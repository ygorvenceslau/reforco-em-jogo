# Explicação do código

Guia para explicar e defender o Quizzes & Masmorras. Leia com o código aberto no VS Code.

## 1. A ideia em uma frase
O reforço escolar vira uma aventura: o aprendiz derrota monstros respondendo questões, sozinho ou com a turma, e o Mestre (docente) descobre quem precisa de reforço e em qual assunto.

## 2. Como as peças se ligam
```
 Celular / notebook                     Netlify                          Supabase
 ┌────────────────────┐   baixa o site  ┌──────────────┐               ┌────────────────────────┐
 │ Navegador (React)   │ ◄────────────── │ pasta dist/  │               │ PostgreSQL (banco)      │
 │                     │ ────────────────────────────────────────────► │ Auth (login do Mestre)  │
 └────────────────────┘    consultas e funções do banco                 │ RLS (regras de acesso)  │
                                                                        └────────────────────────┘
```
- **Netlify:** gera o site (`npm run build`) e entrega os arquivos prontos. As telas são estáticas.
- **Supabase:** é o back-end. Tem o banco PostgreSQL, o login do Mestre e as regras de segurança.
- **`src/config.js`:** liga as duas partes, com o endereço do projeto e a chave pública.
- Não existe um servidor próprio, como Node ou PHP. A lógica do servidor está em **funções SQL dentro do banco** (`supabase/schema.sql`).

## 3. Tecnologias
- **React + Vite:** telas e componentes. Com o jogo (estado da batalha, animações, várias telas), um framework passou a valer a pena.
- **React Router:** cada endereço mostra uma tela (`src/App.jsx`).
- **supabase-js:** biblioteca que conversa com o Supabase.
  - `sb.auth`: login.
  - `sb.from("tabela")`: consultas.
  - `sb.rpc("funcao")`: chama funções do banco.
- **PostgreSQL + PL/pgSQL:** tabelas, regras de segurança e funções.

## 4. Onde está cada coisa
| Arquivo | O que faz |
|---|---|
| `src/App.jsx` | Rotas: qual tela aparece em cada endereço |
| `src/lib/supabase.js` | Conexão com o banco, usada por todas as telas |
| `src/components/RequireMestre.jsx` | Protege as telas do Mestre: sem login, vai para a tela de entrar |
| `src/pages/MestreCadastro.jsx` | Cadastro de Mestre |
| `src/pages/Painel.jsx` | Criar sala (ano, disciplina, assunto, fonte das questões e modo), listar, encerrar e excluir salas |
| `src/pages/Questoes.jsx` | Banco de questões: padrão e minhas; criar, editar, duplicar |
| `src/pages/AprendizEntrar.jsx` | Aprendiz entra com código e apelido |
| `src/pages/JogarMasmorra.jsx` | Masmorra solo dentro da sala |
| `src/pages/JogarTurma.jsx` | Celular do aprendiz no modo turma |
| `src/pages/Lousa.jsx` | Lousa do Mestre no modo turma |
| `src/pages/Relatorio.jsx` | Acertos por aprendiz e por assunto, com "Reforçar" |
| `src/masmorra/regras.js` | **Regras do jogo** (ataque, crítico, dano, poções, baú, ondas) |
| `src/masmorra/fontes.js` | De onde vêm as questões e quem corrige (protótipo ou servidor) |
| `src/masmorra/Masmorra.jsx` | Telas da masmorra: classe, batalha, baú, derrota, vitória |
| `src/masmorra/dados.js` | Classes, monstros, poções, recompensas e medalhas |
| `supabase/schema.sql` | Tabelas, RLS, funções e views |
| `supabase/seed.sql` | 237 questões padrão com explicação (gerado por `supabase/gerador/`) |
| `src/lib/apelido.js` | Filtro de apelidos impróprios (palavrões e ofensas), usado na entrada do aprendiz e na lousa |
| `src/lib/obterSb.js` | Busca a biblioteca do Supabase só quando ela é usada, para a tela inicial abrir mais rápido |
| `src/masmorra/Monstro.jsx` | Desenho dos monstros em SVG: um molde por tipo (dragão, morcego, polvo, robô...), colorido com a cor do monstro e com partes animadas |
| `src/masmorra/Efeitos.jsx` | Efeitos de ataque: corte (guerreiro), magia (mago), flecha (arqueiro) e garras (erro) |

