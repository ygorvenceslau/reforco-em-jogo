import { Link } from "react-router-dom";

export default function Inicio() {
  return (
    <main>
      <h1>Quizzes &amp; Masmorras</h1>
      <p className="muted">Aprenda enfrentando monstros com a sua turma ou com os amigos.</p>

      <Link className="btn" to="/mestre">Sou Mestre</Link>
      <p className="muted dica">Crio salas para a turma ou para os amigos.</p>

      <Link className="btn outline" to="/jogar">Sou Aprendiz</Link>
      <p className="muted dica">Tenho um código e quero jogar.</p>

      <Link className="btn" style={{ background: "#2c2640" }} to="/masmorra">⚔️ Experimentar a masmorra (demonstração)</Link>
      <p className="muted dica">Jogue agora, sem conta e sem código.</p>

      <p className="muted" style={{ textAlign: "center" }}>
        <Link to="/privacidade">Privacidade</Link>
      </p>
    </main>
  );
}
