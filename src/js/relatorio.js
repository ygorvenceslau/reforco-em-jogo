// =====================================================================
// relatorio.js — relatório de uma sessão (relatorio.html?sessao=<id>).
// Mostra acertos por ASSUNTO e por ALUNO e marca "Reforçar" abaixo de 60%.
// As contas são feitas no banco por duas views (v_acertos_por_aluno e v_acertos_por_assunto);
// aqui só desenhamos as tabelas. As views respeitam o RLS: a professora só vê os próprios alunos.
// =====================================================================
const sessaoId = new URLSearchParams(location.search).get("sessao"); // id que veio na URL
const LIMITE_REFORCO = 60; // regra de negócio: abaixo de 60% de acerto → "Reforçar"

// Cria uma célula de tabela com texto. textContent (e não innerHTML) impede que um aluno
// que digite código HTML no nome consiga alterar a página (proteção contra XSS).
function celula(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

// Selo colorido da coluna "Situação": Sem respostas / Reforçar / Bom.
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

// Monta uma <table> com cabeçalho e linhas.
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

// Cabeçalho: código, habilidade, data e situação da sessão.
// habilidade(nome) traz o nome da tabela relacionada (chave estrangeira habilidade_id).
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

// Tabela "Acertos por assunto": a view agrupa as respostas por habilidade.
// Ordenada do menor percentual para o maior: o que a turma mais precisa aparece primeiro.
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

// Tabela "Por aluno": a view soma respondidas e acertos de cada participante.
// Alunos com menor percentual aparecem primeiro; quem não respondeu nada fica no fim.
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
  // Resumo: quantos alunos e quantos precisam de reforço.
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

// Carrega tudo. Assuntos e alunos são buscados ao mesmo tempo (Promise.all).
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

// Início: só carrega se a professora estiver logada. "Atualizar" busca de novo.
exigirLogin().then((s) => {
  if (s) carregarTudo();
});
$("atualizar").addEventListener("click", carregarTudo);
