# Contexto do projeto (leia antes de mexer no código)

## O que é
Site de jogos educativos para **reforço escolar dentro da aula**. Problema levantado no diagnóstico com professores: com o ensino integral não há contraturno, então os alunos saem da sala para o reforço e perdem conteúdo. A solução são sessões curtas de jogo, por habilidade, com relatório para a professora.

## Fluxo do MVP
1. A professora faz login e cria uma sessão (escolhe a habilidade) e recebe um código.
2. O aluno entra pelo celular com o código e o primeiro nome ou apelido (sem conta).
3. O aluno joga um quiz de 8 questões.
4. A professora vê o relatório: acertos por aluno e por assunto.

## Escopo
- **Nível 1 (mínimo):** aluno entra por código, joga e as respostas ficam gravadas (sessão pode ser criada por SQL).
- **Nível 2 (MVP):** a professora cria a sessão pela tela, com login, e vê o relatório.
- **Nível 3 (extra):** acabamento, resultado bonito, medalhas.
- **Fora do MVP:** outros jogos, cadastro de questões pela tela, tempo limite, cadastro de professoras pela tela, ranking entre alunos, WhatsApp.

## Decisões
- Front: HTML, CSS e JavaScript puros (pasta `src`). Back: Supabase (PostgreSQL, Auth e funções).
- Professora: login por e-mail e senha; contas criadas à mão no painel do Supabase.
- Aluno: sem conta. Entra por `entrar_na_sessao`, e só usa as funções `buscar_questoes` e `responder`. O aluno não acessa tabelas direto e nunca recebe a alternativa correta; a conferência é no servidor.
- Segurança: RLS ligado em todas as tabelas. A professora só vê as próprias sessões, alunos e respostas.
- Dados mínimos do aluno: só primeiro nome ou apelido. Sem rastreadores nem anúncios.
- Público-alvo inicial: Língua Portuguesa, 5º ano (4º e 5º ano), com uso no celular do aluno.

## Regras de conteúdo
- Questões pedagógicas, sem violência, revisadas pela professora.
- Linguagem simples, botões grandes, layout pensado primeiro para celular.

## Banco (resumo)
`professor`, `habilidade`, `questao`, `sessao`, `participante`, `resposta` + views `v_acertos_por_aluno` e `v_acertos_por_assunto`. Detalhes em `supabase/schema.sql`.

## Convenções
- Nomes de tabelas, colunas e funções em português, sem acento, em minúsculas.
- Textos da interface em português, com frases curtas.
- Um commit por tarefa que funcione; uma branch por pessoa.
- Para quem usa IA no código (ex.: Claude Code): tarefas pequenas, leia cada alteração antes de aceitar, e explique o código para a equipe. Cada pessoa precisa conseguir defender sua parte para os professores.
- Não commitar a chave `service_role` nem senhas.

## Estado atual
Pronto: banco, seed, login, entrada do aluno, quiz.
Falta: `painel` (criar sessão), `relatorio`, acabamento visual, publicação online e teste em celulares reais.
