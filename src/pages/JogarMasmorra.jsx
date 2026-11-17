// Masmorra solo dentro da sala do Mestre: questões do banco, correção no servidor
// e respostas indo direto para o relatório.
import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import Masmorra from "../masmorra/Masmorra.jsx";
import { fonteSala } from "../masmorra/fontes.js";
import { aprendizAtual } from "../lib/util.js";

export default function JogarMasmorra() {
  const aprendiz = aprendizAtual();
  // useMemo: a mesma fonte durante toda a partida (senão a masmorra recarregaria as questões).
  const fonte = useMemo(() => (aprendiz ? fonteSala(aprendiz.participante_id) : null), [aprendiz?.participante_id]);
  if (!aprendiz) return <Navigate to="/jogar" replace />;
  if (aprendiz.modo === "turma") return <Navigate to="/jogar/turma" replace />;
  return <Masmorra fonte={fonte} disciplina={aprendiz.disciplina} />;
}
