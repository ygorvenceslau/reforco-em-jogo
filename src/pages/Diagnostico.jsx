// Diagnóstico: confere, item por item, se o site está ligado ao Supabase e se o banco foi instalado.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js";

async function verificar() {
  const itens = [];
  const add = (ok, titulo, dica = "") => { itens.push({ ok, titulo, dica }); return ok; };

  const urlOk = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(SUPABASE_URL);
  const chaveOk = SUPABASE_ANON_KEY.length > 30 && !SUPABASE_ANON_KEY.includes("COLE-A-CHAVE");
  add(urlOk, "Project URL no config.js", urlOk ? SUPABASE_URL : "Cole a Project URL em src/config.js.");
  add(chaveOk, "Chave pública no config.js", chaveOk ? "" : "Cole a chave publishable/anon em src/config.js.");
  if (SUPABASE_ANON_KEY.startsWith("sb_secret_")) {
    add(false, "PERIGO: chave secreta no site", "Troque pela chave publishable e gere uma nova chave secreta no Supabase.");
    return itens;
  }
  if (!urlOk || !chaveOk) return itens;

  const hab = await sb.from("habilidade").select("id");
  if (hab.error) {
    const m = hab.error.message || "";
    let dica = "Erro: " + m;
    if (/does not exist|schema cache/i.test(m)) dica = "As tabelas não existem. Rode supabase/schema.sql.";
    else if (/fetch|network/i.test(m)) dica = "Sem conexão. Confira a internet e se o projeto não está pausado no Supabase.";
    add(false, "Conexão com o banco", dica);
    return itens;
  }
  add(true, "Conexão com o banco");
  add(hab.data.length > 0, "Assuntos e questões cadastrados",
    hab.data.length > 0 ? hab.data.length + " assunto(s)" : "Banco vazio. Rode supabase/seed.sql.");

  // O código ZZZZZZ não existe, então o esperado é a mensagem "não encontrado".
  const rpc = await sb.rpc("entrar_na_sessao", { p_codigo: "ZZZZZZ", p_nome: "teste" });
  const msg = rpc.error ? rpc.error.message || "" : "";
  add(msg.includes("não encontrado"), "Funções do aprendiz",
    msg.includes("não encontrado") ? "" : "Rode de novo supabase/schema.sql. " + msg);

  const { data } = await sb.auth.getSession();
  if (!data.session) {
    add(null, "Parte do Mestre não testada", "Entre como Mestre e volte a esta tela.");
    return itens;
  }
  add(true, "Login feito", data.session.user.email);
  const prof = await sb.from("professor").select("nome").eq("id", data.session.user.id).maybeSingle();
  if (!add(!!prof.data, "Conta de Mestre registrada",
    prof.data ? prof.data.nome : "Rode de novo supabase/schema.sql (ele cria o registro das contas existentes).")) return itens;
  const ses = await sb.from("sessao").select("id", { count: "exact", head: true });
  add(!ses.error, "Acesso às salas", ses.error ? "Erro: " + ses.error.message : (ses.count || 0) + " sala(s)");
  if (!ses.error) add(true, "Tudo certo! O site está pronto para usar.");
  return itens;
}

export default function Diagnostico() {
  const [itens, setItens] = useState(null);
  const rodar = () => { setItens(null); verificar().then(setItens); };
  useEffect(rodar, []);

  return (
    <main>
      <Link to="/">‹ Início</Link>
      <h1>Diagnóstico</h1>
      <p className="muted">Confere se o site está ligado ao Supabase e se o banco foi instalado.</p>
      <div className="card">
        <ul className="checagens">
          {!itens && <li>Verificando...</li>}
          {itens && itens.map((i, n) => (
            <li key={n} className={i.ok === null ? "aviso" : i.ok ? "ok" : "falha"}>
              <strong>{i.ok === null ? "• " : i.ok ? "✔ " : "✖ "}{i.titulo}</strong>
              {i.dica && <p>{i.dica}</p>}
            </li>
          ))}
        </ul>
      </div>
      <button className="btn" type="button" onClick={rodar}>Verificar de novo</button>
      <Link className="btn outline" to="/mestre/entrar">Entrar como Mestre</Link>
    </main>
  );
}
