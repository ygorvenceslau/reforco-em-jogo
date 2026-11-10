// app.js - código comum, carregado por todas as telas do site.
// Ordem de carregamento no HTML: biblioteca do Supabase -> config.js -> app.js -> js da tela.

// Aviso para quem esquecer de preencher o config.js com os dados do Supabase.
if (CONFIG.SUPABASE_URL.includes("SEU-PROJETO")) {
  alert("Configure o Supabase em src/js/config.js antes de usar o site. Veja diagnostico.html.");
}

// Conexão com o banco: "sb" é o cliente do Supabase usado em todas as telas.
// Com ele fazemos login (sb.auth), consultas em tabelas (sb.from) e chamadas de funções (sb.rpc).
const sb = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Atalho: $("codigo") é o mesmo que document.getElementById("codigo").
const $ = (id) => document.getElementById(id);

// Mostra uma mensagem de erro no parágrafo <p id="erro"> da tela (ou limpa, se vier vazio).
function mostrarErro(texto) {
  const el = $("erro");
  if (el) el.textContent = texto || "";
}

// Proteção das telas da professora (painel e relatório).
// Pergunta ao Supabase se existe alguém logado. Se não existir, manda para o login.
async function exigirLogin() {
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    location.href = "login.html";
    return null;
  }
  return data.session; // traz o usuário logado (id e e-mail)
}

// Botão "Sair": encerra o login e volta para a tela inicial.
async function sair() {
  await sb.auth.signOut();
  location.href = "index.html";
}

// O aluno não tem conta. Ao entrar na sessão, guardamos os dados dele no sessionStorage,
// que fica só nesta aba do navegador e some quando ela é fechada.
function participanteAtual() {
  const bruto = sessionStorage.getItem("participante");
  return bruto ? JSON.parse(bruto) : null;
}

// Converte a data do banco (formato ISO) para o formato brasileiro: 03/11/2026, 18:34.
function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
