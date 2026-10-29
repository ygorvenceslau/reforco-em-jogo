-- Reforço em Jogo: esquema do banco (PostgreSQL / Supabase)
-- Como usar: Supabase > SQL Editor > colar este arquivo inteiro > Run. Depois rodar seed.sql.

create table professor (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  escola text
);

create table habilidade (
  id serial primary key,
  disciplina text not null,
  serie text not null,
  nome text not null
);

create table questao (
  id serial primary key,
  habilidade_id int not null references habilidade(id),
  enunciado text not null,
  alt_a text not null,
  alt_b text not null,
  alt_c text not null,
  alt_d text not null,
  correta char(1) not null check (correta in ('A','B','C','D'))
);

create or replace function gerar_codigo() returns text
language sql as $$
  select upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
$$;

create table sessao (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique default gerar_codigo(),
  professor_id uuid not null references professor(id),
  habilidade_id int references habilidade(id),
  disciplina text not null,
  serie text not null,
  ativa boolean not null default true,
  criada_em timestamptz not null default now()
);

create table participante (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null references sessao(id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 30),
  entrou_em timestamptz not null default now()
);

create table resposta (
  id serial primary key,
  participante_id uuid not null references participante(id) on delete cascade,
  questao_id int not null references questao(id),
  escolhida char(1) not null check (escolhida in ('A','B','C','D')),
  correta boolean not null,
  respondida_em timestamptz not null default now(),
  unique (participante_id, questao_id)
);

create index on participante (sessao_id);
create index on resposta (participante_id);

-- Segurança (RLS): o aluno NÃO acessa tabelas direto; só chama as funções abaixo.
alter table professor enable row level security;
alter table habilidade enable row level security;
alter table questao enable row level security;
alter table sessao enable row level security;
alter table participante enable row level security;
alter table resposta enable row level security;

create policy "professor ve a si mesmo" on professor
  for select to authenticated using (id = auth.uid());

create policy "habilidades sao publicas" on habilidade
  for select to anon, authenticated using (true);

create policy "professor ve questoes" on questao
  for select to authenticated using (true);

create policy "professor gerencia suas sessoes" on sessao
  for all to authenticated
  using (professor_id = auth.uid()) with check (professor_id = auth.uid());

create policy "professor ve participantes das suas sessoes" on participante
  for select to authenticated
  using (exists (select 1 from sessao s where s.id = sessao_id and s.professor_id = auth.uid()));

create policy "professor ve respostas das suas sessoes" on resposta
  for select to authenticated
  using (exists (
    select 1 from participante p join sessao s on s.id = p.sessao_id
    where p.id = participante_id and s.professor_id = auth.uid()));

-- Funções chamadas pelo aluno (sem login). Rodam com permissão do dono do banco.
create or replace function entrar_na_sessao(p_codigo text, p_nome text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sessao sessao%rowtype;
  v_id uuid;
begin
  select * into v_sessao from sessao where codigo = upper(trim(p_codigo)) and ativa;
  if not found then
    raise exception 'Código de sessão não encontrado';
  end if;
  insert into participante (sessao_id, nome)
  values (v_sessao.id, trim(p_nome)) returning id into v_id;
  return json_build_object('participante_id', v_id, 'sessao_id', v_sessao.id, 'nome', trim(p_nome));
end $$;

-- Devolve as questões SEM a alternativa correta.
create or replace function buscar_questoes(p_participante uuid, p_limite int default 8)
returns table (id int, enunciado text, alt_a text, alt_b text, alt_c text, alt_d text, assunto text)
language sql security definer set search_path = public as $$
  select q.id, q.enunciado, q.alt_a, q.alt_b, q.alt_c, q.alt_d, h.nome
  from participante p
  join sessao s on s.id = p.sessao_id
  join habilidade h on h.disciplina = s.disciplina and h.serie = s.serie
  join questao q on q.habilidade_id = h.id
  where p.id = p_participante
    and (s.habilidade_id is null or h.id = s.habilidade_id)
  order by random()
  limit p_limite;
$$;

-- Confere a resposta no servidor, grava e devolve true/false.
create or replace function responder(p_participante uuid, p_questao int, p_escolhida text)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_correta char(1);
  v_ok boolean;
begin
  select correta into v_correta from questao where id = p_questao;
  if not found then
    raise exception 'Questão inexistente';
  end if;
  if not exists (select 1 from participante where id = p_participante) then
    raise exception 'Participante inexistente';
  end if;
  v_ok := (upper(p_escolhida) = v_correta);
  insert into resposta (participante_id, questao_id, escolhida, correta)
  values (p_participante, p_questao, upper(p_escolhida), v_ok)
  on conflict (participante_id, questao_id) do nothing;
  return v_ok;
end $$;

grant execute on function entrar_na_sessao(text, text) to anon, authenticated;
grant execute on function buscar_questoes(uuid, int) to anon, authenticated;
grant execute on function responder(uuid, int, text) to anon, authenticated;

-- Relatórios (a professora só enxerga as próprias sessões, por causa do RLS)
create view v_acertos_por_aluno with (security_invoker = true) as
select p.sessao_id, p.id as participante_id, p.nome,
       count(r.id) as respondidas,
       count(*) filter (where r.correta) as acertos,
       round(100.0 * count(*) filter (where r.correta) / nullif(count(r.id), 0)) as percentual
from participante p
left join resposta r on r.participante_id = p.id
group by p.sessao_id, p.id, p.nome;

create view v_acertos_por_assunto with (security_invoker = true) as
select p.sessao_id, h.nome as assunto,
       count(r.id) as respondidas,
       count(*) filter (where r.correta) as acertos,
       round(100.0 * count(*) filter (where r.correta) / nullif(count(r.id), 0)) as percentual
from resposta r
join participante p on p.id = r.participante_id
join questao q on q.id = r.questao_id
join habilidade h on h.id = q.habilidade_id
group by p.sessao_id, h.nome;
