// "Esqueci minha senha": o Supabase envia um e-mail com um link para criar uma senha nova.
// O link volta para /mestre/nova-senha, neste mesmo site.
import { useState } from "react";
import { Link } from "react-router-dom";
import { sb } from "../lib/supabase.js";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: location.origin + "/mestre/nova-senha",
    });
    setEnviando(false);
    if (error && /rate limit|too many/i.test(error.message || "")) {
      return setErro("Muitos pedidos em pouco tempo. Espere alguns minutos e tente de novo.");
    }
    if (error && !/not found|user/i.test(error.message || "")) {
      return setErro("Não deu para enviar agora. Tente de novo em alguns minutos.");
    }
    // A mensagem é a mesma exista a conta ou não: assim ninguém descobre quais e-mails estão cadastrados.
    setEnviado(true);
  }

  return (
    <main>
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Esqueci minha senha</h1>
      {enviado ? (
        <div className="card">
          <p className="aviso-ok">📬 Pronto! Se houver uma conta com <b>{email.trim()}</b>, enviamos um link para criar uma senha nova.</p>
          <p className="muted dica">Abra o e-mail neste aparelho e clique no link. Se não aparecer em alguns minutos, olhe a caixa de spam.</p>
        </div>
      ) : (
        <form className="card" onSubmit={enviar}>
          <p className="muted" style={{ marginTop: 0 }}>Digite o e-mail da sua conta de Mestre. Vamos enviar um link para você criar uma senha nova.</p>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button className="btn" type="submit" disabled={enviando}>{enviando ? "Enviando..." : "Enviar link"}</button>
        </form>
      )}
      <Link className="btn outline" to="/mestre/entrar">Voltar para o login</Link>
    </main>
  );
}
