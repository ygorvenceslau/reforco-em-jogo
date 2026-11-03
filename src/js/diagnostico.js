// Tela de diagnóstico: cada item mostra se está OK e, se não, o que fazer.
// Não usa app.js, para funcionar mesmo quando a configuração está errada.
const lista = document.getElementById("checagens");

function item(ok, titulo, dica) {
  const li = document.createElement("li");
  li.className = ok === null ? "aviso" : ok ? "ok" : "falha";
  const t = document.createElement("strong");
  t.textContent = (ok === null ? "• " : ok ? "✔ " : "✖ ") + titulo;
  li.appendChild(t);
  if (dica) {
    const d = document.createElement("p");
    d.textContent = dica;
    li.appendChild(d);
  }
  lista.appendChild(li);
  return ok;
}

// Detecta a chave secreta: "sb_secret_..." (nova) ou um JWT com role "service_role" (antiga).
function ehChaveSecreta(chave) {
  if (chave.startsWith("sb_secret_")) return true;
  try {
    const meio = chave.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return atob(meio).includes("service_role");
  } catch {
    return false;
  }
}

async function verificar() {
  lista.innerHTML = "";

  // 1. Biblioteca do Supabase (vem da internet)
  const bibliotecaOk = typeof window.supabase !== "undefined";
  if (!item(bibliotecaOk, "Biblioteca do Supabase carregada",
    bibliotecaOk ? "" : "Sem internet ou a CDN foi bloqueada. Confira a conexão e recarregue.")) return;

  // 2. config.js preenchido
  const cfg = window.CONFIG || {};
  const url = cfg.SUPABASE_URL || "";
  const chave = cfg.SUPABASE_ANON_KEY || "";
  const urlOk = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url);
  const chaveOk = chave.length > 30 && !chave.includes("COLE-A-CHAVE");
  item(urlOk, "Project URL no config.js",
    urlOk ? url : "Em src/js/config.js, cole a Project URL (Settings > API), no formato https://xxxx.supabase.co");
  item(chaveOk, "Chave anon no config.js",
    chaveOk ? "Chave começa com " + chave.slice(0, 12) + "..." :
    "Em src/js/config.js, cole a chave anon ou publishable (Settings > API Keys). Nunca a service_role.");
  if (ehChaveSecreta(chave)) {
    item(false, "PERIGO: chave service_role no site",
      "Troque já pela chave anon e gere uma nova service_role no Supabase (Settings > API Keys).");
    return;
  }
  if (!urlOk || !chaveOk) return;

  const sb = supabase.createClient(url.replace(/\/$/, ""), chave);

  // 3. Conexão + tabela habilidade (schema.sql e seed.sql)
  const hab = await sb.from("habilidade").select("id");
  if (hab.error) {
    const m = hab.error.message || "";
    let dica = "Erro: " + m;
    if (/api key|apikey|JWT|401/i.test(m)) dica = "A chave não confere com este projeto. Copie de novo a URL e a chave anon do MESMO projeto.";
    else if (/does not exist|schema cache|not find/i.test(m)) dica = "As tabelas não existem. Rode supabase/schema.sql no SQL Editor.";
    else if (/permission denied/i.test(m)) dica = "Sem permissão. Rode de novo supabase/schema.sql (ele libera o acesso).";
    else if (/fetch|network/i.test(m)) dica = "Não conectou. Confira a URL, a internet e se o projeto não está pausado no Supabase.";
    item(false, "Conexão com o banco", dica);
    return;
  }
  item(true, "Conexão com o banco");
  item(hab.data.length > 0, "Habilidades e questões cadastradas",
    hab.data.length > 0 ? hab.data.length + " habilidade(s)" : "O banco está vazio. Rode supabase/seed.sql no SQL Editor.");

  // 4. Funções do aluno (o código ZZZZZZ não existe, então o esperado é "não encontrado")
  const rpc = await sb.rpc("entrar_na_sessao", { p_codigo: "ZZZZZZ", p_nome: "teste" });
  const msg = rpc.error ? rpc.error.message || "" : "";
  item(msg.includes("não encontrado"), "Funções do aluno (entrar, questões, responder)",
    msg.includes("não encontrado") ? "" : "Não achei as funções. Rode de novo supabase/schema.sql. " + (msg ? "Erro: " + msg : ""));

  // 5. Login e ligação com a tabela professor
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    item(null, "Parte da professora não testada", "Faça login e volte a esta tela para testar.");
    return;
  }
  item(true, "Login feito", data.session.user.email);
  const prof = await sb.from("professor").select("nome").eq("id", data.session.user.id).maybeSingle();
  if (!item(!!prof.data, "Conta ligada à tabela professor",
    prof.data ? prof.data.nome : "Rode supabase/professora.sql com este e-mail: " + data.session.user.email)) return;
  const ses = await sb.from("sessao").select("id", { count: "exact", head: true });
  item(!ses.error, "Acesso às sessões", ses.error ? "Erro: " + ses.error.message : (ses.count || 0) + " sessão(ões) criada(s)");
  if (!ses.error) item(true, "Tudo certo! O site está pronto para usar.");
}

document.getElementById("repetir").addEventListener("click", verificar);
verificar();
