# Reforço em Jogo

**Site no ar: https://reforcoemjogo.netlify.app**

Plataforma web de quizzes curtos para fazer o **reforço escolar dentro da aula**. A professora cria uma sessão, os alunos entram pelo celular com um código e, no final, ela vê **quem precisa de reforço e em qual assunto**.

Projeto integrado (Extensão/PIES I, CTS, UX, Front End e Banco de Dados).

## O problema
Com o ensino integral não existe mais contraturno: o aluno que precisa de reforço sai da sala e perde conteúdo.

## A solução
1. A **professora** faz login, escolhe a habilidade e gera uma sessão com um **código de 6 letras**.
2. O **aluno** entra pelo celular com o código e um apelido, **sem criar conta**, e joga um quiz de até 8 questões.
3. Ele vê na hora se acertou e, no fim, o resultado.
4. A professora abre o **relatório**: acertos por aluno e por assunto, com a marcação **"Reforçar"** abaixo de 60%.

## Tecnologias
| Parte | Tecnologia | Para que serve |
|---|---|---|
| Telas | HTML, CSS e JavaScript puros | Funcionam no navegador do celular, sem instalar nada |
| Hospedagem | Netlify | Publica a pasta `src/` a cada atualização da `main` |
| Banco de dados | Supabase (PostgreSQL) | Tabelas, login da professora e regras de segurança |

```
Celular / notebook  ──►  Netlify (telas da pasta src/)
        │
        └──────────────►  Supabase (PostgreSQL + login + RLS)
```

## Segurança e privacidade
- **A resposta certa nunca vai para o celular**: o aluno envia a letra e o banco corrige e devolve só certo/errado.
- **RLS (segurança por linha)**: cada professora só vê as próprias sessões, alunos e respostas. Quem garante é o próprio banco.
- O aluno **não acessa tabelas**: só chama 3 funções do banco (entrar, buscar questões e responder).
- Cada questão só pode ser respondida **uma vez** por aluno.
- Do aluno guardamos **só o apelido e as respostas**. Sem anúncios e sem rastreadores.
- A chave no `config.js` é a **pública** (publishable). A chave secreta nunca é usada no site.

## Banco de dados
Tabelas: `professor` → `sessao` → `participante` → `resposta`, e `habilidade` → `questao`.
Relatórios por duas views: `v_acertos_por_aluno` e `v_acertos_por_assunto`.
Diagrama (DER) e modelo lógico: [`docs/banco-de-dados.md`](docs/banco-de-dados.md).

## Onde está cada coisa
| Arquivo | O que faz |
|---|---|
| `src/index.html` | Tela inicial: "Sou professora" ou "Sou aluno" |
| `src/js/login.js` | Login da professora |
| `src/js/painel.js` | Criar sessão, mostrar código/link, encerrar e reabrir |
| `src/js/entrar.js` | Aluno entra com código e apelido |
| `src/js/quiz.js` | O jogo: questões, acerto/erro e resultado |
| `src/js/relatorio.js` | Acertos por aluno e por assunto, com "Reforçar" |
| `src/js/app.js` | Código comum: conexão com o Supabase e funções de apoio |
| `src/js/config.js` | Endereço do Supabase e chave pública |
| `src/diagnostico.html` | Confere se o site está ligado ao banco |
| `supabase/schema.sql` | Tabelas, regras de segurança, funções e views |
| `supabase/seed.sql` | 12 questões de Língua Portuguesa (5º ano) |
| `supabase/professora.sql` | Liga a conta de login à tabela `professor` |
| `supabase/demo.sql` | Alunos fictícios para demonstração |

O código está comentado em português, explicando cada parte.

## Documentação
- [Explicação do código](docs/explicacao-do-codigo.md): como tudo funciona e perguntas frequentes.
- [Requisitos e casos de uso](docs/requisitos.md)
- [Banco de dados: DER e modelo lógico](docs/banco-de-dados.md)
- [Roteiro da apresentação](docs/roteiro-demonstracao.md)
- [Como configurar o Supabase](docs/configurar-supabase.md)

## Como rodar no computador
```bash
cd src
python3 -m http.server 8000
```
Abra http://localhost:8000. Para criar o banco do zero, siga [`docs/configurar-supabase.md`](docs/configurar-supabase.md).

## Próximos passos
- Outros tipos de jogo além do quiz.
- Cadastro de questões pela tela.
- Mais disciplinas e séries.
- QR Code para os alunos entrarem sem digitar o código.

## Uso de IA
O desenvolvimento usou o Claude Code como ferramenta de apoio, em tarefas pequenas, revisadas, testadas e comentadas.
