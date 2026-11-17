// Cartão da questão com as 4 alternativas. Usado na masmorra solo e no modo turma.
// questao.opcoes = [{ letra, texto }] (já embaralhadas). A letra mostrada na tela (A, B, C, D)
// é só a posição; a letra de verdade (op.letra) é a que vai para o servidor.
export default function Questao({ questao, resposta, eliminadas = [], desativada = false, onResponder }) {
  return (
    <div className="pergaminho">
      <span className="tag-assunto">{questao.assunto}</span>
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
