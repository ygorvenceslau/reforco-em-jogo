# Roteiro da apresentação (cerca de 12 minutos)

## Na véspera (ensaio completo)
- [ ] Abrir o painel do Supabase (o plano grátis pausa projetos parados; se estiver pausado, clicar em **Restore**).
- [ ] Abrir https://reforcoemjogo.netlify.app/diagnostico, entrar como Mestre e ver **"Tudo certo!"**.
- [ ] Notebook (projetor) e celular com internet, site já aberto nos dois.
- [ ] Criar com antecedência uma sala de **Masmorra solo** e jogar uma vez, para o relatório ter dados.
- [ ] Plano B: a prancha de prints e um vídeo curto do fluxo, caso a internet falhe.

## Roteiro
1. **Problema (1 min):** com o ensino integral não há contraturno; o aluno sai da sala para o reforço e perde conteúdo.
2. **Solução (1 min):** *Quizzes & Masmorras*: o reforço vira uma aventura. O aluno derrota monstros respondendo questões, sozinho ou com a turma, e o professor (Mestre) vê quem precisa de ajuda e em quê.
3. **Tela inicial (30 s):** "Aprenda jogando", entrada do aprendiz e do Mestre na mesma página.
4. **Mestre cria a sala (2 min):** painel → marcar série, disciplina e assunto → mostrar a **prévia das questões** → modo **Turma contra o chefão** → **Abrir a lousa** (código e QR Code no projetor).
5. **Turma joga (3 min):** a plateia entra pelo QR Code. Clicar em **Começar a batalha**. Mostrar:
   - cada acerto tira vida do chefão, com o nome de quem acertou;
   - quem erra lê a explicação e **não é exposto** na lousa;
   - a turma vence junta.
6. **Masmorra solo no celular (2 min):** escolher a classe, mostrar um golpe (magia/flecha/corte), errar de propósito para mostrar a **explicação**, usar a **Poção de Visão** e o botão **🔈 Ouvir**.
7. **Sala ao vivo (1 min):** no celular do Mestre, abrir **📊 Ao vivo** da sala enquanto a turma joga. Mostrar o resumo (quem está respondendo agora), as **questões que mais confundiram** com a **alternativa errada mais marcada** e "Quem errou", e os acertos por aluno e por assunto ("Reforçar" abaixo de 60%). Explicar que essa tela não vai para o projetor, porque mostra quem errou.
8. **Versatilidade (1 min):** tela **Questões**: 237 questões prontas (Português, Matemática e Tecnologia e Computação) e criação de questões para qualquer série ou assunto, com explicação.
9. **Bastidores (30 s):** React no Netlify + Supabase (PostgreSQL). A resposta certa nunca vai para o celular antes da resposta; RLS garante que cada Mestre só vê os próprios dados; aluno entra só com apelido (LGPD).
10. **Próximos passos (30 s):** comunidade de questões com moderação, turmas fixas com histórico, outros modos de jogo.

## Perguntas prováveis
Veja a seção 9 de `docs/explicacao-do-codigo.md`.
