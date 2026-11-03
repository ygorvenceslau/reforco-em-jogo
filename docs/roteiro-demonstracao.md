# Roteiro da demonstração (cerca de 10 minutos)

## Antes (na segunda, ensaio completo)
- [ ] Site publicado no Netlify e abrindo no celular.
- [ ] Conta da professora funcionando.
- [ ] Dois celulares com internet para os "alunos" (ou um celular e uma aba anônima).
- [ ] Uma sessão de reserva já com dados (`supabase/demo.sql`), caso a internet falhe.
- [ ] Plano B: prints/gravação de tela do fluxo inteiro.

## Roteiro
1. **Problema (1 min):** com o ensino integral não há contraturno; o aluno sai da sala para o reforço e perde conteúdo.
2. **Solução (1 min):** sessões curtas de jogo, dentro da aula, por habilidade, com relatório para a professora.
3. **Professora cria a sessão (2 min):** login → painel → escolhe "Ortografia" → mostra o código grande no projetor.
4. **Alunos jogam (3 min):** dois colegas entram pelo celular com o código e um apelido e jogam. Mostrar o acerto/erro na hora e o resultado final.
5. **Relatório (2 min):** clicar em "Atualizar" e mostrar acertos por aluno e por assunto, e a marcação "Reforçar" (abaixo de 60%). Abrir a sessão de demonstração para mostrar uma turma maior.
6. **Encerrar a sessão:** mostrar que um aluno novo não consegue mais entrar.
7. **Bastidores (1 min):** Supabase com RLS (cada professora vê só os seus dados), resposta correta nunca vai para o celular, dados mínimos do aluno.
8. **Próximos passos:** outros jogos, cadastro de questões pela tela, mais disciplinas e séries.

## Quem fala o quê
- Pessoa 1: telas e criação de sessão (passos 3 e 6).
- Pessoa 2: banco, segurança e publicação (passo 7).
- Pessoa 3: questões e relatório (passos 4 e 5).
