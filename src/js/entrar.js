// entrar.js - tela onde o aluno entra na sessão (entrar.html).
// O aluno não tem conta: só digita o código da sessão e um apelido.

// Se o aluno abriu o link da professora (entrar.html?codigo=AB12CD), o código já vem preenchido.
const codigoNaUrl = new URLSearchParams(location.search).get("codigo");
if (codigoNaUrl) $("codigo").value = codigoNaUrl;

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarErro("");

  // Confere se os dois campos foram preenchidos.
  const codigo = $("codigo").value.trim();
  const nome = $("nome").value.trim();
  if (!codigo || !nome) {
    mostrarErro("Preencha o código e o seu nome.");
    return;
  }

  // Desliga o botão enquanto espera, para o aluno não clicar duas vezes.
  const botao = e.submitter;
  if (botao) botao.disabled = true;

  // sb.rpc chama uma função do banco (não uma tabela).
  // entrar_na_sessao (em supabase/schema.sql) confere o código, vê se a sessão está aberta
  // e cria o participante. O aluno nunca acessa as tabelas diretamente.
  const { data, error } = await sb.rpc("entrar_na_sessao", { p_codigo: codigo, p_nome: nome });
  if (botao) botao.disabled = false;

  // O banco devolve mensagens de erro; aqui escolhemos a frase certa para o aluno.
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

  // Deu certo: guarda o participante nesta aba (ver participanteAtual em app.js) e vai para o quiz.
  sessionStorage.setItem("participante", JSON.stringify(data));
  location.href = "quiz.html";
});
