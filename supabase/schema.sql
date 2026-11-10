-- Reforço em Jogo: esquema do banco (PostgreSQL / Supabase)
-- Como usar: Supabase > SQL Editor > colar este arquivo inteiro > Run. Depois rodar seed.sql.
-- Pode rodar de novo sem problema: nada é apagado e o que já existe é mantido ou atualizado.

-- Tabelas
-- professor -> sessao -> participante -> resposta      habilidade -> questao

-- Professora. O id é o mesmo do usuário de login (auth.users), por isso é PK e FK ao mesmo tempo.
create table if not exists professor (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  escola text
);

-- Assunto/habilidade trabalhada (ex.: Ortografia), por disciplina e série.
create table if not exists habilidade (
  id serial primary key,
  disciplina text not null,
  serie text not null,
  nome text not null
);

-- Questão de múltipla escolha. "correta" guarda a letra certa e nunca é enviada ao aluno.
-- O CHECK garante que só existam as letras A, B, C ou D.
create table if not exists questao (
  id serial primary key,
  habilidade_id int not null references habilidade(id),
  enunciado text not null,
  alt_a text not null,
  alt_b text not null,
  alt_c text not null,
  alt_d text not null,
  correta char(1) not null check (correta in ('A','B','C','D'))
);

-- Gera o código da sessão: 6 caracteres aleatórios em maiúsculas (ex.: 3F9A1C).
create or replace function gerar_codigo() returns text
language sql as $$
  select upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
$$;

-- Sessão de jogo criada pela professora. habilidade_id nulo = todas as habilidades misturadas.
-- "ativa" = false significa sessão encerrada (ninguém mais entra nem responde).
create table if not exists sessao (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique default gerar_codigo(),
  professor_id uuid not null references professor(id),
  habilidade_id int references habilidade(id),
  disciplina text not null,
  serie text not null,
  ativa boolean not null default true,
  criada_em timestamptz not null default now()
);

-- Aluno dentro de uma sessão. Sem conta: só o apelido (1 a 30 caracteres).
-- "on delete cascade": se a sessão for apagada, os participantes vão junto.
create table if not exists participante (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null references sessao(id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 30),
  entrou_em timestamptz not null default now()
);

-- Cada resposta do aluno. O UNIQUE (participante_id, questao_id) impede responder
-- a mesma questão duas vezes: só a primeira resposta vale.
create table if not exists resposta (
  id serial primary key,
  participante_id uuid not null references participante(id) on delete cascade,
  questao_id int not null references questao(id),
  escolhida char(1) not null check (escolhida in ('A','B','C','D')),
  correta boolean not null,
  respondida_em timestamptz not null default now(),
  unique (participante_id, questao_id)
);

-- Índices para deixar os relatórios rápidos (buscas por sessão e por participante).
create index if not exists participante_sessao_idx on participante (sessao_id);
create index if not exists resposta_participante_idx on resposta (participante_id);

-- Segurança (RLS = Row Level Security, segurança por linha)
-- Com o RLS ligado, o PostgreSQL só devolve as linhas permitidas pelas "policies".
-- auth.uid() = id da professora logada. Sem policy = ninguém acessa.
-- O aluno (papel "anon") não acessa tabelas direto; só chama as funções mais abaixo.
alter table professor enable row level security;
alter table habilidade enable row level security;
alter table questao enable row level security;
alter table sessao enable row level security;
alter table participante enable row level security;
alter table resposta enable row level security;

drop policy if exists "professor ve a si mesmo" on professor;
create policy "professor ve a si mesmo" on professor
  for select to authenticated using (id = auth.uid());

drop policy if exists "habilidades sao publicas" on habilidade;
create policy "habilidades sao publicas" on habilidade
  for select to anon, authenticated using (true);

drop policy if exists "professor ve questoes" on questao;
create policy "professor ve questoes" on questao
  for select to authenticated using (true);

drop policy if exists "professor gerencia suas sessoes" on sessao;
-- Regra principal: a professora só vê, cria, altera e apaga sessões em que ela é a dona.
create policy "professor gerencia suas sessoes" on sessao
  for all to authenticated
  using (professor_id = auth.uid()) with check (professor_id = auth.uid());

drop policy if exists "professor ve participantes das suas sessoes" on participante;
-- Participantes e respostas: só os que pertencem a uma sessão da professora logada.
create policy "professor ve participantes das suas sessoes" on participante
  for select to authenticated
  using (exists (select 1 from sessao s where s.id = sessao_id and s.professor_id = auth.uid()));

