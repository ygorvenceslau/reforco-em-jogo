# Protótipo: Quizzes & Masmorras

Jogar: https://reforcoemjogo.netlify.app/masmorra (sem conta e sem código)
Modo turma (demonstração): https://reforcoemjogo.netlify.app/masmorra/turma

## A ideia

O reforço escolar vira uma aventura. Cada assunto é uma masmorra cheia de monstros, e a arma do aprendiz é o conhecimento: acertar uma questão é atacar, errar é levar um golpe e ver a explicação da resposta certa.

O objetivo continua o mesmo do projeto original: fazer o reforço dentro da aula, em sessões curtas, e mostrar ao Mestre (docente) quem precisa de ajuda e em qual assunto.

## Como funciona o protótipo

1. O aprendiz escolhe uma classe:
   - **Guerreiro(a):** mais vida;
   - **Mago(a):** começa com uma poção de visão a mais;
   - **Arqueiro(a):** faz golpes críticos com mais frequência.
2. Enfrenta 3 ondas: um monstrinho, um morcego e, no fim, o chefão (o Dragão da Gramática).
3. **Acerto:** ataca o monstro. Acertos seguidos viram golpe crítico, com dano em dobro.
4. **Erro:** perde um coração e lê uma explicação curta de por que a resposta certa é a certa.
5. **Poções:**
   - Cura: recupera 2 corações.
   - Visão: elimina 2 alternativas erradas, funcionando como uma dica.
   - Escudo: protege do próximo erro.
6. **Baú entre as ondas:** o aprendiz escolhe 1 de 3 recompensas (poções ou equipamentos, como uma espada que aumenta o dano).
7. **Se os corações acabam:** o aprendiz tenta a onda de novo. Ninguém é eliminado.
8. **No fim:** aparece uma medalha e o desempenho por assunto, com a marcação "Reforçar" abaixo de 60%, igual ao relatório do Mestre.

Uma partida dura de 5 a 12 minutos (entre 10 e 22 questões, conforme o desempenho), o que cabe numa aula.

## Modo turma

O Mestre projeta o chefão na lousa com uma vida grande. Cada aprendiz responde no próprio celular, e cada acerto tira vida do dragão. A turma vence junta.

A lousa mostra só os acertos ("Ana acertou!"), nunca os erros, para não expor quem tem dificuldade. No protótipo os colegas são simulados.

## Decisões pedagógicas

- **Recompensa ligada ao aprendizado:** o ataque é o acerto, a poção de visão é uma dica e o erro traz explicação.
- **Equipamentos ajudam, mas não substituem o acerto:** sem responder certo, ninguém vence.
- **Errar não elimina:** o aprendiz tenta de novo com os corações cheios.
- **Cooperação em vez de ranking** no modo turma.
- **Tema de fantasia em estilo cartoon, sem violência:** os monstros são "desencantados", não feridos.

## O que é simulado neste protótipo

- As 18 questões de Língua Portuguesa estão no próprio site. Na versão final elas vêm do banco: questões padrão e questões criadas pelo Mestre.
- A correção acontece no navegador. Na versão final ela é feita no servidor, e a resposta certa não chega ao celular antes da resposta do aprendiz.
- Os colegas do modo turma são simulados. Na versão final o modo turma funciona ao vivo com o Supabase Realtime.
- As respostas ainda não vão para o relatório do Mestre.

## Plano até 1º de dezembro

1. Questões no banco, para todos os anos do Ensino Fundamental, com explicação, e questões criadas pelo Mestre.
2. Masmorra solo ligada à sala do Mestre e ao relatório.
3. Modo turma ao vivo.
4. Testes com estudantes e ajustes.

## Perguntas para o professor

1. A ideia faz sentido para o problema do reforço dentro da aula?
2. As mecânicas (poções, baú, crítico) ajudam ou distraem do aprendizado?
3. O modo turma cooperativo é melhor que um modo competitivo?
4. O escopo até 1º de dezembro está adequado?
5. O que deveria mudar ou sair?
