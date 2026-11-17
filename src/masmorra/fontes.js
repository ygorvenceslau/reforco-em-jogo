// De onde vêm as questões e quem corrige.
// - fonteLocal: protótipo, sem login (questões de dados.js, correção no próprio navegador).
// - fonteSala: sala real do Mestre (questões do banco, correção no servidor, respostas no relatório).
// As duas têm as mesmas funções, então a masmorra funciona igual com qualquer uma.
import { sb } from "../lib/supabase.js";
import { QUESTOES } from "./dados.js";
import { embaralhar } from "./regras.js";

const LETRAS = ["A", "B", "C", "D"];

// Questões do protótipo no formato da masmorra (com a resposta guardada, só para o protótipo).
export function questoesLocais() {
  return QUESTOES.map((q, i) => ({
    id: i,
    assunto: q.assunto,
    enunciado: q.enunciado,
    opcoes: q.opcoes.map((texto, j) => ({ letra: LETRAS[j], texto })),
    _certa: LETRAS[q.correta],
    _explicacao: q.explicacao,
  }));
}

export const fonteLocal = {
  async carregar() {
    return questoesLocais();
  },
  async responder(questao, letra) {
    return { acertou: letra === questao._certa, certa: questao._certa, explicacao: questao._explicacao };
  },
  async eliminar(questao) {
    return embaralhar(LETRAS.filter((l) => l !== questao._certa)).slice(0, 2);
  },
};

// Converte a mensagem de erro do banco numa frase para o aprendiz.
function erroAmigavel(error) {
  const m = error?.message || "";
  if (m.includes("encerrada")) return new Error("O Mestre encerrou esta sala.");
  return new Error("Sem conexão com o servidor. Tente de novo.");
}

export function fonteSala(participanteId) {
  return {
    async carregar() {
      // Pede bastante questões para a aventura inteira (elas se repetem se acabarem).
      const { data, error } = await sb.rpc("buscar_questoes", { p_participante: participanteId, p_limite: 40 });
      if (error) throw erroAmigavel(error);
      return (data || []).map((q) => ({
        id: q.id,
        assunto: q.assunto,
        enunciado: q.enunciado,
        opcoes: LETRAS.map((l) => ({ letra: l, texto: q["alt_" + l.toLowerCase()] })),
      }));
    },
    async responder(questao, letra) {
      // O servidor corrige, grava a resposta e só então conta qual era a certa.
      const { data, error } = await sb.rpc("responder_questao", {
        p_participante: participanteId,
        p_questao: questao.id,
        p_escolhida: letra,
      });
      if (error) throw erroAmigavel(error);
      return { acertou: data.correta, certa: data.certa, explicacao: data.explicacao };
    },
    async eliminar(questao) {
      const { data, error } = await sb.rpc("eliminar_alternativas", { p_participante: participanteId, p_questao: questao.id });
      if (error) throw erroAmigavel(error);
      return data || [];
    },
  };
}
