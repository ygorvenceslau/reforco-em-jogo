// Desenho dos monstros em SVG (feito à mão, sem imagens externas).
// Cada "tipo" é um molde; a cor vem do monstro em dados.js, então o mesmo molde
// serve para vários monstros (ex.: os dragões de cada disciplina).
// As partes se mexem com animações do próprio SVG (asas, tentáculos, fumaça)
// e com CSS (piscar e balançar), em monstro.css.
import { useId } from "react";
import "./monstro.css";

const L = "#241a33"; // cor do contorno

// Mistura uma cor com branco (t > 0) ou preto (t < 0).
function tom(hex, t) {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const alvo = t > 0 ? 255 : 0;
  const k = Math.abs(t);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (alvo - v) * k));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}

const contorno = { stroke: L, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" };

function Olho({ x, y, r = 9, olhar = 0 }) {
  return (
    <g className="mo-olho">
      <circle cx={x} cy={y} r={r} fill="#fff" stroke={L} strokeWidth="2.5" />
      <circle cx={x + olhar} cy={y + r * 0.12} r={r * 0.52} fill={L} />
      <circle cx={x + olhar - r * 0.2} cy={y - r * 0.18} r={r * 0.2} fill="#fff" />
    </g>
  );
}

// Sobrancelha brava: desce em direção ao centro do rosto.
function Bravo({ x, y, lado }) {
  const s = lado === "e" ? 1 : -1;
  return <path d={`M${x - 10 * s} ${y - 15} L${x + 8 * s} ${y - 9}`} stroke={L} strokeWidth="4.5" strokeLinecap="round" />;
}

// Braço, perna, cauda ou tentáculo: contorno grosso por baixo e a cor por cima.
function Membro({ d, cor, w = 8 }) {
  return (
    <>
      <path d={d} fill="none" stroke={L} strokeWidth={w + 5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={cor} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// Gira um grupo para lá e para cá em torno de (cx, cy).
function Balanca({ cx, cy, de = -8, ate = 8, dur = "1.2s", atraso = "0s", children }) {
  const v = `${de} ${cx} ${cy};${ate} ${cx} ${cy};${de} ${cx} ${cy}`;
  return (
    <g>
      {children}
      <animateTransform attributeName="transform" type="rotate" values={v} dur={dur} begin={atraso}
        repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" />
    </g>
  );
}

// Desenha o lado direito espelhando o esquerdo.
const Espelho = ({ children }) => <g transform="translate(120 0) scale(-1 1)">{children}</g>;

const Brilho = ({ x, y, rx = 8, ry = 4.5, rot = -30 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity=".45" transform={`rotate(${rot} ${x} ${y})`} />
);

const Bochechas = ({ x1, x2, y }) => (
  <g fill="#ff8fb1" opacity=".65">
    <ellipse cx={x1} cy={y} rx="6" ry="3.5" />
    <ellipse cx={x2} cy={y} rx="6" ry="3.5" />
  </g>
);

const Presa = ({ x, y, h = 6 }) => <path d={`M${x - 3} ${y} L${x} ${y + h} L${x + 3} ${y} Z`} fill="#fff" stroke={L} strokeWidth="1.5" strokeLinejoin="round" />;

const MOLDES = {
  geleca: (p) => (
    <>
      <g className="mo-geleca">
        <path d="M18 104 C14 78 30 40 60 34 C90 40 106 78 102 104 C96 110 24 110 18 104 Z" fill={p.C} {...contorno} />
        <path d="M60 35 C56 24 62 16 70 18" fill="none" {...contorno} />
        <circle cx="71" cy="18" r="4" fill={p.claro} {...contorno} strokeWidth="2.5" />
        <path d="M86 104 q2 9 -3 10 q-5 -1 -2 -10" fill={p.cor} {...contorno} strokeWidth="2.5" />
        <Brilho x={38} y={56} rx={9} ry={5} />
        <Olho x={46} y={70} r={10} olhar={1} />
        <Olho x={74} y={70} r={10} olhar={1} />
        <path d="M44 86 Q60 101 76 86 Z" fill="#5a1d3a" {...contorno} />
        <Presa x={54} y={87} />
        <Bochechas x1={34} x2={86} y={84} />
      </g>
    </>
  ),

  sapo: (p) => (
    <>
      <ellipse cx="34" cy="108" rx="15" ry="5" fill={p.escuro} {...contorno} />
      <ellipse cx="86" cy="108" rx="15" ry="5" fill={p.escuro} {...contorno} />
      <ellipse cx="60" cy="82" rx="44" ry="28" fill={p.C} {...contorno} />
      <ellipse cx="60" cy="92" rx="27" ry="15" fill={p.claro} />
      <circle cx="38" cy="52" r="15" fill={p.C} {...contorno} />
      <circle cx="82" cy="52" r="15" fill={p.C} {...contorno} />
      <Olho x={38} y={52} r={9.5} olhar={1.5} />
      <Olho x={82} y={52} r={9.5} olhar={-1.5} />
      <path d="M28 76 Q60 98 92 76" fill="none" {...contorno} />
      <path d="M56 86 Q60 96 64 86" fill="#ff6b8a" {...contorno} strokeWidth="2" />
      <Bochechas x1={30} x2={90} y={82} />
      <Brilho x={30} y={72} />
    </>
  ),

  lagarto: (p) => (
    <>
      <Balanca cx={84} cy={94} de={-6} ate={10} dur="1.6s">
        <Membro d="M80 96 C108 98 112 72 98 66 C92 64 89 72 95 75" cor={p.escuro} w={10} />
      </Balanca>
      <ellipse cx="36" cy="106" rx="10" ry="5" fill={p.escuro} {...contorno} />
      <ellipse cx="80" cy="106" rx="10" ry="5" fill={p.escuro} {...contorno} />
      <ellipse cx="58" cy="86" rx="26" ry="22" fill={p.C} {...contorno} />
      <ellipse cx="58" cy="92" rx="14" ry="12" fill={p.claro} />
      <path d="M40 34 L44 24 L50 32 L56 21 L62 31 L68 23 L72 34 Z" fill={p.escuro} {...contorno} strokeWidth="2.5" />
      <ellipse cx="58" cy="52" rx="31" ry="22" fill={p.C} {...contorno} />
      <circle cx="40" cy="62" r="3" fill={p.escuro} opacity=".6" />
      <circle cx="78" cy="60" r="2.5" fill={p.escuro} opacity=".6" />
      <Olho x={42} y={47} r={10} olhar={1} />
      <Olho x={74} y={47} r={10} olhar={1} />
      <path d="M46 62 Q58 71 70 62" fill="none" {...contorno} />
      <path d="M58 67 L58 76 M58 76 l-3 4 M58 76 l3 4" fill="none" stroke="#e0405a" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.6;.65;.85;.9" dur="2.6s" repeatCount="indefinite" />
      </path>
      <Brilho x={40} y={40} />
    </>
  ),

  morcego: (p) => {
    const asa = (
      <path d="M44 62 C30 38 12 42 4 56 C13 57 15 64 13 71 C21 67 26 72 26 80 C32 74 39 75 44 79 Z" fill={p.escuro} {...contorno} />
    );
    return (
      <>
        <Balanca cx={44} cy={66} de={-14} ate={10} dur=".55s">{asa}</Balanca>
        <Espelho><Balanca cx={44} cy={66} de={-14} ate={10} dur=".55s">{asa}</Balanca></Espelho>
        <path d="M43 56 L40 30 L56 47 Z" fill={p.C} {...contorno} />
        <path d="M77 56 L80 30 L64 47 Z" fill={p.C} {...contorno} />
        <path d="M45 50 L43 37 L51 46 Z" fill="#ff8fb1" />
        <path d="M75 50 L77 37 L69 46 Z" fill="#ff8fb1" />
        <circle cx="60" cy="70" r="25" fill={p.C} {...contorno} />
        <ellipse cx="60" cy="80" rx="13" ry="10" fill={p.claro} />
        <path d="M52 95 l-2 8 M68 95 l2 8" stroke={L} strokeWidth="3" strokeLinecap="round" />
        <Olho x={51} y={65} r={8} />
        <Olho x={69} y={65} r={8} />
        <Bravo x={51} y={65} lado="e" />
        <Bravo x={69} y={65} lado="d" />
        <path d="M51 80 Q60 86 69 80" fill="none" {...contorno} />
        <Presa x={54} y={81} />
        <Presa x={66} y={81} />
        <Brilho x={45} y={56} rx={6} ry={3.5} />
      </>
    );
  },

  fantasma: (p) => (
    <>
      <g className="mo-tremeluz">
        <path d="M30 70 q-14 2 -12 16 q7 -1 12 -6" fill={p.C} {...contorno} />
        <path d="M90 70 q14 2 12 16 q-7 -1 -12 -6" fill={p.C} {...contorno} />
        <path d="M28 104 L28 60 C28 30 92 30 92 60 L92 104 Q86 95 80 104 Q74 95 68 104 Q62 95 56 104 Q50 95 44 104 Q38 95 34 104 Q31 99 28 104 Z" fill={p.C} {...contorno} />
        <Brilho x={42} y={46} rx={9} ry={5} />
        <g className="mo-olho">
          <ellipse cx="48" cy="62" rx="6.5" ry="9.5" fill={L} />
          <ellipse cx="72" cy="62" rx="6.5" ry="9.5" fill={L} />
          <circle cx="46" cy="58" r="2.4" fill="#fff" />
          <circle cx="70" cy="58" r="2.4" fill="#fff" />
        </g>
        <ellipse cx="60" cy="82" rx="6" ry="8" fill="#3a2050" stroke={L} strokeWidth="2.5" />
        <Bochechas x1={38} x2={82} y={74} />
      </g>
    </>
  ),

  aranha: (p) => {
    const pernas = (
      <>
        <Balanca cx={46} cy={74} de={-6} ate={6} dur=".9s"><Membro d="M46 66 Q26 46 14 60" cor={p.escuro} w={4} /></Balanca>
        <Balanca cx={46} cy={74} de={5} ate={-5} dur=".9s"><Membro d="M44 74 Q22 64 9 80" cor={p.escuro} w={4} /></Balanca>
        <Balanca cx={46} cy={74} de={-5} ate={5} dur=".9s"><Membro d="M44 82 Q22 86 13 102" cor={p.escuro} w={4} /></Balanca>
        <Balanca cx={46} cy={74} de={5} ate={-5} dur=".9s"><Membro d="M48 90 Q32 98 28 112" cor={p.escuro} w={4} /></Balanca>
      </>
    );
    return (
      <>
        <line x1="60" y1="0" x2="60" y2="48" stroke="#e8e2ff" strokeWidth="1.6" opacity=".8" />
        {pernas}
        <Espelho>{pernas}</Espelho>
        <circle cx="60" cy="76" r="27" fill={p.C} {...contorno} />
        <path d="M44 56 Q60 48 76 56" fill="none" stroke={p.claro} strokeWidth="4" strokeLinecap="round" />
        <circle cx="46" cy="62" r="3.5" fill={L} /><circle cx="45" cy="61" r="1.2" fill="#fff" />
        <circle cx="74" cy="62" r="3.5" fill={L} /><circle cx="73" cy="61" r="1.2" fill="#fff" />
        <Olho x={51} y={74} r={8.5} />
        <Olho x={69} y={74} r={8.5} />
        <path d="M54 92 q-1 7 3 8 M66 92 q1 7 -3 8" fill="none" stroke={L} strokeWidth="3" strokeLinecap="round" />
        <path d="M52 87 Q60 92 68 87" fill="none" {...contorno} strokeWidth="2.5" />
        <Brilho x={44} y={68} rx={5} ry={3} />
      </>
    );
  },

  dragao: (p, { asas = true, bracinhos = false } = {}) => {
    const asa = (
      <path d="M40 62 L8 28 L15 48 L3 51 L14 62 L5 70 L28 76 Z" fill={p.escuro} {...contorno} />
    );
    const chifre = <path d="M39 36 Q28 18 40 11 Q40 24 47 31 Z" fill="#f6e7c8" {...contorno} strokeWidth="2.5" />;
    return (
      <>
        {asas && (
          <>
            <Balanca cx={40} cy={66} de={-12} ate={8} dur="1.1s">{asa}</Balanca>
            <Espelho><Balanca cx={40} cy={66} de={-12} ate={8} dur="1.1s">{asa}</Balanca></Espelho>
          </>
        )}
        {!asas && (
          <path d="M34 72 L26 62 L36 64 L32 52 L42 58 Z M86 72 L94 62 L84 64 L88 52 L78 58 Z" fill={p.escuro} {...contorno} strokeWidth="2.5" />
        )}
        <ellipse cx="42" cy="110" rx="11" ry="5" fill={p.escuro} {...contorno} />
        <ellipse cx="78" cy="110" rx="11" ry="5" fill={p.escuro} {...contorno} />
        <ellipse cx="60" cy="90" rx="29" ry="22" fill={p.C} {...contorno} />
        <ellipse cx="60" cy="94" rx="16" ry="15" fill="#ffe7b0" stroke={L} strokeWidth="2" />
        <path d="M47 88 Q60 92 73 88 M46 96 Q60 100 74 96 M49 104 Q60 107 71 104" fill="none" stroke="#d9a860" strokeWidth="2" />
        {bracinhos && (
          <>
            <Membro d="M37 84 q-9 3 -8 11" cor={p.cor} w={6} />
            <Membro d="M83 84 q9 3 8 11" cor={p.cor} w={6} />
          </>
        )}
        {chifre}
        <Espelho>{chifre}</Espelho>
        <path d="M52 30 L56 20 L60 29 L64 20 L68 30 Z" fill={p.escuro} {...contorno} strokeWidth="2.5" />
        <ellipse cx="60" cy="52" rx="31" ry="24" fill={p.C} {...contorno} />
        <ellipse cx="60" cy="64" rx="20" ry="12" fill={p.claro} {...contorno} strokeWidth="2.5" />
        <ellipse cx="53" cy="61" rx="2.4" ry="1.8" fill={L} />
        <ellipse cx="67" cy="61" rx="2.4" ry="1.8" fill={L} />
        <Olho x={46} y={46} r={8.5} />
        <Olho x={74} y={46} r={8.5} />
        <Bravo x={46} y={46} lado="e" />
        <Bravo x={74} y={46} lado="d" />
        <path d="M46 69 Q60 77 74 69" fill="none" {...contorno} />
        <Presa x={50} y={70} h={7} />
        <Presa x={70} y={70} h={7} />
        <Brilho x={40} y={38} />
        {[[52, "0s"], [68, "1.3s"]].map(([x, atraso]) => (
          <circle key={x} cx={x} cy="58" r="3" fill="#cfc8e8" opacity="0">
            <animate attributeName="cy" values="58;30" dur="2.6s" begin={atraso} repeatCount="indefinite" />
            <animate attributeName="r" values="2;7" dur="2.6s" begin={atraso} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;.7;0" dur="2.6s" begin={atraso} repeatCount="indefinite" />
          </circle>
        ))}
      </>
    );
  },

  // Rex: o mesmo desenho do dragão, sem asas e com bracinhos.
  rex: (p) => MOLDES.dragao(p, { asas: false, bracinhos: true }),

  troll: (p) => (
    <>
      <path d="M26 108 C20 72 34 58 60 58 C86 58 100 72 94 108 Z" fill={p.C} {...contorno} />
      <ellipse cx="60" cy="90" rx="20" ry="15" fill={p.claro} />
      <ellipse cx="24" cy="86" rx="9" ry="18" fill={p.C} {...contorno} />
      <g transform="rotate(12 98 88)">
        <rect x="86" y="74" width="24" height="30" rx="3" fill="#8b4a2b" {...contorno} />
        <rect x="90" y="78" width="16" height="22" rx="1.5" fill="#f4e6c4" />
        <path d="M93 84 h10 M93 89 h10 M93 94 h7" stroke="#b49a6a" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <ellipse cx="90" cy="96" rx="8" ry="6" fill={p.C} {...contorno} />
      <path d="M38 42 L16 34 L38 58 Z" fill={p.C} {...contorno} />
      <path d="M82 42 L104 34 L82 58 Z" fill={p.C} {...contorno} />
      <ellipse cx="60" cy="46" rx="26" ry="23" fill={p.C} {...contorno} />
      <path d="M54 24 q2 -12 6 -2 q3 -9 6 2" fill="none" {...contorno} />
      <Olho x={50} y={42} r={7} />
      <Olho x={70} y={42} r={7} />
      <path d="M41 33 Q60 28 79 33" fill="none" stroke={L} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="60" cy="53" rx="7" ry="6" fill={p.escuro} {...contorno} strokeWidth="2.5" />
      <path d="M47 62 Q60 67 73 62" fill="none" {...contorno} />
      <path d="M49 62 L48 54 L54 61 Z M71 62 L72 54 L66 61 Z" fill="#fff" stroke={L} strokeWidth="1.5" strokeLinejoin="round" />
      <Brilho x={46} y={36} rx={6} ry={3.5} />
    </>
  ),

  lesma: (p) => (
    <>
      <ellipse cx="60" cy="110" rx="48" ry="4" fill="#9fd8ff" opacity=".35" />
      <path d="M14 108 C10 98 20 94 34 95 L96 94 C108 94 110 108 98 108 Z" fill={p.claro} {...contorno} />
      <circle cx="68" cy="70" r="29" fill={p.C} {...contorno} />
      <path d="M68 70 a5 5 0 1 1 5 5 a10 10 0 1 1 -10 -10 a15 15 0 1 1 15 15 a20 20 0 1 1 -20 -20" fill="none" stroke={L} strokeWidth="2.5" strokeLinecap="round" opacity=".75" />
      <Brilho x={54} y={52} />
      <path d="M18 106 C8 98 10 72 26 70 C40 70 42 90 42 100" fill={p.claro} {...contorno} />
      <Balanca cx={26} cy={72} de={-7} ate={7} dur="2s">
        <path d="M22 72 L16 50 M31 72 L35 48" stroke={L} strokeWidth="3" strokeLinecap="round" />
        <Olho x={16} y={46} r={7} />
        <Olho x={35} y={45} r={7} />
      </Balanca>
      <path d="M20 86 Q27 92 34 86" fill="none" {...contorno} strokeWidth="2.5" />
      <ellipse cx="18" cy="82" rx="4" ry="2.4" fill="#ff8fb1" opacity=".7" />
    </>
  ),

  caranguejo: (p) => {
    const garra = (
      <Balanca cx={28} cy={80} de={-8} ate={6} dur=".8s">
        <Membro d="M30 80 Q14 72 18 54" cor={p.escuro} w={6} />
        <path d="M18 54 C2 50 4 28 18 28 C14 34 16 40 23 40 C26 33 31 35 31 40 C31 49 27 54 18 54 Z" fill={p.C} {...contorno} />
      </Balanca>
    );
    const pernas = (
      <>
        <Membro d="M32 90 L16 100" cor={p.escuro} w={4} />
        <Membro d="M36 96 L24 108" cor={p.escuro} w={4} />
        <Membro d="M42 99 L36 111" cor={p.escuro} w={4} />
      </>
    );
    return (
      <>
        {pernas}
        <Espelho>{pernas}</Espelho>
        {garra}
        <Espelho>{garra}</Espelho>
        <path d="M51 64 L48 44 M69 64 L72 44" stroke={L} strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="60" cy="80" rx="36" ry="22" fill={p.C} {...contorno} />
        <circle cx="44" cy="74" r="3" fill={p.claro} /><circle cx="78" cy="72" r="2.5" fill={p.claro} />
        <Olho x={48} y={41} r={8} />
        <Olho x={72} y={41} r={8} />
        <Bravo x={48} y={41} lado="e" />
        <Bravo x={72} y={41} lado="d" />
        <path d="M48 84 Q60 94 72 84" fill="#5a1d3a" {...contorno} strokeWidth="2.5" />
        <Brilho x={42} y={68} />
      </>
    );
  },

  polvo: (p) => {
    const tentaculos = [
      "M34 74 C22 88 34 98 20 108",
      "M46 80 C42 94 50 100 40 112",
      "M56 82 C56 96 61 102 53 113",
      "M64 82 C64 96 59 102 67 113",
      "M74 80 C78 94 70 100 80 112",
      "M86 74 C98 88 86 98 100 108",
    ];
    return (
      <>
        {tentaculos.map((d, i) => (
          <Balanca key={i} cx={34 + i * 10.4} cy={78} de={-7} ate={7} dur="1.4s" atraso={i * 0.18 + "s"}>
            <Membro d={d} cor={p.escuro} w={8} />
          </Balanca>
        ))}
        <path d="M24 66 C24 26 96 26 96 66 C96 80 86 84 60 84 C34 84 24 80 24 66 Z" fill={p.C} {...contorno} />
        <circle cx="42" cy="40" r="4" fill={p.claro} /><circle cx="78" cy="42" r="5" fill={p.claro} /><circle cx="70" cy="32" r="2.6" fill={p.claro} />
        <Olho x={47} y={60} r={9.5} />
        <Olho x={73} y={60} r={9.5} />
        <ellipse cx="60" cy="75" rx="4" ry="3.5" fill="#5a1d3a" stroke={L} strokeWidth="2" />
        <Bochechas x1={36} x2={84} y={72} />
        <Brilho x={40} y={46} />
      </>
    );
  },

  coruja: (p) => (
    <>
      <path d="M38 108 l-3 6 M42 108 l0 6 M78 108 l3 6 M82 108 l0 6" stroke="#ffb347" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M35 37 L28 14 L48 30 Z" fill={p.escuro} {...contorno} />
      <path d="M85 37 L92 14 L72 30 Z" fill={p.escuro} {...contorno} />
      <path d="M60 24 C88 24 99 54 96 80 C94 104 78 110 60 110 C42 110 26 104 24 80 C21 54 32 24 60 24 Z" fill={p.C} {...contorno} />
      <path d="M26 66 C16 80 22 98 34 104 C30 92 30 80 34 70 Z" fill={p.escuro} {...contorno} />
      <path d="M94 66 C104 80 98 98 86 104 C90 92 90 80 86 70 Z" fill={p.escuro} {...contorno} />
      <ellipse cx="60" cy="90" rx="20" ry="16" fill={p.claro} />
      <path d="M52 86 l4 4 l4 -4 l4 4 l4 -4 M50 95 l4 4 l4 -4 l4 4 l4 -4 l4 4" fill="none" stroke={p.escuro} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="56" r="15" fill={p.claro} />
      <circle cx="74" cy="56" r="15" fill={p.claro} />
      <Olho x={46} y={56} r={10.5} />
      <Olho x={74} y={56} r={10.5} />
      <circle cx="46" cy="56" r="14" fill="none" stroke={L} strokeWidth="3" />
      <circle cx="74" cy="56" r="14" fill="none" stroke={L} strokeWidth="3" />
      <path d="M58 54 Q60 51 62 54" fill="none" stroke={L} strokeWidth="3" />
      <path d="M55 68 L65 68 L60 78 Z" fill="#ffb347" {...contorno} strokeWidth="2.5" />
      <Brilho x={44} y={34} />
    </>
  ),

  lobo: (p) => (
    <>
      <path d="M30 112 C30 96 90 96 90 112 Z" fill={p.escuro} {...contorno} />
      <path d="M60 98 C36 98 26 80 28 62 L22 24 L46 42 C54 38 66 38 74 42 L98 24 L92 62 C94 80 84 98 60 98 Z" fill={p.C} {...contorno} />
      <path d="M28 66 L14 72 L30 80 Z M92 66 L106 72 L90 80 Z" fill={p.C} {...contorno} />
      <path d="M30 34 L42 44 L33 52 Z M90 34 L78 44 L87 52 Z" fill="#ff8fb1" />
      <ellipse cx="60" cy="80" rx="17" ry="13" fill={p.claro} {...contorno} strokeWidth="2.5" />
      <ellipse cx="60" cy="72" rx="6.5" ry="4.5" fill={L} />
      <circle cx="58" cy="71" r="1.4" fill="#fff" />
      <path d="M52 84 Q60 90 68 84" fill="none" {...contorno} strokeWidth="2.5" />
      <Presa x={54} y={85} />
      <Presa x={66} y={85} />
      <Olho x={45} y={58} r={7.5} />
      <Olho x={75} y={58} r={7.5} />
      <Bravo x={45} y={58} lado="e" />
      <Bravo x={75} y={58} lado="d" />
      <Brilho x={40} y={46} rx={6} ry={3.5} />
    </>
  ),

  inseto: (p) => {
    const lado = (
      <>
        <Balanca cx={34} cy={72} de={-6} ate={6} dur=".5s"><Membro d="M34 66 L16 58" cor={L} w={3} /></Balanca>
        <Balanca cx={32} cy={80} de={6} ate={-6} dur=".5s"><Membro d="M32 80 L12 82" cor={L} w={3} /></Balanca>
        <Balanca cx={34} cy={92} de={-6} ate={6} dur=".5s"><Membro d="M34 92 L18 106" cor={L} w={3} /></Balanca>
        <Balanca cx={52} cy={40} de={-8} ate={8} dur="1.3s">
          <path d="M53 40 Q46 22 36 22" fill="none" stroke={L} strokeWidth="3" strokeLinecap="round" />
          <circle cx="35" cy="22" r="4.5" fill={p.claro} {...contorno} strokeWidth="2.5" />
        </Balanca>
      </>
    );
    return (
      <>
        {lado}
        <Espelho>{lado}</Espelho>
        <ellipse cx="60" cy="80" rx="31" ry="28" fill={p.C} {...contorno} />
        <path d="M60 56 L60 107" stroke={L} strokeWidth="3" />
        <circle cx="46" cy="74" r="5" fill={p.escuro} /><circle cx="74" cy="74" r="5" fill={p.escuro} />
        <circle cx="48" cy="92" r="4" fill={p.escuro} /><circle cx="72" cy="92" r="4" fill={p.escuro} />
        <ellipse cx="60" cy="50" rx="21" ry="15" fill={p.escuro} {...contorno} />
        <Olho x={52} y={48} r={7} />
        <Olho x={68} y={48} r={7} />
        <path d="M54 58 Q60 62 66 58" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <Brilho x={42} y={66} />
      </>
    );
  },

  virus: (p) => {
    const pontas = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      const x1 = 60 + Math.cos(a) * 28, y1 = 64 + Math.sin(a) * 28;
      const x2 = 60 + Math.cos(a) * 42, y2 = 64 + Math.sin(a) * 42;
      return (
        <g key={i}>
          <Membro d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} cor={p.escuro} w={3.5} />
          <circle cx={x2} cy={y2} r="5" fill={p.claro} {...contorno} strokeWidth="2.5" />
        </g>
      );
    });
    return (
      <>
        <g>
          {pontas}
          <animateTransform attributeName="transform" type="rotate" values="0 60 64;360 60 64" dur="14s" repeatCount="indefinite" />
        </g>
        <circle cx="60" cy="64" r="30" fill={p.C} {...contorno} />
        <circle cx="44" cy="76" r="4" fill={p.escuro} opacity=".5" /><circle cx="78" cy="50" r="3" fill={p.escuro} opacity=".5" />
        <Olho x={50} y={60} r={7.5} olhar={1} />
        <Olho x={70} y={60} r={7.5} olhar={-1} />
        <ellipse cx="60" cy="76" rx="5" ry="6" fill="#5a1d3a" stroke={L} strokeWidth="2.5" />
        <path d="M62 70 q3 4 0 6 q-3 -2 0 -6" fill="#9fd8ff" stroke={L} strokeWidth="1.5">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.2;.8;1" dur="3s" repeatCount="indefinite" />
        </path>
        <Bochechas x1={42} x2={78} y={70} />
        <Brilho x={46} y={46} />
      </>
    );
  },

  robo: (p) => (
    <>
      <rect x="40" y="104" width="14" height="8" rx="2" fill={p.escuro} {...contorno} />
      <rect x="66" y="104" width="14" height="8" rx="2" fill={p.escuro} {...contorno} />
      <Membro d="M40 82 L24 98" cor={p.escuro} w={6} />
      <Balanca cx={80} cy={82} de={-20} ate={10} dur="1s">
        <Membro d="M80 82 L96 66" cor={p.escuro} w={6} />
        <circle cx="98" cy="64" r="5" fill={p.claro} {...contorno} strokeWidth="2.5" />
      </Balanca>
      <rect x="38" y="74" width="44" height="32" rx="7" fill={p.C} {...contorno} />
      <rect x="48" y="81" width="24" height="14" rx="3" fill="#10202e" stroke={L} strokeWidth="2" />
      <circle cx="54" cy="88" r="2.5" fill="#ff5a5a" /><circle cx="60" cy="88" r="2.5" fill="#ffe26b" /><circle cx="66" cy="88" r="2.5" fill="#7cf7ff" />
      <line x1="60" y1="30" x2="60" y2="16" stroke={L} strokeWidth="3" />
      <circle cx="60" cy="13" r="5" fill="#ff5a5a" {...contorno} strokeWidth="2.5">
        <animate attributeName="fill" values="#ff5a5a;#ffe0e0;#ff5a5a" dur="1s" repeatCount="indefinite" />
      </circle>
      <rect x="24" y="44" width="8" height="16" rx="2" fill={p.escuro} {...contorno} />
      <rect x="88" y="44" width="8" height="16" rx="2" fill={p.escuro} {...contorno} />
      <rect x="30" y="30" width="60" height="44" rx="11" fill={p.C} {...contorno} />
      <rect x="37" y="37" width="46" height="29" rx="6" fill="#10202e" stroke={L} strokeWidth="2.5" />
      <path d="M44 45 l8 8 M52 45 l-8 8" stroke="#7cf7ff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="72" cy="49" r="4.5" fill="#7cf7ff">
        <animate attributeName="r" values="4.5;4.5;1;4.5" keyTimes="0;.9;.95;1" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M46 60 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3" fill="none" stroke="#7cf7ff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M94 26 l-5 6 h5 l-5 6" fill="none" stroke="#ffe26b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0;1;0;0" keyTimes="0;.1;.2;1" dur="1.8s" repeatCount="indefinite" />
      </path>
      <Brilho x={40} y={36} rx={6} ry={3} rot={0} />
    </>
  ),

  cobra: (p) => (
    <>
      <ellipse cx="60" cy="101" rx="38" ry="10" fill={p.escuro} {...contorno} />
      <ellipse cx="60" cy="89" rx="30" ry="9" fill={p.C} {...contorno} />
      <ellipse cx="60" cy="78" rx="21" ry="8" fill={p.escuro} {...contorno} />
      <Balanca cx={64} cy={76} de={-5} ate={5} dur="1.8s">
        <Membro d="M66 76 C78 66 70 58 58 54" cor={p.cor} w={12} />
        
        <ellipse cx="56" cy="40" rx="21" ry="15" fill={p.C} {...contorno} />
        <Olho x={48} y={38} r={6.5} olhar={1.5} />
        <Olho x={64} y={38} r={6.5} olhar={1.5} />
        <path d="M40 34 Q48 28 56 34 M56 34 Q64 28 72 34" fill="none" stroke={L} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M56 50 L56 58 M56 58 l-3.5 4.5 M56 58 l3.5 4.5" fill="none" stroke="#e0405a" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="opacity" values="0;0;1;0;1;0" keyTimes="0;.5;.6;.7;.8;.9" dur="2.2s" repeatCount="indefinite" />
        </path>
        <path d="M46 47 Q56 53 66 47" fill="none" {...contorno} strokeWidth="2.5" />
        <Brilho x={44} y={33} rx={5} ry={3} />
      </Balanca>
    </>
  ),

  ovni: (p) => (
    <>
      <defs>
        <linearGradient id={p.id + "-raio"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3a6" stopOpacity=".8" />
          <stop offset="1" stopColor="#fff3a6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M44 72 L76 72 L98 116 L22 116 Z" fill={`url(#${p.id}-raio)`}>
        <animate attributeName="opacity" values=".4;1;.4" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M36 58 A24 24 0 0 1 84 58 Z" fill="#bfe8ff" fillOpacity=".55" {...contorno} />
      <circle cx="60" cy="46" r="10" fill="#9be15d" {...contorno} strokeWidth="2.5" />
      <ellipse cx="56" cy="46" rx="2.6" ry="3.6" fill={L} /><ellipse cx="64" cy="46" rx="2.6" ry="3.6" fill={L} />
      <path d="M57 51 Q60 53 63 51" fill="none" stroke={L} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M46 40 Q50 34 56 36" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      <ellipse cx="60" cy="67" rx="30" ry="8" fill={p.escuro} {...contorno} />
      <ellipse cx="60" cy="61" rx="46" ry="13" fill={p.C} {...contorno} />
      {[22, 41, 60, 79, 98].map((x, i) => (
        <circle key={x} cx={x} cy={x === 60 ? 66 : x === 22 || x === 98 ? 60 : 64.5} r="3.5" fill="#ffe26b" stroke={L} strokeWidth="1.5">
          <animate attributeName="fill" values="#ffe26b;#fff;#ff7b6b;#ffe26b" dur="1.2s" begin={i * 0.24 + "s"} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  ),
};

// tamanho em "em": acompanha o font-size do lugar onde o monstro aparece.
export default function Monstro({ tipo = "geleca", cor = "#b07cff", nome = "", variante, tamanho = "1.45em", className = "" }) {
  const id = "mo" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = { id, cor, C: `url(#${id})`, claro: tom(cor, 0.45), escuro: tom(cor, -0.32) };
  const molde = MOLDES[tipo] || MOLDES.geleca;
  return (
    <svg className={"monstro-svg " + className} viewBox="0 0 120 120" width={tamanho} height={tamanho} role="img" aria-label={nome || tipo}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="78%">
          <stop offset="0" stopColor={tom(cor, 0.5)} />
          <stop offset=".5" stopColor={cor} />
          <stop offset="1" stopColor={tom(cor, -0.38)} />
        </radialGradient>
      </defs>
      {molde(p, variante)}
    </svg>
  );
}
