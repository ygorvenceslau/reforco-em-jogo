// Cadastro de Mestre. O Supabase cria o login; um gatilho no banco (schema.sql)
// cria a linha na tabela "professor" com o nome e a escola informados aqui.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";

export default function MestreCadastro() {
  const navegar = useNavigate();
  const [form, setForm] = useState({ nome: "", escola: "", email: "", senha: "", senha2: "" });
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function cadastrar(e) {
    e.preventDefault();
    setErro("");
    if (form.senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    if (form.senha !== form.senha2) return setErro("As duas senhas não são iguais.");

    setEnviando(true);
    const { data, error } = await sb.auth.signUp({
      email: form.email.trim(),
      password: form.senha,
      // "data" vira o raw_user_meta_data no banco, que o gatilho usa para preencher a tabela professor.
      options: { data: { nome: form.nome.trim(), escola: form.escola.trim() } },
    });
    setEnviando(false);

    if (error) {
      const m = error.message || "";
      if (/already registered|already exists/i.test(m)) setErro("Já existe uma conta com esse e-mail.");
      else if (/rate limit/i.test(m)) setErro("Muitas tentativas. Espere alguns minutos e tente de novo.");
      else if (/password/i.test(m)) setErro("Senha fraca. Use pelo menos 6 caracteres.");
      else setErro("Não deu para criar a conta. Tente de novo.");
      return;
    }
    // Se o Supabase exige confirmação de e-mail, não vem sessão: avisa para checar a caixa de entrada.
    if (!data.session) {
      setAviso("Conta criada! Abra o e-mail que enviamos e clique no link para confirmar. Depois é só entrar.");
      return;
    }
    navegar("/mestre");
  }

  if (aviso) {
    return (
      <main>
        <h1>Quase lá!</h1>
        <p className="card">{aviso}</p>
        <Link className="btn" to="/mestre/entrar">Ir para o login</Link>
      </main>
    );
  }

  return (
    <main>
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Criar conta de Mestre</h1>
      <p className="muted">Para docentes, monitores ou quem quer reunir amigos para estudar.</p>
      <form onSubmit={cadastrar}>
        <label htmlFor="nome">Seu nome</label>
        <input id="nome" required maxLength={60} autoComplete="name" value={form.nome} onChange={mudar("nome")} />
        <label htmlFor="escola">Escola ou grupo (opcional)</label>
        <input id="escola" maxLength={80} value={form.escola} onChange={mudar("escola")} />
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" required autoComplete="email" value={form.email} onChange={mudar("email")} />
        <label htmlFor="senha">Senha (mínimo 6 caracteres)</label>
        <input id="senha" type="password" required autoComplete="new-password" value={form.senha} onChange={mudar("senha")} />
        <label htmlFor="senha2">Repita a senha</label>
        <input id="senha2" type="password" required autoComplete="new-password" value={form.senha2} onChange={mudar("senha2")} />
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="btn" type="submit" disabled={enviando}>{enviando ? "Criando..." : "Criar conta"}</button>
      </form>
      <p className="muted">Já tem conta? <Link to="/mestre/entrar">Entrar</Link></p>
    </main>
  );
}
