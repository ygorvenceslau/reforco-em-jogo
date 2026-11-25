import sys
sys.path.insert(0, sys.argv[1])
from questoes import Q

saida = sys.argv[2]

def lit(s):
    return "'" + s.replace("'", "''") + "'"

partes = ["""-- Banco padrão de questões do Quizzes & Masmorras (Ensino Fundamental, 1º ao 9º ano).
-- Questões padrão têm professor_id vazio: todo Mestre vê, ninguém edita.
-- Pode rodar de novo sem duplicar: só insere o que ainda não existe e completa explicações vazias.
-- Rode depois do schema.sql.

-- 1) Limpeza: se um seed antigo foi rodado mais de uma vez, junta habilidades e questões repetidas.
do $$
begin
  create temp table hab_dup on commit drop as
    select h.id as velho, k.id as novo
    from habilidade h
    join (select disciplina, serie, nome, min(id) as id from habilidade where professor_id is null group by 1, 2, 3) k
      on k.disciplina = h.disciplina and k.serie = h.serie and k.nome = h.nome
    where h.id <> k.id and h.professor_id is null;
  update questao q set habilidade_id = d.novo from hab_dup d where q.habilidade_id = d.velho;
  update sessao s set habilidade_id = d.novo from hab_dup d where s.habilidade_id = d.velho;
  delete from habilidade h using hab_dup d where h.id = d.velho;

  delete from questao q
  using questao k
  where k.habilidade_id = q.habilidade_id and k.enunciado = q.enunciado and k.alt_a = q.alt_a
    and k.id < q.id and q.professor_id is null and k.professor_id is null
    and not exists (select 1 from resposta r where r.questao_id = q.id);
end $$;

-- 2) Habilidades
insert into habilidade (disciplina, serie, nome)
select v.* from (values"""]

habs = []
for (disc, ano), mapa in Q.items():
    for nome in mapa:
        habs.append(f"  ({lit(disc)}, {lit(ano)}, {lit(nome)})")
partes.append(",\n".join(habs))
partes.append(""") as v(disciplina, serie, nome)
where not exists (select 1 from habilidade h
  where h.disciplina = v.disciplina and h.serie = v.serie and h.nome = v.nome and h.professor_id is null);

-- 3) Questões (uma instrução por habilidade). Também preenche a explicação de questões antigas sem explicação.""")

total = 0
for (disc, ano), mapa in Q.items():
    for nome, questoes in mapa.items():
        linhas = []
        for enun, alts, certa, expl in questoes:
            assert len(alts) == 4 and 0 <= certa < 4, enun
            linhas.append("  (" + ", ".join([lit(enun)] + [lit(a) for a in alts] + [lit("ABCD"[certa]), lit(expl)]) + ")")
            total += 1
        partes.append(f"""
-- {disc} · {ano} · {nome}
with v(enunciado, a, b, c, d, correta, explicacao) as (values
{",".join(chr(10) + l for l in linhas).lstrip(chr(10))}
),
h as (select id from habilidade where disciplina = {lit(disc)} and serie = {lit(ano)} and nome = {lit(nome)} and professor_id is null),
novas as (
  insert into questao (habilidade_id, enunciado, alt_a, alt_b, alt_c, alt_d, correta, explicacao)
  select h.id, v.enunciado, v.a, v.b, v.c, v.d, v.correta, v.explicacao from v, h
  where not exists (select 1 from questao q
    where q.habilidade_id = h.id and q.enunciado = v.enunciado and q.alt_a = v.a and q.professor_id is null)
  returning id
)
update questao q set explicacao = v.explicacao
from v, h
where q.habilidade_id = h.id and q.enunciado = v.enunciado and q.alt_a = v.a
  and q.professor_id is null and q.explicacao is null;""")

open(saida, "w").write("\n".join(partes) + "\n")
print(len(habs), "habilidades,", total, "questões")
