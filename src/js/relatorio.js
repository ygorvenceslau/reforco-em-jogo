const sessaoId = new URLSearchParams(location.search).get("sessao");
const LIMITE_REFORCO = 60; // abaixo disso, marcamos "reforçar"

// Cria elementos com textContent (nome do aluno é digitado por ele, então nunca usar innerHTML).
function el(tag, texto, classe) {
  const e = document.createElement(tag);
  if (texto !== undefined) e.textContent = texto;
  if (classe) e.className = classe;
  return e;
}

async function carregar() {
  mostrarErro("");
  const [alunosRes, assuntosRes] = await Promise.all([
    sb.from("v_acertos_por_aluno").select("*").eq("sessao_id", sessaoId).order("percentual", { ascending: true }),
    sb.from("v_acertos_por_assunto").select("*").eq("sessao_id", sessaoId).order("percentual", { ascending: true })
  ]);
  if (alunosRes.error || assuntosRes.error) {
    mostrarErro("Não foi possível carregar o relatório.");
    return;
  }
  desenharResumo(alunosRes.data);
  desenharAssuntos(assuntosRes.data);
  desenharAlunos(alunosRes.data);
}

function desenharResumo(alunos) {
  const jogaram = alunos.filter((a) => Number(a.respondidas) > 0).length;
  const respondidas = alunos.reduce((t, a) => t + Number(a.respondidas), 0);
  const acertos = alunos.reduce((t, a) => t + Number(a.acertos), 0);
  const media = respondidas > 0 ? Math.round((100 * acertos) / respondidas) + "%" : "—";

  const caixa = $("resumo");
  caixa.innerHTML = "";
  [[jogaram + "/" + alunos.length, "alunos jogaram"], [media, "de acertos"]].forEach(([valor, rotulo]) => {
    const card = el("div", undefined, "card");
    card.append(el("div", valor, "num"), el("div", rotulo, "muted"));
    caixa.appendChild(card);
  });
}

function desenharAssuntos(assuntos) {
  const caixa = $("assuntos");
  caixa.innerHTML = "";
  if (assuntos.length === 0) {
    caixa.appendChild(el("p", "Ainda não há respostas nesta sessão.", "muted"));
    return;
  }
  assuntos.forEach((a) => {
    const pct = Number(a.percentual);
    const baixo = pct < LIMITE_REFORCO;
    const topo = el("div", undefined, "topo");
    topo.append(el("span", a.assunto), el("span", pct + "%" + (baixo ? " · reforçar" : ""), baixo ? "reforcar" : ""));
    const barra = el("div", undefined, "bar" + (baixo ? " baixo" : ""));
    const preenchida = el("div");
    preenchida.style.width = pct + "%";
    barra.appendChild(preenchida);
    caixa.append(topo, barra);
  });
}

function desenharAlunos(alunos) {
  const corpo = $("alunos");
  corpo.innerHTML = "";
  if (alunos.length === 0) {
    const linha = el("tr");
    const celula = el("td", "Nenhum aluno entrou nesta sessão ainda.", "muted");
    celula.colSpan = 5;
    linha.appendChild(celula);
    corpo.appendChild(linha);
    return;
  }
  alunos.forEach((a) => {
    const jogou = Number(a.respondidas) > 0;
    const pct = jogou ? Number(a.percentual) : null;
    const baixo = jogou && pct < LIMITE_REFORCO;
    const linha = el("tr");
    const nome = el("td");
    nome.appendChild(el("b", a.nome));
    linha.append(
      nome,
      el("td", String(a.respondidas)),
      el("td", String(a.acertos)),
      el("td", jogou ? pct + "%" : "—"),
      el("td", !jogou ? "Ainda não jogou" : baixo ? "Reforçar" : "Em dia", baixo ? "reforcar" : "")
    );
    corpo.appendChild(linha);
  });
}

async function iniciar() {
  const login = await exigirLogin();
  if (!login) return;
  if (!sessaoId) {
    $("info").textContent = "Abra o relatório a partir do painel.";
    return;
  }
  const { data: sessao, error } = await sb
    .from("sessao")
    .select("codigo, disciplina, serie, habilidade(nome)")
    .eq("id", sessaoId)
    .single();
  if (error || !sessao) {
    $("info").textContent = "Sessão não encontrada.";
    return;
  }
  $("info").textContent = sessao.disciplina + " · " + sessao.serie + " · código " + sessao.codigo;
  await carregar();
  setInterval(carregar, 15000);
}

$("atualizar").addEventListener("click", carregar);
iniciar();
