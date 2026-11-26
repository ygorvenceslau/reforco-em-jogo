// Painel do Mestre: criar salas (sessões), ver o código/link e gerenciar as salas anteriores.
// O Mestre só enxerga as próprias salas: quem garante isso é o RLS do banco.
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { formatarData, ordenarAnos } from "../lib/util.js";
import Chips from "../components/Chips.jsx";

export default function Painel({ sessao }) {
  const navegar = useNavigate();
  const usuario = sessao.user;

  const [nome, setNome] = useState("");
  const [habilidades, setHabilidades] = useState([]);
  const [ano, setAno] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [habilidadeId, setHabilidadeId] = useState(""); // "" = todas as habilidades
  const [fonte, setFonte] = useState("todas"); // de onde vêm as questões: padrao, minhas ou todas
  const [modo, setModo] = useState("solo"); // masmorra solo ou turma contra o chefão
  const [salas, setSalas] = useState(null);
  const [nova, setNova] = useState(null);
  const [erro, setErro] = useState("");
  const [criando, setCriando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [previa, setPrevia] = useState(null); // questões que a sala vai usar
  const [verPrevia, setVerPrevia] = useState(false);

  // Ao abrir a tela: nome do Mestre, habilidades disponíveis e salas.
  useEffect(() => {
    sb.from("professor").select("nome").eq("id", usuario.id).maybeSingle()
      .then(({ data }) => setNome(data ? data.nome : ""));
    sb.from("habilidade").select("*").order("id").then(({ data, error }) => {
      if (error) return setErro("Não foi possível carregar os assuntos.");
      setHabilidades(data);
      if (data.length) setAno(ordenarAnos(new Set(data.map((h) => h.serie)))[0]);
    });
    carregarSalas();
  }, []);

  // Listas dos filtros: anos → disciplinas daquele ano → habilidades daquele ano e disciplina.
  const anos = useMemo(() => ordenarAnos(new Set(habilidades.map((h) => h.serie))), [habilidades]);
  const disciplinas = useMemo(
    () => [...new Set(habilidades.filter((h) => h.serie === ano).map((h) => h.disciplina))].sort(),
    [habilidades, ano]
  );
  const opcoes = habilidades.filter((h) => h.serie === ano && h.disciplina === disciplina);

  // Quando muda o ano, escolhe a primeira disciplina dele.
  useEffect(() => {
    setDisciplina(disciplinas[0] || "");
    setHabilidadeId("");
  }, [ano, disciplinas.join("|")]);

  // Prévia: as mesmas questões que o banco vai sortear para a sala (mesma série, disciplina,
  // assunto e fonte). O RLS já limita às padrão e às deste Mestre.
  useEffect(() => {
    const ids = (habilidadeId ? opcoes.filter((h) => String(h.id) === String(habilidadeId)) : opcoes).map((h) => h.id);
    if (!ids.length) return setPrevia([]);
    let consulta = sb.from("questao")
      .select("id, habilidade_id, enunciado, alt_a, alt_b, alt_c, alt_d, correta, explicacao, professor_id")
      .in("habilidade_id", ids).order("id");
    if (fonte === "padrao") consulta = consulta.is("professor_id", null);
    if (fonte === "minhas") consulta = consulta.eq("professor_id", usuario.id);
    setPrevia(null);
    // "valida" descarta a resposta de uma busca antiga, se os filtros mudaram nesse meio-tempo.
    let valida = true;
    consulta.then(({ data, error }) => {
      if (valida) setPrevia(error ? [] : data);
    });
    return () => {
      valida = false;
    };
  }, [ano, disciplina, habilidadeId, fonte, habilidades.length]);

  async function carregarSalas() {
    // Não filtramos por Mestre aqui: o RLS já devolve só as salas dele.
    // participante(count) conta quantos aprendizes entraram.
    const { data, error } = await sb
      .from("sessao")
      .select("id, codigo, habilidade_id, disciplina, serie, ativa, criada_em, modo, participante(count)")
      .order("criada_em", { ascending: false });
    if (error) return setErro("Não foi possível carregar as salas.");
    setSalas(data);
  }

  async function criarSala() {
    setErro("");
    if (!ano || !disciplina) return setErro("Escolha a série e a disciplina.");
    if (previa && previa.length === 0) return setErro("Não há questões com essas escolhas. Crie as suas em Questões.");
    setCriando(true);
    // O código de 6 caracteres é gerado pelo próprio banco (default gerar_codigo()).
    const { data, error } = await sb
      .from("sessao")
      .insert({
        professor_id: usuario.id,
        habilidade_id: habilidadeId ? Number(habilidadeId) : null,
        disciplina,
        serie: ano,
        fonte,
        modo,
      })
      .select("id, codigo, modo")
      .single();
    setCriando(false);
    if (error) return setErro("Não deu para criar a sala. Tente de novo.");
    setNova({ ...data, link: location.origin + "/jogar?codigo=" + data.codigo });
    carregarSalas();
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(nova.link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setErro("Não deu para copiar. Selecione o link e copie.");
    }
  }

  // Encerrar/Reabrir: com ativa = false, ninguém mais entra nem responde.
  async function alternar(sala) {
    const { error } = await sb.from("sessao").update({ ativa: !sala.ativa }).eq("id", sala.id);
    if (error) return setErro("Não deu para mudar a sala.");
    carregarSalas();
  }

  // Excluir apaga a sala, os aprendizes e as respostas dela ("on delete cascade" no banco).
  async function excluir(sala) {
    const ok = window.confirm(
      "Excluir a sala " + sala.codigo + "? Os aprendizes e as respostas dela serão apagados. Não dá para desfazer."
    );
    if (!ok) return;
    const { error } = await sb.from("sessao").delete().eq("id", sala.id);
    if (error) return setErro("Não deu para excluir a sala.");
    if (nova && nova.id === sala.id) setNova(null);
    carregarSalas();
  }

  async function sair() {
    await sb.auth.signOut();
    navegar("/");
  }

  const nomeHabilidade = (id) => (habilidades.find((h) => h.id === id) || {}).nome || "Todos os assuntos";

  return (
    <main className="painel">
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Olá, {nome || "Mestre"}!</h1>
      <p className="muted">{usuario.email}</p>
      <Link className="btn outline botao-questoes" to="/mestre/questoes">📚 Questões (padrão e minhas)</Link>

      <div className="painel-grade">
      <div className="card">
        <h2>Criar sala</h2>
        <Chips rotulo="Série / ano" valor={ano} onEscolher={setAno}
          opcoes={anos.map((a) => ({ valor: a, rotulo: a }))} />
        <Chips rotulo="Disciplina" valor={disciplina} onEscolher={(d) => { setDisciplina(d); setHabilidadeId(""); }}
          opcoes={disciplinas.map((d) => ({ valor: d, rotulo: d }))} />
        <Chips rotulo="Assunto" valor={String(habilidadeId)} onEscolher={(v) => setHabilidadeId(v)}
          opcoes={[{ valor: "", rotulo: "Todos (misturar)" }, ...opcoes.map((h) => ({ valor: String(h.id), rotulo: h.nome + (h.professor_id ? " ✎" : "") }))]} />
        <Chips rotulo="Questões" valor={fonte} onEscolher={setFonte}
          opcoes={[{ valor: "todas", rotulo: "Padrão + minhas" }, { valor: "padrao", rotulo: "Só as padrão" }, { valor: "minhas", rotulo: "Só as minhas" }]} />

        <div className="previa" aria-live="polite">
          <div className="previa-topo">
            <strong>
              {previa === null ? "Contando questões..." : previa.length === 0 ? "⚠️ Nenhuma questão com essas escolhas" : `📋 ${previa.length} questão(ões) nesta sala`}
            </strong>
            {previa && previa.length > 0 && (
              <button className="btn pequeno outline" type="button" onClick={() => setVerPrevia(!verPrevia)}>
                {verPrevia ? "Esconder" : "Ver as questões"}
              </button>
            )}
          </div>
          {previa && previa.length === 0 && (
            <p className="muted dica">Escolha outro assunto ou <Link to="/mestre/questoes">crie as suas questões</Link>.</p>
          )}
          {previa && previa.length > 0 && previa.length < 13 && (
            <p className="muted dica">Com poucas questões, os monstros ficam com menos vida: quem acerta tudo não repete nenhuma.</p>
          )}
          {verPrevia && previa && (
            <ol className="previa-lista">
              {previa.map((q) => (
                <li key={q.id}>
                  {q.enunciado}
                  <small>
                    Certa: <span className="certa">{q["alt_" + q.correta.toLowerCase()]}</span>
                    {" · "}{q.professor_id ? "sua" : "padrão"}
                    {" · "}{(opcoes.find((h) => h.id === q.habilidade_id) || {}).nome}
                  </small>
                </li>
              ))}
            </ol>
          )}
        </div>

        <label>Modo de jogo</label>
        <div className="grupo-opcoes" role="radiogroup">
          {[
            ["solo", "🗡️ Masmorra solo", "Cada aprendiz enfrenta 3 ondas e um chefão no próprio ritmo."],
            ["turma", "🐉 Turma contra o chefão", "Todos atacam o mesmo chefão, projetado na lousa. A turma vence junta."],
          ].map(([valor, titulo, texto]) => (
            <label key={valor} className={"opcao-radio" + (modo === valor ? " marcada" : "")}>
              <input type="radio" name="modo" value={valor} checked={modo === valor} onChange={() => setModo(valor)} />
              <span><strong>{titulo}</strong><small>{texto}</small></span>
            </label>
          ))}
        </div>
        <button className="btn" type="button" onClick={criarSala} disabled={criando || !habilidades.length || (previa && previa.length === 0)}>
          {criando ? "Criando..." : "Criar sala"}
        </button>
        {erro && <p className="erro" role="alert">{erro}</p>}

        {nova && (
          <div>
            <p className="muted">Código para os aprendizes:</p>
            <p className="codigo">{nova.codigo}</p>
            <p className="muted">Link direto:</p>
            <p><a className="quebra" href={nova.link} target="_blank" rel="noopener">{nova.link}</a></p>
            <button className="btn outline" type="button" onClick={copiarLink}>{copiado ? "Link copiado!" : "Copiar link"}</button>
            {nova.modo === "turma" && (
              <Link className="btn" style={{ marginTop: 10 }} to={"/mestre/sessao/" + nova.id + "/lousa"}>🐉 Abrir a lousa</Link>
            )}
            <Link className="btn outline" style={{ marginTop: 10 }} to={"/mestre/sessao/" + nova.id}>Ver relatório</Link>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Minhas salas</h2>
        {salas === null && <p className="muted">Carregando...</p>}
        {salas && salas.length === 0 && <p className="muted">Nenhuma sala ainda. Crie a primeira acima.</p>}
        {salas && salas.map((s) => (
          <div className="sessao-item" key={s.id}>
            <div className="linha">
              <strong>{s.codigo}</strong>
              <span className={"selo " + (s.ativa ? "ok" : "fechada")}>{s.ativa ? "Aberta" : "Encerrada"}</span>
            </div>
            <p className="muted">
              {s.modo === "turma" ? "🐉 Turma" : "🗡️ Solo"} · {s.serie} · {s.disciplina} · {nomeHabilidade(s.habilidade_id)}<br />
              {formatarData(s.criada_em)} · {(s.participante[0] || {}).count || 0} aprendiz(es)
            </p>
            <div className="linha">
              <span style={{ display: "flex", gap: 8 }}>
                <Link className="btn pequeno" to={"/mestre/sessao/" + s.id}>Relatório</Link>
                {s.modo === "turma" && <Link className="btn pequeno" to={"/mestre/sessao/" + s.id + "/lousa"}>Lousa</Link>}
              </span>
              <span style={{ display: "flex", gap: 8 }}>
                <button className="btn pequeno outline" type="button" onClick={() => alternar(s)}>
                  {s.ativa ? "Encerrar" : "Reabrir"}
                </button>
                <button className="btn pequeno perigo" type="button" onClick={() => excluir(s)}>Excluir</button>
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>

      <button className="btn outline botao-sair" type="button" onClick={sair}>Sair</button>
    </main>
  );
}
