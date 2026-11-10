# Reforço em Jogo

Site: https://reforcoemjogo.netlify.app

Plataforma de quizzes curtos para fazer reforço escolar dentro da sala de aula. A professora cria uma sessão, os alunos entram pelo celular com um código e, no final, ela vê quem precisa de reforço e em qual assunto.

Projeto integrado das disciplinas de Extensão (PIES I), CTS, UX, Front End e Banco de Dados.

## Problema

Com o ensino integral não existe mais contraturno, então o aluno que precisa de reforço tem que sair da sala e acaba perdendo conteúdo.

## Como funciona

1. A professora faz login, escolhe a habilidade e gera uma sessão. O site mostra um código de 6 caracteres e um link.
2. O aluno abre o site no celular, digita o código e um apelido (não precisa criar conta) e responde até 8 questões.
3. Depois de cada resposta ele já vê se acertou, e no final aparece o resultado.
4. No relatório a professora vê os acertos por aluno e por assunto. Quem fica abaixo de 60% aparece como "Reforçar".

## Tecnologias

- HTML, CSS e JavaScript puro nas telas (pasta `src`)
- Supabase (PostgreSQL) para o banco de dados e o login da professora
- Netlify para hospedar o site, que é publicado de novo a cada atualização da branch `main`

## Segurança e privacidade

- O aluno não acessa as tabelas do banco. Ele só usa três funções: entrar na sessão, buscar as questões e responder.
- A alternativa correta não é enviada para o celular. A correção é feita no banco, que devolve só se acertou ou errou.
- Cada questão só pode ser respondida uma vez por aluno.
- Foi usado RLS (Row Level Security) em todas as tabelas, então cada professora só vê as próprias sessões e alunos.
- Do aluno é guardado só o apelido e as respostas.
- A chave que aparece no `config.js` é a chave pública do Supabase. A chave secreta não é usada no site.

## Banco de dados

Tabelas: `professor`, `sessao`, `participante`, `resposta`, `habilidade` e `questao`.
O relatório usa as views `v_acertos_por_aluno` e `v_acertos_por_assunto`.

O DER e o modelo lógico estão em `docs/banco-de-dados.md`.

## Estrutura

```
src/
  index.html         tela inicial
  login.html         login da professora
  painel.html        criar e listar sessões
  entrar.html        entrada do aluno
  quiz.html          o jogo
  relatorio.html     relatório da sessão
  diagnostico.html   testa a ligação com o banco
  css/style.css
  js/                um arquivo para cada tela + app.js (comum) e config.js
supabase/
  schema.sql         tabelas, segurança, funções e views
  seed.sql           12 questões de Português (5º ano)
  professora.sql     liga a conta de login à tabela professor
  demo.sql           alunos fictícios para demonstração
docs/                requisitos, banco de dados, roteiro e explicação do código
```

## Rodar localmente

```bash
cd src
python3 -m http.server 8000
```

Depois é só abrir http://localhost:8000. Para criar o banco do zero, ver `docs/configurar-supabase.md`.

## Próximos passos

- Outros tipos de jogo além do quiz
- Cadastro de questões pela tela
- Mais disciplinas e séries
- QR Code para entrar na sessão

## Observação

Usei o Claude Code como ferramenta de apoio durante o desenvolvimento. O código foi revisado, testado e comentado.
