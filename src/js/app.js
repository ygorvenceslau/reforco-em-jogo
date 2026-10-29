// Código compartilhado por todas as páginas.
const sb = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const $ = (id) => document.getElementById(id);

function mostrarErro(texto) {
  const el = $("erro");
  if (el) el.textContent = texto || "";
}

// Páginas da professora chamam isto no começo. Sem login, volta para a tela de entrada.
async function exigirLogin() {
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    location.href = "login.html";
    return null;
  }
  return data.session;
}

async function sair() {
  await sb.auth.signOut();
  location.href = "index.html";
}

// O aluno fica guardado só nesta aba do navegador, sem conta.
function participanteAtual() {
  const bruto = sessionStorage.getItem("participante");
  return bruto ? JSON.parse(bruto) : null;
}
