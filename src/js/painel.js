let professor = null;
let ultimoLink = "";

async function iniciar() {
  const sessao = await exigirLogin();
  if (!sessao) return;
  professor = sessao.user;
  $("quem").textContent = professor.email;
  await carregarHabilidades();
  await listarSessoes();
}

// Preenche o <select> com as habilidades cadastradas no banco.
async function carregarHabilidades() {
  const { data, error } = await sb.from("habilidade").select("id, disciplina, serie, nome").order("id");
  if (error || !data || data.length === 0) {
    mostrarErro("Não foi possível carregar as habilidades.");
    return;
  }
  const select = $("habilidade");
  select.innerHTML = "";
  data.forEach((h) => {
    const opcao = document.createElement("option");
    opcao.value = h.id;
    opcao.textContent = h.nome + " (" + h.serie + ")";
    opcao.dataset.disciplina = h.disciplina;
    opcao.dataset.serie = h.serie;
    select.appendChild(opcao);
  });
}

function linkDaSessao(codigo) {
  return new URL("entrar.html?codigo=" + codigo, location.href).href;
}

// Cria a sessão. O código é gerado pelo banco (função gerar_codigo).
$("gerar").addEventListener("click", async () => {
  mostrarErro("");
  const opcao = $("habilidade").selectedOptions[0];
  if (!opcao || !opcao.dataset.serie) return;

  const { data, error } = await sb
    .from("sessao")
    .insert({
      professor_id: professor.id,
      habilidade_id: Number(opcao.value),
      disciplina: opcao.dataset.disciplina,
      serie: opcao.dataset.serie
    })
    .select("id, codigo")
    .single();

  if (error) {
    mostrarErro("Não foi possível criar a sessão. Tente de novo.");
    return;
  }
  mostrarSessao(data);
  await listarSessoes();
});

function mostrarSessao(sessao) {
  ultimoLink = linkDaSessao(sessao.codigo);
  $("codigo").textContent = sessao.codigo;
  $("link").textContent = ultimoLink;
  const texto = "Vamos jogar? Entre em " + ultimoLink + " e use o código " + sessao.codigo;
  $("whatsapp").href = "https://wa.me/?text=" + encodeURIComponent(texto);
  $("ver").href = "relatorio.html?sessao=" + sessao.id;
  $("resultado").hidden = false;
}

$("copiar").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(ultimoLink);
    $("copiar").textContent = "Link copiado";
  } catch (e) {
    mostrarErro("Não deu para copiar. Selecione o link e copie à mão.");
  }
});

// Lista as últimas sessões da professora (o RLS já filtra só as dela).
async function listarSessoes() {
  const { data, error } = await sb
    .from("sessao")
    .select("id, codigo, criada_em, ativa, habilidade(nome)")
    .order("criada_em", { ascending: false })
    .limit(10);

  const lista = $("lista");
  lista.innerHTML = "";
  if (error) {
    lista.textContent = "Não foi possível carregar as sessões.";
    return;
  }
  if (data.length === 0) {
    lista.textContent = "Você ainda não criou nenhuma sessão.";
    return;
  }
  data.forEach((s) => {
    const linha = document.createElement("div");
    linha.className = "linha";

    const info = document.createElement("div");
    const titulo = document.createElement("b");
    titulo.textContent = s.codigo + (s.ativa ? "" : " (encerrada)");
    const detalhe = document.createElement("div");
    detalhe.className = "muted";
    const quando = new Date(s.criada_em).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    detalhe.textContent = (s.habilidade ? s.habilidade.nome + " · " : "") + quando;
    info.append(titulo, detalhe);

    const acoes = document.createElement("div");
    acoes.className = "acoes";
    const ver = document.createElement("a");
    ver.className = "btn mini outline";
    ver.href = "relatorio.html?sessao=" + s.id;
    ver.textContent = "Relatório";
    acoes.appendChild(ver);
    if (s.ativa) {
      const encerrar = document.createElement("button");
      encerrar.className = "btn mini outline";
      encerrar.type = "button";
      encerrar.textContent = "Encerrar";
      encerrar.onclick = async () => {
        await sb.from("sessao").update({ ativa: false }).eq("id", s.id);
        listarSessoes();
      };
      acoes.appendChild(encerrar);
    }
    linha.append(info, acoes);
    lista.appendChild(linha);
  });
}

$("sair").addEventListener("click", sair);
iniciar();
