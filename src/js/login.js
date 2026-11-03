$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarErro("");
  const { error } = await sb.auth.signInWithPassword({
    email: $("email").value.trim(),
    password: $("senha").value
  });
  if (error) {
    const m = error.message || "";
    if (/invalid login credentials/i.test(m)) mostrarErro("E-mail ou senha incorretos.");
    else if (/not confirmed/i.test(m)) mostrarErro("Conta não confirmada. No Supabase, confirme o usuário (Auto Confirm User).");
    else mostrarErro("Não conectou ao servidor. Veja a tela de diagnóstico.");
    return;
  }
  location.href = "painel.html";
});
