-- Dados de demonstração: alunos fictícios jogando na sessão MAIS RECENTE da professora.
-- Como usar: crie uma sessão pelo painel e depois rode este arquivo no SQL Editor.
-- Para apagar depois:  delete from participante where nome like '% (demo)';

do $$
declare
  v_sessao uuid;
  v_part uuid;
  v_nome text;
  v_chance numeric;
  q record;
begin
  select id into v_sessao from sessao order by criada_em desc limit 1;
  if v_sessao is null then
    raise exception 'Crie uma sessão antes de rodar este arquivo.';
  end if;

  -- Cada aluno tem uma "chance de acertar" diferente, para o relatório ficar variado.
  for v_nome, v_chance in
    select * from (values
      ('Ana (demo)', 0.9), ('Bruno (demo)', 0.75), ('Carla (demo)', 0.5),
      ('Davi (demo)', 0.35), ('Elisa (demo)', 0.8), ('Felipe (demo)', 0.6),
      ('Gabi (demo)', 0.45), ('Heitor (demo)', 0.95)) as t(n, c)
  loop
    insert into participante (sessao_id, nome) values (v_sessao, v_nome) returning id into v_part;
    for q in select * from buscar_questoes(v_part, 8) loop
      insert into resposta (participante_id, questao_id, escolhida, correta)
      select v_part, q.id,
             case when random() < v_chance then x.correta
                  else (array['A','B','C','D'])[1 + floor(random() * 4)::int] end,
             false
      from questao x where x.id = q.id;
    end loop;
    update resposta r set correta = (r.escolhida = x.correta)
    from questao x where x.id = r.questao_id and r.participante_id = v_part;
  end loop;
end $$;
