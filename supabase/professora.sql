-- Liga a conta de login da professora à tabela "professor".
-- ANTES: crie a conta em Authentication > Users > Add user (marque "Auto Confirm User").
-- Troque os 3 valores entre aspas abaixo e clique em Run. Pode rodar de novo para corrigir o nome.

do $$
declare
  v_email  text := 'professora@exemplo.com';   -- o mesmo e-mail criado no Authentication
  v_nome   text := 'Nome da professora';
  v_escola text := 'Nome da escola';
  v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = lower(trim(v_email));
  if v_id is null then
    raise exception 'Não achei o usuário "%". Crie a conta em Authentication > Users e confira o e-mail.', v_email;
  end if;
  insert into professor (id, nome, escola) values (v_id, v_nome, v_escola)
  on conflict (id) do update set nome = excluded.nome, escola = excluded.escola;
  raise notice 'Pronto! % está ligada à tabela professor.', v_email;
end $$;

-- Confira: deve aparecer uma linha com o nome da professora.
select p.nome, p.escola, u.email from professor p join auth.users u on u.id = p.id;
