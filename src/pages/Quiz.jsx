// Quiz do aprendiz. Base que vai virar a batalha da masmorra.
// A resposta certa nunca chega ao celular: quem corrige é o banco (função "responder").
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { aprendizAtual } from "../lib/util.js";

const LETRAS = ["A", "B", "C", "D"];

export default function Quiz() {
  const [aprendiz] = useState(aprendizAtual);
  const [questoes, setQuestoes] = useState(null);
  const [atual, setAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [resposta, setResposta] = useState(null); // { letra, correta }
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [fim, setFim] = useState(false);

  // Busca até 8 questões sorteadas, sem a coluna "correta".
  useEffect(() => {
    if (!aprendiz) return;
    sb.rpc("buscar_questoes", { p_participante: aprendiz.participante_id }).then(({ data, error }) => {
      if (error) return setErro("Não deu para carregar as questões. Recarregue a página.");
      setQuestoes(data || []);
    });
  }, []);

  if (!aprendiz) return <Navigate to="/jogar" replace />;

  async function responder(letra) {
    if (resposta || enviando) return; // uma resposta por questão
    setEnviando(true);
    const { data: correta, error } = await sb.rpc("responder", {
      p_participante: aprendiz.participante_id,
      p_questao: questoes[atual].id,
      p_escolhida: letra,
    });
    setEnviando(false);
    if (error) {
      return setErro((error.message || "").includes("encerrada")
        ? "O Mestre encerrou esta sala."
        : "Não deu para enviar a resposta. Tente de novo.");
    }
    setErro("");
    if (correta) setAcertos((n) => n + 1);
    setResposta({ letra, correta });
  }

  function proxima() {
    setResposta(null);
    if (atual + 1 < questoes.length) setAtual(atual + 1);
    else {
      setFim(true);
      sessionStorage.removeItem("participante");
    }
  }

  if (fim) {
    const p = acertos / questoes.length;
    return (
      <main>
        <h1>Fim da aventura!</h1>
        <p className="card" style={{ fontSize: 22, fontWeight: 800 }}>Você acertou {acertos} de {questoes.length}.</p>
        <p className="muted" style={{ fontSize: 18 }}>
          {p === 1 ? "Perfeito! Você acertou tudo!" : p >= 0.6 ? "Muito bem! Continue assim." : "Bom esforço! Vamos treinar mais um pouco."}
        </p>
        <Link className="btn outline" to="/jogar">Entrar em outra sala</Link>
      </main>
    );
  }

  if (questoes === null) return <main><p className="card">{erro || "Carregando..."}</p></main>;
  if (questoes.length === 0) return <main><p className="card">Não há questões nesta sala. Avise o Mestre.</p></main>;

  const q = questoes[atual];
  return (
    <main>
      <div style={{ fontWeight: 800 }}>Questão {atual + 1} de {questoes.length}</div>
      <div className="progresso"><div style={{ width: (atual / questoes.length) * 100 + "%" }} /></div>
      <p className="card" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.4 }}>{q.enunciado}</p>
      <div>
        {LETRAS.map((letra) => {
          let classe = "opcao";
          if (resposta && resposta.letra === letra) classe += resposta.correta ? " certa" : " errada";
          return (
            <button key={letra} type="button" className={classe} onClick={() => responder(letra)} disabled={enviando}>
              {q["alt_" + letra.toLowerCase()]}
            </button>
          );
        })}
      </div>
      {erro && <p className="erro" role="alert">{erro}</p>}
      {resposta && (
        <button className="btn" type="button" onClick={proxima}>
          {atual + 1 < questoes.length ? "Próxima questão" : "Ver meu resultado"}
        </button>
      )}
    </main>
  );
}
