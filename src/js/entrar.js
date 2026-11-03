const codigoNaUrl = new URLSearchParams(location.search).get("codigo");
if (codigoNaUrl) $("codigo").value = codigoNaUrl;

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarErro("");
  const codigo = $("codigo").value.trim();
  const nome = $("nome").value.trim();
  if (!codigo || !nome) {
    mostrarErro("Preencha o código e o seu nome.");
    return;
  }
  const botao = e.submitter;
  if (botao) botao.disabled = true;
  const { data, error } = await sb.rpc("entrar_na_sessao", { p_codigo: codigo, p_nome: nome });
  if (botao) botao.disabled = false;
  if (error) {
    const msg = error.message || "";
    if (msg.includes("encerrada")) {
      mostrarErro("Essa sessão já foi encerrada. Fale com a professora.");
    } else if (msg.includes("não encontrado")) {
      mostrarErro("Não encontramos essa sessão. Confira o código com a professora.");
    } else {
      mostrarErro("Sem conexão com o servidor. Tente de novo.");
    }
    return;
  }
  sessionStorage.setItem("participante", JSON.stringify(data));
  location.href = "quiz.html";
});
