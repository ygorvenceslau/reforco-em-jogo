// Rotas do site: cada endereço mostra uma tela (pasta pages/).
// Para o site abrir rápido no celular, só a tela inicial e a entrada do aprendiz vêm
// no arquivo principal. As outras telas são baixadas quando são abertas (lazy):
// o aprendiz não baixa as telas do Mestre, e o Mestre não baixa o jogo até precisar.
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import BotaoTema from "./components/BotaoTema.jsx";
import RequireMestre from "./components/RequireMestre.jsx";
import Inicio from "./pages/Inicio.jsx";
import AprendizEntrar from "./pages/AprendizEntrar.jsx";

// Baixa a tela quando ela é aberta. Se o site foi atualizado enquanto a página estava
// aberta, o arquivo antigo não existe mais: recarrega uma vez para pegar a versão nova.
function carregar(importar) {
  return lazy(() =>
    importar()
      .then((modulo) => {
        try { sessionStorage.removeItem("recarregou"); } catch { /* sem sessionStorage */ }
        return modulo;
      })
      .catch((erro) => {
        let jaRecarregou = true;
        try { jaRecarregou = sessionStorage.getItem("recarregou") === "1"; } catch { /* sem sessionStorage */ }
        if (jaRecarregou) throw erro;
        try { sessionStorage.setItem("recarregou", "1"); } catch { /* sem sessionStorage */ }
        window.location.reload();
        return new Promise(() => {}); // espera o recarregamento
      })
  );
}

const MestreEntrar = carregar(() => import("./pages/MestreEntrar.jsx"));
const MestreCadastro = carregar(() => import("./pages/MestreCadastro.jsx"));
const EsqueciSenha = carregar(() => import("./pages/EsqueciSenha.jsx"));
const NovaSenha = carregar(() => import("./pages/NovaSenha.jsx"));
const Painel = carregar(() => import("./pages/Painel.jsx"));
const Relatorio = carregar(() => import("./pages/Relatorio.jsx"));
const Lousa = carregar(() => import("./pages/Lousa.jsx"));
const Questoes = carregar(() => import("./pages/Questoes.jsx"));
const Diagnostico = carregar(() => import("./pages/Diagnostico.jsx"));
const Privacidade = carregar(() => import("./pages/Privacidade.jsx"));
const NaoEncontrada = carregar(() => import("./pages/NaoEncontrada.jsx"));
const JogarMasmorra = carregar(() => import("./pages/JogarMasmorra.jsx"));
const JogarTurma = carregar(() => import("./pages/JogarTurma.jsx"));
const Prototipo = carregar(() => import("./masmorra/Prototipo.jsx"));
const ModoTurma = carregar(() => import("./masmorra/ModoTurma.jsx"));

// O botão de tema (claro/escuro) aparece só nas telas do Mestre e nas informativas.
// As telas do jogo, a entrada do aprendiz e a lousa já têm o visual escuro da masmorra.
const TELAS_COM_TEMA = [/^\/mestre(?!.*\/lousa$)/, /^\/diagnostico/, /^\/privacidade/];

// Aparece por um instante enquanto a tela é baixada.
function Carregando({ escuro }) {
  return (
    <div className={"carregando" + (escuro ? " escuro" : "")} role="status">
      <span>⚔️</span> Carregando…
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const comTema = TELAS_COM_TEMA.some((r) => r.test(pathname));
  return (
    <>
    {comTema && <BotaoTema />}
    <Suspense fallback={<Carregando escuro={!comTema} />}>
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
      <Route path="/masmorra" element={<Prototipo />} />
      <Route path="/masmorra/turma" element={<ModoTurma />} />
      <Route path="/diagnostico" element={<Diagnostico />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
    </Suspense>
    </>
  );
}