drop policy if exists "professor ve respostas das suas sessoes" on resposta;
create policy "professor ve respostas das suas sessoes" on resposta
  for select to authenticated
  using (exists (
    select 1 from participante p join sessao s on s.id = p.sessao_id
    where p.id = participante_id and s.professor_id = auth.uid()));

-- Funções do aluno (chamadas pelo site com sb.rpc, sem login)
-- "security definer": rodam com permissão do dono do banco, mas só fazem o que está escrito aqui.
-- É assim que o aluno consegue jogar sem enxergar nenhuma tabela.

-- Entrar: valida o nome, procura a sessão pelo código, recusa sessão encerrada
-- e cria o participante. Devolve o id do participante para o site guardar.
create or replace function entrar_na_sessao(p_codigo text, p_nome text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sessao sessao%rowtype;
  v_id uuid;
begin
  if char_length(trim(coalesce(p_nome, ''))) not between 1 and 30 then
    raise exception 'Nome inválido';
  end if;
  select * into v_sessao from sessao where codigo = upper(trim(p_codigo));
  if not found then
    raise exception 'Código de sessão não encontrado';
  end if;
  if not v_sessao.ativa then
    raise exception 'Sessão encerrada';
  end if;
  insert into participante (sessao_id, nome)
  values (v_sessao.id, trim(p_nome)) returning id into v_id;
  return json_build_object('participante_id', v_id, 'sessao_id', v_sessao.id, 'nome', trim(p_nome));
end $$;

-- Sorteia até 8 questões da disciplina/série da sessão (e da habilidade, se escolhida).
-- Devolve as questões sem a coluna "correta": a resposta certa nunca sai do banco.
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

-- Responder: compara a letra escolhida com a correta aqui no servidor, grava na tabela
-- resposta e devolve só true (acertou) ou false (errou).
-- "on conflict do nothing": se já respondeu essa questão, a segunda resposta é ignorada.
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
  if not exists (select 1 from participante p join sessao s on s.id = p.sessao_id
                 where p.id = p_participante and s.ativa) then
    raise exception 'Sessão encerrada';
  end if;
  v_ok := (upper(p_escolhida) = v_correta);
  insert into resposta (participante_id, questao_id, escolhida, correta)
  values (p_participante, p_questao, upper(p_escolhida), v_ok)
  on conflict (participante_id, questao_id) do nothing;
  return v_ok;
end $$;

-- Libera as 3 funções para o aluno (anon) e para a professora (authenticated).
grant execute on function entrar_na_sessao(text, text) to anon, authenticated;
grant execute on function buscar_questoes(uuid, int) to anon, authenticated;
grant execute on function responder(uuid, int, text) to anon, authenticated;

-- Relatórios (views = consultas salvas, usadas pelo relatorio.js)
-- security_invoker = true: a view usa as permissões de quem consulta,
-- então o RLS continua valendo e a professora só vê os próprios alunos.
-- percentual = 100 * acertos / respondidas (nullif evita divisão por zero).

-- Acertos de cada aluno (left join: aluno que ainda não respondeu aparece com 0).
create or replace view v_acertos_por_aluno with (security_invoker = true) as
select p.sessao_id, p.id as participante_id, p.nome,
       count(r.id) as respondidas,
       count(*) filter (where r.correta) as acertos,
       round(100.0 * count(*) filter (where r.correta) / nullif(count(r.id), 0)) as percentual
from participante p
left join resposta r on r.participante_id = p.id
group by p.sessao_id, p.id, p.nome;

-- Acertos de cada assunto (habilidade) na sessão: mostra o que a turma precisa reforçar.
create or replace view v_acertos_por_assunto with (security_invoker = true) as
select p.sessao_id, h.nome as assunto,
       count(r.id) as respondidas,
       count(*) filter (where r.correta) as acertos,
       round(100.0 * count(*) filter (where r.correta) / nullif(count(r.id), 0)) as percentual
from resposta r
join participante p on p.id = r.participante_id
join questao q on q.id = r.questao_id
join habilidade h on h.id = q.habilidade_id
group by p.sessao_id, h.nome;

-- Permissões de acesso pela API (o RLS acima continua decidindo quais linhas cada um vê).
-- Explícitas para funcionar mesmo em projetos que não liberam tabelas novas automaticamente.
grant usage on schema public to anon, authenticated;
grant select on habilidade to anon, authenticated;
grant select on professor, questao, participante, resposta to authenticated;
grant select, insert, update, delete on sessao to authenticated;
grant select on v_acertos_por_aluno, v_acertos_por_assunto to authenticated;
