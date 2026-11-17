// Banco de questões do Mestre.
// - Padrão: questões prontas da plataforma (todo Mestre vê, ninguém edita).
// - Minhas: questões criadas por este Mestre (só ele vê, edita e apaga).
// Uma questão padrão pode ser duplicada para virar uma questão própria e então editada.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { ordenarAnos } from "../lib/util.js";

const LETRAS = ["A", "B", "C", "D"];
const VAZIA = { id: null, habilidade_id: "", enunciado: "", alt_a: "", alt_b: "", alt_c: "", alt_d: "", correta: "A", explicacao: "" };

function Formulario({ inicial, habilidades, onSalvar, onCancelar }) {
  const [q, setQ] = useState(inicial);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const mudar = (campo) => (e) => setQ({ ...q, [campo]: e.target.value });

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    if (!q.habilidade_id) return setErro("Escolha o assunto.");
    if (!q.enunciado.trim() || LETRAS.some((l) => !q["alt_" + l.toLowerCase()].trim())) {
      return setErro("Preencha o enunciado e as 4 alternativas.");
    }
    setSalvando(true);
    const msg = await onSalvar(q);
    setSalvando(false);
    if (msg) setErro(msg);
  }

  return (
    <form className="card" onSubmit={salvar}>
      <h2>{q.id ? "Editar questão" : "Nova questão"}</h2>
      <label htmlFor="q-hab">Assunto</label>
      <select id="q-hab" value={q.habilidade_id} onChange={mudar("habilidade_id")}>
        <option value="">Escolha...</option>
        {habilidades.map((h) => <option key={h.id} value={h.id}>{h.serie} · {h.disciplina} · {h.nome}</option>)}
      </select>
      <label htmlFor="q-enun">Enunciado</label>
      <textarea id="q-enun" rows={3} maxLength={400} value={q.enunciado} onChange={mudar("enunciado")} />
      <p className="muted dica">Marque a bolinha da alternativa certa.</p>
      {LETRAS.map((l) => (
        <div className="alt-form" key={l}>
          <input type="radio" name="correta" aria-label={"Alternativa " + l + " é a certa"} checked={q.correta === l} onChange={() => setQ({ ...q, correta: l })} />
          <strong>{l}</strong>
          <input aria-label={"Alternativa " + l} maxLength={150} value={q["alt_" + l.toLowerCase()]} onChange={mudar("alt_" + l.toLowerCase())} />
        </div>
      ))}
      <label htmlFor="q-exp">Explicação da resposta</label>
      <textarea id="q-exp" rows={2} maxLength={300} value={q.explicacao || ""} onChange={mudar("explicacao")}
        placeholder="Explique em uma ou duas frases por que essa é a resposta certa." />
      <p className="muted dica">Aparece para o aprendiz quando ele erra. É o que transforma o erro em aprendizado.</p>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="btn" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar questão"}</button>
      <button className="btn outline" type="button" style={{ marginTop: 8 }} onClick={onCancelar}>Cancelar</button>
    </form>
  );
}

