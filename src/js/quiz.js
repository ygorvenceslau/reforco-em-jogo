const aluno = participanteAtual();
if (!aluno) location.href = "entrar.html";

let questoes = [];
let atual = 0;
let acertos = 0;
let respondeu = false;

async function iniciar() {
  const { data, error } = await sb.rpc("buscar_questoes", { p_participante: aluno.participante_id });
  if (error) {
    $("pergunta").textContent = "Não deu para carregar as questões. Recarregue a página.";
    return;
  }
  if (!data || data.length === 0) {
    $("pergunta").textContent = "Não há questões nesta sessão. Avise a professora.";
    return;
  }
  questoes = data;
  mostrar();
}

function mostrar() {
  respondeu = false;
  const q = questoes[atual];
  $("contador").textContent = "Questão " + (atual + 1) + " de " + questoes.length;
  $("barra").style.width = (atual / questoes.length) * 100 + "%";
  $("pergunta").textContent = q.enunciado;
  $("proxima").hidden = true;
  const caixa = $("opcoes");
  caixa.innerHTML = "";
  ["A", "B", "C", "D"].forEach((letra) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opcao";
    b.textContent = q["alt_" + letra.toLowerCase()];
    b.onclick = () => responder(letra, b);
    caixa.appendChild(b);
  });
}

async function responder(letra, botao) {
  if (respondeu) return;
  respondeu = true;
  const { data: correta, error } = await sb.rpc("responder", {
    p_participante: aluno.participante_id,
    p_questao: questoes[atual].id,
    p_escolhida: letra
  });
  if (error) {
    respondeu = false;
    mostrarErro((error.message || "").includes("encerrada")
      ? "A professora encerrou esta sessão."
      : "Não deu para enviar a resposta. Tente de novo.");
    return;
  }
  mostrarErro("");
  if (correta) acertos++;
  botao.classList.add(correta ? "certa" : "errada");
  $("proxima").textContent = atual + 1 < questoes.length ? "Próxima questão" : "Ver meu resultado";
  $("proxima").hidden = false;
}

$("proxima").addEventListener("click", () => {
  atual++;
  if (atual < questoes.length) {
    mostrar();
  } else {
    $("jogo").hidden = true;
    $("fim").hidden = false;
    $("resultado").textContent = "Você acertou " + acertos + " de " + questoes.length + ".";
    const p = acertos / questoes.length;
    $("mensagem").textContent = p === 1 ? "Perfeito! Você acertou tudo!"
      : p >= 0.6 ? "Muito bem! Continue assim."
      : "Bom esforço! Vamos treinar mais um pouco.";
    sessionStorage.removeItem("participante");
  }
});

iniciar();
