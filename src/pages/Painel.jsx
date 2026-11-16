// Painel do Mestre: criar salas (sessões), ver o código/link e gerenciar as salas anteriores.
// O Mestre só enxerga as próprias salas: quem garante isso é o RLS do banco.
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { formatarData, ordenarAnos } from "../lib/util.js";

export default function Painel({ sessao }) {
  const navegar = useNavigate();
  const usuario = sessao.user;

  const [nome, setNome] = useState("");
  const [habilidades, setHabilidades] = useState([]);
  const [ano, setAno] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [habilidadeId, setHabilidadeId] = useState(""); // "" = todas as habilidades
  const [salas, setSalas] = useState(null);
  const [nova, setNova] = useState(null);
  const [erro, setErro] = useState("");
  const [criando, setCriando] = useState(false);
  const [copiado, setCopiado] = useState(false);

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

  async function carregarSalas() {
    // Não filtramos por Mestre aqui: o RLS já devolve só as salas dele.
    // participante(count) conta quantos aprendizes entraram.
    const { data, error } = await sb
      .from("sessao")
      .select("id, codigo, habilidade_id, disciplina, serie, ativa, criada_em, participante(count)")
      .order("criada_em", { ascending: false });
    if (error) return setErro("Não foi possível carregar as salas.");
    setSalas(data);
  }

  async function criarSala() {
    setErro("");
    if (!ano || !disciplina) return setErro("Escolha o ano e a disciplina.");
    setCriando(true);
    // O código de 6 caracteres é gerado pelo próprio banco (default gerar_codigo()).
    const { data, error } = await sb
      .from("sessao")
      .insert({
        professor_id: usuario.id,
        habilidade_id: habilidadeId ? Number(habilidadeId) : null,
        disciplina,
        serie: ano,
      })
      .select("id, codigo")
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
    <main>
      <p className="marca">Quizzes &amp; Masmorras</p>
      <h1>Olá, {nome || "Mestre"}!</h1>
      <p className="muted">{usuario.email}</p>

      <div className="card">
        <h2>Criar sala</h2>
        <div className="filtros">
          <div>
            <label htmlFor="ano">Ano</label>
            <select id="ano" value={ano} onChange={(e) => setAno(e.target.value)}>
              {anos.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="disciplina">Disciplina</label>
            <select id="disciplina" value={disciplina} onChange={(e) => setDisciplina(e.target.value)}>
              {disciplinas.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <label htmlFor="habilidade">Assunto</label>
        <select id="habilidade" value={habilidadeId} onChange={(e) => setHabilidadeId(e.target.value)}>
          <option value="">Todos os assuntos (misturar)</option>
          {opcoes.map((h) => <option key={h.id} value={h.id}>{h.nome}</option>)}
        </select>
        <button className="btn" type="button" onClick={criarSala} disabled={criando || !habilidades.length}>
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
              {s.serie} · {s.disciplina} · {nomeHabilidade(s.habilidade_id)}<br />
              {formatarData(s.criada_em)} · {(s.participante[0] || {}).count || 0} aprendiz(es)
            </p>
            <div className="linha">
              <Link className="btn pequeno" to={"/mestre/sessao/" + s.id}>Relatório</Link>
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

      <button className="btn outline" type="button" onClick={sair}>Sair</button>
    </main>
  );
}
