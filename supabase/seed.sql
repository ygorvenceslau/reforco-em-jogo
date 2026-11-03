-- Conteúdo inicial: Língua Portuguesa, 5º ano (12 questões). A professora deve revisar antes de usar com alunos.
-- Pode rodar de novo sem duplicar: só insere o que ainda não existe.

-- 1) Limpeza: se o seed antigo foi rodado mais de uma vez, junta as habilidades e questões repetidas.
do $$
begin
  -- Habilidades repetidas: aponta tudo para a de menor id e apaga as outras.
  create temp table hab_dup on commit drop as
    select h.id as velho, k.id as novo
    from habilidade h
    join (select disciplina, serie, nome, min(id) as id from habilidade group by 1, 2, 3) k
      on k.disciplina = h.disciplina and k.serie = h.serie and k.nome = h.nome
    where h.id <> k.id;
  update questao q set habilidade_id = d.novo from hab_dup d where q.habilidade_id = d.velho;
  update sessao s set habilidade_id = d.novo from hab_dup d where s.habilidade_id = d.velho;
  delete from habilidade h using hab_dup d where h.id = d.velho;

  -- Questões repetidas que ninguém respondeu ainda: apaga, mantendo a de menor id.
  delete from questao q
  using questao k
  where k.habilidade_id = q.habilidade_id and k.enunciado = q.enunciado and k.alt_a = q.alt_a
    and k.id < q.id
    and not exists (select 1 from resposta r where r.questao_id = q.id);

  -- Impede habilidades repetidas daqui para frente.
  if not exists (select 1 from pg_constraint where conname = 'habilidade_unica') then
    alter table habilidade add constraint habilidade_unica unique (disciplina, serie, nome);
  end if;
end $$;

-- 2) Conteúdo
insert into habilidade (disciplina, serie, nome)
select v.* from (values
  ('Língua Portuguesa', '5º ano', 'Interpretação de texto'),
  ('Língua Portuguesa', '5º ano', 'Classes de palavras'),
  ('Língua Portuguesa', '5º ano', 'Ortografia')) as v(disciplina, serie, nome)
where not exists (select 1 from habilidade h
  where h.disciplina = v.disciplina and h.serie = v.serie and h.nome = v.nome);

insert into questao (habilidade_id, enunciado, alt_a, alt_b, alt_c, alt_d, correta)
select h.id, v.enunciado, v.a, v.b, v.c, v.d, v.correta from (values
('Interpretação de texto',
 'Ana levou o guarda-chuva porque o céu estava cheio de nuvens escuras. Por que Ana levou o guarda-chuva?',
 'Porque o céu indicava que poderia chover', 'Porque queria brincar', 'Porque estava com frio', 'Porque ganhou de presente', 'A'),
('Interpretação de texto',
 'Pedro acordou tarde, correu para a escola e chegou depois do sinal. Qual é o assunto principal do texto?',
 'Pedro chegou atrasado à escola', 'Pedro gosta de correr', 'Pedro perdeu o lanche', 'A escola foi fechada', 'A'),
('Interpretação de texto',
 'Em “Maria ficou radiante com a notícia”, a palavra “radiante” mostra que Maria ficou:',
 'Muito triste', 'Muito feliz', 'Com sono', 'Com medo', 'B'),
('Interpretação de texto',
 'O cachorro de Lia fugiu pelo portão aberto. Lia saiu chamando por ele até encontrá-lo na praça. O que Lia fez depois que o cachorro fugiu?',
 'Foi dormir', 'Procurou o cachorro e o encontrou na praça', 'Ganhou outro cachorro', 'Fechou o portão e esperou', 'B'),
('Classes de palavras',
 'Em “Ela comprou frutas frescas”, qual palavra é o adjetivo?',
 'Ela', 'comprou', 'frutas', 'frescas', 'D'),
('Classes de palavras',
 'Em “Os alunos leram o livro”, qual palavra é o verbo?',
 'alunos', 'leram', 'livro', 'Os', 'B'),
('Classes de palavras',
 'Qual destas palavras é um substantivo?',
 'rapidamente', 'bonito', 'cadeira', 'correr', 'C'),
('Classes de palavras',
 'Em “O gato preto dorme no sofá”, qual palavra indica uma característica do gato?',
 'dorme', 'sofá', 'preto', 'no', 'C'),
('Ortografia',
 'Qual palavra está escrita corretamente?',
 'exceção', 'esceção', 'eceção', 'exessão', 'A'),
('Ortografia',
 'Qual palavra completa corretamente a frase: “A ___ chegou cedo hoje.”?',
 'profesora', 'professora', 'proffessora', 'professsora', 'B'),
('Ortografia',
 'Qual palavra está escrita corretamente?',
 'caxorro', 'cachorro', 'cachoro', 'cashorro', 'B'),
('Ortografia',
 'Qual palavra completa a frase: “Ele ___ o dever de casa ontem.”?',
 'fêz', 'fes', 'fez', 'fés', 'C')
) as v(assunto, enunciado, a, b, c, d, correta)
join habilidade h on h.nome = v.assunto and h.disciplina = 'Língua Portuguesa' and h.serie = '5º ano'
where not exists (select 1 from questao q where q.enunciado = v.enunciado and q.alt_a = v.a);
