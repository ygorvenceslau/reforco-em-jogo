// =====================================================================
// login.js — tela de login da professora (login.html).
// O login é feito pelo Supabase Auth: o site nunca guarda nem confere senhas.
// =====================================================================

$("form").addEventListener("submit", async (e) => {
  e.preventDefault(); // impede o formulário de recarregar a página
  mostrarErro("");

  // Envia e-mail e senha ao Supabase. Se estiverem certos, ele guarda a sessão no navegador.
  const { error } = await sb.auth.signInWithPassword({
    email: $("email").value.trim(),
    password: $("senha").value
  });

  // Traduz os erros mais comuns para mensagens simples.
  if (error) {
    const m = error.message || "";
    if (/invalid login credentials/i.test(m)) mostrarErro("E-mail ou senha incorretos.");
    else if (/not confirmed/i.test(m)) mostrarErro("Conta não confirmada. No Supabase, confirme o usuário (Auto Confirm User).");
    else mostrarErro("Não conectou ao servidor. Veja a tela de diagnóstico.");
    return;
  }

  // Login certo: vai para o painel.
  location.href = "painel.html";
});
