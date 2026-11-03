// Relatório da sessão: acertos por assunto e por aluno.
// As views já vêm filtradas pelo RLS: a professora só vê as próprias sessões.
const sessaoId = new URLSearchParams(location.search).get("sessao");
const LIMITE_REFORCO = 60;

function celula(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

function celulaSituacao(percentual) {
  const td = document.createElement("td");
  const selo = document.createElement("span");
  if (percentual === null) {
    selo.className = "selo fechada";
    selo.textContent = "Sem respostas";
  } else if (percentual < LIMITE_REFORCO) {
    selo.className = "selo reforcar";
    selo.textContent = "Reforçar";
  } else {
    selo.className = "selo ok";
    selo.textContent = "Bom";
  }
  td.appendChild(selo);
  return td;
}

function tabela(colunas, linhas) {
  const t = document.createElement("table");
  const cab = document.createElement("tr");
  colunas.forEach((c) => {
    const th = document.createElement("th");
    th.textContent = c;
    cab.appendChild(th);
  });
  t.appendChild(cab);
  linhas.forEach((l) => t.appendChild(l));
  return t;
}

function textoPercentual(p) {
  return p === null ? "-" : p + "%";
}

async function carregarInfo() {
  const { data, error } = await sb
    .from("sessao")
    .select("codigo, ativa, criada_em, habilidade(nome)")
    .eq("id", sessaoId)
    .maybeSingle();
  if (error || !data) {
    $("info").textContent = "";
    mostrarErro("Sessão não encontrada.");
    return false;
  }
  const hab = data.habilidade ? data.habilidade.nome : "Todas as habilidades";
  $("info").textContent =
    "Código " + data.codigo + " · " + hab + " · " + formatarData(data.criada_em) +
    " · " + (data.ativa ? "Aberta" : "Encerrada");
  return true;
}

async function carregarAssuntos() {
  const caixa = $("assuntos");
  const { data, error } = await sb
    .from("v_acertos_por_assunto")
    .select("*")
    .eq("sessao_id", sessaoId)
    .order("percentual");
  caixa.innerHTML = "";
  if (error) {
    caixa.innerHTML = '<p class="erro">Não foi possível carregar.</p>';
    return;
  }
  if (data.length === 0) {
    caixa.innerHTML = '<p class="muted">Ainda não há respostas.</p>';
    return;
  }
  const linhas = data.map((a) => {
    const tr = document.createElement("tr");
    tr.append(
      celula(a.assunto),
      celula(a.acertos + " de " + a.respondidas),
      celula(textoPercentual(a.percentual)),
      celulaSituacao(a.percentual)
    );
    return tr;
  });
  caixa.appendChild(tabela(["Assunto", "Acertos", "%", "Situação"], linhas));
}

async function carregarAlunos() {
  const caixa = $("alunos");
  const { data, error } = await sb
    .from("v_acertos_por_aluno")
    .select("*")
    .eq("sessao_id", sessaoId)
    .order("percentual", { ascending: true, nullsFirst: false })
    .order("nome");
  caixa.innerHTML = "";
  if (error) {
    caixa.innerHTML = '<p class="erro">Não foi possível carregar.</p>';
    return;
  }
  if (data.length === 0) {
    caixa.innerHTML = '<p class="muted">Nenhum aluno entrou ainda.</p>';
    return;
  }
  const reforco = data.filter((a) => a.percentual !== null && a.percentual < LIMITE_REFORCO).length;
  const resumo = document.createElement("p");
  resumo.className = "muted";
  resumo.textContent = data.length + " aluno(s) · " + reforco + " para reforçar";
  caixa.appendChild(resumo);

  const linhas = data.map((a) => {
    const tr = document.createElement("tr");
    tr.append(
      celula(a.nome),
      celula(a.acertos + " de " + a.respondidas),
      celula(textoPercentual(a.percentual)),
      celulaSituacao(a.percentual)
    );
    return tr;
  });
  caixa.appendChild(tabela(["Aluno", "Acertos", "%", "Situação"], linhas));
}

async function carregarTudo() {
  mostrarErro("");
  if (!sessaoId) {
    $("info").textContent = "";
    mostrarErro("Abra o relatório pelo painel.");
    return;
  }
  if (await carregarInfo()) {
    await Promise.all([carregarAssuntos(), carregarAlunos()]);
  }
}

exigirLogin().then((s) => {
  if (s) carregarTudo();
});
$("atualizar").addEventListener("click", carregarTudo);
