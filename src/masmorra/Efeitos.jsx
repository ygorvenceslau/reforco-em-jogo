// Efeitos visuais dos golpes (só CSS, sem imagens).
// Cada classe ataca de um jeito: guerreiro corta, mago lança magia, arqueiro atira uma flecha.
// Quando o aprendiz erra, aparecem as garras do monstro. Estilo cartoon, sem sangue.

export function EfeitoAtaque({ classe, critico }) {
  if (classe === "mago") {
    return (
      <div className={"fx fx-magia" + (critico ? " critico" : "")} aria-hidden="true">
        <span className="anel" />
        <span className="anel segundo" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="faisca" style={{ "--ang": i * 60 + "deg" }}>✦</span>
        ))}
      </div>
    );
  }
  if (classe === "arqueiro") {
    return (
      <div className={"fx fx-flecha" + (critico ? " critico" : "")} aria-hidden="true">
        <span className="flecha" />
        {critico && <span className="flecha segunda" />}
        <span className="impacto" />
      </div>
    );
  }
  // Guerreiro (e golpes da turma): cortes de espada.
  return (
    <div className={"fx fx-corte" + (critico ? " critico" : "")} aria-hidden="true">
      <span />
      <span />
      {critico && <span />}
    </div>
  );
}

export function EfeitoEscudo() {
  return <div className="fx fx-escudo" aria-hidden="true">🛡️</div>;
}

// Garras do monstro na tela inteira quando o aprendiz erra.
export function EfeitoGarras() {
  return (
    <div className="fx-garras" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
