# Gerador do seed.sql

As questões padrão ficam em `questoes.py` (fáceis de ler e editar). O `seed.sql` é gerado a partir delas,
para evitar erros de aspas e de formato no SQL.

Para adicionar ou corrigir questões:
1. Edite `questoes.py`. Cada questão é: (enunciado, [A, B, C, D], índice da certa (0 a 3), explicação).
2. Gere de novo o seed (na raiz do projeto):
   ```bash
   python3 supabase/gerador/gerar_seed.py supabase/gerador supabase/seed.sql
   ```
3. Rode o `seed.sql` no SQL Editor do Supabase. Ele só insere o que ainda não existe.

Atenção: mudar o enunciado ou a alternativa A de uma questão que já está no banco cria uma questão nova
(a antiga continua lá, porque pode já ter respostas no relatório).
