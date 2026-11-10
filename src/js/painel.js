// =====================================================================
// painel.js — painel da professora (painel.html).
// Cria sessões de quiz, mostra o código/link para os alunos e lista as sessões anteriores.
// A professora só enxerga as PRÓPRIAS sessões: quem garante isso é o RLS do banco.
// =====================================================================
let usuario = null;     // professora logada
let habilidades = [];   // habilidades carregadas do banco (para o <select>)

// Monta o link que os alunos abrem: .../entrar.html?codigo=AB12CD
// Usa o endereço atual do site, então funciona no computador e no Netlify.
function linkDaSessao(codigo) {
  const pasta = location.pathname.replace(/[^/]*$/, "");
  return location.origin + pasta + "entrar.html?codigo=" + codigo;
}

// Preenche a lista "Habilidade" com o que está na tabela habilidade (seed.sql).
async function carregarHabilidades() {
  const { data, error } = await sb.from("habilidade").select("*").order("id");
  const select = $("habilidade");
  select.innerHTML = "";
  if (error || !data || data.length === 0) {
    mostrarErro("Não foi possível carregar as habilidades.");
    return;
  }
  habilidades = data;
  const todas = document.createElement("option");
  todas.value = "";
  todas.textContent = "Todas as habilidades (misturar)";
  select.appendChild(todas);
  data.forEach((h) => {
    const op = document.createElement("option");
    op.value = h.id;
    op.textContent = h.nome + " (" + h.serie + ")";
    select.appendChild(op);
  });
}

// Nome da habilidade a partir do id (usado na lista de sessões).
function nomeDaHabilidade(id) {
  const h = habilidades.find((x) => x.id === id);
  return h ? h.nome : "Todas as habilidades";
}

// CRIAR SESSÃO — principal ação do painel.
async function criarSessao() {
  mostrarErro("");
  // "" = todas as habilidades misturadas; senão, o id da habilidade escolhida.
  const valor = $("habilidade").value;
  const habilidade = valor ? habilidades.find((h) => String(h.id) === valor) : habilidades[0];
  if (!habilidade) {
    mostrarErro("Escolha uma habilidade.");
    return;
  }
  $("gerar").disabled = true;
  // Insere uma linha na tabela "sessao". O CÓDIGO de 6 letras é gerado pelo próprio banco
  // (default gerar_codigo() no schema.sql) e volta para nós no .select("id, codigo").
  // O RLS só aceita a linha se professor_id for a própria professora logada.
  const { data, error } = await sb
    .from("sessao")
    .insert({
      professor_id: usuario.id,
      habilidade_id: valor ? habilidade.id : null,
      disciplina: habilidade.disciplina,
      serie: habilidade.serie
    })
    .select("id, codigo")
    .single();
  $("gerar").disabled = false;
  if (error) {
    mostrarErro("Não deu para criar a sessão. Tente de novo.");
    return;
  }
  // Mostra o código grande, o link e o atalho para o relatório desta sessão.
  const link = linkDaSessao(data.codigo);
  $("codigo").textContent = data.codigo;
  $("link").textContent = link;
  $("link").href = link;
  $("ver-relatorio").href = "relatorio.html?sessao=" + data.id;
  $("resultado").hidden = false;
  carregarSessoes();
}

// Copia o link para a área de transferência (para colar no WhatsApp da turma, por exemplo).
async function copiarLink() {
  try {
    await navigator.clipboard.writeText($("link").href);
    $("copiar").textContent = "Link copiado!";
  } catch {
    $("copiar").textContent = "Copie o link acima";
  }
  setTimeout(() => ($("copiar").textContent = "Copiar link"), 2000);
}

// Botão Encerrar/Reabrir: só troca a coluna "ativa" da sessão.
// Com ativa = false, a função entrar_na_sessao recusa novos alunos.
async function alternarSessao(sessao) {
  const { error } = await sb.from("sessao").update({ ativa: !sessao.ativa }).eq("id", sessao.id);
  if (error) {
    mostrarErro("Não deu para mudar a sessão.");
    return;
  }
  carregarSessoes();
}

// LISTA "MINHAS SESSÕES". Não filtramos por professora aqui: o RLS do banco
// já devolve só as sessões dela. participante(count) conta quantos alunos entraram.
async function carregarSessoes() {
  const caixa = $("sessoes");
  const { data, error } = await sb
    .from("sessao")
    .select("id, codigo, habilidade_id, ativa, criada_em, participante(count)")
    .order("criada_em", { ascending: false });
  caixa.innerHTML = "";
  if (error) {
    caixa.innerHTML = '<p class="erro">Não foi possível carregar as sessões.</p>';
    return;
  }
  if (data.length === 0) {
    caixa.innerHTML = '<p class="muted">Nenhuma sessão ainda. Crie a primeira acima.</p>';
    return;
  }
  // Monta um bloco por sessão com textContent (nunca HTML), para evitar injeção de código.
  data.forEach((s) => {
    const item = document.createElement("div");
    item.className = "sessao-item";

    const topo = document.createElement("div");
    topo.className = "linha";
    const cod = document.createElement("strong");
    cod.textContent = s.codigo;
    const status = document.createElement("span");
    status.className = "selo " + (s.ativa ? "ok" : "fechada");
    status.textContent = s.ativa ? "Aberta" : "Encerrada";
    topo.append(cod, status);

    const info = document.createElement("p");
    info.className = "muted";
    const alunos = s.participante && s.participante[0] ? s.participante[0].count : 0;
    info.textContent =
      nomeDaHabilidade(s.habilidade_id) + " · " + formatarData(s.criada_em) + " · " + alunos + " aluno(s)";

    const acoes = document.createElement("div");
    acoes.className = "linha";
    const rel = document.createElement("a");
    rel.className = "btn pequeno";
    rel.href = "relatorio.html?sessao=" + s.id;
    rel.textContent = "Relatório";
    const alt = document.createElement("button");
    alt.type = "button";
    alt.className = "btn pequeno outline";
    alt.textContent = s.ativa ? "Encerrar" : "Reabrir";
    alt.onclick = () => alternarSessao(s);
    acoes.append(rel, alt);

    item.append(topo, info, acoes);
    caixa.appendChild(item);
  });
}

// INÍCIO DA TELA: exige login, confere se a conta está na tabela "professor",
// depois carrega habilidades e sessões.
exigirLogin().then(async (sessao) => {
  if (!sessao) return;
  usuario = sessao.user;
  $("quem").textContent = usuario.email;
  const prof = await sb.from("professor").select("nome").eq("id", usuario.id).maybeSingle();
  if (!prof.data) {
    $("gerar").disabled = true;
    mostrarErro("Sua conta ainda não está cadastrada como professora. Rode supabase/professora.sql no Supabase com o e-mail " + usuario.email + ".");
  } else {
    $("quem").textContent = prof.data.nome + " (" + usuario.email + ")";
  }
  await carregarHabilidades();
  carregarSessoes();
});
// Liga os botões às funções.
$("gerar").addEventListener("click", criarSessao);
$("copiar").addEventListener("click", copiarLink);
$("sair").addEventListener("click", sair);
