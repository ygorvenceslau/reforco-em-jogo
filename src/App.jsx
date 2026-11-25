// Rotas do site: cada endereço mostra uma tela (pasta pages/).
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import BotaoTema from "./components/BotaoTema.jsx";
import RequireMestre from "./components/RequireMestre.jsx";
import Inicio from "./pages/Inicio.jsx";
import MestreEntrar from "./pages/MestreEntrar.jsx";
import MestreCadastro from "./pages/MestreCadastro.jsx";
import EsqueciSenha from "./pages/EsqueciSenha.jsx";
import NovaSenha from "./pages/NovaSenha.jsx";
import Painel from "./pages/Painel.jsx";
import Relatorio from "./pages/Relatorio.jsx";
import AprendizEntrar from "./pages/AprendizEntrar.jsx";
import Diagnostico from "./pages/Diagnostico.jsx";
import Privacidade from "./pages/Privacidade.jsx";
import NaoEncontrada from "./pages/NaoEncontrada.jsx";
import Masmorra from "./masmorra/Masmorra.jsx";
import ModoTurma from "./masmorra/ModoTurma.jsx";
import { fonteLocal } from "./masmorra/fontes.js";
import JogarMasmorra from "./pages/JogarMasmorra.jsx";
import JogarTurma from "./pages/JogarTurma.jsx";
import Lousa from "./pages/Lousa.jsx";
import Questoes from "./pages/Questoes.jsx";

// Telas do jogo já são escuras (tema da masmorra): nelas o botão de tema não aparece.
const TELAS_DO_JOGO = [/^\/$/, /^\/masmorra/, /^\/jogar\/(masmorra|turma)/, /\/lousa$/];

export default function App() {
  const { pathname } = useLocation();
  const telaDoJogo = TELAS_DO_JOGO.some((r) => r.test(pathname));
  return (
    <>
    {!telaDoJogo && <BotaoTema />}
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/mestre/entrar" element={<MestreEntrar />} />
      <Route path="/mestre/cadastro" element={<MestreCadastro />} />
      <Route path="/mestre/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/mestre/nova-senha" element={<NovaSenha />} />
      <Route path="/mestre" element={<RequireMestre>{(s) => <Painel sessao={s} />}</RequireMestre>} />
      <Route path="/mestre/sessao/:id" element={<RequireMestre>{() => <Relatorio />}</RequireMestre>} />
      <Route path="/mestre/sessao/:id/lousa" element={<RequireMestre>{() => <Lousa />}</RequireMestre>} />
      <Route path="/mestre/questoes" element={<RequireMestre>{(s) => <Questoes sessao={s} />}</RequireMestre>} />
      <Route path="/jogar" element={<AprendizEntrar />} />
      <Route path="/jogar/masmorra" element={<JogarMasmorra />} />
      <Route path="/jogar/turma" element={<JogarTurma />} />
      <Route path="/jogar/quiz" element={<Navigate to="/jogar/masmorra" replace />} />
      <Route path="/masmorra" element={<Masmorra fonte={fonteLocal} prototipo />} />
      <Route path="/masmorra/turma" element={<ModoTurma />} />
      <Route path="/diagnostico" element={<Diagnostico />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
    </>
  );
}
