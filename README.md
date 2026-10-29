# Reforço em Jogo

Plataforma web de jogos educativos para reforço escolar, feita como projeto integrado (Extensão/PIES I e CTS, UX, Front End e Banco de Dados). A professora cria uma sessão, o aluno entra pelo celular com um código e joga um quiz curto, e a professora vê o relatório por aluno e por assunto.

**Prazo do MVP: terça, 3 de novembro de 2026.** Veja `CONTEXT.md` (decisões e escopo) e `TAREFAS.md` (quem faz o quê).

## O que já vem pronto
- Banco completo (`supabase/schema.sql`) com regras de segurança, funções do aluno e views de relatório.
- 12 questões de Português do 5º ano (`supabase/seed.sql`), para a professora revisar.
- Funcionando: login da professora, entrada do aluno por código e quiz completo.
- Para fazer: criar sessão (`painel`) e relatório (`relatorio`).

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

### 4. Testar o fluxo mínimo (Nível 1)
Crie uma sessão pelo SQL Editor (enquanto a tela do painel não existe):
```sql
insert into sessao (professor_id, habilidade_id, disciplina, serie)
select id, null, 'Língua Portuguesa', '5º ano' from professor limit 1
returning codigo;
```
Abra `entrar.html`, use o código retornado e jogue. Confira as linhas em `resposta` no Supabase.

### 5. Publicar online
No Netlify: **Add new site > Import from GitHub**, escolha o repositório. O `netlify.toml` já aponta a pasta `src`. Cada `git push` na `main` publica de novo.

## Observações
- Não testamos contra o seu projeto Supabase: se algo falhar na primeira execução do SQL, leia a mensagem de erro e ajuste.
- A biblioteca do Supabase vem de uma CDN (versão fixa no HTML). Se der problema de carregamento, instale pelo npm.
- Antes de usar com alunos de verdade: autorização da escola e dos responsáveis.