export default function Questoes({ sessao }) {
  const usuario = sessao.user;
  const [habilidades, setHabilidades] = useState([]);
  const [ano, setAno] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [aba, setAba] = useState("minhas");
  const [questoes, setQuestoes] = useState(null);
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    sb.from("habilidade").select("*").order("id").then(({ data }) => {
      setHabilidades(data || []);
      if (data?.length) setAno(ordenarAnos(new Set(data.map((h) => h.serie)))[0]);
    });
  }, []);

  const anos = useMemo(() => ordenarAnos(new Set(habilidades.map((h) => h.serie))), [habilidades]);
  const disciplinas = useMemo(
    () => [...new Set(habilidades.filter((h) => h.serie === ano).map((h) => h.disciplina))].sort(),
    [habilidades, ano]
  );
  useEffect(() => setDisciplina(disciplinas[0] || ""), [ano, disciplinas.join("|")]);
  const doFiltro = habilidades.filter((h) => h.serie === ano && h.disciplina === disciplina);
  const nomeHab = (id) => (habilidades.find((h) => h.id === id) || {}).nome || "";

  async function carregar() {
    if (!doFiltro.length) return setQuestoes([]);
    let consulta = sb
      .from("questao")
      .select("id, habilidade_id, enunciado, alt_a, alt_b, alt_c, alt_d, correta, explicacao, professor_id")
      .in("habilidade_id", doFiltro.map((h) => h.id))
      .order("id");
    consulta = aba === "minhas" ? consulta.eq("professor_id", usuario.id) : consulta.is("professor_id", null);
    const { data, error } = await consulta;
    if (error) return setErro("Não foi possível carregar as questões.");
    setQuestoes(data);
  }

  useEffect(() => { carregar(); }, [ano, disciplina, aba, habilidades.length]);

  // Salva uma questão própria (nova, duplicada ou editada). Devolve uma mensagem se der erro.
  async function salvar(q) {
    const dados = {
      habilidade_id: Number(q.habilidade_id),
      enunciado: q.enunciado.trim(),
      alt_a: q.alt_a.trim(), alt_b: q.alt_b.trim(), alt_c: q.alt_c.trim(), alt_d: q.alt_d.trim(),
      correta: q.correta,
      explicacao: (q.explicacao || "").trim() || null,
      professor_id: usuario.id,
    };
    const { error } = q.id
      ? await sb.from("questao").update(dados).eq("id", q.id)
      : await sb.from("questao").insert(dados);
    if (error) return "Não deu para salvar. Tente de novo.";
    setEditando(null);
    // Mostra a questão salva: vai para a aba "Minhas" com o ano e a disciplina dela.
    const h = habilidades.find((x) => x.id === dados.habilidade_id);
    if (h) { setAno(h.serie); setTimeout(() => setDisciplina(h.disciplina), 0); }
    setAba("minhas");
    carregar();
    return "";
  }

  async function excluir(q) {
    if (!window.confirm("Excluir esta questão? Não dá para desfazer.")) return;
    const { error } = await sb.from("questao").delete().eq("id", q.id);
    if (error) {
      // Questão já respondida em alguma sala não pode ser apagada (o relatório depende dela).
      return setErro("Não deu para excluir: esta questão já foi respondida em alguma sala.");
    }
    carregar();
  }

  return (
    <main className="largo">
      <Link to="/mestre">‹ Painel</Link>
      <h1>Questões</h1>
      <p className="muted">
        As questões <b>padrão</b> já vêm prontas. Você também pode criar as <b>suas</b>, ou duplicar uma padrão e adaptar para a sua turma.
      </p>

      {editando ? (
        <Formulario inicial={editando} habilidades={habilidades} onSalvar={salvar} onCancelar={() => setEditando(null)} />
      ) : (
        <button className="btn" type="button" onClick={() => setEditando({ ...VAZIA, habilidade_id: doFiltro[0]?.id || "" })}>
          + Nova questão
        </button>
      )}

      <div className="card">
        <div className="filtros">
          <div>
            <label htmlFor="f-ano">Ano</label>
            <select id="f-ano" value={ano} onChange={(e) => setAno(e.target.value)}>
              {anos.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="f-disc">Disciplina</label>
            <select id="f-disc" value={disciplina} onChange={(e) => setDisciplina(e.target.value)}>
              {disciplinas.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="abas" role="tablist">
          <button type="button" role="tab" aria-selected={aba === "minhas"} className={aba === "minhas" ? "ativa" : ""} onClick={() => setAba("minhas")}>Minhas</button>
          <button type="button" role="tab" aria-selected={aba === "padrao"} className={aba === "padrao" ? "ativa" : ""} onClick={() => setAba("padrao")}>Padrão</button>
        </div>
        {erro && <p className="erro" role="alert">{erro}</p>}
        {questoes === null && <p className="muted">Carregando...</p>}
        {questoes && questoes.length === 0 && (
          <p className="muted">
            {aba === "minhas" ? "Você ainda não criou questões para este ano e disciplina." : "Não há questões padrão para este ano e disciplina."}
          </p>
        )}
        {questoes && questoes.map((q) => (
          <div className="questao-item" key={q.id}>
            <span className="selo fechada">{nomeHab(q.habilidade_id)}</span>
            <p className="questao-enunciado">{q.enunciado}</p>
            <ol className="questao-alts" type="A">
              {LETRAS.map((l) => (
                <li key={l} className={q.correta === l ? "certa" : ""}>
                  {q["alt_" + l.toLowerCase()]} {q.correta === l && "✔"}
                </li>
              ))}
            </ol>
            {q.explicacao && <p className="muted dica"><b>Explicação:</b> {q.explicacao}</p>}
            <div className="linha">
              {q.professor_id ? (
                <>
                  <button className="btn pequeno outline" type="button" onClick={() => setEditando({ ...q, habilidade_id: String(q.habilidade_id) })}>Editar</button>
                  <button className="btn pequeno perigo" type="button" onClick={() => excluir(q)}>Excluir</button>
                </>
              ) : (
                <button className="btn pequeno outline" type="button"
                  onClick={() => setEditando({ ...q, id: null, professor_id: null, habilidade_id: String(q.habilidade_id) })}>
                  Duplicar e editar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
