# Configurar o Supabase (passo a passo, com solução de problemas)

Tempo: uns 15 minutos. Faça na ordem. Todos os arquivos `.sql` **podem ser rodados de novo** sem estragar nada.

## 1. Criar o projeto
1. Entre em supabase.com > **New project**.
2. Nome: `reforco-em-jogo`. Região: **South America (São Paulo)**. Crie uma senha do banco e guarde.
3. Espere o projeto terminar de criar (1 a 2 minutos).

## 2. Instalar o banco
1. Menu da esquerda > **SQL Editor** > **New query**.
2. Abra `supabase/schema.sql` no GitHub, copie **tudo**, cole e clique em **Run**. Deve aparecer "Success".
3. Nova query: cole `supabase/seed.sql` inteiro e clique em **Run**.
4. Confira em **Table Editor**: a tabela `questao` deve ter 187 linhas (as questões padrão).

**Atualizações:** sempre que o `schema.sql` ou o `seed.sql` mudarem no GitHub, rode os dois de novo, nessa ordem. Eles não apagam nada e não duplicam questões.

## 3. Contas de Mestre
As contas são criadas pela própria tela de cadastro do site (`/mestre/cadastro`). O `schema.sql` tem um gatilho que registra cada conta nova na tabela `professor` automaticamente.

**Confirmação de e-mail:** por padrão o Supabase pede que a pessoa confirme o e-mail antes de entrar, e o envio de e-mails do plano grátis tem um limite baixo por hora. Para testes e demonstrações, desligue em **Authentication > Sign In / Providers > Email > Confirm email**. Antes de abrir para o público, o ideal é ligar de novo e configurar um serviço de e-mail próprio.

## 4. Ligar o site ao banco
1. **Project Settings > API Keys** (ou **Settings > API** em projetos antigos).
2. Copie a **Project URL** (`https://xxxx.supabase.co`, às vezes fica em **Settings > Data API**).
3. Copie a chave **anon** (aba "Legacy API keys") ou a **publishable** (`sb_publishable_...`).
4. Cole as duas em `src/config.js`. **Nunca use a `service_role` / `sb_secret_...`.**
5. Faça commit e push. O Netlify publica de novo sozinho.

## 5. Conferir
Abra `/diagnostico` no site. Cada item mostra ✔ ou ✖ e o que fazer. Faça login e abra o diagnóstico de novo para testar a parte da professora.

## Problemas comuns
| O que aparece | Causa | Solução |
|---|---|---|
| `relation "..." already exists` | Versão antiga do schema | Use o `schema.sql` atual: ele pode ser rodado de novo. |
| `relation "habilidade" does not exist` ao rodar o seed | Schema não foi rodado (ou deu erro no meio) | Rode `schema.sql` inteiro primeiro e confira o "Success". |
| Login: "E-mail ou senha incorretos" | Senha errada ou e-mail diferente | Em Authentication > Users, use "Send password recovery" ou apague e crie de novo. |
| Login: "Confirme seu e-mail" | Confirmação de e-mail ligada | Clique no link do e-mail, ou desligue a confirmação (passo 3). |
| Diagnóstico: "Conta de Mestre registrada" com ✖ | O gatilho de cadastro não foi instalado | Rode `schema.sql` de novo: ele instala o gatilho e registra as contas que já existem. |
| `Invalid API key` / nada carrega | URL e chave de projetos diferentes, ou chave cortada | Copie as duas de novo, do mesmo projeto, sem espaços. |
| `permission denied for table ...` | Permissões da API | Rode `schema.sql` de novo (ele libera o acesso no fim). |
| Aluno: "Não há questões nesta sessão" | Seed não rodou | Rode `seed.sql`. |
| Tudo parou de funcionar depois de dias | Projeto grátis pausado por inatividade | No painel do Supabase, clique em **Restore project**. Abra o painel na véspera da apresentação. |
| `Failed to fetch` | Sem internet ou URL errada | Confira a URL (termina em `.supabase.co`) e a conexão. |

Se aparecer outro erro, copie a mensagem inteira e peça ajuda (pode colar no Claude Code).