## 5. As regras do jogo (`src/masmorra/regras.js`)
Tudo o que acontece na batalha passa por **uma função só**, `regras(jogo, acao)`. Ela recebe o estado atual e uma ação e devolve o estado novo. No React isso se chama *reducer* (`useReducer`).

| Ação | O que acontece |
|---|---|
| `ESCOLHER_CLASSE` | Cria o herói (vida e poções da classe) e sorteia o baralho de questões |
| `RESPONDER` | Acertou: dano no monstro (crítico a cada N acertos seguidos, espada +1). Errou: perde 1 coração (o escudo bloqueia) |
| `USAR_POCAO` | Cura (+2 corações), escudo (bloqueia o próximo erro) ou visão (elimina 2 erradas) |
| `AVANCAR` | Monstro derrotado: baú ou vitória. Corações zerados: derrota. Senão, próxima questão |
| `ESCOLHER_RECOMPENSA` | Aplica a recompensa do baú e começa a próxima onda |
| `TENTAR_DE_NOVO` | Volta com a vida cheia e o monstro da onda também se recupera |

**Por que assim?** As regras ficam num lugar só, fáceis de testar e explicar. Simulei 1.200 partidas só com essa função para equilibrar o jogo: de 10 a 22 questões por partida, conforme o desempenho.

## 6. A "fonte" das questões (`src/masmorra/fontes.js`)
A masmorra não sabe de onde vêm as questões nem quem corrige. Ela recebe uma **fonte** com três funções: `carregar`, `responder` e `eliminar`.
- **`fonteLocal`:** o protótipo (`/masmorra`), com questões no próprio site, para demonstrar sem login.
- **`fonteSala`:** a sala real, que chama as funções do banco:
```js
sb.rpc("buscar_questoes", { p_participante, p_limite: 40 })  // questões SEM a resposta certa
sb.rpc("responder_questao", { p_participante, p_questao, p_escolhida })  // corrige no servidor
sb.rpc("eliminar_alternativas", { p_participante, p_questao })  // poção de visão
```
Assim o mesmo jogo funciona nos dois casos, e **a resposta certa só chega ao celular depois que o aprendiz responde**.

## 7. Modo turma
1. O Mestre cria a sala em modo turma e abre a **lousa** (`Lousa.jsx`), que mostra o código grande.
2. Os aprendizes entram e ficam esperando (`JogarTurma.jsx`).
3. O Mestre clica em **Começar a batalha**. A função `iniciar_turma` grava a vida do chefão (5 por aprendiz, no mínimo 10) e a hora de início, com o relógio do servidor.
4. Cada acerto vira uma linha na tabela `golpe`. O **dano** do chefão é a contagem de golpes da sala desde o início da batalha. (A tabela `resposta` só guarda a primeira resposta de cada questão, para o relatório; por isso os golpes ficam numa tabela separada.)
5. A lousa (`estado_turma_mestre`) e os celulares (`estado_turma`) consultam o servidor **a cada 2 segundos**.
6. A lousa mostra **só os acertos**, para não expor quem erra.

## 7b. Recursos que deixam o jogo justo e versátil
- **Sem repetição (`vidasPara` e `proximaQuestao` em `regras.js`):** a vida dos 3 monstros soma no máximo o número de questões da sala. Como cada acerto tira pelo menos 1 de vida, quem acerta tudo vence antes de repetir. Quando as questões acabam, só voltam as erradas, com a etiqueta "🔁 Revisão".
- **Prévia (`Painel.jsx`):** antes de criar a sala, o Mestre vê quantas questões ela vai usar e a lista com a resposta certa. Sala sem questões não pode ser criada.
- **Assuntos livres (`Questoes.jsx`):** série, disciplina e assunto são digitados com sugestões. Combinação nova vira uma `habilidade` do próprio Mestre (`habilidade.professor_id`), visível só para ele; combinação que já existe é reaproveitada.
- **Escolha por toque (`components/Chips.jsx`):** botões para marcar no lugar de listas suspensas, com busca quando há muitas opções.
- **Senha forte (`problemaNaSenha` em `lib/util.js`):** mínimo 8 caracteres, com minúscula, maiúscula e número, sem ser só espaços. A mesma regra deve estar configurada no Supabase.
- **Filtro de apelidos (`lib/apelido.js`):** o apelido aparece na lousa, então palavrões e ofensas são recusados na entrada. O texto é normalizado (sem acento, `4`→`a`, `0`→`o`...) para pegar disfarces como `p0rr4`. Palavras curtas só contam sozinhas ("Cuca" passa), e as longas contam em qualquer parte do texto. Na lousa, o Mestre ainda pode clicar em "🙈 esconder", e um apelido impróprio que chegue ao banco aparece como "Um aprendiz".
- **Site leve no celular (`App.jsx`):** as telas são baixadas só quando são abertas (`React.lazy`), e a biblioteca do Supabase vem depois da primeira tela (`obterSb.js`). O arquivo principal caiu de 587 KB para 298 KB. O Netlify manda o celular guardar os arquivos por um ano (`netlify.toml`), então a próxima visita abre quase na hora.
- **Recuperação de senha (`EsqueciSenha.jsx` e `NovaSenha.jsx`):** o Supabase envia o link por e-mail; a mensagem é a mesma exista ou não a conta, para não revelar quem está cadastrado.

