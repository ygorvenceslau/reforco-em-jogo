// Filtro de apelidos impróprios.
// O apelido do aprendiz aparece na lousa (projetada para a turma), então palavrões,
// ofensas e nomes de cunho sexual são recusados na entrada. A lousa também usa este
// filtro: se algum apelido impróprio chegar ao banco, ele aparece como "Um aprendiz".
//
// Como funciona: o texto é "normalizado" (minúsculas, sem acento, 4→a, 0→o, @→a...)
// e comparado com duas listas:
//  - EXATAS: palavras curtas, que só contam quando aparecem sozinhas
//    ("cu" é bloqueado, mas "Cuca" não; "puta" é bloqueado, mas "computador" não).
//  - CONTEM: palavras longas e inconfundíveis, procuradas em qualquer parte do texto
//    (pega "p.o.r.r.a", "caralhoooo", "xxcaralhoxx").

const EXATAS = [
  "cu", "cus", "pau", "puta", "putas", "puto", "putos", "putao", "foda", "fode", "foder", "fodido", "fodida",
  "porra", "merda", "bosta", "cacete", "caceta", "corno", "chifrudo", "viado", "viadao", "xota", "ppk", "bct",
  "desgraca", "idiota", "imbecil", "otario", "otaria", "babaca", "burro", "burra", "retardado", "retardada",
  "sexo", "sex", "porno", "porn", "nude", "nudes", "anal", "nazi", "nazista",
  "fdp", "pqp", "vsf", "tnc", "vtnc", "krl", "crl", "fds",
  "shit", "dick", "cock", "ass", "fuck", "bitch",
];

const CONTEM = [
  "caralho", "buceta", "boceta", "porra", "merda", "merdinha", "merdao", "foder", "fodase", "punheta", "siririca", "piroca",
  "xoxota", "xereca", "arrombad", "cuzao", "cusao", "vagabund", "filhodaputa", "filhadaputa", "putaria",
  "putinha", "viadinho", "desgracad", "estupr", "hitler", "xvideo", "pornhub",
  "fuck", "bitch", "pussy", "nigga", "nigger",
];

const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", 8: "b", "@": "a", "$": "s", "!": "i", "|": "i" };

function normalizar(texto) {
  return texto
    .toLowerCase()
    .replace(/pica[\s.-]*pau/g, "picapau") // o desenho animado não é palavrão
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // tira os acentos
    .replace(/[0134578@$!|]/g, (c) => LEET[c]);
}

// "porrrraaaa" → "pora": junta letras repetidas.
const colapsar = (s) => s.replace(/(.)\1+/g, "$1");

const exatas = new Set([...EXATAS, ...EXATAS.map(colapsar)]);
const contemColapsadas = CONTEM.map(colapsar).filter((p) => p.length >= 6);

export function apelidoImproprio(nome) {
  const palavras = normalizar(nome || "").split(/[^a-z]+/).filter(Boolean);
  const junto = palavras.join("");
  if (palavras.some((p) => exatas.has(p) || exatas.has(colapsar(p)))) return true;
  if (exatas.has(junto) || exatas.has(colapsar(junto))) return true; // "p u t a", "f.d.p"
  if (CONTEM.some((p) => junto.includes(p))) return true;
  return contemColapsadas.some((p) => colapsar(junto).includes(p));
}
