# Reforço em Jogo

Plataforma web de jogos educativos para reforço escolar, feita como projeto integrado (Extensão/PIES I e CTS, UX, Front End e Banco de Dados). A professora cria uma sessão, o aluno entra pelo celular com um código e joga um quiz curto, e a professora vê o relatório por aluno e por assunto.

**Prazo do MVP: terça, 3 de novembro de 2026.** Veja `CONTEXT.md` (decisões e escopo) e `TAREFAS.md` (quem faz o quê).

## O que já vem pronto
- Banco completo (`supabase/schema.sql`) com regras de segurança, funções do aluno e views de relatório.
- 12 questões de Português do 5º ano (`supabase/seed.sql`), para a professora revisar.
- Funcionando: login da professora, painel (criar sessão, ver código/link, listar, encerrar e reabrir), entrada do aluno por código, quiz e relatório (por aluno e por assunto, com marcação "Reforçar").
- `supabase/demo.sql`: alunos fictícios para a demonstração. `supabase/atualizacao-01.sql`: só para quem rodou o `schema.sql` antigo.
- `docs/`: requisitos e casos de uso, DER e modelo lógico, roteiro da demonstração.

## Passo a passo (uma pessoa faz, os outros acompanham)

### 1. GitHub
1. Em github.com, clique em **New repository**, nome `reforco-em-jogo`, **Private**, sem README.
2. Na pasta do projeto:
   ```bash
   git init
   git add .
   git commit -m "Base do projeto"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/reforco-em-jogo.git
   git push -u origin main
   ```
3. Em **Settings > Collaborators**, convide os outros dois.
4. Cada pessoa trabalha em uma branch (`git checkout -b nome-tarefa`) e abre um Pull Request. Combinem quem revisa.

### 2. Supabase
1. Em supabase.com, crie um projeto (região **South America (São Paulo)**) e anote a senha do banco.
2. **SQL Editor**: cole `supabase/schema.sql`, rode. Depois cole `supabase/seed.sql`, rode.
3. **Authentication > Users > Add user**: crie a conta da professora (e-mail e senha, marque *Auto Confirm User*).
4. No SQL Editor, ligue a conta à tabela `professor` (troque o e-mail e o nome):
   ```sql
   insert into professor (id, nome, escola)
   select id, 'Nome da professora', 'Nome da escola' from auth.users where email = 'professora@exemplo.com';
   ```
5. **Settings > API**: copie a **Project URL** e a chave **anon/publishable** para `src/js/config.js`. Nunca use a chave `service_role` no site.

### 3. Rodar no computador
```bash
cd src
python3 -m http.server 8000
```
Abra http://localhost:8000. (Ou use a extensão Live Server do VS Code na pasta `src`.)

### 4. Testar o fluxo completo
1. Entre como professora (`login.html`) e crie uma sessão no painel.
2. Em outro aparelho (ou aba anônima), abra o link da sessão, digite um nome e jogue.
3. Volte ao painel, abra o **Relatório** e clique em **Atualizar**.
4. Para ter uma turma de exemplo, rode `supabase/demo.sql` no SQL Editor (usa a sessão mais recente).

### 5. Publicar online
No Netlify: **Add new site > Import from GitHub**, escolha o repositório. O `netlify.toml` já aponta a pasta `src`. Cada `git push` na `main` publica de novo.

## Observações
- Não testamos contra o seu projeto Supabase: se algo falhar na primeira execução do SQL, leia a mensagem de erro e ajuste.
- A biblioteca do Supabase vem de uma CDN (versão fixa no HTML). Se der problema de carregamento, instale pelo npm.
- Antes de usar com alunos de verdade: autorização da escola e dos responsáveis.
