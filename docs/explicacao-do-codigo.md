# Explicação do código (para a apresentação)

Guia para cada pessoa da equipe conseguir explicar e defender o projeto. Leia junto com o código aberto.

## 1. A ideia em uma frase
Um site onde a **professora cria uma sessão de quiz**, os **alunos entram pelo celular com um código** e a professora vê **quem precisa de reforço em quê**.

## 2. Como as peças se conectam
```
 Celular / computador                 Netlify                        Supabase
 ┌────────────────────┐   baixa    ┌──────────────┐   pede dados   ┌──────────────────────┐
 │ Navegador           │ ◄──────── │ pasta src/   │                │ PostgreSQL (banco)    │
 │ HTML + CSS + JS     │ ─────────────────────────────────────────► │ Auth (login)          │
 └────────────────────┘            └──────────────┘                │ RLS (regras de acesso)│
                                                                    └──────────────────────┘
```
- **Netlify** só entrega os arquivos da pasta `src/` (as telas). Não guarda dados.
- **Supabase** é o back-end: banco PostgreSQL, login da professora e as regras de segurança.
- O arquivo **`src/js/config.js`** liga as duas partes (endereço do projeto + chave pública).
- Não existe um servidor nosso: o JavaScript do navegador conversa direto com o Supabase, e **quem protege os dados é o próprio banco** (RLS e funções).

## 3. As telas (pasta `src/`)
| Tela | Arquivo HTML | Arquivo JS | O que faz |
|---|---|---|---|
| Início | `index.html` | — | Escolhe "Sou professora" ou "Sou aluno" |
| Login | `login.html` | `js/login.js` | E-mail e senha da professora (`sb.auth.signInWithPassword`) |
| Painel | `painel.html` | `js/painel.js` | Cria sessão, mostra código/link, lista e encerra sessões |
| Entrar | `entrar.html` | `js/entrar.js` | Aluno digita código e apelido |
| Quiz | `quiz.html` | `js/quiz.js` | 8 questões, mostra acerto/erro e resultado |
| Relatório | `relatorio.html` | `js/relatorio.js` | Acertos por assunto e por aluno, marca "Reforçar" |
| Diagnóstico | `diagnostico.html` | `js/diagnostico.js` | Confere se o site está ligado ao banco |
| Privacidade / 404 | `privacidade.html`, `404.html` | — | Páginas informativas |

Todas usam `css/style.css` (um só arquivo de estilo, pensado primeiro para celular) e `js/app.js` (código comum).

## 4. Código comum: `src/js/app.js`
- `const sb = supabase.createClient(URL, CHAVE)` → cria a conexão com o Supabase, usada por todas as telas.
- `$("id")` → atalho para `document.getElementById`.
- `exigirLogin()` → as telas da professora chamam no começo; sem login, volta para `login.html`.
- `participanteAtual()` → o aluno não tem conta; os dados dele ficam só na aba do navegador (`sessionStorage`).

## 5. Fluxo da professora
**Criar sessão** (`painel.js`, função `criarSessao`):
```js
sb.from("sessao").insert({ professor_id, habilidade_id, disciplina, serie })
  .select("id, codigo").single();
```
- O **código de 6 letras é gerado pelo banco** (função `gerar_codigo()` no `schema.sql`), não pelo navegador.
- O link mostrado é `entrar.html?codigo=XXXXXX`; o aluno que abre o link já encontra o código preenchido.
- **Encerrar/Reabrir** só muda a coluna `ativa` da sessão (`update({ ativa: false })`).

**Relatório** (`relatorio.js`):
```js
sb.from("v_acertos_por_aluno").select("*").eq("sessao_id", id)
sb.from("v_acertos_por_assunto").select("*").eq("sessao_id", id)
```
- As contas (acertos, percentual) são feitas **no banco**, por duas *views*.
- O JavaScript só desenha a tabela e marca **"Reforçar" quando o percentual é menor que 60** (`LIMITE_REFORCO = 60`).
- Os nomes dos alunos são escritos com `textContent`, nunca como HTML: um aluno que digitar código no nome não consegue "invadir" a página (proteção contra XSS).

