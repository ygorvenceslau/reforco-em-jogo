// Página de entrada do aprendiz (/jogar), com o tema da masmorra.
// O link e o QR Code da sala já trazem o código: /jogar?codigo=AB12CD
import { Link, useSearchParams } from "react-router-dom";
import FormAprendiz from "../components/FormAprendiz.jsx";
import "../masmorra/masmorra.css";

export default function AprendizEntrar() {
  const [params] = useSearchParams();
  return (
    <div className="masmorra">
      <div className="tela">
        <p className="marca-masmorra">Quizzes &amp; Masmorras</p>
        <div className="icone-enorme centro" aria-hidden="true">🏰</div>
        <h1 className="titulo-masmorra centro">Entre na masmorra</h1>
        <p className="texto-claro centro">Digite o código que o Mestre mostrou e o seu primeiro nome ou apelido.</p>
        <div className="pergaminho">
          <FormAprendiz codigoInicial={params.get("codigo") || ""} botao="⚔️ Entrar na masmorra" />
        </div>
        <p className="texto-claro centro mini-claro">
          Sem e-mail e sem senha. Seu nome aparece só para o Mestre.{" "}
          <Link className="link-claro" to="/privacidade">Saiba mais</Link>
        </p>
        <Link className="link-claro" to="/">‹ Voltar ao início</Link>
      </div>
    </div>
  );
}
