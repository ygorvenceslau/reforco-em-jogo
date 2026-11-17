// Login do Mestre. Quem confere a senha é o Supabase Auth, não o nosso código.
// Usado na tela inicial e na página /mestre/entrar.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";

export default function FormLoginMestre() {
  const navegar = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: senha });
    setEnviando(false);
    if (error) {
      const m = error.message || "";
      if (/invalid login credentials/i.test(m)) setErro("E-mail ou senha incorretos.");
      else if (/not confirmed/i.test(m)) setErro("Confirme seu e-mail pelo link que enviamos antes de entrar.");
      else setErro("Não conectou ao servidor. Tente de novo.");
      return;
    }
    navegar("/mestre");
  }

  return (
    <form onSubmit={entrar}>
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="senha">Senha</label>
      <input id="senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="btn" type="submit" disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</button>
    </form>
  );
}
