// Conteúdo do protótipo da masmorra: classes, ondas de monstros, recompensas e questões.
// No protótipo tudo fica no próprio site (sem banco), para dar para jogar sem login.
// Na versão final, as questões vêm do banco e a correção é feita no servidor.

export const CLASSES = [
  {
    id: "guerreiro",
    nome: "Guerreiro(a)",
    icone: "🛡️",
    descricao: "Mais resistente: começa com 5 corações.",
    vida: 5,
    criticoACada: 3,
    pocoes: { cura: 1, visao: 1, escudo: 0 },
  },
  {
    id: "mago",
    nome: "Mago(a)",
    icone: "🔮",
    descricao: "Começa com uma Poção de Visão a mais.",
    vida: 4,
    criticoACada: 3,
    pocoes: { cura: 1, visao: 2, escudo: 0 },
  },
  {
    id: "arqueiro",
    nome: "Arqueiro(a)",
    icone: "🏹",
    descricao: "Golpe crítico a cada 2 acertos seguidos.",
    vida: 4,
    criticoACada: 2,
    pocoes: { cura: 1, visao: 1, escudo: 0 },
  },
];

// Ondas da Masmorra da Língua Portuguesa. A última é o chefão.
export const ONDAS = [
  { nome: "Monstrinho Troca-Letras", icone: "👾", vida: 3, fala: "Hehe! Vou bagunçar suas letras!" },
  { nome: "Morcego Sem-Acento", icone: "🦇", vida: 4, fala: "Shhh... roubei todos os acentos!" },
  { nome: "Dragão da Gramática", icone: "🐉", vida: 6, fala: "Só passa quem sabe a língua!", chefao: true },
];

export const POCOES = {
  cura: { nome: "Poção de Cura", icone: "❤️", efeito: "Recupera 2 corações." },
  visao: { nome: "Poção de Visão", icone: "🔮", efeito: "Elimina 2 alternativas erradas." },
  escudo: { nome: "Poção de Escudo", icone: "🛡️", efeito: "Protege do próximo erro." },
};

// Recompensas do baú entre as ondas (o aprendiz escolhe 1 de 3).
export const RECOMPENSAS = [
  { id: "cura", tipo: "pocao", nome: "Poção de Cura", icone: "❤️", efeito: "Recupera 2 corações quando usar." },
  { id: "visao", tipo: "pocao", nome: "Poção de Visão", icone: "🔮", efeito: "Elimina 2 alternativas erradas." },
  { id: "escudo", tipo: "pocao", nome: "Poção de Escudo", icone: "🛡️", efeito: "Protege do próximo erro." },
  { id: "espada", tipo: "equipamento", nome: "Espada Afiada", icone: "🗡️", efeito: "Seus ataques causam +1 de dano." },
  { id: "coracao", tipo: "equipamento", nome: "Amuleto do Coração", icone: "💖", efeito: "+1 coração máximo (e cura 1)." },
];

// Medalhas do fim da aventura.
export function medalha(acertos, total, erros) {
  if (erros === 0) return { icone: "🏆", nome: "Lenda da Masmorra", texto: "Nenhum erro!" };
  if (acertos / total >= 0.8) return { icone: "🥇", nome: "Caçador(a) de Dragões", texto: "Mais de 80% de acertos." };
  if (acertos / total >= 0.6) return { icone: "🥈", nome: "Aventureiro(a) Corajoso(a)", texto: "Mais de 60% de acertos." };
  return { icone: "🎖️", nome: "Aprendiz Persistente", texto: "Você não desistiu: isso é o mais importante!" };
}

