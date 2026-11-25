// Banco de questões do Mestre.
// - Padrão: questões prontas da plataforma (todo Mestre vê, ninguém edita).
// - Minhas: questões criadas por este Mestre (só ele vê, edita e apaga).
// Série, disciplina e assunto são digitados livremente (com sugestões): o Mestre pode criar
// conteúdo para qualquer nível, não só o Ensino Fundamental. Combinações novas viram
// "habilidades" deste Mestre; combinações que já existem são reaproveitadas.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { ordenarAnos } from "../lib/util.js";
import Chips from "../components/Chips.jsx";

const LETRAS = ["A", "B", "C", "D"];
const VAZIA = { id: null, serie: "", disciplina: "", assunto: "", enunciado: "", alt_a: "", alt_b: "", alt_c: "", alt_d: "", correta: "A", explicacao: "" };
const limpo = (t) => (t || "").trim().replace(/\s+/g, " ");
const igual = (a, b) => limpo(a).toLowerCase() === limpo(b).toLowerCase();
const unicos = (lista) => [...new Set(lista.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));

function Formulario({ inicial, habilidades, onSalvar, onCancelar }) {
  const [q, setQ] = useState(inicial);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const mudar = (campo) => (e) => setQ({ ...q, [campo]: e.target.value });

  // Sugestões: tudo o que já existe, filtrado pelo que já foi preenchido.
  const series = ordenarAnos(new Set(habilidades.map((h) => h.serie)));
  const disciplinas = unicos(habilidades.filter((h) => !limpo(q.serie) || igual(h.serie, q.serie)).map((h) => h.disciplina));
  const assuntos = unicos(habilidades
    .filter((h) => (!limpo(q.serie) || igual(h.serie, q.serie)) && (!limpo(q.disciplina) || igual(h.disciplina, q.disciplina)))
    .map((h) => h.nome));
  const novo = limpo(q.serie) && limpo(q.disciplina) && limpo(q.assunto) &&
    !habilidades.some((h) => igual(h.serie, q.serie) && igual(h.disciplina, q.disciplina) && igual(h.nome, q.assunto));

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    if (!limpo(q.serie) || !limpo(q.disciplina) || !limpo(q.assunto)) return setErro("Preencha série, disciplina e assunto.");
    if (!limpo(q.enunciado) || LETRAS.some((l) => !limpo(q["alt_" + l.toLowerCase()]))) {
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
      <p className="muted dica" style={{ marginBottom: 6 }}>
        Digite ou escolha nas sugestões. Pode ser qualquer nível: “3º ano (Ensino Médio)”, “Curso de Inglês”, “Pré-vestibular”...
      </p>
      <div>
        <div>
          <label htmlFor="q-serie">Série / ano / turma</label>
          <input id="q-serie" list="lista-series" maxLength={40} value={q.serie} onChange={mudar("serie")} placeholder="Ex.: 6º ano" />
          <datalist id="lista-series">{series.map((x) => <option key={x} value={x} />)}</datalist>
        </div>
        <div>
          <label htmlFor="q-disc">Disciplina</label>
          <input id="q-disc" list="lista-disciplinas" maxLength={40} value={q.disciplina} onChange={mudar("disciplina")} placeholder="Ex.: Matemática" />
          <datalist id="lista-disciplinas">{disciplinas.map((x) => <option key={x} value={x} />)}</datalist>
        </div>
      </div>
      <label htmlFor="q-assunto">Assunto / matéria</label>
      <input id="q-assunto" list="lista-assuntos" maxLength={60} value={q.assunto} onChange={mudar("assunto")} placeholder="Ex.: Frações" />
      <datalist id="lista-assuntos">{assuntos.map((x) => <option key={x} value={x} />)}</datalist>
      {novo && <p className="aviso-ok dica">✨ Novo assunto: será criado só para você.</p>}

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
  const [versao, setVersao] = useState(0); // muda para pedir uma nova busca da lista

  async function carregarHabilidades() {
    // O RLS devolve as habilidades padrão e as criadas por este Mestre.
    const { data } = await sb.from("habilidade").select("*").order("id");
    setHabilidades(data || []);
    return data || [];
  }

  useEffect(() => {
    carregarHabilidades().then((data) => {
      if (data.length && !ano) setAno(ordenarAnos(new Set(data.map((h) => h.serie)))[0]);
    });
  }, []);

  const anos = useMemo(() => ordenarAnos(new Set(habilidades.map((h) => h.serie))), [habilidades]);
  const disciplinas = useMemo(
    () => unicos(habilidades.filter((h) => h.serie === ano).map((h) => h.disciplina)),
    [habilidades, ano]
  );
  useEffect(() => {
    if (!disciplinas.includes(disciplina)) setDisciplina(disciplinas[0] || "");
  }, [ano, disciplinas.join("|")]);
  const doFiltro = habilidades.filter((h) => h.serie === ano && h.disciplina === disciplina);
  const habDe = (id) => habilidades.find((h) => h.id === id) || {};

  // Busca a lista sempre que os filtros mudam ou algo é salvo/excluído.
  // "valida" descarta respostas atrasadas de buscas antigas (sem isso, uma busca lenta
  // com os filtros anteriores podia chegar por último e mostrar a lista errada).
  useEffect(() => {
    let valida = true;
    if (!doFiltro.length) {
      setQuestoes([]);
      return;
    }
    let consulta = sb
      .from("questao")
      .select("id, habilidade_id, enunciado, alt_a, alt_b, alt_c, alt_d, correta, explicacao, professor_id")
      .in("habilidade_id", doFiltro.map((h) => h.id))
      .order("id");
    consulta = aba === "minhas" ? consulta.eq("professor_id", usuario.id) : consulta.is("professor_id", null);
    consulta.then(({ data, error }) => {
      if (!valida) return;
      if (error) return setErro("Não foi possível carregar as questões.");
      setQuestoes(data);
    });
    return () => {
      valida = false;
    };
  }, [ano, disciplina, aba, habilidades.length, versao]);

  // Acha a habilidade (série + disciplina + assunto) já existente, ou cria uma deste Mestre.
  async function habilidadePara(q) {
    const achar = (lista) => lista.find((h) => igual(h.serie, q.serie) && igual(h.disciplina, q.disciplina) && igual(h.nome, q.assunto));
    const existente = achar(habilidades);
    if (existente) return existente;
    const { data, error } = await sb.from("habilidade")
      .insert({ serie: limpo(q.serie), disciplina: limpo(q.disciplina), nome: limpo(q.assunto), professor_id: usuario.id })
      .select("*").single();
    if (!error) return data;
    // Se ela foi criada há pouco (em outra aba), recarrega a lista e usa a existente.
    return achar(await carregarHabilidades()) || null;
  }

  // Salva uma questão própria (nova, duplicada ou editada). Devolve uma mensagem se der erro.
  async function salvar(q) {
    const h = await habilidadePara(q);
    if (!h) return "Não deu para salvar o assunto. Tente de novo.";
    const dados = {
      habilidade_id: h.id,
      enunciado: limpo(q.enunciado),
      alt_a: limpo(q.alt_a), alt_b: limpo(q.alt_b), alt_c: limpo(q.alt_c), alt_d: limpo(q.alt_d),
      correta: q.correta,
      explicacao: limpo(q.explicacao) || null,
      professor_id: usuario.id,
    };
    const { error } = q.id
      ? await sb.from("questao").update(dados).eq("id", q.id)
      : await sb.from("questao").insert(dados);
    if (error) return "Não deu para salvar. Tente de novo.";
    setEditando(null);
    // Mostra a questão salva: aba "Minhas", na série e na disciplina dela.
    await carregarHabilidades();
    setAno(h.serie);
    setDisciplina(h.disciplina);
    setAba("minhas");
    setVersao((v) => v + 1);
    return "";
  }

  async function excluir(q) {
    if (!window.confirm("Excluir esta questão? Não dá para desfazer.")) return;
    const { error } = await sb.from("questao").delete().eq("id", q.id);
    if (error) {
      // Questão já respondida em alguma sala não pode ser apagada (o relatório depende dela).
      return setErro("Não deu para excluir: esta questão já foi respondida em alguma sala.");
    }
    setVersao((v) => v + 1);
  }

  // Abre o formulário a partir de uma questão (para editar ou duplicar).
  const paraFormulario = (q, duplicar) => {
    const h = habDe(q.habilidade_id);
    return { ...q, id: duplicar ? null : q.id, serie: h.serie || "", disciplina: h.disciplina || "", assunto: h.nome || "" };
  };

  return (
    <main className="largo">
      <Link to="/mestre">‹ Painel</Link>
      <h1>Questões</h1>
      <p className="muted">
        As questões <b>padrão</b> já vêm prontas. Você também pode criar as <b>suas</b>, para qualquer série, disciplina ou assunto,
        ou duplicar uma padrão e adaptar para a sua turma.
      </p>

      {editando ? (
        <Formulario inicial={editando} habilidades={habilidades} onSalvar={salvar} onCancelar={() => setEditando(null)} />
      ) : (
        <button className="btn" type="button" onClick={() => setEditando({ ...VAZIA, serie: ano, disciplina })}>
          + Nova questão
        </button>
      )}

      <div className="card">
        <Chips rotulo="Série / ano" valor={ano} onEscolher={setAno} opcoes={anos.map((a) => ({ valor: a, rotulo: a }))} />
        <Chips rotulo="Disciplina" valor={disciplina} onEscolher={setDisciplina} opcoes={disciplinas.map((d) => ({ valor: d, rotulo: d }))} />
        <div className="abas" role="tablist">
          <button type="button" role="tab" aria-selected={aba === "minhas"} className={aba === "minhas" ? "ativa" : ""} onClick={() => setAba("minhas")}>Minhas</button>
          <button type="button" role="tab" aria-selected={aba === "padrao"} className={aba === "padrao" ? "ativa" : ""} onClick={() => setAba("padrao")}>Padrão</button>
        </div>
        {erro && <p className="erro" role="alert">{erro}</p>}
        {questoes === null && <p className="muted">Carregando...</p>}
        {questoes && questoes.length === 0 && (
          <p className="muted">
            {aba === "minhas" ? "Você ainda não criou questões para esta série e disciplina." : "Não há questões padrão para esta série e disciplina."}
          </p>
        )}
        {questoes && questoes.map((q) => (
          <div className="questao-item" key={q.id}>
            <span className="selo fechada">{habDe(q.habilidade_id).nome}</span>
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
                <span style={{ display: "flex", gap: 8 }}>
                  <button className="btn pequeno outline" type="button" onClick={() => setEditando(paraFormulario(q, false))}>Editar</button>
                  <button className="btn pequeno perigo" type="button" onClick={() => excluir(q)}>Excluir</button>
                </span>
              ) : (
                <button className="btn pequeno outline" type="button" onClick={() => setEditando(paraFormulario(q, true))}>
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
