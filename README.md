# Quizzes & Masmorras

Site: https://reforcoemjogo.netlify.app

Plataforma gamificada para reforço escolar no Ensino Fundamental. O Mestre (docente, monitor ou quem reúne amigos para estudar) cria uma sala, os Aprendizes entram pelo celular com um código e enfrentam monstros respondendo questões. No final, o Mestre vê quem precisa de reforço e em qual assunto.

Em desenvolvimento: a masmorra (batalha com ondas, chefão, poções e equipamentos), solo e em grupo.

Projeto integrado das disciplinas de Extensão (PIES I), CTS, UX, Front End e Banco de Dados.

## Problema

Com o ensino integral não existe mais contraturno, então o aluno que precisa de reforço tem que sair da sala e acaba perdendo conteúdo.

## Como funciona

1. O Mestre cria uma conta, escolhe ano, disciplina e assunto e cria uma sala. O site mostra um código de 6 caracteres e um link.
2. O Aprendiz abre o site no celular, digita o código e um apelido (não precisa criar conta) e joga.
3. Depois de cada resposta ele já vê se acertou, e no final aparece o resultado.
4. No relatório o Mestre vê os acertos por aprendiz e por assunto. Quem fica abaixo de 60% aparece como "Reforçar". Salas antigas podem ser encerradas ou excluídas.

## Tecnologias

- React com Vite nas telas (pasta `src`)
- Supabase (PostgreSQL) para o banco de dados e o login do Mestre
- Netlify para hospedar o site, que é gerado e publicado de novo a cada atualização da branch `main`

## Segurança e privacidade

- O aprendiz não acessa as tabelas do banco. Ele só usa três funções: entrar na sessão, buscar as questões e responder.
- A alternativa correta não é enviada para o celular. A correção é feita no banco, que devolve só se acertou ou errou.
- Cada questão só pode ser respondida uma vez por aprendiz.
- Foi usado RLS (Row Level Security) em todas as tabelas, então cada Mestre só vê as próprias salas e aprendizes.
- Do aprendiz é guardado só o apelido e as respostas.
- A chave que aparece no `config.js` é a chave pública do Supabase. A chave secreta não é usada no site.

## Banco de dados

Tabelas: `professor`, `sessao`, `participante`, `resposta`, `habilidade` e `questao`.
O relatório usa as views `v_acertos_por_aluno` e `v_acertos_por_assunto`.

O DER e o modelo lógico estão em `docs/banco-de-dados.md`.

## Estrutura

```
src/
  App.jsx            rotas (qual tela aparece em cada endereço)
  config.js          endereço do Supabase e chave pública
  lib/supabase.js    conexão com o banco
  pages/             uma tela por arquivo: Inicio, MestreEntrar, MestreCadastro,
                     Painel, Relatorio, AprendizEntrar, Quiz, Diagnostico...
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

- Outros tipos de jogo além do quiz
- Cadastro de questões pela tela
- Mais disciplinas e séries
- QR Code para entrar na sala

## Observação

Usei o Claude Code como ferramenta de apoio durante o desenvolvimento. O código foi revisado, testado e comentado.
