// Botão de modo claro/escuro das telas do Mestre.
// Começa seguindo o aparelho (preferência do sistema); a escolha fica guardada neste navegador.
import { useState } from "react";

function temaAtual() {
  return document.documentElement.dataset.tema === "escuro" ? "escuro" : "claro";
}

export default function BotaoTema() {
  const [tema, setTema] = useState(temaAtual);
  function trocar() {
    const novo = tema === "escuro" ? "claro" : "escuro";
    document.documentElement.dataset.tema = novo;
    try {
      localStorage.setItem("tema", novo);
    } catch {
      // Sem armazenamento (aba anônima): vale só nesta visita.
    }
    setTema(novo);
  }
  return (
    <button type="button" className="botao-tema" onClick={trocar}
      aria-label={tema === "escuro" ? "Usar modo claro" : "Usar modo escuro"} title={tema === "escuro" ? "Modo claro" : "Modo escuro"}>
      {tema === "escuro" ? "☀️" : "🌙"}
    </button>
  );
}
