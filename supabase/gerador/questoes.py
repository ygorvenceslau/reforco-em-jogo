# Banco padrão de questões: (disciplina, ano) -> {habilidade: [(enunciado, [A,B,C,D], índice_certo, explicação)]}
LP = "Língua Portuguesa"
MAT = "Matemática"

Q = {
(LP, "1º ano"): {
 "Letras e sons": [
  ("Qual palavra começa com a mesma letra de BOLA?", ["Casa", "Bala", "Pato", "Dado"], 1, "Bola e bala começam com a letra B."),
  ("Quantas letras tem a palavra GATO?", ["3", "4", "5", "6"], 1, "G-A-T-O: são 4 letras."),
  ("Qual é a primeira letra da palavra UVA?", ["A", "O", "U", "V"], 2, "Uva começa com a vogal U."),
  ("Qual palavra rima com JANELA?", ["Panela", "Janeiro", "Sapato", "Lápis"], 0, "Janela e panela terminam com -ELA: por isso rimam."),
  ("Quais destas letras são vogais?", ["B, C, D", "A, E, I", "M, N, P", "R, S, T"], 1, "As vogais são A, E, I, O e U."),
 ],
 "Sílabas": [
  ("Quantas sílabas tem a palavra CASA?", ["1", "2", "3", "4"], 1, "CA-SA: são 2 sílabas. Bata palmas a cada pedacinho!"),
  ("Quantas sílabas tem a palavra BORBOLETA?", ["2", "3", "4", "5"], 2, "BOR-BO-LE-TA: são 4 sílabas."),
  ("Junte as sílabas: MA + CA + CO", ["Macaco", "Maçaco", "Macoca", "Camaco"], 0, "MA + CA + CO forma MACACO."),
  ("Qual palavra tem só uma sílaba?", ["Mesa", "Pé", "Bola", "Dado"], 1, "Pé se fala de uma vez só: tem 1 sílaba."),
  ("Qual é a primeira sílaba de SAPATO?", ["PA", "TO", "SA", "SAP"], 2, "SA-PA-TO: a primeira sílaba é SA."),
 ],
},
(LP, "2º ano"): {
 "Ortografia": [
  ("Qual palavra está escrita corretamente?", ["casa", "kaza", "caza", "kasa"], 0, "Casa se escreve com C e S. O S entre vogais tem som de Z."),
  ("Qual palavra está escrita corretamente?", ["pasarinho", "passarinho", "pacarinho", "paçarinho"], 1, "Passarinho tem SS: entre vogais, o SS faz o som de S."),
  ("Qual palavra tem o som forte do R, como em RATO?", ["caro", "carro", "coro", "pera"], 1, "Entre vogais, o som forte do R se escreve com RR: carro."),
  ("Complete com M ou N: CA_PO", ["campo", "canpo", "caapo", "capo"], 0, "Antes de P e B usamos M: campo."),
  ("Qual palavra começa com letra maiúscula por ser nome de pessoa?", ["mesa", "Ana", "bola", "rua"], 1, "Nomes de pessoas começam com letra maiúscula: Ana."),
 ],
 "Leitura e compreensão": [
  ("\"O sapo pulou na lagoa.\" Onde o sapo pulou?", ["Na árvore", "Na lagoa", "Na casa", "No carro"], 1, "A frase diz: o sapo pulou na lagoa."),
  ("\"Lia comeu uma maçã vermelha.\" De que cor era a maçã?", ["Verde", "Amarela", "Vermelha", "Azul"], 2, "O texto diz que a maçã era vermelha."),
  ("\"Tom estava com frio e vestiu o casaco.\" Por que Tom vestiu o casaco?", ["Porque estava com frio", "Porque ia a uma festa", "Porque estava calor", "Porque ganhou o casaco"], 0, "O texto conta que Tom estava com frio: esse é o motivo."),
  ("Qual destas frases é o título de uma história?", ["Era uma vez...", "O Lobo e os Três Porquinhos", "Fim", "E viveram felizes"], 1, "O título é o nome da história e aparece antes do texto."),
  ("\"Bia regava as flores todos os dias.\" O que Bia fazia?", ["Plantava árvores", "Regava as flores", "Colhia frutas", "Dormia cedo"], 1, "O texto diz que Bia regava as flores."),
 ],
},
(LP, "3º ano"): {
 "Pontuação": [
  ("Qual sinal usamos no fim de uma pergunta?", ["Ponto final (.)", "Ponto de interrogação (?)", "Ponto de exclamação (!)", "Vírgula (,)"], 1, "Perguntas terminam com ponto de interrogação."),
  ("\"Que dia lindo___\" Qual sinal mostra emoção?", ["?", "!", ",", ":"], 1, "O ponto de exclamação mostra emoção, surpresa ou alegria."),
  ("Em um diálogo, que sinal indica a fala de um personagem?", ["Travessão (—)", "Vírgula", "Ponto final", "Parênteses"], 0, "O travessão marca o começo da fala de um personagem."),
  ("Qual pergunta está pontuada corretamente?", ["Você vem amanhã.", "Você vem amanhã?", "Você, vem amanhã", "Você vem? amanhã"], 1, "Uma pergunta termina com ponto de interrogação, no fim da frase."),
  ("Para que serve a vírgula em \"Comprei arroz, feijão e ovos\"?", ["Separar itens de uma lista", "Fazer uma pergunta", "Terminar a frase", "Mostrar emoção"], 0, "Na lista, a vírgula separa os itens: arroz, feijão e ovos."),
 ],
 "Gêneros textuais": [
  ("Qual texto ensina a preparar um bolo?", ["Receita", "Poema", "Bilhete", "Piada"], 0, "A receita traz ingredientes e modo de preparo."),
  ("Qual texto costuma ter versos e rimas?", ["Notícia", "Poema", "Receita", "Lista de compras"], 1, "O poema é escrito em versos e muitas vezes tem rimas."),
  ("Para avisar sua mãe que foi à casa da avó, o melhor texto é um:", ["Bilhete", "Conto", "Poema", "Dicionário"], 0, "O bilhete é um recado curto para alguém."),
  ("\"Era uma vez...\" é um começo típico de:", ["Notícia", "Conto de fadas", "Receita", "Convite"], 1, "Os contos de fadas costumam começar com \"Era uma vez\"."),
  ("Em um convite de aniversário, o que NÃO pode faltar?", ["A data, a hora e o local", "A receita do bolo", "Uma piada", "O preço dos presentes"], 0, "Um convite precisa dizer quando e onde a festa vai acontecer."),
 ],
},
(LP, "4º ano"): {
 "Sinônimos e antônimos": [
  ("Qual é o sinônimo de \"contente\"?", ["triste", "alegre", "bravo", "cansado"], 1, "Sinônimo tem sentido parecido: contente = alegre."),
  ("Qual é o antônimo de \"alto\"?", ["grande", "comprido", "baixo", "forte"], 2, "Antônimo tem sentido contrário: alto x baixo."),
  ("Qual é o antônimo de \"aberto\"?", ["fechado", "largo", "limpo", "novo"], 0, "O contrário de aberto é fechado."),
  ("Em \"A casa é enorme\", a palavra \"enorme\" pode ser trocada por:", ["pequena", "gigante", "velha", "bonita"], 1, "Enorme e gigante são sinônimos: querem dizer muito grande."),
  ("Qual par é de sinônimos?", ["rápido / lento", "bonito / feio", "começar / iniciar", "cheio / vazio"], 2, "Começar e iniciar têm o mesmo sentido. Os outros pares são antônimos."),
 ],
 "Ortografia e acentuação": [
  ("Qual palavra está escrita corretamente?", ["pássaro", "passaro", "páçaro", "pásaro"], 0, "Pássaro tem acento agudo no A e SS entre as vogais."),
  ("Qual palavra tem acento circunflexo (^)?", ["café", "você", "sofá", "pé"], 1, "Você tem o chapeuzinho no E. As outras têm acento agudo."),
  ("Complete: \"Ontem eu ___ ao parque.\"", ["fui", "fuí", "foi", "fuy"], 0, "Com \"eu\", usamos \"fui\". \"Foi\" é para ele ou ela."),
  ("Qual palavra está escrita corretamente?", ["enchergar", "enxergar", "emxergar", "encherguar"], 1, "Enxergar se escreve com X. Depois de EN, a maioria das palavras usa X."),
  ("Qual frase está correta?", ["Nós vai à escola.", "Nós vamos à escola.", "Nós vamo à escola.", "Nós foi à escola."], 1, "Com \"nós\", o verbo termina em -mos: nós vamos."),
 ],
},
(LP, "5º ano"): {
 "Interpretação de texto": [
  ("Ana levou o guarda-chuva porque o céu estava cheio de nuvens escuras. Por que Ana levou o guarda-chuva?", ["Porque o céu indicava que poderia chover", "Porque queria brincar", "Porque estava com frio", "Porque ganhou de presente"], 0, "O texto diz que o céu tinha nuvens escuras: sinal de que podia chover."),
  ("Pedro acordou tarde, correu para a escola e chegou depois do sinal. Qual é o assunto principal do texto?", ["Pedro chegou atrasado à escola", "Pedro gosta de correr", "Pedro perdeu o lanche", "A escola foi fechada"], 0, "Todas as ações do texto levam ao fato principal: Pedro chegou atrasado."),
  ("Em “Maria ficou radiante com a notícia”, a palavra “radiante” mostra que Maria ficou:", ["Muito triste", "Muito feliz", "Com sono", "Com medo"], 1, "Radiante quer dizer cheia de alegria, como se brilhasse de felicidade."),
  ("O cachorro de Lia fugiu pelo portão aberto. Lia saiu chamando por ele até encontrá-lo na praça. O que Lia fez depois que o cachorro fugiu?", ["Foi dormir", "Procurou o cachorro e o encontrou na praça", "Ganhou outro cachorro", "Fechou o portão e esperou"], 1, "O texto diz que Lia procurou o cachorro até encontrá-lo na praça."),
  ("\"Choveu tanto que a rua virou um rio.\" A frase quer dizer que:", ["Um rio passou pela rua", "A rua ficou muito alagada", "A rua foi fechada", "Parou de chover"], 1, "É um exagero: a rua ficou com tanta água que parecia um rio."),
 ],
 "Classes de palavras": [
  ("Em “Ela comprou frutas frescas”, qual palavra é o adjetivo?", ["Ela", "comprou", "frutas", "frescas"], 3, "Adjetivo dá uma característica ao substantivo: frescas diz como são as frutas."),
  ("Em “Os alunos leram o livro”, qual palavra é o verbo?", ["alunos", "leram", "livro", "Os"], 1, "Verbo indica ação: leram é o que os alunos fizeram."),
  ("Qual destas palavras é um substantivo?", ["rapidamente", "bonito", "cadeira", "correr"], 2, "Substantivo dá nome a seres e objetos: cadeira é o nome de um objeto."),
  ("Em “O gato preto dorme no sofá”, qual palavra indica uma característica do gato?", ["dorme", "sofá", "preto", "no"], 2, "Preto é um adjetivo: diz como é o gato."),
  ("Em \"Nós brincamos no parque\", a palavra \"Nós\" é um:", ["pronome", "verbo", "adjetivo", "advérbio"], 0, "Pronome substitui o nome das pessoas: \"nós\" é quem fala e mais alguém."),
  ("Qual é o plural de \"pão\"?", ["pãos", "pães", "pões", "pãoes"], 1, "Algumas palavras em -ão fazem o plural em -ães: pão, pães; cão, cães."),
 ],
 "Ortografia": [
  ("Qual palavra está escrita corretamente?", ["exceção", "esceção", "eceção", "exessão"], 0, "Exceção se escreve com X e C. É da mesma família de \"exceto\"."),
  ("Qual palavra completa corretamente a frase: “A ___ chegou cedo hoje.”?", ["profesora", "professora", "proffessora", "professsora"], 1, "Professora tem SS: pro-fes-so-ra."),
  ("Qual palavra está escrita corretamente?", ["caxorro", "cachorro", "cachoro", "cashorro"], 1, "Cachorro tem CH e RR: ca-chor-ro."),
  ("Qual palavra completa a frase: “Ele ___ o dever de casa ontem.”?", ["fêz", "fes", "fez", "fés"], 2, "Fez (do verbo fazer) termina com Z e não tem acento."),
  ("Qual palavra precisa de acento?", ["mesa", "lapis", "casa", "bola"], 1, "Lápis é paroxítona terminada em S, por isso leva acento: lá-pis."),
  ("Em qual frase a palavra entre aspas está certa?", ["Eu vou \"mas\" tarde.", "Ele quer \"mais\" bolo.", "Não sei \"porque\" ele saiu.", "Ela \"concerta\" o carro."], 1, "\"Mais\" indica quantidade. \"Mas\" indica oposição, como \"porém\"."),
 ],
},
(LP, "6º ano"): {
 "Concordância": [
  ("Qual frase está correta?", ["Os meninos chegou cedo.", "Os meninos chegaram cedo.", "O meninos chegaram cedo.", "Os menino chegaram cedo."], 1, "O verbo concorda com o sujeito: os meninos (plural) chegaram."),
  ("Complete: \"As flores ___ lindas.\"", ["está", "estão", "esteve", "estava"], 1, "As flores é plural, então o verbo também vai para o plural: estão."),
  ("Qual frase está correta?", ["Faltou dois alunos.", "Faltaram dois alunos.", "Faltou os alunos.", "Faltaram um aluno."], 1, "O sujeito \"dois alunos\" está no plural: faltaram."),
  ("Complete: \"Ela ficou ___ preocupada.\"", ["meia", "meio", "meios", "meias"], 1, "\"Meio\" no sentido de \"um pouco\" não muda: meio preocupada."),
  ("Qual frase está correta?", ["A gente fomos ao cinema.", "A gente foi ao cinema.", "A gente fui ao cinema.", "A gente vamos ao cinema."], 1, "\"A gente\" pede o verbo no singular, como \"ela\": a gente foi."),
 ],
 "Interpretação e inferência": [
  ("\"Paulo olhou o céu escuro e pegou o guarda-chuva.\" O que podemos concluir?", ["Paulo achou que ia chover", "Paulo estava com calor", "Paulo ia dormir", "Paulo perdeu algo"], 0, "O céu escuro é uma pista de chuva. Concluir a partir de pistas é fazer uma inferência."),
  ("Qual é a finalidade de um anúncio publicitário?", ["Convencer o leitor a comprar ou fazer algo", "Contar um conto de fadas", "Ensinar uma receita", "Informar a previsão do tempo"], 0, "O anúncio quer convencer: vender um produto ou uma ideia."),
  ("Em \"Ele tem um coração de ouro\", a expressão quer dizer que ele é:", ["rico", "muito bondoso", "doente", "forte"], 1, "É linguagem figurada: coração de ouro é uma pessoa muito boa."),
  ("Uma notícia de jornal deve responder principalmente:", ["O quê, quem, quando, onde, como e por quê", "Só a opinião do jornalista", "Uma rima", "Uma receita"], 0, "A notícia informa um fato respondendo a essas perguntas."),
  ("\"Ana estudou muito, mas não passou na prova.\" A palavra \"mas\" indica:", ["adição", "oposição", "tempo", "lugar"], 1, "\"Mas\" liga ideias contrárias: estudou, porém não passou."),
 ],
},
(LP, "7º ano"): {
 "Figuras de linguagem": [
  ("\"Seus olhos são como estrelas.\" Qual figura de linguagem é essa?", ["Comparação", "Hipérbole", "Onomatopeia", "Antítese"], 0, "O \"como\" liga duas coisas parecidas: é uma comparação."),
  ("\"Já te falei um milhão de vezes!\" é exemplo de:", ["Hipérbole (exagero)", "Metáfora", "Ironia", "Personificação"], 0, "Ninguém falou um milhão de vezes: é um exagero, a hipérbole."),
  ("\"O vento sussurrava na janela.\" Qual figura é essa?", ["Personificação", "Comparação", "Hipérbole", "Onomatopeia"], 0, "Dar ações humanas (sussurrar) a coisas é personificação."),
  ("Em \"Tic-tac, fazia o relógio\", \"tic-tac\" é uma:", ["Onomatopeia", "Metáfora", "Antítese", "Ironia"], 0, "Onomatopeia é a palavra que imita um som."),
  ("\"Ele é uma fera no futebol.\" Que figura é essa?", ["Metáfora", "Onomatopeia", "Comparação", "Pleonasmo"], 0, "Metáfora é uma comparação sem o \"como\": ele é muito bom, como uma fera."),
 ],
 "Verbos e tempos verbais": [
  ("Em \"Amanhã eu viajarei\", o verbo está no:", ["presente", "passado", "futuro", "imperativo"], 2, "Viajarei indica algo que ainda vai acontecer: futuro."),
  ("Qual verbo está no pretérito (passado)?", ["corro", "correrei", "corri", "correndo"], 2, "Corri indica uma ação que já aconteceu."),
  ("Em \"Feche a porta!\", o verbo está no modo:", ["imperativo", "subjuntivo", "indicativo", "infinitivo"], 0, "O imperativo expressa ordem, pedido ou conselho."),
  ("Qual é o infinitivo de \"cantávamos\"?", ["cantar", "cantando", "cantado", "canta"], 0, "O infinitivo é o nome do verbo, terminado em -ar, -er ou -ir: cantar."),
  ("Complete: \"Se eu ___ tempo, iria à festa.\"", ["tenho", "tivesse", "terei", "tive"], 1, "Uma hipótese com \"se\" pede o subjuntivo: se eu tivesse."),
 ],
},
(LP, "8º ano"): {
 "Sujeito e predicado": [
  ("Em \"Os alunos fizeram a tarefa\", qual é o sujeito?", ["Os alunos", "fizeram", "a tarefa", "fizeram a tarefa"], 0, "O sujeito é de quem se fala: quem fez a tarefa? Os alunos."),
  ("Em \"Choveu muito ontem\", o sujeito é:", ["inexistente (oração sem sujeito)", "muito", "ontem", "oculto: ele"], 0, "Verbos que indicam fenômenos da natureza não têm sujeito."),
  ("Em \"Chegamos cedo\", o sujeito é:", ["oculto (nós)", "inexistente", "cedo", "indeterminado"], 0, "A terminação -mos mostra que o sujeito é \"nós\", mesmo sem aparecer."),
  ("Em \"Maria e João dançaram\", o sujeito é:", ["simples", "composto", "oculto", "inexistente"], 1, "Tem dois núcleos (Maria e João): sujeito composto."),
  ("Em \"O cachorro latiu alto\", qual é o predicado?", ["O cachorro", "latiu alto", "cachorro", "O"], 1, "Predicado é o que se diz do sujeito: latiu alto."),
 ],
 "Argumentação": [
  ("Em um texto argumentativo, o autor procura:", ["defender uma opinião com argumentos", "contar uma história inventada", "ensinar uma receita", "fazer uma lista"], 0, "O texto argumentativo defende um ponto de vista com razões."),
  ("Qual frase é uma opinião, e não um fato?", ["O Brasil fica na América do Sul.", "A água ferve a 100 °C ao nível do mar.", "O futebol é o melhor esporte do mundo.", "Um ano tem 12 meses."], 2, "\"Melhor esporte\" depende do gosto de cada um: é opinião."),
  ("Em um texto, a palavra \"portanto\" indica:", ["conclusão", "oposição", "tempo", "dúvida"], 0, "\"Portanto\" introduz a conclusão do que foi dito antes."),
  ("Qual é o melhor argumento para \"Devemos economizar água\"?", ["A água potável é limitada e essencial à vida.", "Eu gosto de água.", "A água é transparente.", "Meu vizinho economiza."], 0, "Um bom argumento traz uma razão forte e verdadeira, não só gosto pessoal."),
  ("\"Embora estivesse cansado, terminou o trabalho.\" \"Embora\" indica:", ["concessão (ideia contrária)", "causa", "finalidade", "conclusão"], 0, "\"Embora\" apresenta um obstáculo que não impediu a ação: é concessão."),
 ],
},
(LP, "9º ano"): {
 "Conectivos e coesão": [
  ("\"Estudou bastante; por isso, foi aprovado.\" \"Por isso\" indica:", ["consequência", "oposição", "condição", "comparação"], 0, "A aprovação é consequência de ter estudado."),
  ("Qual conectivo indica condição?", ["se", "mas", "porque", "e"], 0, "\"Se\" apresenta uma condição: se chover, não vou."),
  ("Em \"Saí cedo para não pegar trânsito\", \"para\" indica:", ["finalidade", "causa", "tempo", "oposição"], 0, "\"Para\" mostra o objetivo da ação: finalidade."),
  ("\"Ele não veio, pois estava doente.\" \"Pois\" indica:", ["explicação (causa)", "conclusão", "oposição", "adição"], 0, "\"Pois\" explica o motivo de ele não ter vindo."),
  ("Em \"Marina chegou. Ela trouxe bolo.\", qual palavra retoma \"Marina\"?", ["Ela", "trouxe", "bolo", "chegou"], 0, "O pronome \"ela\" retoma Marina e evita repetir o nome: isso é coesão."),
 ],
 "Crase e porquês": [
  ("Qual frase usa a crase corretamente?", ["Vou à escola.", "Vou à pé.", "Comecei à estudar.", "Entreguei à ele."], 0, "Crase é a + a: \"ir a\" + \"a escola\" = à escola. Antes de verbo e palavra masculina não há crase."),
  ("Complete: \"Não sei ___ ele faltou.\"", ["porque", "por que", "porquê", "por quê"], 1, "No meio da frase, com sentido de \"por qual motivo\", usamos \"por que\" separado."),
  ("Complete: \"Faltei ___ estava doente.\"", ["por que", "porque", "por quê", "porquê"], 1, "\"Porque\" junto e sem acento explica a causa."),
  ("Complete: \"Você saiu cedo ___?\"", ["por que", "por quê", "porque", "porquê"], 1, "No fim da pergunta, \"por quê\" é separado e leva acento."),
  ("Qual frase NÃO deve ter crase?", ["Fui à praia.", "Dei o livro à professora.", "Andei a cavalo.", "Cheguei à noite."], 2, "Antes de palavra masculina (cavalo) não há crase."),
 ],
},
(MAT, "1º ano"): {
 "Contagem e números": [
  ("Quantas maçãs há aqui? 🍎🍎🍎🍎🍎", ["4", "5", "6", "3"], 1, "Conte apontando: 1, 2, 3, 4, 5. São 5 maçãs."),
  ("Qual número vem depois do 7?", ["6", "8", "9", "5"], 1, "Contando: 6, 7, 8. Depois do 7 vem o 8."),
  ("Qual é o maior número?", ["3", "9", "5", "1"], 1, "O 9 é o maior: vem depois de todos os outros na contagem."),
  ("Quantas patas tem um cachorro?", ["2", "3", "4", "6"], 2, "O cachorro tem 4 patas."),
  ("Qual número vem antes do 10?", ["11", "8", "9", "7"], 2, "Contando: 8, 9, 10. Antes do 10 vem o 9."),
 ],
 "Adição e subtração": [
  ("Quanto é 2 + 3?", ["4", "5", "6", "7"], 1, "Comece no 2 e conte mais 3: 3, 4, 5. O resultado é 5."),
  ("Quanto é 5 − 2?", ["2", "3", "4", "7"], 1, "Tinha 5 e tirou 2: sobram 3."),
  ("Ana tinha 4 balas e ganhou mais 2. Com quantas ficou?", ["5", "6", "7", "2"], 1, "Ganhar é juntar: 4 + 2 = 6."),
  ("Havia 6 pássaros. 1 voou. Quantos ficaram?", ["5", "6", "7", "4"], 0, "Voar embora é tirar: 6 − 1 = 5."),
  ("Quanto é 4 + 4?", ["6", "7", "8", "9"], 2, "4 + 4 = 8. É o dobro de 4."),
 ],
},
(MAT, "2º ano"): {
 "Adição e subtração": [
  ("Quanto é 15 + 4?", ["18", "19", "20", "21"], 1, "Some as unidades: 5 + 4 = 9. Fica 19."),
  ("Quanto é 20 − 5?", ["14", "15", "16", "25"], 1, "De 20 tirando 5 sobram 15."),
  ("Leo tem 12 figurinhas e ganhou 10. Quantas tem agora?", ["20", "21", "22", "2"], 2, "12 + 10 = 22."),
  ("Qual é o dobro de 6?", ["8", "10", "12", "3"], 2, "Dobro é duas vezes o número: 6 + 6 = 12."),
  ("Quanto é 30 + 20?", ["40", "50", "60", "10"], 1, "3 dezenas + 2 dezenas = 5 dezenas = 50."),
 ],
 "Medidas e tempo": [
  ("Quantos dias tem uma semana?", ["5", "6", "7", "10"], 2, "A semana tem 7 dias, de domingo a sábado."),
  ("Quantos minutos tem 1 hora?", ["30", "60", "100", "24"], 1, "Uma hora tem 60 minutos."),
  ("O que usamos para medir o comprimento de uma mesa?", ["Régua ou fita métrica", "Balança", "Termômetro", "Relógio"], 0, "Comprimento se mede com régua ou fita métrica. A balança mede massa."),
  ("Que mês vem depois de março?", ["Fevereiro", "Abril", "Maio", "Junho"], 1, "Janeiro, fevereiro, março, abril..."),
  ("Uma nota de 10 reais e uma de 5 reais somam:", ["R$ 10", "R$ 15", "R$ 20", "R$ 50"], 1, "10 + 5 = 15 reais."),
 ],
},
(MAT, "3º ano"): {
 "Multiplicação": [
  ("Quanto é 3 × 4?", ["7", "10", "12", "14"], 2, "3 × 4 é somar o 4 três vezes: 4 + 4 + 4 = 12."),
  ("Quanto é 5 × 5?", ["10", "20", "25", "30"], 2, "5 + 5 + 5 + 5 + 5 = 25."),
  ("Uma mesa tem 4 pernas. Quantas pernas têm 3 mesas?", ["7", "12", "10", "16"], 1, "3 mesas de 4 pernas: 3 × 4 = 12."),
  ("Quanto é 2 × 9?", ["11", "16", "18", "29"], 2, "2 × 9 é o dobro de 9: 9 + 9 = 18."),
  ("Qual é o triplo de 3?", ["6", "9", "12", "33"], 1, "Triplo é três vezes: 3 × 3 = 9."),
 ],
 "Sistema de numeração": [
  ("No número 352, quantas centenas há?", ["2", "3", "5", "35"], 1, "352 = 3 centenas, 5 dezenas e 2 unidades."),
  ("Qual número tem 4 centenas, 0 dezenas e 7 unidades?", ["47", "407", "470", "4007"], 1, "4 centenas = 400, mais 7 unidades = 407."),
  ("Qual é o maior número?", ["298", "312", "309", "299"], 1, "Compare as centenas primeiro: 3 é maior que 2. Entre 312 e 309, compare as dezenas: 1 é maior que 0."),
  ("Como se escreve \"cento e cinco\" em algarismos?", ["15", "105", "150", "1005"], 1, "Cento = 100, e cinco = 5: 105."),
  ("Qual número vem logo depois de 199?", ["190", "200", "198", "1100"], 1, "199 + 1 = 200."),
 ],
},
(MAT, "4º ano"): {
 "Divisão": [
  ("Quanto é 12 ÷ 3?", ["3", "4", "6", "9"], 1, "Dividir 12 em 3 grupos iguais dá 4 em cada: 3 × 4 = 12."),
  ("Dividindo 20 balas igualmente entre 4 crianças, cada uma recebe:", ["4", "5", "6", "16"], 1, "20 ÷ 4 = 5, porque 4 × 5 = 20."),
  ("Qual é a metade de 18?", ["6", "8", "9", "36"], 2, "Metade é dividir por 2: 18 ÷ 2 = 9."),
  ("Quanto é 35 ÷ 5?", ["5", "6", "7", "8"], 2, "5 × 7 = 35, então 35 ÷ 5 = 7."),
  ("Quantos grupos de 6 cabem em 24?", ["3", "4", "5", "6"], 1, "6 × 4 = 24: cabem 4 grupos."),
 ],
 "Frações": [
  ("Uma pizza foi cortada em 4 pedaços iguais. Cada pedaço é:", ["1/2", "1/3", "1/4", "4/1"], 2, "Um pedaço de quatro iguais é um quarto: 1/4."),
  ("Qual fração representa a metade?", ["1/2", "1/3", "2/3", "1/4"], 0, "Metade é uma parte de duas iguais: 1/2."),
  ("O que é maior: 1/2 ou 1/4 da mesma pizza?", ["1/2", "1/4", "São iguais", "Não dá para saber"], 0, "Quanto mais partes, menor cada pedaço. Por isso 1/2 é maior que 1/4."),
  ("Em 3/5, o número 5 indica:", ["em quantas partes o inteiro foi dividido", "quantas partes foram pegas", "o resultado da conta", "nada"], 0, "O número de baixo (denominador) diz em quantas partes o inteiro foi dividido."),
  ("Quanto é 1/4 de 12?", ["2", "3", "4", "6"], 1, "1/4 de 12 é dividir 12 por 4: 3."),
 ],
},
(MAT, "5º ano"): {
 "Números decimais": [
  ("0,5 é o mesmo que:", ["1/2", "1/5", "5", "1/50"], 0, "0,5 são 5 décimos, que é a metade: 1/2."),
  ("Quanto é R$ 2,50 + R$ 1,50?", ["R$ 3,00", "R$ 4,00", "R$ 3,50", "R$ 4,50"], 1, "50 + 50 centavos = 1 real. 2 + 1 + 1 = 4 reais."),
  ("Qual número é o maior?", ["0,7", "0,25", "0,09", "0,5"], 0, "Compare os décimos (o primeiro número depois da vírgula): 7 é o maior."),
  ("Quanto é 1,2 + 0,3?", ["1,5", "1,23", "4,2", "1,32"], 0, "Some décimos com décimos: 2 + 3 = 5. Fica 1,5."),
  ("Quantos centavos há em R$ 1,00?", ["10", "100", "1000", "50"], 1, "1 real = 100 centavos."),
 ],
 "Geometria": [
  ("Quantos lados tem um triângulo?", ["3", "4", "5", "6"], 0, "Tri quer dizer três: o triângulo tem 3 lados."),
  ("Qual figura tem 4 lados iguais e 4 ângulos retos?", ["Quadrado", "Triângulo", "Círculo", "Pentágono"], 0, "O quadrado tem 4 lados iguais e 4 cantos retos."),
  ("Qual é o perímetro de um quadrado de lado 5 cm?", ["10 cm", "20 cm", "25 cm", "15 cm"], 1, "Perímetro é a soma dos lados: 5 + 5 + 5 + 5 = 20 cm."),
  ("Quantas faces tem um cubo?", ["4", "6", "8", "12"], 1, "O cubo tem 6 faces, como um dado."),
  ("Um ângulo reto mede:", ["45°", "90°", "180°", "360°"], 1, "O ângulo reto mede 90°, como o canto de uma folha."),
 ],
},
(MAT, "6º ano"): {
 "Operações e expressões": [
  ("Quanto é 2 + 3 × 4?", ["20", "14", "24", "9"], 1, "Primeiro a multiplicação: 3 × 4 = 12. Depois 2 + 12 = 14."),
  ("Quanto é (2 + 3) × 4?", ["14", "20", "24", "9"], 1, "Primeiro o que está nos parênteses: 5 × 4 = 20."),
  ("Quanto é 2³ (dois ao cubo)?", ["6", "8", "9", "5"], 1, "2³ = 2 × 2 × 2 = 8."),
  ("Qual é o MMC de 4 e 6?", ["2", "10", "12", "24"], 2, "Múltiplos de 4: 4, 8, 12... Múltiplos de 6: 6, 12... O menor em comum é 12."),
  ("Qual destes números é primo?", ["9", "15", "13", "21"], 2, "13 só é divisível por 1 e por ele mesmo. Os outros têm mais divisores."),
 ],
 "Porcentagem": [
  ("Quanto é 50% de 80?", ["30", "40", "50", "16"], 1, "50% é a metade: 80 ÷ 2 = 40."),
  ("Quanto é 10% de 200?", ["2", "10", "20", "100"], 2, "10% é dividir por 10: 200 ÷ 10 = 20."),
  ("25% corresponde a qual fração?", ["1/2", "1/4", "1/5", "2/5"], 1, "25 de 100 é um quarto: 1/4."),
  ("Um produto de R$ 100 teve 20% de desconto. Qual é o novo preço?", ["R$ 20", "R$ 80", "R$ 120", "R$ 98"], 1, "20% de 100 = 20. 100 − 20 = 80 reais."),
  ("Numa turma de 30 alunos, 15 são meninas. Qual a porcentagem de meninas?", ["15%", "30%", "50%", "45%"], 2, "15 é a metade de 30: 50%."),
 ],
},
(MAT, "7º ano"): {
 "Números inteiros": [
  ("Quanto é −3 + 5?", ["−8", "2", "−2", "8"], 1, "Na reta numérica, saia do −3 e ande 5 para a direita: chega no 2."),
  ("Qual número é maior: −2 ou −7?", ["−2", "−7", "São iguais", "Nenhum"], 0, "Na reta numérica, −2 está mais à direita, então é maior."),
  ("Quanto é (−4) × (−3)?", ["−12", "12", "−7", "7"], 1, "Na multiplicação, sinais iguais dão resultado positivo: 12."),
  ("A temperatura era −2 °C e subiu 6 °C. Qual é a nova temperatura?", ["4 °C", "8 °C", "−8 °C", "−4 °C"], 0, "−2 + 6 = 4."),
  ("Quanto é 7 − 10?", ["3", "−3", "17", "−17"], 1, "Tirar 10 de 7 passa do zero: 7 − 10 = −3."),
 ],
 "Equações do 1º grau": [
  ("Resolva: x + 5 = 12", ["x = 5", "x = 7", "x = 17", "x = 12"], 1, "Qual número somado a 5 dá 12? x = 12 − 5 = 7."),
  ("Resolva: 3x = 21", ["x = 7", "x = 18", "x = 24", "x = 3"], 0, "x = 21 ÷ 3 = 7."),
  ("Resolva: 2x − 4 = 10", ["x = 3", "x = 5", "x = 7", "x = 14"], 2, "2x = 10 + 4 = 14, então x = 7."),
  ("O dobro de um número mais 3 é 11. Qual é o número?", ["4", "5", "7", "8"], 0, "2x + 3 = 11, então 2x = 8 e x = 4."),
  ("Resolva: x / 2 = 9", ["x = 4,5", "x = 11", "x = 18", "x = 7"], 2, "Se a metade de x é 9, então x = 9 × 2 = 18."),
 ],
},
(MAT, "8º ano"): {
 "Potências e raízes": [
  ("Quanto é √49?", ["6", "7", "8", "9"], 1, "7 × 7 = 49, então √49 = 7."),
  ("Quanto é 10²?", ["20", "100", "1000", "12"], 1, "10² = 10 × 10 = 100."),
  ("Quanto é 5⁰?", ["0", "1", "5", "50"], 1, "Todo número diferente de zero elevado a 0 é igual a 1."),
  ("Quanto é 2⁴?", ["8", "16", "6", "32"], 1, "2 × 2 × 2 × 2 = 16."),
  ("Quanto é √81 + √16?", ["13", "10", "97", "11"], 0, "√81 = 9 e √16 = 4. 9 + 4 = 13."),
 ],
 "Expressões algébricas": [
  ("Se x = 3, quanto vale 2x + 1?", ["6", "7", "5", "9"], 1, "Troque x por 3: 2 × 3 + 1 = 7."),
  ("Simplifique: 3a + 2a", ["5a", "6a", "5a²", "32a"], 0, "Termos semelhantes se somam: 3 + 2 = 5, fica 5a."),
  ("Qual expressão representa \"o triplo de um número menos 4\"?", ["3x − 4", "x − 4", "4 − 3x", "3(x − 4)"], 0, "Triplo do número é 3x. Menos 4: 3x − 4."),
  ("Se a = 2 e b = 5, quanto vale a × b + a?", ["12", "10", "17", "14"], 0, "2 × 5 + 2 = 10 + 2 = 12."),
  ("Quanto é 4x − x?", ["4", "3x", "3", "5x"], 1, "4x − 1x = 3x."),
 ],
},
(MAT, "9º ano"): {
 "Equações do 2º grau": [
  ("Quais são as soluções de x² = 25?", ["5 e −5", "25", "5", "0 e 25"], 0, "5 × 5 = 25 e (−5) × (−5) = 25. As duas servem."),
  ("Quais são as raízes de x² − 5x + 6 = 0?", ["2 e 3", "1 e 6", "−2 e −3", "5 e 6"], 0, "Procure dois números com soma 5 e produto 6: 2 e 3."),
  ("Qual é o discriminante (Δ = b² − 4ac) de x² + 2x + 1 = 0?", ["0", "4", "8", "−4"], 0, "Δ = 2² − 4 × 1 × 1 = 4 − 4 = 0."),
  ("Se Δ < 0, a equação do 2º grau:", ["não tem raízes reais", "tem duas raízes iguais", "tem duas raízes diferentes", "tem infinitas raízes"], 0, "Não existe raiz quadrada real de número negativo, então não há raízes reais."),
  ("Resolva: x² − 9 = 0", ["x = 3", "x = ±3", "x = 9", "x = ±9"], 1, "x² = 9, então x = 3 ou x = −3."),
 ],
 "Teorema de Pitágoras": [
  ("Num triângulo retângulo de catetos 3 e 4, a hipotenusa mede:", ["5", "6", "7", "12"], 0, "3² + 4² = 9 + 16 = 25, e √25 = 5."),
  ("O Teorema de Pitágoras vale para triângulos:", ["retângulos", "equiláteros", "quaisquer", "obtusângulos"], 0, "Ele só vale para triângulos com um ângulo reto."),
  ("Num triângulo retângulo de catetos 6 e 8, a hipotenusa mede:", ["10", "14", "12", "48"], 0, "36 + 64 = 100, e √100 = 10."),
  ("A hipotenusa mede 13 e um cateto mede 5. O outro cateto mede:", ["8", "12", "18", "10"], 1, "13² − 5² = 169 − 25 = 144, e √144 = 12."),
  ("Em a² = b² + c², a letra \"a\" representa:", ["a hipotenusa", "um cateto", "um ângulo", "a altura"], 0, "\"a\" é a hipotenusa, o lado oposto ao ângulo reto."),
 ],
},
}

