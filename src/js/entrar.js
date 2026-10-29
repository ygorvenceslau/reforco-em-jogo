const codigoNaUrl = new URLSearchParams(location.search).get("codigo");
if (codigoNaUrl) $("codigo").value = codigoNaUrl;

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarErro("");
  const { data, error } = await sb.rpc("entrar_na_sessao", {
    p_codigo: $("codigo").value,
    p_nome: $("nome").value
  });
  if (error) {
    mostrarErro("Não encontramos essa sessão. Confira o código com a professora.");
    return;
  }
  sessionStorage.setItem("participante", JSON.stringify(data));
  location.href = "quiz.html";
});
