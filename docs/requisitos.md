# Requisitos e casos de uso (rascunho para a equipe revisar)

## Requisitos funcionais (RF)
- **RF01** A professora entra com e-mail e senha.
- **RF02** A professora cria uma sessão escolhendo uma habilidade (ou todas) e recebe um código de 6 caracteres e um link.
- **RF03** A professora vê a lista das suas sessões, com situação (aberta/encerrada) e número de alunos.
- **RF04** A professora encerra ou reabre uma sessão.
- **RF05** O aluno entra na sessão com o código e o primeiro nome ou apelido, sem criar conta.
- **RF06** O aluno responde um quiz de até 8 questões da habilidade da sessão e vê na hora se acertou.
- **RF07** O aluno vê o resultado final (acertos de um total).
- **RF08** A professora vê o relatório da sessão: acertos por aluno e por assunto.
- **RF09** O relatório marca "Reforçar" quando o percentual de acerto é menor que 60%.

## Requisitos não funcionais (RNF)
- **RNF01** Funciona no navegador do celular, sem instalar nada (layout pensado primeiro para telas pequenas).
- **RNF02** Linguagem simples e botões grandes, adequados a alunos de 4º e 5º ano.
- **RNF03** A alternativa correta nunca é enviada ao aparelho do aluno; a correção é feita no servidor.
- **RNF04** RLS ligado em todas as tabelas: cada professora só vê os próprios dados.
- **RNF05** Dados mínimos do aluno (só primeiro nome ou apelido); sem anúncios e sem rastreadores.
- **RNF06** Nenhuma chave secreta (`service_role`) no código ou no repositório.
- **RNF07** Front-end em HTML, CSS e JavaScript puros, publicado no Netlify; back-end no Supabase.

## Regras de negócio (RN)
- **RN01** O código da sessão é único e gerado pelo banco.
- **RN02** Aluno não entra em sessão encerrada.
- **RN03** Cada aluno responde cada questão uma única vez (a primeira resposta vale).
- **RN04** O nome do aluno tem de 1 a 30 caracteres.
- **RN05** Limite de "reforçar": abaixo de 60% de acerto.
- **RN06** As questões são revisadas pela professora antes do uso com alunos.

## Casos de uso
| Caso de uso | Ator | Fluxo principal | Exceções |
|---|---|---|---|
| UC01 Entrar no sistema | Professora | Informa e-mail e senha → vai ao painel | Dados incorretos: mensagem "E-mail ou senha incorretos." |
| UC02 Criar sessão | Professora | Escolhe habilidade → clica em "Gerar link" → vê código e link | Falha de conexão: mensagem de erro |
| UC03 Encerrar/reabrir sessão | Professora | Em "Minhas sessões", clica em Encerrar ou Reabrir | — |
| UC04 Ver relatório | Professora | Clica em "Relatório" → vê tabelas por assunto e por aluno | Sem respostas ainda: aviso |
| UC05 Entrar na sessão | Aluno | Abre o link ou digita o código, escreve o nome → vai ao quiz | Código inválido; sessão encerrada; campos vazios |
| UC06 Jogar o quiz | Aluno | Lê a questão, escolhe a alternativa, vê se acertou, avança até o fim | Sessão encerrada durante o jogo; falha ao enviar (pode tentar de novo) |
