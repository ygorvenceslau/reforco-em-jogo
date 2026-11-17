// Regras da masmorra. Tudo o que acontece no jogo passa pela função "regras":
// ela recebe o estado atual e uma ação (responder, usar poção...) e devolve o novo estado.
import { CLASSES, ONDAS, QUESTOES, RECOMPENSAS } from "./dados.js";

export function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Baralho de questões: ordem sorteada e alternativas também sorteadas.
export function novoBaralho() {
  return embaralhar(QUESTOES).map((q) => ({
    ...q,
    opcoes: embaralhar(q.opcoes.map((texto, i) => ({ texto, certa: i === q.correta }))),
  }));
}

export const estadoInicial = { fase: "escolha" };

function proximaQuestao(jogo) {
  const fim = jogo.indice + 1 >= jogo.baralho.length;
  return {
    ...jogo,
    baralho: fim ? novoBaralho() : jogo.baralho,
    indice: fim ? 0 : jogo.indice + 1,
    resposta: null,
    eliminadas: [],
  };
}

function sortearBau(heroi) {
  // Não oferece uma espada para quem já tem.
  const possiveis = RECOMPENSAS.filter((r) => !(r.id === "espada" && heroi.espada));
  return embaralhar(possiveis).slice(0, 3);
}

export function regras(jogo, acao) {
  switch (acao.tipo) {
    case "ESCOLHER_CLASSE": {
      const classe = CLASSES.find((c) => c.id === acao.classe);
      return {
        fase: "batalha",
        classe,
        heroi: { vida: classe.vida, vidaMax: classe.vida, espada: false, escudo: false, pocoes: { ...classe.pocoes } },
        onda: 0,
        monstroVida: ONDAS[0].vida,
        baralho: novoBaralho(),
        indice: 0,
        resposta: null,
        eliminadas: [],
        sequencia: 0,
        efeito: null,
        historico: [],
        respostasNaOnda: 0,
      };
    }

    case "RESPONDER": {
      if (jogo.resposta) return jogo; // só uma resposta por questão
      const questao = jogo.baralho[jogo.indice];
      const acertou = questao.opcoes[acao.opcao].certa;
      const historico = [...jogo.historico, { assunto: questao.assunto, acertou }];
      const respostasNaOnda = jogo.respostasNaOnda + 1;
      const id = (jogo.efeito?.id || 0) + 1;

      if (acertou) {
        // Acerto = ataque. A cada N acertos seguidos, golpe crítico (dano em dobro).
        const sequencia = jogo.sequencia + 1;
        const critico = sequencia % jogo.classe.criticoACada === 0;
        const dano = (1 + (jogo.heroi.espada ? 1 : 0)) * (critico ? 2 : 1);
        return {
          ...jogo,
          historico,
          respostasNaOnda,
          sequencia,
          monstroVida: Math.max(0, jogo.monstroVida - dano),
          resposta: { opcao: acao.opcao, acertou: true, dano, critico },
          efeito: { tipo: critico ? "critico" : "acerto", valor: dano, id },
        };
      }

      // Erro = o monstro ataca. O escudo, se estiver ativo, bloqueia o golpe.
      const bloqueou = jogo.heroi.escudo;
      return {
        ...jogo,
        historico,
        respostasNaOnda,
        sequencia: 0,
        heroi: { ...jogo.heroi, escudo: false, vida: bloqueou ? jogo.heroi.vida : jogo.heroi.vida - 1 },
        resposta: { opcao: acao.opcao, acertou: false, bloqueou },
        efeito: { tipo: bloqueou ? "bloqueio" : "erro", valor: 1, id },
      };
    }

    case "AVANCAR": {
      if (jogo.monstroVida <= 0) {
        const ultima = jogo.onda === ONDAS.length - 1;
        if (ultima) return { ...jogo, fase: "vitoria" };
        return { ...jogo, fase: "bau", bau: sortearBau(jogo.heroi) };
      }
      if (jogo.heroi.vida <= 0) return { ...jogo, fase: "derrota" };
      return proximaQuestao(jogo);
    }

    case "USAR_POCAO": {
      const { pocoes } = jogo.heroi;
      if (!pocoes[acao.pocao] || jogo.resposta) return jogo;
      const heroi = { ...jogo.heroi, pocoes: { ...pocoes, [acao.pocao]: pocoes[acao.pocao] - 1 } };

      if (acao.pocao === "cura") {
        if (jogo.heroi.vida >= jogo.heroi.vidaMax) return jogo;
        heroi.vida = Math.min(heroi.vidaMax, heroi.vida + 2);
      }
      if (acao.pocao === "escudo") {
        if (jogo.heroi.escudo) return jogo;
        heroi.escudo = true;
      }
      if (acao.pocao === "visao") {
        if (jogo.eliminadas.length) return jogo;
        // Elimina 2 alternativas erradas, sorteadas.
        const erradas = jogo.baralho[jogo.indice].opcoes
          .map((o, i) => (o.certa ? null : i))
          .filter((i) => i !== null);
        return { ...jogo, heroi, eliminadas: embaralhar(erradas).slice(0, 2) };
      }
      return { ...jogo, heroi };
    }

    case "ESCOLHER_RECOMPENSA": {
      const r = acao.recompensa;
      const heroi = { ...jogo.heroi, pocoes: { ...jogo.heroi.pocoes } };
      if (r.tipo === "pocao") heroi.pocoes[r.id] = (heroi.pocoes[r.id] || 0) + 1;
      if (r.id === "espada") heroi.espada = true;
      if (r.id === "coracao") {
        heroi.vidaMax += 1;
        heroi.vida = Math.min(heroi.vidaMax, heroi.vida + 1);
      }
      const onda = jogo.onda + 1;
      return proximaQuestao({ ...jogo, fase: "batalha", heroi, onda, monstroVida: ONDAS[onda].vida, bau: null, efeito: null, respostasNaOnda: 0 });
    }

    case "TENTAR_DE_NOVO":
      // Desmaiou: volta com a vida cheia e o monstro da onda também se recupera.
      return proximaQuestao({
        ...jogo,
        fase: "batalha",
        heroi: { ...jogo.heroi, vida: jogo.heroi.vidaMax },
        monstroVida: ONDAS[jogo.onda].vida,
        sequencia: 0,
        efeito: null,
        respostasNaOnda: 0,
      });

    case "REINICIAR":
      return estadoInicial;

    default:
      return jogo;
  }
}

// Resumo por assunto para o fim da aventura (o mesmo cálculo do relatório do Mestre).
export function resumoPorAssunto(historico) {
  const mapa = {};
  for (const h of historico) {
    mapa[h.assunto] = mapa[h.assunto] || { assunto: h.assunto, acertos: 0, total: 0 };
    mapa[h.assunto].total += 1;
    if (h.acertou) mapa[h.assunto].acertos += 1;
  }
  return Object.values(mapa)
    .map((a) => ({ ...a, percentual: Math.round((100 * a.acertos) / a.total) }))
    .sort((a, b) => a.percentual - b.percentual);
}