TEC = "Tecnologia e Computação"
Q.update({
(TEC, "5º ano"): {
 "Partes do computador": [
  ("Qual parte do computador usamos para digitar letras?", ["Teclado", "Monitor", "Caixa de som", "Impressora"], 0, "O teclado é um dispositivo de entrada: com ele mandamos letras e números para o computador."),
  ("Qual destes é um dispositivo de SAÍDA?", ["Mouse", "Teclado", "Monitor", "Microfone"], 2, "O monitor mostra informações para nós: é saída. Mouse, teclado e microfone mandam informações para o computador: são entrada."),
  ("Para que serve o mouse?", ["Imprimir folhas", "Apontar e clicar na tela", "Guardar arquivos", "Tocar música"], 1, "O mouse move a setinha na tela e permite clicar nas coisas."),
  ("Onde ficam guardados os arquivos mesmo depois de desligar o computador?", ["No armazenamento (HD ou SSD)", "No monitor", "No mouse", "Na tomada"], 0, "O HD ou SSD guarda arquivos de forma permanente, mesmo com o computador desligado."),
  ("Qual destes é um programa (software)?", ["Teclado", "Navegador de internet", "Cabo USB", "Monitor"], 1, "Software é o programa, a parte que não dá para tocar. O navegador é um programa; os outros são peças (hardware)."),
 ],
 "Segurança na internet": [
  ("Um desconhecido pede seu endereço num jogo online. O que fazer?", ["Passar o endereço", "Não passar e avisar um adulto", "Mandar uma foto da casa", "Pedir o endereço dele"], 1, "Dados pessoais não se passam para desconhecidos. Avise um adulto de confiança."),
  ("Qual é a senha mais segura?", ["123456", "seunome", "Gato#Azul72!", "senha"], 2, "Senhas fortes misturam letras maiúsculas e minúsculas, números e símbolos, e não usam o seu nome."),
  ("Com quem você pode compartilhar sua senha?", ["Com os amigos da escola", "Com ninguém, só com seus responsáveis", "Com quem pedir no chat", "Com todo mundo"], 1, "A senha é secreta. No máximo, seus pais ou responsáveis podem saber."),
  ("Apareceu uma mensagem: \"Você ganhou um celular! Clique aqui\". O que fazer?", ["Clicar rápido", "Desconfiar e não clicar", "Passar seus dados", "Mandar para todos"], 1, "Prêmios surpresa costumam ser golpes. Não clique e mostre para um adulto."),
  ("O que é cyberbullying?", ["Um jogo de computador", "Ofender ou humilhar alguém pela internet", "Um tipo de vírus", "Uma rede social"], 1, "Cyberbullying é a agressão feita pela internet. Se acontecer com você ou com alguém, conte a um adulto."),
 ],
},
(TEC, "6º ano"): {
 "Pensamento computacional": [
  ("O que é um algoritmo?", ["Um tipo de computador", "Uma sequência de passos para resolver um problema", "Um vírus", "Um jogo"], 1, "Algoritmo é um passo a passo, como uma receita de bolo."),
  ("Qual é a ordem certa para escovar os dentes?", ["Enxaguar, escovar, pôr pasta", "Pôr pasta, escovar, enxaguar", "Escovar, pôr pasta, enxaguar", "Enxaguar, pôr pasta, guardar"], 1, "Num algoritmo a ordem dos passos importa: primeiro a pasta, depois escovar, depois enxaguar."),
  ("Dividir um problema grande em partes menores se chama:", ["Decomposição", "Impressão", "Formatação", "Download"], 0, "Decomposição é quebrar um problema em partes menores e mais fáceis de resolver."),
  ("Perceber que 2, 4, 6, 8 aumenta de 2 em 2 é identificar um:", ["Padrão", "Vírus", "Arquivo", "Cabo"], 0, "Reconhecer padrões é uma das bases do pensamento computacional."),
  ("Um robô anda 1 casa a cada comando \"frente\". Para andar 3 casas, ele precisa de:", ["1 comando", "2 comandos", "3 comandos", "4 comandos"], 2, "Cada comando move 1 casa, então são 3 comandos \"frente\"."),
 ],
 "Arquivos e pastas": [
  ("Para que servem as pastas no computador?", ["Organizar arquivos", "Ligar o computador", "Limpar a tela", "Acessar a internet"], 0, "Pastas organizam os arquivos, como gavetas de um armário."),
  ("Um arquivo \"trabalho.docx\" provavelmente é um:", ["Texto", "Vídeo", "Música", "Jogo"], 0, ".docx é a extensão de documentos de texto."),
  ("Qual extensão costuma ser de uma imagem?", [".mp3", ".jpg", ".docx", ".exe"], 1, ".jpg e .png são imagens. .mp3 é música e .docx é texto."),
  ("O que acontece com um arquivo enviado para a lixeira?", ["Some para sempre na hora", "Fica na lixeira até ela ser esvaziada", "Vai para a internet", "Vira outro arquivo"], 1, "Na lixeira o arquivo ainda pode ser recuperado, até ela ser esvaziada."),
  ("Fazer uma cópia dos arquivos importantes em outro lugar se chama:", ["Backup", "Download", "Bug", "Login"], 0, "Backup é a cópia de segurança: se o original se perder, você ainda tem a cópia."),
 ],
},
(TEC, "7º ano"): {
 "Internet e redes": [
  ("O que é a internet?", ["Um programa de texto", "Uma rede que liga computadores do mundo todo", "Um tipo de celular", "Um antivírus"], 1, "A internet é uma grande rede que conecta computadores e outros aparelhos no mundo inteiro."),
  ("Qual destes é um navegador?", ["Google Chrome", "Teclado", "Pen drive", "Windows Paint"], 0, "Navegador é o programa para acessar sites, como Chrome, Firefox e Edge."),
  ("O que significa fazer \"download\"?", ["Enviar um arquivo para a internet", "Baixar um arquivo da internet para o aparelho", "Apagar um arquivo", "Desligar o computador"], 1, "Download é baixar. O contrário, enviar, é upload."),
  ("O Wi-Fi permite:", ["Conectar à rede sem fio", "Imprimir sem papel", "Carregar a bateria", "Aumentar a tela"], 0, "Wi-Fi é uma conexão de rede sem fio, por ondas de rádio."),
  ("O cadeado ao lado do endereço do site indica que:", ["O site é proibido", "A conexão é protegida (criptografada)", "O site está fechado", "O site é pago"], 1, "O cadeado (HTTPS) mostra que os dados trocados com o site são protegidos."),
 ],
 "Cidadania digital": [
  ("Antes de compartilhar uma notícia, você deve:", ["Compartilhar logo", "Verificar se a fonte é confiável", "Mudar o título", "Mandar só para os amigos"], 1, "Conferir a fonte ajuda a não espalhar notícias falsas (fake news)."),
  ("Postar foto de um colega sem permissão é:", ["Normal", "Falta de respeito com a privacidade dele", "Obrigatório", "Um jeito de ajudar"], 1, "Cada pessoa decide sobre a própria imagem. Sempre peça permissão."),
  ("O que é \"pegada digital\"?", ["Um tipo de mouse", "O rastro do que fazemos e postamos na internet", "Uma marca na tela", "Um aplicativo"], 1, "Tudo o que postamos deixa rastros que podem ficar na internet por muito tempo."),
  ("Usar o trabalho de outra pessoa como se fosse seu é:", ["Plágio", "Backup", "Pesquisa", "Download"], 0, "Plágio é copiar sem dar crédito. Ao usar algo de alguém, cite a fonte."),
  ("Qual atitude é mais saudável com telas?", ["Usar o celular a noite toda", "Fazer pausas e equilibrar com outras atividades", "Nunca sair do jogo", "Comer sempre na frente da tela"], 1, "Pausas, sono e outras atividades ajudam a usar a tecnologia de forma saudável."),
 ],
},
(TEC, "8º ano"): {
 "Lógica e algoritmos": [
  ("\"SE estiver chovendo, ENTÃO leve guarda-chuva\" é um exemplo de:", ["Condicional", "Repetição", "Variável", "Arquivo"], 0, "Uma condicional executa uma ação só se a condição for verdadeira."),
  ("\"REPITA 10 vezes: pule\" é um exemplo de:", ["Condicional", "Laço de repetição", "Vírus", "Senha"], 1, "O laço (loop) repete um comando várias vezes sem precisar escrever cada um."),
  ("Se x = 5, o que o algoritmo mostra? SE x > 3 mostre \"grande\" SENÃO mostre \"pequeno\"", ["grande", "pequeno", "5", "3"], 0, "5 é maior que 3, então a condição é verdadeira e mostra \"grande\"."),
  ("Um erro num programa é chamado de:", ["Bug", "Byte", "Link", "Pixel"], 0, "Bug é um defeito no programa. Corrigir é \"depurar\" (debug)."),
  ("Para achar o maior número de uma lista, um algoritmo pode:", ["Comparar os números um a um", "Desligar o computador", "Apagar a lista", "Escolher sempre o primeiro"], 0, "Comparando um a um e guardando o maior até agora, chegamos ao maior de todos."),
 ],
 "Dados e informação": [
  ("A menor unidade de informação do computador é o:", ["Bit", "Byte", "Megabyte", "Pixel"], 0, "O bit vale 0 ou 1. Oito bits formam um byte."),
  ("Quantos bits formam 1 byte?", ["2", "4", "8", "10"], 2, "1 byte = 8 bits."),
  ("Qual é maior?", ["1 KB", "1 MB", "1 GB", "1 byte"], 2, "Em ordem: byte < KB < MB < GB. O gigabyte é o maior."),
  ("No sistema binário, os computadores usam só os algarismos:", ["0 e 1", "1 e 2", "0 a 9", "A e B"], 0, "Binário tem só dois algarismos: 0 e 1, como desligado e ligado."),
  ("Os pequenos pontos que formam uma imagem na tela se chamam:", ["Pixels", "Bytes", "Pastas", "Links"], 0, "Pixel é cada pontinho colorido que forma a imagem."),
 ],
},
(TEC, "9º ano"): {
 "Segurança da informação": [
  ("Phishing é:", ["Um jogo de pescaria", "Um golpe que tenta roubar dados com mensagens falsas", "Um antivírus", "Um tipo de backup"], 1, "No phishing, o golpista finge ser um banco ou loja para pegar senhas e dados."),
  ("A verificação em duas etapas serve para:", ["Deixar o celular mais rápido", "Pedir uma confirmação extra além da senha", "Apagar arquivos", "Baixar jogos"], 1, "Mesmo que descubram sua senha, ainda precisam do código extra para entrar."),
  ("Qual atitude protege contra vírus?", ["Baixar programas de qualquer site", "Manter o sistema e o antivírus atualizados", "Desligar o antivírus", "Abrir anexos desconhecidos"], 1, "Atualizações corrigem falhas de segurança, e o antivírus bloqueia ameaças conhecidas."),
  ("Usar a mesma senha em todos os sites é:", ["Seguro", "Arriscado: se uma vazar, todas as contas ficam expostas", "Obrigatório", "Recomendado pelos bancos"], 1, "Senhas diferentes evitam que um vazamento abra todas as suas contas."),
  ("Ao usar um computador público, ao terminar você deve:", ["Deixar a conta aberta", "Sair da conta (logout)", "Salvar a senha no navegador", "Desligar o monitor só"], 1, "Sair da conta impede que a próxima pessoa use o seu login."),
 ],
 "Programação básica": [
  ("Em programação, uma variável serve para:", ["Guardar um valor", "Ligar o computador", "Desenhar a tela", "Conectar ao Wi-Fi"], 0, "Variável é como uma caixa com nome onde guardamos um valor para usar depois."),
  ("Depois de: pontos = 10; pontos = pontos + 5; quanto vale pontos?", ["5", "10", "15", "105"], 2, "Pontos começa em 10 e recebe ele mesmo mais 5: 15."),
  ("Um laço \"para i de 1 até 3, mostre i\" mostra:", ["1 2 3", "3", "1", "0 1 2 3"], 0, "O laço passa por i = 1, 2 e 3 e mostra cada valor."),
  ("Qual destas é uma linguagem de programação?", ["Python", "Excel", "Wi-Fi", "Pen drive"], 0, "Python é uma linguagem de programação muito usada para aprender."),
  ("Um texto entre aspas, como \"Olá\", no código é um valor do tipo:", ["Texto (string)", "Número", "Imagem", "Pasta"], 0, "Valores entre aspas são textos, chamados de strings."),
 ],
},
})
