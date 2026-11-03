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
4. Confira em **Table Editor**: a tabela `questao` deve ter 12 linhas.

## 3. Criar a conta da professora
1. **Authentication > Users > Add user > Create new user**.
2. Digite e-mail e senha e **marque "Auto Confirm User"**.
3. SQL Editor > nova query > cole `supabase/professora.sql`, troque o e-mail, o nome e a escola nas 3 linhas do topo e clique em **Run**. Embaixo deve aparecer uma linha com o nome dela.

## 4. Ligar o site ao banco
1. **Project Settings > API Keys** (ou **Settings > API** em projetos antigos).
2. Copie a **Project URL** (`https://xxxx.supabase.co`, às vezes fica em **Settings > Data API**).
3. Copie a chave **anon** (aba "Legacy API keys") ou a **publishable** (`sb_publishable_...`).
4. Cole as duas em `src/js/config.js`. **Nunca use a `service_role` / `sb_secret_...`.**
5. Faça commit e push. O Netlify publica de novo sozinho.

## 5. Conferir
Abra `diagnostico.html` no site. Cada item mostra ✔ ou ✖ e o que fazer. Faça login e abra o diagnóstico de novo para testar a parte da professora.

## Problemas comuns
| O que aparece | Causa | Solução |
|---|---|---|
| `relation "..." already exists` | Versão antiga do schema | Use o `schema.sql` atual: ele pode ser rodado de novo. |
| `relation "habilidade" does not exist` ao rodar o seed | Schema não foi rodado (ou deu erro no meio) | Rode `schema.sql` inteiro primeiro e confira o "Success". |
| Login: "E-mail ou senha incorretos" | Senha errada ou e-mail diferente | Em Authentication > Users, use "Send password recovery" ou apague e crie de novo. |
| Login: "Conta não confirmada" | Faltou "Auto Confirm User" | No usuário, clique em "Confirm user" (ou recrie marcando a opção). |
| Painel: "Sua conta ainda não está cadastrada como professora" | Faltou o passo 3.3 | Rode `professora.sql` com o mesmo e-mail do login. |
| `Invalid API key` / nada carrega | URL e chave de projetos diferentes, ou chave cortada | Copie as duas de novo, do mesmo projeto, sem espaços. |
| `permission denied for table ...` | Permissões da API | Rode `schema.sql` de novo (ele libera o acesso no fim). |
| Aluno: "Não há questões nesta sessão" | Seed não rodou | Rode `seed.sql`. |
| Tudo parou de funcionar depois de dias | Projeto grátis pausado por inatividade | No painel do Supabase, clique em **Restore project**. Abra o painel na véspera da apresentação. |
| `Failed to fetch` | Sem internet ou URL errada | Confira a URL (termina em `.supabase.co`) e a conexão. |

Se aparecer outro erro, copie a mensagem inteira e peça ajuda (pode colar no Claude Code).
