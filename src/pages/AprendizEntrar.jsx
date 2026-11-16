// O aprendiz entra na sala sem conta: só o código e um apelido.
// Ele não acessa tabelas; chama a função entrar_na_sessao do banco.
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { sb } from "../lib/supabase.js";

export default function AprendizEntrar() {
  const navegar = useNavigate();
  const [params] = useSearchParams();
  const [codigo, setCodigo] = useState(params.get("codigo") || "");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    if (!codigo.trim() || !nome.trim()) return setErro("Preencha o código e o seu nome.");
    setEnviando(true);
    const { data, error } = await sb.rpc("entrar_na_sessao", { p_codigo: codigo.trim(), p_nome: nome.trim() });
    setEnviando(false);
    if (error) {
      const m = error.message || "";
      if (m.includes("encerrada")) setErro("Essa sala já foi encerrada. Fale com o Mestre.");
      else if (m.includes("não encontrado")) setErro("Não encontramos essa sala. Confira o código com o Mestre.");
      else setErro("Sem conexão com o servidor. Tente de novo.");
      return;
    }
    sessionStorage.setItem("participante", JSON.stringify(data));
    navegar("/jogar/quiz");
  }

  return (
    <main>
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Vamos jogar?</h1>
      <p className="muted">Peça o código da sala para o Mestre.</p>
      <form onSubmit={entrar}>
        <label htmlFor="codigo">Código da sala</label>
        <input id="codigo" autoComplete="off" required value={codigo} onChange={(e) => setCodigo(e.target.value)}
          style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }} />
        <label htmlFor="nome">Seu primeiro nome ou apelido</label>
        <input id="nome" maxLength={30} autoComplete="off" required value={nome} onChange={(e) => setNome(e.target.value)} />
        <p className="card muted">Sem e-mail e sem senha. Seu nome aparece só para o Mestre. <Link to="/privacidade">Saiba mais</Link>.</p>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="btn" type="submit" disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</button>
      </form>
    </main>
  );
}
