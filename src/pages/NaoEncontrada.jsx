import { Link } from "react-router-dom";

export default function NaoEncontrada() {
  return (
    <main>
      <h1>Ops! Página não encontrada</h1>
      <p className="muted">Confira o endereço ou volte para o início.</p>
      <Link className="btn" to="/jogar">Entrar numa sala</Link>
      <Link className="btn outline" to="/">Ir para o início</Link>
    </main>
  );
}