## 6. Fluxo do aluno
O aluno **não acessa nenhuma tabela**. Ele só chama 3 funções do banco (`sb.rpc(...)`):

| Função (no `schema.sql`) | Chamada em | O que faz |
|---|---|---|
| `entrar_na_sessao(codigo, nome)` | `entrar.js` | Confere se o código existe e se a sessão está aberta; cria o participante |
| `buscar_questoes(participante)` | `quiz.js` | Sorteia até 8 questões **sem a alternativa correta** |
| `responder(participante, questao, letra)` | `quiz.js` | **Corrige no servidor**, grava a resposta e devolve só certo/errado |

Por que assim? Se a resposta certa fosse para o celular, um aluno esperto poderia vê-la pelo navegador (F12). Aqui ela nunca sai do banco.

## 7. Banco de dados (`supabase/`)
| Arquivo | Para que serve |
|---|---|
| `schema.sql` | Cria tabelas, regras de segurança, funções e views. Pode rodar de novo sem erro. |
| `seed.sql` | 3 habilidades e 12 questões de Português (5º ano). Não duplica se rodar de novo. |
| `professora.sql` | Liga a conta de login à tabela `professor`. |
| `demo.sql` | Cria 8 alunos fictícios para a demonstração. |

**Tabelas:** `professor` → `sessao` → `participante` → `resposta`, e `habilidade` → `questao`. O diagrama está em `docs/banco-de-dados.md`.

**Segurança (RLS – Row Level Security):** o PostgreSQL filtra as linhas automaticamente. Exemplo do `schema.sql`:
```sql
create policy "professor gerencia suas sessoes" on sessao
  for all to authenticated
  using (professor_id = auth.uid());
```
Tradução: "uma professora logada só vê e altera as sessões em que `professor_id` é ela mesma". Mesmo que alguém mude o JavaScript, o banco recusa.

**Funções `security definer`:** as 3 funções do aluno rodam com permissão do dono do banco, mas só fazem exatamente o que está escrito nelas. É assim que o aluno sem conta consegue jogar sem enxergar as tabelas.

**Views com `security_invoker`:** o relatório respeita o RLS de quem consulta, então a professora só vê os próprios alunos.

## 8. Perguntas prováveis e respostas curtas
- **Por que não usaram MySQL?** O Supabase é PostgreSQL, também relacional e com SQL padrão, e já traz login, API e regras de segurança, então não precisamos criar e manter um servidor.
- **A chave no `config.js` não é um risco?** Não. É a chave pública (publishable/anon), feita para ficar no site. A segurança vem do RLS. A chave secreta (`service_role`) nunca foi usada no código.
- **O aluno pode responder duas vezes a mesma questão?** Não. A tabela `resposta` tem `unique (participante_id, questao_id)`, então só a primeira resposta vale.
- **O aluno pode ver a resposta certa?** Não. `buscar_questoes` não devolve a coluna `correta`, e a correção acontece no servidor.
- **Uma professora vê os alunos da outra?** Não. Testamos com duas contas: o RLS devolve zero linhas.
- **Que dados do aluno vocês guardam?** Só o apelido e as respostas. Sem e-mail, senha ou telefone (ver `privacidade.html`).
- **Como o site é publicado?** Cada alteração aprovada na branch `main` do GitHub é publicada sozinha pelo Netlify.
- **Usaram IA?** Sim, como ferramenta de apoio (Claude Code), em tarefas pequenas e revisadas pela equipe, como previsto no `CONTEXT.md`. Cada parte foi lida e testada pela equipe e está explicada neste guia.

## 9. Sugestão de divisão na apresentação
- **Pessoa 1 – telas e painel:** seções 2, 3 e 5 (criar sessão, código, link, encerrar).
- **Pessoa 2 – banco, segurança e publicação:** seção 7 e as perguntas sobre chave, RLS e Netlify.
- **Pessoa 3 – questões e relatório:** seção 6 (fluxo do aluno) e o relatório com "Reforçar".
