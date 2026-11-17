// Cartão da questão com as 4 alternativas. Usado na masmorra solo e no modo turma.
export default function Questao({ questao, resposta, eliminadas = [], onResponder }) {
  return (
    <div className="pergaminho">
      <span className="tag-assunto">{questao.assunto}</span>
      <p className="enunciado">{questao.enunciado}</p>
      <div className="alternativas">
        {questao.opcoes.map((op, i) => {
          let classe = "alternativa";
          if (resposta) {
            if (op.certa) classe += " certa";
            else if (resposta.opcao === i) classe += " errada";
            else classe += " apagada";
          } else if (eliminadas.includes(i)) classe += " eliminada";
          return (
            <button
              key={i}
              type="button"
              className={classe}
              disabled={!!resposta || eliminadas.includes(i)}
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