// Questões de exemplo (Língua Portuguesa, anos iniciais e finais do Fundamental).
// "correta" é o índice da alternativa certa. "explicacao" aparece depois de um erro.
export const QUESTOES = [
  {
    assunto: "Ortografia",
    enunciado: "Qual palavra está escrita corretamente?",
    opcoes: ["exceção", "esceção", "eceção", "exessão"],
    correta: 0,
    explicacao: "Exceção se escreve com X e C: ex-ce-ção. É da mesma família de \"exceto\".",
  },
  {
    assunto: "Ortografia",
    enunciado: "Complete: \"Ele ___ o dever de casa ontem.\"",
    opcoes: ["fêz", "fes", "fez", "fés"],
    correta: 2,
    explicacao: "Fez (do verbo fazer) termina com Z e não tem acento.",
  },
  {
    assunto: "Ortografia",
    enunciado: "Qual palavra está escrita corretamente?",
    opcoes: ["caxorro", "cachorro", "cachoro", "cashorro"],
    correta: 1,
    explicacao: "Cachorro tem CH e RR: ca-chor-ro. O RR aparece entre vogais para o som forte.",
  },
  {
    assunto: "Ortografia",
    enunciado: "Qual palavra completa a frase? \"Usamos a ___ para cortar o papel.\"",
    opcoes: ["tisoura", "tesoura", "tezoura", "tesora"],
    correta: 1,
    explicacao: "Tesoura se escreve com E e S. O S entre vogais tem som de Z.",
  },
  {
    assunto: "Ortografia",
    enunciado: "Em qual frase a palavra destacada está certa?",
    opcoes: ["Eu vou \"mas\" tarde.", "Ele quer \"mais\" bolo.", "Não sei \"porque\" ele saiu?", "Ela \"concerta\" o carro."],
    correta: 1,
    explicacao: "\"Mais\" indica quantidade (mais bolo). \"Mas\" indica oposição, como \"porém\".",
  },
  {
    assunto: "Ortografia",
    enunciado: "Qual palavra precisa de acento?",
    opcoes: ["mesa", "lapis", "casa", "bola"],
    correta: 1,
    explicacao: "Lápis é paroxítona terminada em S (com I antes), por isso leva acento: lá-pis.",
  },
  {
    assunto: "Classes de palavras",
    enunciado: "Em \"Ela comprou frutas frescas\", qual palavra é o adjetivo?",
    opcoes: ["Ela", "comprou", "frutas", "frescas"],
    correta: 3,
    explicacao: "Adjetivo dá uma característica ao substantivo. \"Frescas\" diz como são as frutas.",
  },
  {
    assunto: "Classes de palavras",
    enunciado: "Em \"Os alunos leram o livro\", qual palavra é o verbo?",
    opcoes: ["alunos", "leram", "livro", "Os"],
    correta: 1,
    explicacao: "Verbo indica ação. \"Leram\" é a ação que os alunos fizeram.",
  },
  {
    assunto: "Classes de palavras",
    enunciado: "Qual destas palavras é um substantivo?",
    opcoes: ["rapidamente", "bonito", "cadeira", "correr"],
    correta: 2,
    explicacao: "Substantivo dá nome a seres e objetos. \"Cadeira\" é o nome de um objeto.",
  },
  {
    assunto: "Classes de palavras",
    enunciado: "Em \"Nós brincamos no parque\", a palavra \"Nós\" é um:",
    opcoes: ["pronome", "verbo", "adjetivo", "advérbio"],
    correta: 0,
    explicacao: "Pronome substitui o nome das pessoas. \"Nós\" fala de quem está falando e de outras pessoas.",
  },
  {
    assunto: "Classes de palavras",
    enunciado: "Qual palavra indica COMO a ação aconteceu em \"Ele correu rapidamente\"?",
    opcoes: ["Ele", "correu", "rapidamente", "nenhuma"],
    correta: 2,
    explicacao: "\"Rapidamente\" é um advérbio de modo: mostra como ele correu.",
  },
  {
    assunto: "Classes de palavras",
    enunciado: "Qual é o plural de \"pão\"?",
    opcoes: ["pãos", "pães", "pões", "pãoes"],
    correta: 1,
    explicacao: "Algumas palavras em -ão fazem plural em -ães: pão, pães; cão, cães.",
  },
  {
    assunto: "Interpretação de texto",
    enunciado: "Ana levou o guarda-chuva porque o céu estava cheio de nuvens escuras. Por que Ana levou o guarda-chuva?",
    opcoes: ["Porque podia chover", "Porque queria brincar", "Porque estava com frio", "Porque ganhou de presente"],
    correta: 0,
    explicacao: "O texto diz que o céu tinha nuvens escuras: sinal de que podia chover.",
  },
  {
    assunto: "Interpretação de texto",
    enunciado: "Em \"Maria ficou radiante com a notícia\", Maria ficou:",
    opcoes: ["muito triste", "muito feliz", "com sono", "com medo"],
    correta: 1,
    explicacao: "Radiante quer dizer cheia de alegria, como se estivesse brilhando de felicidade.",
  },
  {
    assunto: "Interpretação de texto",
    enunciado: "Pedro acordou tarde, correu para a escola e chegou depois do sinal. Qual é o assunto principal?",
    opcoes: ["Pedro chegou atrasado", "Pedro gosta de correr", "Pedro perdeu o lanche", "A escola fechou"],
    correta: 0,
    explicacao: "Todas as ações do texto levam ao fato principal: Pedro chegou atrasado à escola.",
  },
  {
    assunto: "Interpretação de texto",
    enunciado: "\"O cachorro de Lia fugiu. Ela procurou por ele até encontrá-lo na praça.\" O que Lia fez?",
    opcoes: ["Foi dormir", "Procurou e achou o cachorro", "Ganhou outro cachorro", "Fechou o portão e esperou"],
    correta: 1,
    explicacao: "O texto diz que Lia procurou o cachorro até encontrá-lo na praça.",
  },
  {
    assunto: "Interpretação de texto",
    enunciado: "\"Choveu tanto que a rua virou um rio.\" A frase quer dizer que:",
    opcoes: ["Um rio passou pela rua", "A rua ficou muito alagada", "A rua foi fechada", "Parou de chover"],
    correta: 1,
    explicacao: "É uma comparação (exagero): a rua ficou com tanta água que parecia um rio.",
  },
  {
    assunto: "Interpretação de texto",
    enunciado: "Em um convite de aniversário, qual informação NÃO pode faltar?",
    opcoes: ["A cor do bolo", "O dia, a hora e o local", "O nome dos presentes", "A previsão do tempo"],
    correta: 1,
    explicacao: "Um convite precisa dizer quando e onde a festa vai acontecer.",
  },
];

// Colegas simulados do modo turma (só no protótipo).
export const COLEGAS = [
  { nome: "Ana", chance: 0.85 },
  { nome: "Bruno", chance: 0.7 },
  { nome: "Carla", chance: 0.55 },
  { nome: "Davi", chance: 0.4 },
  { nome: "Elisa", chance: 0.75 },
  { nome: "Felipe", chance: 0.6 },
];
