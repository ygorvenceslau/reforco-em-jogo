-- Banco padrão de questões do Quizzes & Masmorras (Ensino Fundamental, 1º ao 9º ano).
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
select v.* from (values
  ('Língua Portuguesa', '1º ano', 'Letras e sons'),
  ('Língua Portuguesa', '1º ano', 'Sílabas'),
  ('Língua Portuguesa', '2º ano', 'Ortografia'),
  ('Língua Portuguesa', '2º ano', 'Leitura e compreensão'),
  ('Língua Portuguesa', '3º ano', 'Pontuação'),
  ('Língua Portuguesa', '3º ano', 'Gêneros textuais'),
  ('Língua Portuguesa', '4º ano', 'Sinônimos e antônimos'),
  ('Língua Portuguesa', '4º ano', 'Ortografia e acentuação'),
  ('Língua Portuguesa', '5º ano', 'Interpretação de texto'),
  ('Língua Portuguesa', '5º ano', 'Classes de palavras'),
  ('Língua Portuguesa', '5º ano', 'Ortografia'),
  ('Língua Portuguesa', '6º ano', 'Concordância'),
  ('Língua Portuguesa', '6º ano', 'Interpretação e inferência'),
  ('Língua Portuguesa', '7º ano', 'Figuras de linguagem'),
  ('Língua Portuguesa', '7º ano', 'Verbos e tempos verbais'),
  ('Língua Portuguesa', '8º ano', 'Sujeito e predicado'),
  ('Língua Portuguesa', '8º ano', 'Argumentação'),
  ('Língua Portuguesa', '9º ano', 'Conectivos e coesão'),
  ('Língua Portuguesa', '9º ano', 'Crase e porquês'),
  ('Matemática', '1º ano', 'Contagem e números'),
  ('Matemática', '1º ano', 'Adição e subtração'),
  ('Matemática', '2º ano', 'Adição e subtração'),
  ('Matemática', '2º ano', 'Medidas e tempo'),
  ('Matemática', '3º ano', 'Multiplicação'),
  ('Matemática', '3º ano', 'Sistema de numeração'),
  ('Matemática', '4º ano', 'Divisão'),
  ('Matemática', '4º ano', 'Frações'),
  ('Matemática', '5º ano', 'Números decimais'),
  ('Matemática', '5º ano', 'Geometria'),
  ('Matemática', '6º ano', 'Operações e expressões'),
  ('Matemática', '6º ano', 'Porcentagem'),
  ('Matemática', '7º ano', 'Números inteiros'),
  ('Matemática', '7º ano', 'Equações do 1º grau'),
  ('Matemática', '8º ano', 'Potências e raízes'),
  ('Matemática', '8º ano', 'Expressões algébricas'),
  ('Matemática', '9º ano', 'Equações do 2º grau'),
  ('Matemática', '9º ano', 'Teorema de Pitágoras'),
  ('Tecnologia e Computação', '5º ano', 'Partes do computador'),
  ('Tecnologia e Computação', '5º ano', 'Segurança na internet'),
  ('Tecnologia e Computação', '6º ano', 'Pensamento computacional'),
  ('Tecnologia e Computação', '6º ano', 'Arquivos e pastas'),
  ('Tecnologia e Computação', '7º ano', 'Internet e redes'),
  ('Tecnologia e Computação', '7º ano', 'Cidadania digital'),
  ('Tecnologia e Computação', '8º ano', 'Lógica e algoritmos'),
  ('Tecnologia e Computação', '8º ano', 'Dados e informação'),
  ('Tecnologia e Computação', '9º ano', 'Segurança da informação'),
  ('Tecnologia e Computação', '9º ano', 'Programação básica')
) as v(disciplina, serie, nome)
where not exists (select 1 from habilidade h
  where h.disciplina = v.disciplina and h.serie = v.serie and h.nome = v.nome and h.professor_id is null);

-- 3) Questões (uma instrução por habilidade). Também preenche a explicação de questões antigas sem explicação.

