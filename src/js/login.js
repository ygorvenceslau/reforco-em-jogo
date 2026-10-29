$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarErro("");
  const { error } = await sb.auth.signInWithPassword({
    email: $("email").value.trim(),
    password: $("senha").value
  });
  if (error) {
    mostrarErro("E-mail ou senha incorretos.");
    return;
  }
  location.href = "painel.html";
});
