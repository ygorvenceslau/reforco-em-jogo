// Página de erro 404, com o tema da masmorra.
import { Link } from "react-router-dom";
import "../masmorra/masmorra.css";

export default function NaoEncontrada() {
  return (
    <div className="masmorra">
      <div className="tela centro">
        <div className="icone-enorme" aria-hidden="true">👻</div>
        <h1 className="titulo-masmorra">Esta sala da masmorra não existe</h1>
        <p className="texto-claro">Confira o endereço. Se você tem um código de sala, entre por aqui:</p>
        <Link className="botao-ouro" to="/jogar">⚔️ Entrar numa sala</Link>
        <Link className="link-claro" to="/">‹ Ir para o início</Link>
      </div>
    </div>
  );
}
