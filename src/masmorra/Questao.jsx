// Cartão da questão com as 4 alternativas. Usado na masmorra solo e no modo turma.
import { useEffect } from "react";

const temVoz = typeof window !== "undefined" && "speechSynthesis" in window;

// Lê a questão em voz alta com a voz em português do próprio aparelho.
// Ajuda quem ainda lê com dificuldade, que é justamente o público do reforço.
function lerEmVozAlta(questao) {
  const voz = window.speechSynthesis;
  voz.cancel();
  const limpar = (t) => t.replace(/_{2,}/g, " ... ").replace(/["“”]/g, "");
  const texto = limpar(questao.enunciado) + ". " +
    questao.opcoes.map((o, i) => "ABCD"[i] + ": " + limpar(o.texto)).join(". ");
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  fala.rate = 0.95;
  const pt = voz.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith("pt"));
  if (pt) fala.voice = pt;
  voz.speak(fala);
}

// questao.opcoes = [{ letra, texto }] (já embaralhadas). A letra mostrada na tela (A, B, C, D)
// é só a posição; a letra de verdade (op.letra) é a que vai para o servidor.
export default function Questao({ questao, resposta, eliminadas = [], desativada = false, revisao = false, onResponder }) {
  // Para de falar quando a questão muda ou a tela fecha.
  useEffect(() => () => {
    if (temVoz) window.speechSynthesis.cancel();
  }, [questao.id, questao.enunciado]);

  return (
    <div className="pergaminho">
      <div className="topo-questao">
        <span className="tags-questao">
          <span className="tag-assunto">{questao.assunto}</span>
          {revisao && <span className="tag-revisao" title="Esta questão já apareceu: é uma chance de acertar agora">🔁 Revisão</span>}
        </span>
        {temVoz && (
          <button type="button" className="botao-ouvir" onClick={() => lerEmVozAlta(questao)} aria-label="Ouvir a questão">
            🔈 Ouvir
          </button>
        )}
      </div>
      <p className="enunciado">{questao.enunciado}</p>
      <div className="alternativas">
        {questao.opcoes.map((op, i) => {
          const eliminada = eliminadas.includes(op.letra);
          let classe = "alternativa";
          if (resposta) {
            if (op.letra === resposta.certa) classe += " certa";
            else if (resposta.opcao === i) classe += " errada";
            else classe += " apagada";
          } else if (eliminada) classe += " eliminada";
          return (
            <button
              key={op.letra}
              type="button"
              className={classe}
              disabled={!!resposta || eliminada || desativada}
              onClick={() => onResponder(i)}
            >
              <span className="letra">{"ABCD"[i]}</span> {op.texto}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Barra de vida do monstro.
export function BarraVida({ atual, max, grande = false }) {
  return (
    <div className={"barra-vida" + (grande ? " grande" : "")} aria-label={`Vida do monstro: ${atual} de ${max}`}>
      <div style={{ width: (max ? (atual / max) * 100 : 0) + "%" }} />
      <span>{atual} / {max}</span>
    </div>
  );
}
