# Quizzes & Masmorras

Site: https://reforcoemjogo.netlify.app

Plataforma gamificada para reforço escolar. Já vem com questões do Ensino Fundamental, e cada Mestre pode criar questões para qualquer série, disciplina ou assunto. O Mestre (docente, monitor ou quem reúne amigos para estudar) cria uma sala, os Aprendizes entram pelo celular com um código e enfrentam monstros respondendo questões. No final, o Mestre vê quem precisa de reforço e em qual assunto.

Projeto integrado das disciplinas de Extensão (PIES I), CTS, UX, Front End e Banco de Dados.

## Problema

Com o ensino integral não existe mais contraturno, então o aluno que precisa de reforço tem que sair da sala e acaba perdendo conteúdo.

## Como funciona

1. O Mestre cria uma conta e uma sala: marca a série, a disciplina, o assunto, de onde vêm as questões (padrão, próprias ou as duas) e o modo de jogo. Antes de criar, vê a **prévia** das questões que a sala vai usar.
2. O Aprendiz entra pelo celular com o código e um apelido, sem criar conta.
3. **Masmorra solo:** cada aprendiz escolhe uma classe e enfrenta 3 ondas de monstros e um chefão. Acertar é atacar; errar tira um coração e mostra a explicação. Há poções (cura, visão, escudo) e um baú com recompensas entre as ondas.
4. **Turma contra o chefão:** o Mestre projeta a lousa e todos atacam o mesmo chefão pelo celular. A turma vence junta, e a lousa mostra só os acertos.
5. Durante a aula, o Mestre acompanha a sala **ao vivo** pelo celular: quem está respondendo, as questões que mais confundiram a turma (com a alternativa errada mais marcada e quem errou) e os acertos por aprendiz e por assunto, com "Reforçar" abaixo de 60%.

Outros detalhes:
- **Sem questões repetidas:** a vida dos monstros se ajusta ao número de questões da sala; só voltam as erradas, como "Revisão".
- **Para qualquer nível:** o Mestre digita série, disciplina e assunto livremente (Ensino Médio, cursos, pré-vestibular...).
- **Acessibilidade:** botão "Ouvir" lê a questão em voz alta; modo escuro nas telas do Mestre.
- **Conta do Mestre:** cadastro com senha forte (8+ caracteres, com maiúscula, minúscula e número) e "Esqueci minha senha".

O site já vem com 237 questões padrão, todas com explicação: Língua Portuguesa e Matemática (1º ao 9º ano) e Tecnologia e Computação (5º ao 9º ano, seguindo os eixos da BNCC Computação: mundo digital, cultura digital e pensamento computacional). As questões ficam em `supabase/gerador/questoes.py`, que gera o `seed.sql`. O Mestre pode criar as próprias questões ou duplicar e adaptar uma padrão.

Protótipo sem login: `/masmorra` (solo) e `/masmorra/turma` (demonstração do modo turma).

## Tecnologias

- React com Vite nas telas (pasta `src`)
- Supabase (PostgreSQL) para o banco de dados e o login do Mestre
- Netlify para hospedar o site, que é gerado e publicado de novo a cada atualização da branch `main`

## Segurança e privacidade

- O aprendiz não acessa as tabelas do banco. Ele só usa funções prontas: entrar na sessão, buscar as questões, responder, usar a poção de visão e ver o estado do chefão no modo turma.
- A alternativa correta não é enviada para o celular. A correção é feita no banco, que devolve só se acertou ou errou.
- Cada questão só pode ser respondida uma vez por aprendiz.
- Foi usado RLS (Row Level Security) em todas as tabelas, então cada Mestre só vê as próprias salas e aprendizes.
- Do aprendiz é guardado só o apelido e as respostas.
- Apelidos com palavrões ou ofensas são recusados na entrada, e na lousa o Mestre pode esconder qualquer apelido.
- A chave que aparece no `config.js` é a chave pública do Supabase. A chave secreta não é usada no site.

## Banco de dados

Tabelas: `professor`, `sessao`, `participante`, `resposta`, `golpe` (acertos do modo turma), `habilidade` e `questao`.
O relatório usa as views `v_acertos_por_aluno`, `v_acertos_por_assunto` e `v_acertos_por_questao`.

O DER e o modelo lógico estão em `docs/banco-de-dados.md`.

## Estrutura

```
src/
  App.jsx            rotas (qual tela aparece em cada endereço)
  config.js          endereço do Supabase e chave pública
  lib/supabase.js    conexão com o banco
  pages/             uma tela por arquivo: Inicio, MestreEntrar, MestreCadastro,
                     Painel, Questoes, Lousa, Relatorio, AprendizEntrar,
                     JogarMasmorra, JogarTurma, Diagnostico...
  masmorra/          o jogo: regras, monstros, efeitos, sons e telas da batalha
  components/        peças reaproveitadas (chips, botão de tema, formulários)
  styles.css
supabase/
  schema.sql         tabelas, segurança, funções, views e o gatilho de cadastro
  seed.sql           questões iniciais
  demo.sql           aprendizes fictícios para demonstração
docs/                requisitos, banco de dados e configuração do Supabase
```

## Rodar localmente

```bash
npm install
npm run dev
```

Depois é só abrir o endereço que aparecer no terminal (normalmente http://localhost:5173). Para criar o banco do zero, ver `docs/configurar-supabase.md`.

## Próximos passos

- Comunidade de questões entre Mestres, com moderação
- Turmas fixas com histórico ao longo do ano
- Outros modos de jogo (corrida, por exemplo)
- Mais disciplinas no banco de questões padrão

## Observação

Usei o Claude Code como ferramenta de apoio durante o desenvolvimento. O código foi revisado, testado e comentado.
