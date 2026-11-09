$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarErro("");
  const nome = $("nome").value.trim();
  const escola = $("escola").value.trim();
  const email = $("email").value.trim();
  const senha = $("senha").value;
  if (senha !== $("senha2").value) {
    mostrarErro("As senhas não são iguais.");
    return;
  }
  const botao = e.submitter;
  botao.disabled = true;
  const { data, error } = await sb.auth.signUp({
    email: email,
    password: senha,
    options: { data: { nome: nome, escola: escola } }
  });
  botao.disabled = false;
  if (error) {
    const m = error.message || "";
    if (/already registered/i.test(m)) mostrarErro("Esse e-mail já tem conta. Tente entrar.");
    else if (/password/i.test(m)) mostrarErro("Senha fraca. Use pelo menos 6 caracteres.");
    else if (/rate limit/i.test(m)) mostrarErro("Muitas tentativas. Espere alguns minutos.");
    else mostrarErro("Não foi possível criar a conta. Tente de novo.");
    return;
  }
  // E-mail que já existe volta sem erro, mas sem identidades.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    mostrarErro("Esse e-mail já tem conta. Tente entrar.");
    return;
  }
  if (data.session) {
    location.href = "painel.html";
    return;
  }
  $("form").innerHTML = '<p class="card">Conta criada! Confira o seu e-mail para confirmar e depois <a href="login.html">entre aqui</a>.</p>';
});