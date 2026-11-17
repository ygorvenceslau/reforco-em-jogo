// Página de login do Mestre (/mestre/entrar).
import { Link } from "react-router-dom";
import FormLoginMestre from "../components/FormLoginMestre.jsx";

export default function MestreEntrar() {
  return (
    <main>
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Entrar como Mestre</h1>
      <FormLoginMestre />
      <p className="muted">Ainda não tem conta? <Link to="/mestre/cadastro">Criar conta de Mestre</Link></p>
      <Link className="btn outline" to="/">Voltar</Link>
    </main>
  );
}
