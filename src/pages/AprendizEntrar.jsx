// Página de entrada do aprendiz (/jogar). O link da sala já traz o código: /jogar?codigo=AB12CD
import { Link, useSearchParams } from "react-router-dom";
import FormAprendiz from "../components/FormAprendiz.jsx";

export default function AprendizEntrar() {
  const [params] = useSearchParams();
  return (
    <main>
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Vamos jogar?</h1>
      <p className="muted">Peça o código da sala para o Mestre.</p>
      <FormAprendiz codigoInicial={params.get("codigo") || ""} />
      <p className="card muted">Sem e-mail e sem senha. Seu nome aparece só para o Mestre. <Link to="/privacidade">Saiba mais</Link>.</p>
    </main>
  );
}
