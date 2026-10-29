# Tarefas e divisão (prazo: terça, 03/11)

Marque `[x]` ao concluir. Ponto de decisão: **sábado à noite**. Se o Nível 2 não estiver pronto, entreguem o Nível 1 funcionando, o protótipo e a lista do que ficou para a próxima etapa.

## Quarta, 28 (hoje à noite) — todos
- [ ] Criar o repositório no GitHub e convidar os três.
- [ ] Criar o projeto no Supabase, rodar `schema.sql` e `seed.sql`.
- [ ] Criar a conta da professora e a linha em `professor`.
- [ ] Preencher `src/js/config.js` e rodar o site no computador.
- [ ] Testar o Nível 1 (sessão por SQL, entrar e jogar).

## Pessoa 1 — telas e criar sessão
- [ ] Quinta: tela `painel` (criar sessão com habilidade, mostrar código e link). Ver `js/painel.js`.
- [ ] Sexta: listar "minhas sessões" e link para o relatório.
- [ ] Sábado: ajustar o visual das telas com base no protótipo (cores, botões, responsivo).
- [ ] Domingo: teste em dois celulares diferentes.

## Pessoa 2 — banco, login e publicação
- [ ] Quinta: conferir o RLS (a professora A não vê dados da professora B) e criar mais uma conta de teste.
- [ ] Sexta: publicar no Netlify e conferir que o login funciona online.
- [ ] Sábado: tratar erros comuns (código inválido, sessão encerrada) e conferir mensagens.
- [ ] Domingo: revisar segurança (nenhuma chave secreta no repositório).

## Pessoa 3 — questões e relatório
- [ ] Quinta: revisar as 12 questões com a professora e ajustar `seed.sql` (se mudar, atualizar o banco).
- [ ] Sexta: tela `relatorio` com acertos por aluno. Ver `js/relatorio.js`.
- [ ] Sábado: acertos por assunto e marcação "reforçar" (abaixo de 60%).
- [ ] Domingo: preparar dados de demonstração (alunos fictícios jogando).

## Todos — documentação (em paralelo, um pouco por dia)
- [ ] Requisitos (RF/RNF/regras) e casos de uso.
- [ ] DER e modelo lógico (para BD).
- [ ] Wireframes e mockups (para UX).
- [ ] Roteiro da demonstração de terça (um ensaio completo na segunda).

## Se atrasar, cortar nesta ordem
1. Acerto por assunto no relatório (fica só por aluno).
2. Listagem de sessões anteriores.
3. Login (usar uma conta fixa da professora).
Não cortar: criar sessão, entrar com código e jogar.
