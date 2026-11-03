-- Atualização 01: mensagens de "sessão encerrada" e checagem de nome.
-- Só precisa rodar se o schema.sql foi executado ANTES desta mudança.
-- Supabase > SQL Editor > colar este arquivo > Run. Pode rodar mais de uma vez.

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

