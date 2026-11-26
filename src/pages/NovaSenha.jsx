// Tela aberta pelo link do e-mail de recuperação. O Supabase lê o link sozinho
// (o código vem no endereço) e libera a troca de senha para esta conta.
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { problemaNaSenha, REGRA_SENHA } from "../lib/util.js";

export default function NovaSenha() {
  const navegar = useNavigate();
  const [estado, setEstado] = useState("verificando"); // verificando | pronto | invalido | trocada
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    // Link vencido ou já usado: o Supabase devolve o erro no próprio endereço.
    if (/error_code=|error=/.test(location.hash + location.search)) {
      setEstado("invalido");
      return;
    }
    const { data } = sb.auth.onAuthStateChange((evento, sessao) => {
      if (evento === "PASSWORD_RECOVERY" || sessao) setEstado("pronto");
    });
    // Se em alguns segundos não houver sessão, o link não serviu.
    const t = setTimeout(async () => {
      const { data: s } = await sb.auth.getSession();
      setEstado((atual) => (atual === "verificando" ? (s.session ? "pronto" : "invalido") : atual));
    }, 3000);
    return () => {
      data.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    const problema = problemaNaSenha(senha);
    if (problema) return setErro(problema);
    if (senha !== senha2) return setErro("As duas senhas não são iguais.");
    setSalvando(true);
    const { error } = await sb.auth.updateUser({ password: senha });
    setSalvando(false);
    if (error) {
      if (/different|same/i.test(error.message || "")) return setErro("A senha nova precisa ser diferente da antiga.");
      if (/password/i.test(error.message || "")) return setErro("Senha fraca. " + REGRA_SENHA);
      return setErro("Não deu para trocar a senha. Peça um link novo e tente de novo.");
    }
    setEstado("trocada");
  }

  return (
    <main>
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Criar senha nova</h1>
      {estado === "verificando" && <p className="card muted">Conferindo o link...</p>}
      {estado === "invalido" && (
        <div className="card">
          <p className="erro">Este link venceu ou já foi usado.</p>
          <p className="muted dica">Os links de recuperação valem por pouco tempo e só uma vez. Peça um novo.</p>
          <Link className="btn" style={{ marginTop: 12 }} to="/mestre/esqueci-senha">Pedir um link novo</Link>
        </div>
      )}
      {estado === "pronto" && (
        <form className="card" onSubmit={salvar}>
          <label htmlFor="senha">Senha nova</label>
          <input id="senha" type="password" autoComplete="new-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
          <p className="muted dica" style={{ marginTop: -4, marginBottom: 6 }}>{REGRA_SENHA}</p>
          <label htmlFor="senha2">Repita a senha nova</label>
          <input id="senha2" type="password" autoComplete="new-password" required value={senha2} onChange={(e) => setSenha2(e.target.value)} />
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button className="btn" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar senha nova"}</button>
        </form>
      )}
      {estado === "trocada" && (
        <div className="card">
          <p className="aviso-ok">✔ Senha trocada! Você já está conectado.</p>
          <button className="btn" type="button" style={{ marginTop: 12 }} onClick={() => navegar("/mestre")}>Ir para o painel</button>
        </div>
      )}
    </main>
  );
}
