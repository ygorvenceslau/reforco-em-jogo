// Rotas do site: cada endereço mostra uma tela (pasta pages/).
import { Routes, Route } from "react-router-dom";
import RequireMestre from "./components/RequireMestre.jsx";
import Inicio from "./pages/Inicio.jsx";
import MestreEntrar from "./pages/MestreEntrar.jsx";
import MestreCadastro from "./pages/MestreCadastro.jsx";
import Painel from "./pages/Painel.jsx";
import Relatorio from "./pages/Relatorio.jsx";
import AprendizEntrar from "./pages/AprendizEntrar.jsx";
import Quiz from "./pages/Quiz.jsx";
import Diagnostico from "./pages/Diagnostico.jsx";
import Privacidade from "./pages/Privacidade.jsx";
import NaoEncontrada from "./pages/NaoEncontrada.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/mestre/entrar" element={<MestreEntrar />} />
      <Route path="/mestre/cadastro" element={<MestreCadastro />} />
      <Route path="/mestre" element={<RequireMestre>{(s) => <Painel sessao={s} />}</RequireMestre>} />
      <Route path="/mestre/sessao/:id" element={<RequireMestre>{() => <Relatorio />}</RequireMestre>} />
      <Route path="/jogar" element={<AprendizEntrar />} />
      <Route path="/jogar/quiz" element={<Quiz />} />
      <Route path="/diagnostico" element={<Diagnostico />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  );
}