## 8. Banco de dados
Tabelas: `professor` → `sessao` → `participante` → `resposta` e `golpe`; `habilidade` → `questao`. Diagrama em `docs/banco-de-dados.md`.

Colunas importantes:
- `questao.professor_id`: vazio = questão padrão; preenchido = questão daquele Mestre.
- `questao.explicacao`: aparece para o aprendiz quando ele erra.
- `sessao.fonte` (`padrao`, `minhas`, `todas`) e `sessao.modo` (`solo`, `turma`).

**RLS (segurança por linha):** o PostgreSQL só devolve as linhas permitidas. Exemplo:
```sql
create policy "professor ve questoes" on questao
  for select to authenticated using (professor_id is null or professor_id = auth.uid());
```
"O Mestre vê as questões padrão e as próprias." Para criar, editar e apagar, só as próprias.

**Funções `security definer`:** as funções do aprendiz rodam com permissão do dono do banco, mas só fazem o que está escrito nelas. É assim que o aprendiz joga sem conta e sem enxergar nenhuma tabela.

## 9. Perguntas prováveis
- **Por que React?** Com o jogo, o site passou a ter estado complexo (vida, poções, ondas), animações e várias telas. O React organiza isso em componentes.
- **Por que não Node.js?** O back-end é o Supabase. A lógica do servidor está em funções SQL no PostgreSQL, então não foi preciso manter um servidor.
- **O Netlify serve?** Sim. Ele entrega só os arquivos do site, que são estáticos. A parte dinâmica fica no Supabase.
- **O aprendiz pode colar?** A resposta certa só sai do servidor depois da resposta, e cada questão só vale uma vez no relatório (`unique` na tabela `resposta`).
- **Uma pessoa vê os dados de outra?** Não. O RLS filtra pelo usuário logado, e o aprendiz não acessa tabelas.
- **O aprendiz precisa de conta?** Não: código e apelido. Isso protege os dados das crianças (LGPD) e não toma tempo da aula.
- **O modo turma é em tempo real?** Atualiza a cada 2 segundos, o que é suficiente para a sala. Dá para trocar por Supabase Realtime no futuro.
- **Por que a mesma questão não se repete?** A vida dos monstros se ajusta ao número de questões; só voltam as erradas, como revisão.
- **Serve só para o Ensino Fundamental?** Não. O banco padrão é do Fundamental, mas o Mestre cria questões para qualquer série ou assunto, e elas ficam visíveis só para ele.
- **Os equipamentos não tiram o foco do estudo?** Eles ajudam, mas não substituem o acerto: sem responder certo, ninguém vence. E todo erro mostra uma explicação.
- **E se um aluno colocar um palavrão no apelido?** O site recusa na entrada (`lib/apelido.js`), e na lousa o Mestre esconde qualquer apelido com um clique.
- **O site é pesado para o celular da escola?** Não: cada tela é baixada só quando é aberta, e a tela inicial não espera a biblioteca do banco. Numa simulação de 3G, ela abriu cerca de 30% mais rápido.
- **Usou IA?** Sim, o Claude Code, como ferramenta de apoio. Cada parte foi testada, e eu consigo explicar o que cada arquivo faz.
