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

// As 3 ondas da masmorra: vida do monstro e cenário de cada uma. A última é o chefão.
// As regras do jogo (regras.js) usam só a vida daqui; o monstro de cada onda é sorteado abaixo.
export const ONDAS = [
  { vida: 3, cenario: "entrada", lugar: "Entrada da masmorra" },
  { vida: 4, cenario: "corredor", lugar: "Corredor das sombras" },
  { vida: 6, cenario: "trono", lugar: "Sala do trono", chefao: true },
];

// Monstros por disciplina: para cada onda, uma lista (um é sorteado a cada partida).
// "cor" é a cor do brilho em volta do monstro. Estilo cartoon: ninguém se machuca, os monstros são desencantados.
const MONSTROS = {
  "Língua Portuguesa": [
    [
      { nome: "Monstrinho Troca-Letras", icone: "👾", cor: "#b07cff", fala: "Hehe! Vou bagunçar suas letras!" },
      { nome: "Sapo Soletrador", icone: "🐸", cor: "#6bdc7a", fala: "Croac! Soletre se for capaz!" },
      { nome: "Lagartixa Come-Vírgula", icone: "🦎", cor: "#9be15d", fala: "Nhac! Comi todas as vírgulas!" },
    ],
    [
      { nome: "Morcego Sem-Acento", icone: "🦇", cor: "#8f7cff", fala: "Shhh... roubei todos os acentos!" },
      { nome: "Fantasma do Ponto Final", icone: "👻", cor: "#d9e6ff", fala: "Buuu! Sumi com os pontos finais!" },
      { nome: "Aranha da Crase", icone: "🕷️", cor: "#c9a0ff", fala: "Teci uma teia de crases!" },
    ],
    [
      { nome: "Dragão da Gramática", icone: "🐉", cor: "#5ee07a", fala: "Só passa quem sabe a língua!" },
      { nome: "Troll do Dicionário", icone: "🧌", cor: "#a3d977", fala: "Grrr! Conheço todas as palavras!" },
      { nome: "Dragão das Rimas", icone: "🐲", cor: "#ff9f5e", fala: "Rima comigo se tiver coragem!" },
    ],
  ],
  "Matemática": [
    [
      { nome: "Monstrinho Conta-Errada", icone: "👾", cor: "#b07cff", fala: "Hehe! 2 + 2 = 5!" },
      { nome: "Lesma da Tabuada", icone: "🐌", cor: "#ffd166", fala: "Devagar... quanto é 7 × 8?" },
      { nome: "Caranguejo dos Sinais", icone: "🦀", cor: "#ff7b6b", fala: "Mais vira menos, menos vira mais!" },
    ],
    [
      { nome: "Polvo das Contas", icone: "🐙", cor: "#ff8ad1", fala: "Oito braços, oito contas difíceis!" },
      { nome: "Coruja dos Problemas", icone: "🦉", cor: "#e0b07a", fala: "Huu! Problema difícil à vista!" },
      { nome: "Lobo do Resto", icone: "🐺", cor: "#9fb4d6", fala: "Auuu! Quero o resto da divisão!" },
    ],
    [
      { nome: "Dragão dos Números", icone: "🐉", cor: "#5ee07a", fala: "Só passa quem domina os números!" },
      { nome: "Rex da Geometria", icone: "🦖", cor: "#7be0a0", fala: "ROAR! Quantos lados tem um hexágono?" },
      { nome: "Dragão das Equações", icone: "🐲", cor: "#ff9f5e", fala: "Descubra o x ou não passa!" },
    ],
  ],
  "Tecnologia e Computação": [
    [
      { nome: "Bug Saltitante", icone: "🐛", cor: "#9be15d", fala: "Bzzz! Entrei no seu código!" },
      { nome: "Vírus Espirrento", icone: "🦠", cor: "#6be0c8", fala: "Atchim! Vou infectar seus arquivos!" },
      { nome: "Pixel Fujão", icone: "👾", cor: "#b07cff", fala: "Pega o pixel se for capaz!" },
    ],
    [
      { nome: "Robô Desconfigurado", icone: "🤖", cor: "#8fd3ff", fala: "Bip bop... erro 404!" },
      { nome: "Cobra do Phishing", icone: "🐍", cor: "#9be15d", fala: "Ssss... clique neste link..." },
      { nome: "Fantasma do Spam", icone: "👻", cor: "#d9e6ff", fala: "Buuu! Mil e-mails para você!" },
    ],
    [
      { nome: "Dragão do Firewall", icone: "🐲", cor: "#ff9f5e", fala: "Só passa quem navega com segurança!" },
      { nome: "Dragão Binário", icone: "🐉", cor: "#5ee07a", fala: "01001111... você decifra?" },
      { nome: "Disco Voador do Malware", icone: "🛸", cor: "#8fd3ff", fala: "Vou abduzir suas senhas!" },
    ],
  ],
};
const MONSTROS_GERAIS = [
  [{ nome: "Monstrinho Esquecido", icone: "👾", cor: "#b07cff", fala: "Hehe! Você não vai lembrar!" }],
  [{ nome: "Morcego da Dúvida", icone: "🦇", cor: "#8f7cff", fala: "Shhh... será que é essa mesmo?" }],
  [{ nome: "Dragão do Saber", icone: "🐉", cor: "#5ee07a", fala: "Só passa quem estudou!" }],
];

// Monta as 3 ondas de uma disciplina. Com sortear = true, cada onda ganha um monstro aleatório da lista
// (cada partida fica diferente); sem sortear, usa sempre o primeiro (ex.: o chefão da lousa).
export function ondasDe(disciplina, sortear = false) {
  const listas = MONSTROS[disciplina] || MONSTROS_GERAIS;
  return ONDAS.map((onda, i) => {
    const lista = listas[i];
    const monstro = sortear ? lista[Math.floor(Math.random() * lista.length)] : lista[0];
    return { ...onda, ...monstro };
  });
}

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
