// =====================================================================
// quiz.js — o jogo do aluno (quiz.html).
// Mostra uma questão por vez, envia a resposta ao banco e mostra se acertou.
// A RESPOSTA CERTA NUNCA CHEGA AO CELULAR: quem corrige é o banco (função "responder").
// =====================================================================

// Sem participante salvo (aluno não passou pela tela de entrar), volta para lá.
const aluno = participanteAtual();
if (!aluno) location.href = "entrar.html";

// Estado do jogo
let questoes = [];      // lista de questões sorteadas
let atual = 0;          // número da questão que está na tela (começa em 0)
let acertos = 0;        // quantas o aluno acertou
let respondeu = false;  // impede responder duas vezes a mesma questão

// 1) Busca as questões no banco.
// buscar_questoes sorteia até 8 questões da habilidade da sessão e devolve
// enunciado e alternativas, mas NÃO a coluna "correta".
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

// 2) Desenha a questão atual: contador, barra de progresso, enunciado e 4 botões.
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
    b.textContent = q["alt_" + letra.toLowerCase()]; // alt_a, alt_b, alt_c, alt_d
    b.onclick = () => responder(letra, b);
    caixa.appendChild(b);
  });
}

// 3) O aluno tocou numa alternativa: envia a letra ao banco, que corrige e grava.
async function responder(letra, botao) {
  if (respondeu) return; // já respondeu esta questão
  respondeu = true;

  // A função "responder" do banco compara com a resposta certa, grava na tabela
  // "resposta" e devolve só true (acertou) ou false (errou).
  const { data: correta, error } = await sb.rpc("responder", {
    p_participante: aluno.participante_id,
    p_questao: questoes[atual].id,
    p_escolhida: letra
  });

  if (error) {
    respondeu = false; // deixa tentar de novo
    mostrarErro((error.message || "").includes("encerrada")
      ? "A professora encerrou esta sessão."
      : "Não deu para enviar a resposta. Tente de novo.");
    return;
  }

  // Pinta o botão de verde (certa) ou vermelho (errada) e mostra o botão de avançar.
  mostrarErro("");
  if (correta) acertos++;
  botao.classList.add(correta ? "certa" : "errada");
  $("proxima").textContent = atual + 1 < questoes.length ? "Próxima questão" : "Ver meu resultado";
  $("proxima").hidden = false;
}

// 4) Botão "Próxima questão": avança ou, se acabou, mostra o resultado final.
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
    sessionStorage.removeItem("participante"); // libera a aba para outra sessão
  }
});

iniciar();