-- Língua Portuguesa · 1º ano · Letras e sons
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual palavra começa com a mesma letra de BOLA?', 'Casa', 'Bala', 'Pato', 'Dado', 'B', 'Bola e bala começam com a letra B.'),
  ('Quantas letras tem a palavra GATO?', '3', '4', '5', '6', 'B', 'G-A-T-O: são 4 letras.'),
  ('Qual é a primeira letra da palavra UVA?', 'A', 'O', 'U', 'V', 'C', 'Uva começa com a vogal U.'),
  ('Qual palavra rima com JANELA?', 'Panela', 'Janeiro', 'Sapato', 'Lápis', 'A', 'Janela e panela terminam com -ELA: por isso rimam.'),
  ('Quais destas letras são vogais?', 'B, C, D', 'A, E, I', 'M, N, P', 'R, S, T', 'B', 'As vogais são A, E, I, O e U.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '1º ano' and nome = 'Letras e sons' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 1º ano · Sílabas
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quantas sílabas tem a palavra CASA?', '1', '2', '3', '4', 'B', 'CA-SA: são 2 sílabas. Bata palmas a cada pedacinho!'),
  ('Quantas sílabas tem a palavra BORBOLETA?', '2', '3', '4', '5', 'C', 'BOR-BO-LE-TA: são 4 sílabas.'),
  ('Junte as sílabas: MA + CA + CO', 'Macaco', 'Maçaco', 'Macoca', 'Camaco', 'A', 'MA + CA + CO forma MACACO.'),
  ('Qual palavra tem só uma sílaba?', 'Mesa', 'Pé', 'Bola', 'Dado', 'B', 'Pé se fala de uma vez só: tem 1 sílaba.'),
  ('Qual é a primeira sílaba de SAPATO?', 'PA', 'TO', 'SA', 'SAP', 'C', 'SA-PA-TO: a primeira sílaba é SA.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '1º ano' and nome = 'Sílabas' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 2º ano · Ortografia
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual palavra está escrita corretamente?', 'casa', 'kaza', 'caza', 'kasa', 'A', 'Casa se escreve com C e S. O S entre vogais tem som de Z.'),
  ('Qual palavra está escrita corretamente?', 'pasarinho', 'passarinho', 'pacarinho', 'paçarinho', 'B', 'Passarinho tem SS: entre vogais, o SS faz o som de S.'),
  ('Qual palavra tem o som forte do R, como em RATO?', 'caro', 'carro', 'coro', 'pera', 'B', 'Entre vogais, o som forte do R se escreve com RR: carro.'),
  ('Complete com M ou N: CA_PO', 'campo', 'canpo', 'caapo', 'capo', 'A', 'Antes de P e B usamos M: campo.'),
  ('Qual palavra começa com letra maiúscula por ser nome de pessoa?', 'mesa', 'Ana', 'bola', 'rua', 'B', 'Nomes de pessoas começam com letra maiúscula: Ana.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '2º ano' and nome = 'Ortografia' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 2º ano · Leitura e compreensão
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('"O sapo pulou na lagoa." Onde o sapo pulou?', 'Na árvore', 'Na lagoa', 'Na casa', 'No carro', 'B', 'A frase diz: o sapo pulou na lagoa.'),
  ('"Lia comeu uma maçã vermelha." De que cor era a maçã?', 'Verde', 'Amarela', 'Vermelha', 'Azul', 'C', 'O texto diz que a maçã era vermelha.'),
  ('"Tom estava com frio e vestiu o casaco." Por que Tom vestiu o casaco?', 'Porque estava com frio', 'Porque ia a uma festa', 'Porque estava calor', 'Porque ganhou o casaco', 'A', 'O texto conta que Tom estava com frio: esse é o motivo.'),
  ('Qual destas frases é o título de uma história?', 'Era uma vez...', 'O Lobo e os Três Porquinhos', 'Fim', 'E viveram felizes', 'B', 'O título é o nome da história e aparece antes do texto.'),
  ('"Bia regava as flores todos os dias." O que Bia fazia?', 'Plantava árvores', 'Regava as flores', 'Colhia frutas', 'Dormia cedo', 'B', 'O texto diz que Bia regava as flores.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '2º ano' and nome = 'Leitura e compreensão' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 3º ano · Pontuação
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual sinal usamos no fim de uma pergunta?', 'Ponto final (.)', 'Ponto de interrogação (?)', 'Ponto de exclamação (!)', 'Vírgula (,)', 'B', 'Perguntas terminam com ponto de interrogação.'),
  ('"Que dia lindo___" Qual sinal mostra emoção?', '?', '!', ',', ':', 'B', 'O ponto de exclamação mostra emoção, surpresa ou alegria.'),
  ('Em um diálogo, que sinal indica a fala de um personagem?', 'Travessão (—)', 'Vírgula', 'Ponto final', 'Parênteses', 'A', 'O travessão marca o começo da fala de um personagem.'),
  ('Qual pergunta está pontuada corretamente?', 'Você vem amanhã.', 'Você vem amanhã?', 'Você, vem amanhã', 'Você vem? amanhã', 'B', 'Uma pergunta termina com ponto de interrogação, no fim da frase.'),
  ('Para que serve a vírgula em "Comprei arroz, feijão e ovos"?', 'Separar itens de uma lista', 'Fazer uma pergunta', 'Terminar a frase', 'Mostrar emoção', 'A', 'Na lista, a vírgula separa os itens: arroz, feijão e ovos.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '3º ano' and nome = 'Pontuação' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 3º ano · Gêneros textuais
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual texto ensina a preparar um bolo?', 'Receita', 'Poema', 'Bilhete', 'Piada', 'A', 'A receita traz ingredientes e modo de preparo.'),
  ('Qual texto costuma ter versos e rimas?', 'Notícia', 'Poema', 'Receita', 'Lista de compras', 'B', 'O poema é escrito em versos e muitas vezes tem rimas.'),
  ('Para avisar sua mãe que foi à casa da avó, o melhor texto é um:', 'Bilhete', 'Conto', 'Poema', 'Dicionário', 'A', 'O bilhete é um recado curto para alguém.'),
  ('"Era uma vez..." é um começo típico de:', 'Notícia', 'Conto de fadas', 'Receita', 'Convite', 'B', 'Os contos de fadas costumam começar com "Era uma vez".'),
  ('Em um convite de aniversário, o que NÃO pode faltar?', 'A data, a hora e o local', 'A receita do bolo', 'Uma piada', 'O preço dos presentes', 'A', 'Um convite precisa dizer quando e onde a festa vai acontecer.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '3º ano' and nome = 'Gêneros textuais' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 4º ano · Sinônimos e antônimos
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual é o sinônimo de "contente"?', 'triste', 'alegre', 'bravo', 'cansado', 'B', 'Sinônimo tem sentido parecido: contente = alegre.'),
  ('Qual é o antônimo de "alto"?', 'grande', 'comprido', 'baixo', 'forte', 'C', 'Antônimo tem sentido contrário: alto x baixo.'),
  ('Qual é o antônimo de "aberto"?', 'fechado', 'largo', 'limpo', 'novo', 'A', 'O contrário de aberto é fechado.'),
  ('Em "A casa é enorme", a palavra "enorme" pode ser trocada por:', 'pequena', 'gigante', 'velha', 'bonita', 'B', 'Enorme e gigante são sinônimos: querem dizer muito grande.'),
  ('Qual par é de sinônimos?', 'rápido / lento', 'bonito / feio', 'começar / iniciar', 'cheio / vazio', 'C', 'Começar e iniciar têm o mesmo sentido. Os outros pares são antônimos.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '4º ano' and nome = 'Sinônimos e antônimos' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 4º ano · Ortografia e acentuação
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual palavra está escrita corretamente?', 'pássaro', 'passaro', 'páçaro', 'pásaro', 'A', 'Pássaro tem acento agudo no A e SS entre as vogais.'),
  ('Qual palavra tem acento circunflexo (^)?', 'café', 'você', 'sofá', 'pé', 'B', 'Você tem o chapeuzinho no E. As outras têm acento agudo.'),
  ('Complete: "Ontem eu ___ ao parque."', 'fui', 'fuí', 'foi', 'fuy', 'A', 'Com "eu", usamos "fui". "Foi" é para ele ou ela.'),
  ('Qual palavra está escrita corretamente?', 'enchergar', 'enxergar', 'emxergar', 'encherguar', 'B', 'Enxergar se escreve com X. Depois de EN, a maioria das palavras usa X.'),
  ('Qual frase está correta?', 'Nós vai à escola.', 'Nós vamos à escola.', 'Nós vamo à escola.', 'Nós foi à escola.', 'B', 'Com "nós", o verbo termina em -mos: nós vamos.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '4º ano' and nome = 'Ortografia e acentuação' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 5º ano · Interpretação de texto
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Ana levou o guarda-chuva porque o céu estava cheio de nuvens escuras. Por que Ana levou o guarda-chuva?', 'Porque o céu indicava que poderia chover', 'Porque queria brincar', 'Porque estava com frio', 'Porque ganhou de presente', 'A', 'O texto diz que o céu tinha nuvens escuras: sinal de que podia chover.'),
  ('Pedro acordou tarde, correu para a escola e chegou depois do sinal. Qual é o assunto principal do texto?', 'Pedro chegou atrasado à escola', 'Pedro gosta de correr', 'Pedro perdeu o lanche', 'A escola foi fechada', 'A', 'Todas as ações do texto levam ao fato principal: Pedro chegou atrasado.'),
  ('Em “Maria ficou radiante com a notícia”, a palavra “radiante” mostra que Maria ficou:', 'Muito triste', 'Muito feliz', 'Com sono', 'Com medo', 'B', 'Radiante quer dizer cheia de alegria, como se brilhasse de felicidade.'),
  ('O cachorro de Lia fugiu pelo portão aberto. Lia saiu chamando por ele até encontrá-lo na praça. O que Lia fez depois que o cachorro fugiu?', 'Foi dormir', 'Procurou o cachorro e o encontrou na praça', 'Ganhou outro cachorro', 'Fechou o portão e esperou', 'B', 'O texto diz que Lia procurou o cachorro até encontrá-lo na praça.'),
  ('"Choveu tanto que a rua virou um rio." A frase quer dizer que:', 'Um rio passou pela rua', 'A rua ficou muito alagada', 'A rua foi fechada', 'Parou de chover', 'B', 'É um exagero: a rua ficou com tanta água que parecia um rio.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '5º ano' and nome = 'Interpretação de texto' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 5º ano · Classes de palavras
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Em “Ela comprou frutas frescas”, qual palavra é o adjetivo?', 'Ela', 'comprou', 'frutas', 'frescas', 'D', 'Adjetivo dá uma característica ao substantivo: frescas diz como são as frutas.'),
  ('Em “Os alunos leram o livro”, qual palavra é o verbo?', 'alunos', 'leram', 'livro', 'Os', 'B', 'Verbo indica ação: leram é o que os alunos fizeram.'),
  ('Qual destas palavras é um substantivo?', 'rapidamente', 'bonito', 'cadeira', 'correr', 'C', 'Substantivo dá nome a seres e objetos: cadeira é o nome de um objeto.'),
  ('Em “O gato preto dorme no sofá”, qual palavra indica uma característica do gato?', 'dorme', 'sofá', 'preto', 'no', 'C', 'Preto é um adjetivo: diz como é o gato.'),
  ('Em "Nós brincamos no parque", a palavra "Nós" é um:', 'pronome', 'verbo', 'adjetivo', 'advérbio', 'A', 'Pronome substitui o nome das pessoas: "nós" é quem fala e mais alguém.'),
  ('Qual é o plural de "pão"?', 'pãos', 'pães', 'pões', 'pãoes', 'B', 'Algumas palavras em -ão fazem o plural em -ães: pão, pães; cão, cães.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '5º ano' and nome = 'Classes de palavras' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 5º ano · Ortografia
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual palavra está escrita corretamente?', 'exceção', 'esceção', 'eceção', 'exessão', 'A', 'Exceção se escreve com X e C. É da mesma família de "exceto".'),
  ('Qual palavra completa corretamente a frase: “A ___ chegou cedo hoje.”?', 'profesora', 'professora', 'proffessora', 'professsora', 'B', 'Professora tem SS: pro-fes-so-ra.'),
  ('Qual palavra está escrita corretamente?', 'caxorro', 'cachorro', 'cachoro', 'cashorro', 'B', 'Cachorro tem CH e RR: ca-chor-ro.'),
  ('Qual palavra completa a frase: “Ele ___ o dever de casa ontem.”?', 'fêz', 'fes', 'fez', 'fés', 'C', 'Fez (do verbo fazer) termina com Z e não tem acento.'),
  ('Qual palavra precisa de acento?', 'mesa', 'lapis', 'casa', 'bola', 'B', 'Lápis é paroxítona terminada em S, por isso leva acento: lá-pis.'),
  ('Em qual frase a palavra entre aspas está certa?', 'Eu vou "mas" tarde.', 'Ele quer "mais" bolo.', 'Não sei "porque" ele saiu.', 'Ela "concerta" o carro.', 'B', '"Mais" indica quantidade. "Mas" indica oposição, como "porém".')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '5º ano' and nome = 'Ortografia' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 6º ano · Concordância
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual frase está correta?', 'Os meninos chegou cedo.', 'Os meninos chegaram cedo.', 'O meninos chegaram cedo.', 'Os menino chegaram cedo.', 'B', 'O verbo concorda com o sujeito: os meninos (plural) chegaram.'),
  ('Complete: "As flores ___ lindas."', 'está', 'estão', 'esteve', 'estava', 'B', 'As flores é plural, então o verbo também vai para o plural: estão.'),
  ('Qual frase está correta?', 'Faltou dois alunos.', 'Faltaram dois alunos.', 'Faltou os alunos.', 'Faltaram um aluno.', 'B', 'O sujeito "dois alunos" está no plural: faltaram.'),
  ('Complete: "Ela ficou ___ preocupada."', 'meia', 'meio', 'meios', 'meias', 'B', '"Meio" no sentido de "um pouco" não muda: meio preocupada.'),
  ('Qual frase está correta?', 'A gente fomos ao cinema.', 'A gente foi ao cinema.', 'A gente fui ao cinema.', 'A gente vamos ao cinema.', 'B', '"A gente" pede o verbo no singular, como "ela": a gente foi.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '6º ano' and nome = 'Concordância' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 6º ano · Interpretação e inferência
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('"Paulo olhou o céu escuro e pegou o guarda-chuva." O que podemos concluir?', 'Paulo achou que ia chover', 'Paulo estava com calor', 'Paulo ia dormir', 'Paulo perdeu algo', 'A', 'O céu escuro é uma pista de chuva. Concluir a partir de pistas é fazer uma inferência.'),
  ('Qual é a finalidade de um anúncio publicitário?', 'Convencer o leitor a comprar ou fazer algo', 'Contar um conto de fadas', 'Ensinar uma receita', 'Informar a previsão do tempo', 'A', 'O anúncio quer convencer: vender um produto ou uma ideia.'),
  ('Em "Ele tem um coração de ouro", a expressão quer dizer que ele é:', 'rico', 'muito bondoso', 'doente', 'forte', 'B', 'É linguagem figurada: coração de ouro é uma pessoa muito boa.'),
  ('Uma notícia de jornal deve responder principalmente:', 'O quê, quem, quando, onde, como e por quê', 'Só a opinião do jornalista', 'Uma rima', 'Uma receita', 'A', 'A notícia informa um fato respondendo a essas perguntas.'),
  ('"Ana estudou muito, mas não passou na prova." A palavra "mas" indica:', 'adição', 'oposição', 'tempo', 'lugar', 'B', '"Mas" liga ideias contrárias: estudou, porém não passou.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '6º ano' and nome = 'Interpretação e inferência' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 7º ano · Figuras de linguagem
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('"Seus olhos são como estrelas." Qual figura de linguagem é essa?', 'Comparação', 'Hipérbole', 'Onomatopeia', 'Antítese', 'A', 'O "como" liga duas coisas parecidas: é uma comparação.'),
  ('"Já te falei um milhão de vezes!" é exemplo de:', 'Hipérbole (exagero)', 'Metáfora', 'Ironia', 'Personificação', 'A', 'Ninguém falou um milhão de vezes: é um exagero, a hipérbole.'),
  ('"O vento sussurrava na janela." Qual figura é essa?', 'Personificação', 'Comparação', 'Hipérbole', 'Onomatopeia', 'A', 'Dar ações humanas (sussurrar) a coisas é personificação.'),
  ('Em "Tic-tac, fazia o relógio", "tic-tac" é uma:', 'Onomatopeia', 'Metáfora', 'Antítese', 'Ironia', 'A', 'Onomatopeia é a palavra que imita um som.'),
  ('"Ele é uma fera no futebol." Que figura é essa?', 'Metáfora', 'Onomatopeia', 'Comparação', 'Pleonasmo', 'A', 'Metáfora é uma comparação sem o "como": ele é muito bom, como uma fera.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '7º ano' and nome = 'Figuras de linguagem' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 7º ano · Verbos e tempos verbais
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Em "Amanhã eu viajarei", o verbo está no:', 'presente', 'passado', 'futuro', 'imperativo', 'C', 'Viajarei indica algo que ainda vai acontecer: futuro.'),
  ('Qual verbo está no pretérito (passado)?', 'corro', 'correrei', 'corri', 'correndo', 'C', 'Corri indica uma ação que já aconteceu.'),
  ('Em "Feche a porta!", o verbo está no modo:', 'imperativo', 'subjuntivo', 'indicativo', 'infinitivo', 'A', 'O imperativo expressa ordem, pedido ou conselho.'),
  ('Qual é o infinitivo de "cantávamos"?', 'cantar', 'cantando', 'cantado', 'canta', 'A', 'O infinitivo é o nome do verbo, terminado em -ar, -er ou -ir: cantar.'),
  ('Complete: "Se eu ___ tempo, iria à festa."', 'tenho', 'tivesse', 'terei', 'tive', 'B', 'Uma hipótese com "se" pede o subjuntivo: se eu tivesse.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '7º ano' and nome = 'Verbos e tempos verbais' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 8º ano · Sujeito e predicado
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Em "Os alunos fizeram a tarefa", qual é o sujeito?', 'Os alunos', 'fizeram', 'a tarefa', 'fizeram a tarefa', 'A', 'O sujeito é de quem se fala: quem fez a tarefa? Os alunos.'),
  ('Em "Choveu muito ontem", o sujeito é:', 'inexistente (oração sem sujeito)', 'muito', 'ontem', 'oculto: ele', 'A', 'Verbos que indicam fenômenos da natureza não têm sujeito.'),
  ('Em "Chegamos cedo", o sujeito é:', 'oculto (nós)', 'inexistente', 'cedo', 'indeterminado', 'A', 'A terminação -mos mostra que o sujeito é "nós", mesmo sem aparecer.'),
  ('Em "Maria e João dançaram", o sujeito é:', 'simples', 'composto', 'oculto', 'inexistente', 'B', 'Tem dois núcleos (Maria e João): sujeito composto.'),
  ('Em "O cachorro latiu alto", qual é o predicado?', 'O cachorro', 'latiu alto', 'cachorro', 'O', 'B', 'Predicado é o que se diz do sujeito: latiu alto.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '8º ano' and nome = 'Sujeito e predicado' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 8º ano · Argumentação
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Em um texto argumentativo, o autor procura:', 'defender uma opinião com argumentos', 'contar uma história inventada', 'ensinar uma receita', 'fazer uma lista', 'A', 'O texto argumentativo defende um ponto de vista com razões.'),
  ('Qual frase é uma opinião, e não um fato?', 'O Brasil fica na América do Sul.', 'A água ferve a 100 °C ao nível do mar.', 'O futebol é o melhor esporte do mundo.', 'Um ano tem 12 meses.', 'C', '"Melhor esporte" depende do gosto de cada um: é opinião.'),
  ('Em um texto, a palavra "portanto" indica:', 'conclusão', 'oposição', 'tempo', 'dúvida', 'A', '"Portanto" introduz a conclusão do que foi dito antes.'),
  ('Qual é o melhor argumento para "Devemos economizar água"?', 'A água potável é limitada e essencial à vida.', 'Eu gosto de água.', 'A água é transparente.', 'Meu vizinho economiza.', 'A', 'Um bom argumento traz uma razão forte e verdadeira, não só gosto pessoal.'),
  ('"Embora estivesse cansado, terminou o trabalho." "Embora" indica:', 'concessão (ideia contrária)', 'causa', 'finalidade', 'conclusão', 'A', '"Embora" apresenta um obstáculo que não impediu a ação: é concessão.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '8º ano' and nome = 'Argumentação' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 9º ano · Conectivos e coesão
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('"Estudou bastante; por isso, foi aprovado." "Por isso" indica:', 'consequência', 'oposição', 'condição', 'comparação', 'A', 'A aprovação é consequência de ter estudado.'),
  ('Qual conectivo indica condição?', 'se', 'mas', 'porque', 'e', 'A', '"Se" apresenta uma condição: se chover, não vou.'),
  ('Em "Saí cedo para não pegar trânsito", "para" indica:', 'finalidade', 'causa', 'tempo', 'oposição', 'A', '"Para" mostra o objetivo da ação: finalidade.'),
  ('"Ele não veio, pois estava doente." "Pois" indica:', 'explicação (causa)', 'conclusão', 'oposição', 'adição', 'A', '"Pois" explica o motivo de ele não ter vindo.'),
  ('Em "Marina chegou. Ela trouxe bolo.", qual palavra retoma "Marina"?', 'Ela', 'trouxe', 'bolo', 'chegou', 'A', 'O pronome "ela" retoma Marina e evita repetir o nome: isso é coesão.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '9º ano' and nome = 'Conectivos e coesão' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Língua Portuguesa · 9º ano · Crase e porquês
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual frase usa a crase corretamente?', 'Vou à escola.', 'Vou à pé.', 'Comecei à estudar.', 'Entreguei à ele.', 'A', 'Crase é a + a: "ir a" + "a escola" = à escola. Antes de verbo e palavra masculina não há crase.'),
  ('Complete: "Não sei ___ ele faltou."', 'porque', 'por que', 'porquê', 'por quê', 'B', 'No meio da frase, com sentido de "por qual motivo", usamos "por que" separado.'),
  ('Complete: "Faltei ___ estava doente."', 'por que', 'porque', 'por quê', 'porquê', 'B', '"Porque" junto e sem acento explica a causa.'),
  ('Complete: "Você saiu cedo ___?"', 'por que', 'por quê', 'porque', 'porquê', 'B', 'No fim da pergunta, "por quê" é separado e leva acento.'),
  ('Qual frase NÃO deve ter crase?', 'Fui à praia.', 'Dei o livro à professora.', 'Andei a cavalo.', 'Cheguei à noite.', 'C', 'Antes de palavra masculina (cavalo) não há crase.')
),
h as (select id from habilidade where disciplina = 'Língua Portuguesa' and serie = '9º ano' and nome = 'Crase e porquês' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 1º ano · Contagem e números
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quantas maçãs há aqui? 🍎🍎🍎🍎🍎', '4', '5', '6', '3', 'B', 'Conte apontando: 1, 2, 3, 4, 5. São 5 maçãs.'),
  ('Qual número vem depois do 7?', '6', '8', '9', '5', 'B', 'Contando: 6, 7, 8. Depois do 7 vem o 8.'),
  ('Qual é o maior número?', '3', '9', '5', '1', 'B', 'O 9 é o maior: vem depois de todos os outros na contagem.'),
  ('Quantas patas tem um cachorro?', '2', '3', '4', '6', 'C', 'O cachorro tem 4 patas.'),
  ('Qual número vem antes do 10?', '11', '8', '9', '7', 'C', 'Contando: 8, 9, 10. Antes do 10 vem o 9.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '1º ano' and nome = 'Contagem e números' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 1º ano · Adição e subtração
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é 2 + 3?', '4', '5', '6', '7', 'B', 'Comece no 2 e conte mais 3: 3, 4, 5. O resultado é 5.'),
  ('Quanto é 5 − 2?', '2', '3', '4', '7', 'B', 'Tinha 5 e tirou 2: sobram 3.'),
  ('Ana tinha 4 balas e ganhou mais 2. Com quantas ficou?', '5', '6', '7', '2', 'B', 'Ganhar é juntar: 4 + 2 = 6.'),
  ('Havia 6 pássaros. 1 voou. Quantos ficaram?', '5', '6', '7', '4', 'A', 'Voar embora é tirar: 6 − 1 = 5.'),
  ('Quanto é 4 + 4?', '6', '7', '8', '9', 'C', '4 + 4 = 8. É o dobro de 4.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '1º ano' and nome = 'Adição e subtração' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 2º ano · Adição e subtração
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é 15 + 4?', '18', '19', '20', '21', 'B', 'Some as unidades: 5 + 4 = 9. Fica 19.'),
  ('Quanto é 20 − 5?', '14', '15', '16', '25', 'B', 'De 20 tirando 5 sobram 15.'),
  ('Leo tem 12 figurinhas e ganhou 10. Quantas tem agora?', '20', '21', '22', '2', 'C', '12 + 10 = 22.'),
  ('Qual é o dobro de 6?', '8', '10', '12', '3', 'C', 'Dobro é duas vezes o número: 6 + 6 = 12.'),
  ('Quanto é 30 + 20?', '40', '50', '60', '10', 'B', '3 dezenas + 2 dezenas = 5 dezenas = 50.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '2º ano' and nome = 'Adição e subtração' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 2º ano · Medidas e tempo
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quantos dias tem uma semana?', '5', '6', '7', '10', 'C', 'A semana tem 7 dias, de domingo a sábado.'),
  ('Quantos minutos tem 1 hora?', '30', '60', '100', '24', 'B', 'Uma hora tem 60 minutos.'),
  ('O que usamos para medir o comprimento de uma mesa?', 'Régua ou fita métrica', 'Balança', 'Termômetro', 'Relógio', 'A', 'Comprimento se mede com régua ou fita métrica. A balança mede massa.'),
  ('Que mês vem depois de março?', 'Fevereiro', 'Abril', 'Maio', 'Junho', 'B', 'Janeiro, fevereiro, março, abril...'),
  ('Uma nota de 10 reais e uma de 5 reais somam:', 'R$ 10', 'R$ 15', 'R$ 20', 'R$ 50', 'B', '10 + 5 = 15 reais.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '2º ano' and nome = 'Medidas e tempo' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 3º ano · Multiplicação
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é 3 × 4?', '7', '10', '12', '14', 'C', '3 × 4 é somar o 4 três vezes: 4 + 4 + 4 = 12.'),
  ('Quanto é 5 × 5?', '10', '20', '25', '30', 'C', '5 + 5 + 5 + 5 + 5 = 25.'),
  ('Uma mesa tem 4 pernas. Quantas pernas têm 3 mesas?', '7', '12', '10', '16', 'B', '3 mesas de 4 pernas: 3 × 4 = 12.'),
  ('Quanto é 2 × 9?', '11', '16', '18', '29', 'C', '2 × 9 é o dobro de 9: 9 + 9 = 18.'),
  ('Qual é o triplo de 3?', '6', '9', '12', '33', 'B', 'Triplo é três vezes: 3 × 3 = 9.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '3º ano' and nome = 'Multiplicação' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 3º ano · Sistema de numeração
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('No número 352, quantas centenas há?', '2', '3', '5', '35', 'B', '352 = 3 centenas, 5 dezenas e 2 unidades.'),
  ('Qual número tem 4 centenas, 0 dezenas e 7 unidades?', '47', '407', '470', '4007', 'B', '4 centenas = 400, mais 7 unidades = 407.'),
  ('Qual é o maior número?', '298', '312', '309', '299', 'B', 'Compare as centenas primeiro: 3 é maior que 2. Entre 312 e 309, compare as dezenas: 1 é maior que 0.'),
  ('Como se escreve "cento e cinco" em algarismos?', '15', '105', '150', '1005', 'B', 'Cento = 100, e cinco = 5: 105.'),
  ('Qual número vem logo depois de 199?', '190', '200', '198', '1100', 'B', '199 + 1 = 200.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '3º ano' and nome = 'Sistema de numeração' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 4º ano · Divisão
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é 12 ÷ 3?', '3', '4', '6', '9', 'B', 'Dividir 12 em 3 grupos iguais dá 4 em cada: 3 × 4 = 12.'),
  ('Dividindo 20 balas igualmente entre 4 crianças, cada uma recebe:', '4', '5', '6', '16', 'B', '20 ÷ 4 = 5, porque 4 × 5 = 20.'),
  ('Qual é a metade de 18?', '6', '8', '9', '36', 'C', 'Metade é dividir por 2: 18 ÷ 2 = 9.'),
  ('Quanto é 35 ÷ 5?', '5', '6', '7', '8', 'C', '5 × 7 = 35, então 35 ÷ 5 = 7.'),
  ('Quantos grupos de 6 cabem em 24?', '3', '4', '5', '6', 'B', '6 × 4 = 24: cabem 4 grupos.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '4º ano' and nome = 'Divisão' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 4º ano · Frações
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Uma pizza foi cortada em 4 pedaços iguais. Cada pedaço é:', '1/2', '1/3', '1/4', '4/1', 'C', 'Um pedaço de quatro iguais é um quarto: 1/4.'),
  ('Qual fração representa a metade?', '1/2', '1/3', '2/3', '1/4', 'A', 'Metade é uma parte de duas iguais: 1/2.'),
  ('O que é maior: 1/2 ou 1/4 da mesma pizza?', '1/2', '1/4', 'São iguais', 'Não dá para saber', 'A', 'Quanto mais partes, menor cada pedaço. Por isso 1/2 é maior que 1/4.'),
  ('Em 3/5, o número 5 indica:', 'em quantas partes o inteiro foi dividido', 'quantas partes foram pegas', 'o resultado da conta', 'nada', 'A', 'O número de baixo (denominador) diz em quantas partes o inteiro foi dividido.'),
  ('Quanto é 1/4 de 12?', '2', '3', '4', '6', 'B', '1/4 de 12 é dividir 12 por 4: 3.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '4º ano' and nome = 'Frações' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 5º ano · Números decimais
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('0,5 é o mesmo que:', '1/2', '1/5', '5', '1/50', 'A', '0,5 são 5 décimos, que é a metade: 1/2.'),
  ('Quanto é R$ 2,50 + R$ 1,50?', 'R$ 3,00', 'R$ 4,00', 'R$ 3,50', 'R$ 4,50', 'B', '50 + 50 centavos = 1 real. 2 + 1 + 1 = 4 reais.'),
  ('Qual número é o maior?', '0,7', '0,25', '0,09', '0,5', 'A', 'Compare os décimos (o primeiro número depois da vírgula): 7 é o maior.'),
  ('Quanto é 1,2 + 0,3?', '1,5', '1,23', '4,2', '1,32', 'A', 'Some décimos com décimos: 2 + 3 = 5. Fica 1,5.'),
  ('Quantos centavos há em R$ 1,00?', '10', '100', '1000', '50', 'B', '1 real = 100 centavos.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '5º ano' and nome = 'Números decimais' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 5º ano · Geometria
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quantos lados tem um triângulo?', '3', '4', '5', '6', 'A', 'Tri quer dizer três: o triângulo tem 3 lados.'),
  ('Qual figura tem 4 lados iguais e 4 ângulos retos?', 'Quadrado', 'Triângulo', 'Círculo', 'Pentágono', 'A', 'O quadrado tem 4 lados iguais e 4 cantos retos.'),
  ('Qual é o perímetro de um quadrado de lado 5 cm?', '10 cm', '20 cm', '25 cm', '15 cm', 'B', 'Perímetro é a soma dos lados: 5 + 5 + 5 + 5 = 20 cm.'),
  ('Quantas faces tem um cubo?', '4', '6', '8', '12', 'B', 'O cubo tem 6 faces, como um dado.'),
  ('Um ângulo reto mede:', '45°', '90°', '180°', '360°', 'B', 'O ângulo reto mede 90°, como o canto de uma folha.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '5º ano' and nome = 'Geometria' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 6º ano · Operações e expressões
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é 2 + 3 × 4?', '20', '14', '24', '9', 'B', 'Primeiro a multiplicação: 3 × 4 = 12. Depois 2 + 12 = 14.'),
  ('Quanto é (2 + 3) × 4?', '14', '20', '24', '9', 'B', 'Primeiro o que está nos parênteses: 5 × 4 = 20.'),
  ('Quanto é 2³ (dois ao cubo)?', '6', '8', '9', '5', 'B', '2³ = 2 × 2 × 2 = 8.'),
  ('Qual é o MMC de 4 e 6?', '2', '10', '12', '24', 'C', 'Múltiplos de 4: 4, 8, 12... Múltiplos de 6: 6, 12... O menor em comum é 12.'),
  ('Qual destes números é primo?', '9', '15', '13', '21', 'C', '13 só é divisível por 1 e por ele mesmo. Os outros têm mais divisores.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '6º ano' and nome = 'Operações e expressões' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 6º ano · Porcentagem
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é 50% de 80?', '30', '40', '50', '16', 'B', '50% é a metade: 80 ÷ 2 = 40.'),
  ('Quanto é 10% de 200?', '2', '10', '20', '100', 'C', '10% é dividir por 10: 200 ÷ 10 = 20.'),
  ('25% corresponde a qual fração?', '1/2', '1/4', '1/5', '2/5', 'B', '25 de 100 é um quarto: 1/4.'),
  ('Um produto de R$ 100 teve 20% de desconto. Qual é o novo preço?', 'R$ 20', 'R$ 80', 'R$ 120', 'R$ 98', 'B', '20% de 100 = 20. 100 − 20 = 80 reais.'),
  ('Numa turma de 30 alunos, 15 são meninas. Qual a porcentagem de meninas?', '15%', '30%', '50%', '45%', 'C', '15 é a metade de 30: 50%.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '6º ano' and nome = 'Porcentagem' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 7º ano · Números inteiros
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é −3 + 5?', '−8', '2', '−2', '8', 'B', 'Na reta numérica, saia do −3 e ande 5 para a direita: chega no 2.'),
  ('Qual número é maior: −2 ou −7?', '−2', '−7', 'São iguais', 'Nenhum', 'A', 'Na reta numérica, −2 está mais à direita, então é maior.'),
  ('Quanto é (−4) × (−3)?', '−12', '12', '−7', '7', 'B', 'Na multiplicação, sinais iguais dão resultado positivo: 12.'),
  ('A temperatura era −2 °C e subiu 6 °C. Qual é a nova temperatura?', '4 °C', '8 °C', '−8 °C', '−4 °C', 'A', '−2 + 6 = 4.'),
  ('Quanto é 7 − 10?', '3', '−3', '17', '−17', 'B', 'Tirar 10 de 7 passa do zero: 7 − 10 = −3.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '7º ano' and nome = 'Números inteiros' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 7º ano · Equações do 1º grau
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Resolva: x + 5 = 12', 'x = 5', 'x = 7', 'x = 17', 'x = 12', 'B', 'Qual número somado a 5 dá 12? x = 12 − 5 = 7.'),
  ('Resolva: 3x = 21', 'x = 7', 'x = 18', 'x = 24', 'x = 3', 'A', 'x = 21 ÷ 3 = 7.'),
  ('Resolva: 2x − 4 = 10', 'x = 3', 'x = 5', 'x = 7', 'x = 14', 'C', '2x = 10 + 4 = 14, então x = 7.'),
  ('O dobro de um número mais 3 é 11. Qual é o número?', '4', '5', '7', '8', 'A', '2x + 3 = 11, então 2x = 8 e x = 4.'),
  ('Resolva: x / 2 = 9', 'x = 4,5', 'x = 11', 'x = 18', 'x = 7', 'C', 'Se a metade de x é 9, então x = 9 × 2 = 18.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '7º ano' and nome = 'Equações do 1º grau' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 8º ano · Potências e raízes
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quanto é √49?', '6', '7', '8', '9', 'B', '7 × 7 = 49, então √49 = 7.'),
  ('Quanto é 10²?', '20', '100', '1000', '12', 'B', '10² = 10 × 10 = 100.'),
  ('Quanto é 5⁰?', '0', '1', '5', '50', 'B', 'Todo número diferente de zero elevado a 0 é igual a 1.'),
  ('Quanto é 2⁴?', '8', '16', '6', '32', 'B', '2 × 2 × 2 × 2 = 16.'),
  ('Quanto é √81 + √16?', '13', '10', '97', '11', 'A', '√81 = 9 e √16 = 4. 9 + 4 = 13.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '8º ano' and nome = 'Potências e raízes' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 8º ano · Expressões algébricas
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Se x = 3, quanto vale 2x + 1?', '6', '7', '5', '9', 'B', 'Troque x por 3: 2 × 3 + 1 = 7.'),
  ('Simplifique: 3a + 2a', '5a', '6a', '5a²', '32a', 'A', 'Termos semelhantes se somam: 3 + 2 = 5, fica 5a.'),
  ('Qual expressão representa "o triplo de um número menos 4"?', '3x − 4', 'x − 4', '4 − 3x', '3(x − 4)', 'A', 'Triplo do número é 3x. Menos 4: 3x − 4.'),
  ('Se a = 2 e b = 5, quanto vale a × b + a?', '12', '10', '17', '14', 'A', '2 × 5 + 2 = 10 + 2 = 12.'),
  ('Quanto é 4x − x?', '4', '3x', '3', '5x', 'B', '4x − 1x = 3x.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '8º ano' and nome = 'Expressões algébricas' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 9º ano · Equações do 2º grau
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Quais são as soluções de x² = 25?', '5 e −5', '25', '5', '0 e 25', 'A', '5 × 5 = 25 e (−5) × (−5) = 25. As duas servem.'),
  ('Quais são as raízes de x² − 5x + 6 = 0?', '2 e 3', '1 e 6', '−2 e −3', '5 e 6', 'A', 'Procure dois números com soma 5 e produto 6: 2 e 3.'),
  ('Qual é o discriminante (Δ = b² − 4ac) de x² + 2x + 1 = 0?', '0', '4', '8', '−4', 'A', 'Δ = 2² − 4 × 1 × 1 = 4 − 4 = 0.'),
  ('Se Δ < 0, a equação do 2º grau:', 'não tem raízes reais', 'tem duas raízes iguais', 'tem duas raízes diferentes', 'tem infinitas raízes', 'A', 'Não existe raiz quadrada real de número negativo, então não há raízes reais.'),
  ('Resolva: x² − 9 = 0', 'x = 3', 'x = ±3', 'x = 9', 'x = ±9', 'B', 'x² = 9, então x = 3 ou x = −3.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '9º ano' and nome = 'Equações do 2º grau' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Matemática · 9º ano · Teorema de Pitágoras
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Num triângulo retângulo de catetos 3 e 4, a hipotenusa mede:', '5', '6', '7', '12', 'A', '3² + 4² = 9 + 16 = 25, e √25 = 5.'),
  ('O Teorema de Pitágoras vale para triângulos:', 'retângulos', 'equiláteros', 'quaisquer', 'obtusângulos', 'A', 'Ele só vale para triângulos com um ângulo reto.'),
  ('Num triângulo retângulo de catetos 6 e 8, a hipotenusa mede:', '10', '14', '12', '48', 'A', '36 + 64 = 100, e √100 = 10.'),
  ('A hipotenusa mede 13 e um cateto mede 5. O outro cateto mede:', '8', '12', '18', '10', 'B', '13² − 5² = 169 − 25 = 144, e √144 = 12.'),
  ('Em a² = b² + c², a letra "a" representa:', 'a hipotenusa', 'um cateto', 'um ângulo', 'a altura', 'A', '"a" é a hipotenusa, o lado oposto ao ângulo reto.')
),
h as (select id from habilidade where disciplina = 'Matemática' and serie = '9º ano' and nome = 'Teorema de Pitágoras' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 5º ano · Partes do computador
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Qual parte do computador usamos para digitar letras?', 'Teclado', 'Monitor', 'Caixa de som', 'Impressora', 'A', 'O teclado é um dispositivo de entrada: com ele mandamos letras e números para o computador.'),
  ('Qual destes é um dispositivo de SAÍDA?', 'Mouse', 'Teclado', 'Monitor', 'Microfone', 'C', 'O monitor mostra informações para nós: é saída. Mouse, teclado e microfone mandam informações para o computador: são entrada.'),
  ('Para que serve o mouse?', 'Imprimir folhas', 'Apontar e clicar na tela', 'Guardar arquivos', 'Tocar música', 'B', 'O mouse move a setinha na tela e permite clicar nas coisas.'),
  ('Onde ficam guardados os arquivos mesmo depois de desligar o computador?', 'No armazenamento (HD ou SSD)', 'No monitor', 'No mouse', 'Na tomada', 'A', 'O HD ou SSD guarda arquivos de forma permanente, mesmo com o computador desligado.'),
  ('Qual destes é um programa (software)?', 'Teclado', 'Navegador de internet', 'Cabo USB', 'Monitor', 'B', 'Software é o programa, a parte que não dá para tocar. O navegador é um programa; os outros são peças (hardware).')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '5º ano' and nome = 'Partes do computador' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 5º ano · Segurança na internet
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Um desconhecido pede seu endereço num jogo online. O que fazer?', 'Passar o endereço', 'Não passar e avisar um adulto', 'Mandar uma foto da casa', 'Pedir o endereço dele', 'B', 'Dados pessoais não se passam para desconhecidos. Avise um adulto de confiança.'),
  ('Qual é a senha mais segura?', '123456', 'seunome', 'Gato#Azul72!', 'senha', 'C', 'Senhas fortes misturam letras maiúsculas e minúsculas, números e símbolos, e não usam o seu nome.'),
  ('Com quem você pode compartilhar sua senha?', 'Com os amigos da escola', 'Com ninguém, só com seus responsáveis', 'Com quem pedir no chat', 'Com todo mundo', 'B', 'A senha é secreta. No máximo, seus pais ou responsáveis podem saber.'),
  ('Apareceu uma mensagem: "Você ganhou um celular! Clique aqui". O que fazer?', 'Clicar rápido', 'Desconfiar e não clicar', 'Passar seus dados', 'Mandar para todos', 'B', 'Prêmios surpresa costumam ser golpes. Não clique e mostre para um adulto.'),
  ('O que é cyberbullying?', 'Um jogo de computador', 'Ofender ou humilhar alguém pela internet', 'Um tipo de vírus', 'Uma rede social', 'B', 'Cyberbullying é a agressão feita pela internet. Se acontecer com você ou com alguém, conte a um adulto.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '5º ano' and nome = 'Segurança na internet' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 6º ano · Pensamento computacional
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('O que é um algoritmo?', 'Um tipo de computador', 'Uma sequência de passos para resolver um problema', 'Um vírus', 'Um jogo', 'B', 'Algoritmo é um passo a passo, como uma receita de bolo.'),
  ('Qual é a ordem certa para escovar os dentes?', 'Enxaguar, escovar, pôr pasta', 'Pôr pasta, escovar, enxaguar', 'Escovar, pôr pasta, enxaguar', 'Enxaguar, pôr pasta, guardar', 'B', 'Num algoritmo a ordem dos passos importa: primeiro a pasta, depois escovar, depois enxaguar.'),
  ('Dividir um problema grande em partes menores se chama:', 'Decomposição', 'Impressão', 'Formatação', 'Download', 'A', 'Decomposição é quebrar um problema em partes menores e mais fáceis de resolver.'),
  ('Perceber que 2, 4, 6, 8 aumenta de 2 em 2 é identificar um:', 'Padrão', 'Vírus', 'Arquivo', 'Cabo', 'A', 'Reconhecer padrões é uma das bases do pensamento computacional.'),
  ('Um robô anda 1 casa a cada comando "frente". Para andar 3 casas, ele precisa de:', '1 comando', '2 comandos', '3 comandos', '4 comandos', 'C', 'Cada comando move 1 casa, então são 3 comandos "frente".')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '6º ano' and nome = 'Pensamento computacional' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 6º ano · Arquivos e pastas
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Para que servem as pastas no computador?', 'Organizar arquivos', 'Ligar o computador', 'Limpar a tela', 'Acessar a internet', 'A', 'Pastas organizam os arquivos, como gavetas de um armário.'),
  ('Um arquivo "trabalho.docx" provavelmente é um:', 'Texto', 'Vídeo', 'Música', 'Jogo', 'A', '.docx é a extensão de documentos de texto.'),
  ('Qual extensão costuma ser de uma imagem?', '.mp3', '.jpg', '.docx', '.exe', 'B', '.jpg e .png são imagens. .mp3 é música e .docx é texto.'),
  ('O que acontece com um arquivo enviado para a lixeira?', 'Some para sempre na hora', 'Fica na lixeira até ela ser esvaziada', 'Vai para a internet', 'Vira outro arquivo', 'B', 'Na lixeira o arquivo ainda pode ser recuperado, até ela ser esvaziada.'),
  ('Fazer uma cópia dos arquivos importantes em outro lugar se chama:', 'Backup', 'Download', 'Bug', 'Login', 'A', 'Backup é a cópia de segurança: se o original se perder, você ainda tem a cópia.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '6º ano' and nome = 'Arquivos e pastas' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 7º ano · Internet e redes
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('O que é a internet?', 'Um programa de texto', 'Uma rede que liga computadores do mundo todo', 'Um tipo de celular', 'Um antivírus', 'B', 'A internet é uma grande rede que conecta computadores e outros aparelhos no mundo inteiro.'),
  ('Qual destes é um navegador?', 'Google Chrome', 'Teclado', 'Pen drive', 'Windows Paint', 'A', 'Navegador é o programa para acessar sites, como Chrome, Firefox e Edge.'),
  ('O que significa fazer "download"?', 'Enviar um arquivo para a internet', 'Baixar um arquivo da internet para o aparelho', 'Apagar um arquivo', 'Desligar o computador', 'B', 'Download é baixar. O contrário, enviar, é upload.'),
  ('O Wi-Fi permite:', 'Conectar à rede sem fio', 'Imprimir sem papel', 'Carregar a bateria', 'Aumentar a tela', 'A', 'Wi-Fi é uma conexão de rede sem fio, por ondas de rádio.'),
  ('O cadeado ao lado do endereço do site indica que:', 'O site é proibido', 'A conexão é protegida (criptografada)', 'O site está fechado', 'O site é pago', 'B', 'O cadeado (HTTPS) mostra que os dados trocados com o site são protegidos.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '7º ano' and nome = 'Internet e redes' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 7º ano · Cidadania digital
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Antes de compartilhar uma notícia, você deve:', 'Compartilhar logo', 'Verificar se a fonte é confiável', 'Mudar o título', 'Mandar só para os amigos', 'B', 'Conferir a fonte ajuda a não espalhar notícias falsas (fake news).'),
  ('Postar foto de um colega sem permissão é:', 'Normal', 'Falta de respeito com a privacidade dele', 'Obrigatório', 'Um jeito de ajudar', 'B', 'Cada pessoa decide sobre a própria imagem. Sempre peça permissão.'),
  ('O que é "pegada digital"?', 'Um tipo de mouse', 'O rastro do que fazemos e postamos na internet', 'Uma marca na tela', 'Um aplicativo', 'B', 'Tudo o que postamos deixa rastros que podem ficar na internet por muito tempo.'),
  ('Usar o trabalho de outra pessoa como se fosse seu é:', 'Plágio', 'Backup', 'Pesquisa', 'Download', 'A', 'Plágio é copiar sem dar crédito. Ao usar algo de alguém, cite a fonte.'),
  ('Qual atitude é mais saudável com telas?', 'Usar o celular a noite toda', 'Fazer pausas e equilibrar com outras atividades', 'Nunca sair do jogo', 'Comer sempre na frente da tela', 'B', 'Pausas, sono e outras atividades ajudam a usar a tecnologia de forma saudável.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '7º ano' and nome = 'Cidadania digital' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 8º ano · Lógica e algoritmos
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('"SE estiver chovendo, ENTÃO leve guarda-chuva" é um exemplo de:', 'Condicional', 'Repetição', 'Variável', 'Arquivo', 'A', 'Uma condicional executa uma ação só se a condição for verdadeira.'),
  ('"REPITA 10 vezes: pule" é um exemplo de:', 'Condicional', 'Laço de repetição', 'Vírus', 'Senha', 'B', 'O laço (loop) repete um comando várias vezes sem precisar escrever cada um.'),
  ('Se x = 5, o que o algoritmo mostra? SE x > 3 mostre "grande" SENÃO mostre "pequeno"', 'grande', 'pequeno', '5', '3', 'A', '5 é maior que 3, então a condição é verdadeira e mostra "grande".'),
  ('Um erro num programa é chamado de:', 'Bug', 'Byte', 'Link', 'Pixel', 'A', 'Bug é um defeito no programa. Corrigir é "depurar" (debug).'),
  ('Para achar o maior número de uma lista, um algoritmo pode:', 'Comparar os números um a um', 'Desligar o computador', 'Apagar a lista', 'Escolher sempre o primeiro', 'A', 'Comparando um a um e guardando o maior até agora, chegamos ao maior de todos.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '8º ano' and nome = 'Lógica e algoritmos' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 8º ano · Dados e informação
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('A menor unidade de informação do computador é o:', 'Bit', 'Byte', 'Megabyte', 'Pixel', 'A', 'O bit vale 0 ou 1. Oito bits formam um byte.'),
  ('Quantos bits formam 1 byte?', '2', '4', '8', '10', 'C', '1 byte = 8 bits.'),
  ('Qual é maior?', '1 KB', '1 MB', '1 GB', '1 byte', 'C', 'Em ordem: byte < KB < MB < GB. O gigabyte é o maior.'),
  ('No sistema binário, os computadores usam só os algarismos:', '0 e 1', '1 e 2', '0 a 9', 'A e B', 'A', 'Binário tem só dois algarismos: 0 e 1, como desligado e ligado.'),
  ('Os pequenos pontos que formam uma imagem na tela se chamam:', 'Pixels', 'Bytes', 'Pastas', 'Links', 'A', 'Pixel é cada pontinho colorido que forma a imagem.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '8º ano' and nome = 'Dados e informação' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 9º ano · Segurança da informação
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Phishing é:', 'Um jogo de pescaria', 'Um golpe que tenta roubar dados com mensagens falsas', 'Um antivírus', 'Um tipo de backup', 'B', 'No phishing, o golpista finge ser um banco ou loja para pegar senhas e dados.'),
  ('A verificação em duas etapas serve para:', 'Deixar o celular mais rápido', 'Pedir uma confirmação extra além da senha', 'Apagar arquivos', 'Baixar jogos', 'B', 'Mesmo que descubram sua senha, ainda precisam do código extra para entrar.'),
  ('Qual atitude protege contra vírus?', 'Baixar programas de qualquer site', 'Manter o sistema e o antivírus atualizados', 'Desligar o antivírus', 'Abrir anexos desconhecidos', 'B', 'Atualizações corrigem falhas de segurança, e o antivírus bloqueia ameaças conhecidas.'),
  ('Usar a mesma senha em todos os sites é:', 'Seguro', 'Arriscado: se uma vazar, todas as contas ficam expostas', 'Obrigatório', 'Recomendado pelos bancos', 'B', 'Senhas diferentes evitam que um vazamento abra todas as suas contas.'),
  ('Ao usar um computador público, ao terminar você deve:', 'Deixar a conta aberta', 'Sair da conta (logout)', 'Salvar a senha no navegador', 'Desligar o monitor só', 'B', 'Sair da conta impede que a próxima pessoa use o seu login.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '9º ano' and nome = 'Segurança da informação' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;

-- Tecnologia e Computação · 9º ano · Programação básica
with v(enunciado, a, b, c, d, correta, explicacao) as (values
  ('Em programação, uma variável serve para:', 'Guardar um valor', 'Ligar o computador', 'Desenhar a tela', 'Conectar ao Wi-Fi', 'A', 'Variável é como uma caixa com nome onde guardamos um valor para usar depois.'),
  ('Depois de: pontos = 10; pontos = pontos + 5; quanto vale pontos?', '5', '10', '15', '105', 'C', 'Pontos começa em 10 e recebe ele mesmo mais 5: 15.'),
  ('Um laço "para i de 1 até 3, mostre i" mostra:', '1 2 3', '3', '1', '0 1 2 3', 'A', 'O laço passa por i = 1, 2 e 3 e mostra cada valor.'),
  ('Qual destas é uma linguagem de programação?', 'Python', 'Excel', 'Wi-Fi', 'Pen drive', 'A', 'Python é uma linguagem de programação muito usada para aprender.'),
  ('Um texto entre aspas, como "Olá", no código é um valor do tipo:', 'Texto (string)', 'Número', 'Imagem', 'Pasta', 'A', 'Valores entre aspas são textos, chamados de strings.')
),
h as (select id from habilidade where disciplina = 'Tecnologia e Computação' and serie = '9º ano' and nome = 'Programação básica' and professor_id is null),
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
  and q.professor_id is null and q.explicacao is null;
