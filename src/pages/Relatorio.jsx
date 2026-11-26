// Relatório de uma sala, que vira um painel AO VIVO enquanto a sala está aberta:
// a tela se atualiza sozinha a cada 5 segundos e o Mestre acompanha a aula pelo celular
// ou pelo notebook (sem projetar: aqui aparece quem errou).
// - Resumo: quantos aprendizes estão respondendo agora e o acerto geral.
// - Questões que mais confundiram: quantos marcaram cada alternativa e quem errou.
// - Por aprendiz e por assunto: as contas vêm de views do banco.
// Tudo respeita o RLS: o Mestre só vê as respostas das próprias salas.
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { formatarData } from "../lib/util.js";

const LIMITE_REFORCO = 60; // abaixo de 60% de acerto → "Reforçar"
const INTERVALO = 5000; // atualização ao vivo, em milissegundos
const ATIVO_MINUTOS = 2; // respondeu nos últimos 2 minutos = "respondendo agora"
const LETRAS = ["A", "B", "C", "D"];

function Situacao({ percentual }) {
  if (percentual === null || percentual === undefined) return <span className="selo fechada">Sem respostas</span>;
  if (percentual < LIMITE_REFORCO) return <span className="selo reforcar">Reforçar</span>;
  return <span className="selo ok">Bom</span>;
}

const pct = (p) => (p === null ? "-" : p + "%");

function tempoDesde(data, agora) {
  if (!data) return "-";
  const s = Math.max(0, Math.round((agora - new Date(data).getTime()) / 1000));
  if (s < 60) return "agora";
  const m = Math.round(s / 60);
  if (m < 60) return `há ${m} min`;
  return `há ${Math.round(m / 60)} h`;
}

// Junta as respostas por questão: quantos marcaram cada alternativa e quem errou.
// Fica só com as questões que tiveram erro, da que mais confundiu para a que menos confundiu.
function questoesComErro(respostas, detalhes) {
  const mapa = new Map();
  for (const r of respostas) {
    let q = mapa.get(r.questao_id);
    if (!q) {
      q = { questao_id: r.questao_id, respondidas: 0, acertos: 0, marcadas: { A: 0, B: 0, C: 0, D: 0 }, erraram: [] };
      mapa.set(r.questao_id, q);
    }
    q.respondidas++;
    q.marcadas[r.escolhida]++;
    if (r.correta) q.acertos++;
    else q.erraram.push(r.participante.nome);
  }
  return [...mapa.values()]
    .filter((q) => q.acertos < q.respondidas && detalhes.has(q.questao_id))
    .map((q) => ({ ...q, ...detalhes.get(q.questao_id), percentual: Math.round((100 * q.acertos) / q.respondidas) }))
    .sort((a, b) => a.percentual - b.percentual || b.respondidas - a.respondidas);
}

// Uma questão: barras com quantos marcaram cada alternativa.
// A alternativa errada mais marcada mostra a confusão da turma.
function QuestaoConfusa({ q }) {
  const maiorErrada = Math.max(...LETRAS.filter((l) => l !== q.correta).map((l) => q.marcadas[l]));
  return (
    <div className="questao-item">
      <div className="linha">
        <span className="selo fechada">{q.assunto}</span>
        <Situacao percentual={q.percentual} />
      </div>
      <p className="questao-enunciado">{q.enunciado}</p>
      <p className="muted dica">{q.acertos} de {q.respondidas} acertaram ({q.percentual}%)</p>
      <ul className="distribuicao">
        {LETRAS.map((l) => {
          const n = q.marcadas[l];
          const certa = l === q.correta;
          const confusao = !certa && n > 0 && n === maiorErrada;
          return (
            <li key={l} className={certa ? "certa" : confusao ? "confusao" : ""}>
              <span className="letra">{l}</span>
              <span className="texto">
                {q.alternativas[l]}
                {certa && <b> ✓ certa</b>}
                {confusao && <b> ← mais marcada entre as erradas</b>}
              </span>
              <span className="barra" aria-hidden="true"><i style={{ width: (100 * n) / q.respondidas + "%" }} /></span>
              <span className="qtd">{n}</span>
            </li>
          );
        })}
      </ul>
      <details className="quem-errou">
        <summary>Quem errou ({q.erraram.length})</summary>
        <p>{q.erraram.join(", ")}</p>
      </details>
      {q.explicacao && <p className="muted dica"><b>Explicação:</b> {q.explicacao}</p>}
    </div>
  );
}

export default function Relatorio() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [assuntos, setAssuntos] = useState(null);
  const [aprendizes, setAprendizes] = useState(null);
  const [respostas, setRespostas] = useState(null);
  const [erro, setErro] = useState("");
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  const [todas, setTodas] = useState(false);
  const detalhes = useRef(new Map()); // enunciado e alternativas de cada questão (buscados uma vez só)
  const [, setVersaoDetalhes] = useState(0);
  const salaAberta = useRef(true);
  const ocupado = useRef(false);

  async function carregar(valida = () => true) {
    if (ocupado.current) return; // a consulta anterior ainda não voltou
    ocupado.current = true;
    try {
      // As quatro consultas rodam ao mesmo tempo.
      const [sala, a, b, r] = await Promise.all([
        sb.from("sessao").select("codigo, ativa, criada_em, serie, disciplina, modo, habilidade(nome)").eq("id", id).maybeSingle(),
        sb.from("v_acertos_por_assunto").select("*").eq("sessao_id", id).order("percentual"),
        sb.from("v_acertos_por_aluno").select("*").eq("sessao_id", id)
          .order("percentual", { ascending: true, nullsFirst: false }).order("nome"),
        // Cada resposta com o nome de quem respondeu (só desta sala).
        sb.from("resposta").select("questao_id, escolhida, correta, respondida_em, participante!inner(id, nome, sessao_id)")
          .eq("participante.sessao_id", id),
      ]);
      if (!valida()) return;
      if (sala.error) return setErro("Sem conexão com o servidor. Tentando de novo…");
      if (!sala.data) return setErro("Sala não encontrada.");
      if (a.error || b.error || r.error) return setErro("Sem conexão com o servidor. Tentando de novo…");

      // Busca o texto só das questões que ainda não conhecemos.
      const novas = [...new Set(r.data.map((x) => x.questao_id))].filter((q) => !detalhes.current.has(q));
      if (novas.length) {
        const q = await sb.from("questao").select("id, enunciado, explicacao, correta, alt_a, alt_b, alt_c, alt_d, habilidade(nome)").in("id", novas);
        if (!valida()) return;
        for (const x of q.data || []) {
          detalhes.current.set(x.id, {
            enunciado: x.enunciado, explicacao: x.explicacao, correta: x.correta, assunto: x.habilidade?.nome || "",
            alternativas: { A: x.alt_a, B: x.alt_b, C: x.alt_c, D: x.alt_d },
          });
        }
        setVersaoDetalhes((v) => v + 1);
      }

      salaAberta.current = sala.data.ativa;
      setInfo(sala.data);
      setAssuntos(a.data);
      setAprendizes(b.data);
      setRespostas(r.data);
      setErro("");
      setAtualizadoEm(new Date());
    } finally {
      ocupado.current = false;
    }
  }

  // Ao vivo: atualiza a cada 5 s enquanto a sala está aberta e a aba está visível.
  useEffect(() => {
    let ativo = true;
    const valida = () => ativo;
    carregar(valida);
    const t = setInterval(() => {
      if (salaAberta.current && document.visibilityState === "visible") carregar(valida);
    }, INTERVALO);
    const aoVoltar = () => document.visibilityState === "visible" && salaAberta.current && carregar(valida);
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      ativo = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [id]);

  const agora = atualizadoEm ? atualizadoEm.getTime() : Date.now();
  const lista = respostas ? questoesComErro(respostas, detalhes.current) : null;
  const paraReforcar = (aprendizes || []).filter((x) => x.percentual !== null && x.percentual < LIMITE_REFORCO).length;

  // Última resposta de cada aprendiz e quem respondeu nos últimos minutos.
  const ultima = new Map();
  for (const r of respostas || []) {
    const pid = r.participante.id;
    if (!ultima.has(pid) || r.respondida_em > ultima.get(pid)) ultima.set(pid, r.respondida_em);
  }
  const ativosAgora = [...ultima.values()].filter((d) => agora - new Date(d).getTime() < ATIVO_MINUTOS * 60000).length;
  const totalRespostas = respostas ? respostas.length : 0;
  const totalAcertos = respostas ? respostas.filter((r) => r.correta).length : 0;
  const acertoGeral = totalRespostas ? Math.round((100 * totalAcertos) / totalRespostas) : null;

  return (
    <main className="largo">
      <Link to="/mestre">‹ Painel</Link>
      <div className="linha">
        <h1>{info?.ativa ? "Sala ao vivo" : "Relatório da sala"}</h1>
        {info?.ativa && (
          <span className="ao-vivo" title="A tela se atualiza sozinha a cada 5 segundos">
            <i /> Ao vivo{atualizadoEm && " · " + atualizadoEm.toLocaleTimeString("pt-BR")}
          </span>
        )}
      </div>
      {info && (
        <p className="muted">
          Código {info.codigo} · {info.serie} · {info.disciplina} · {info.habilidade ? info.habilidade.nome : "Todos os assuntos"} ·{" "}
          {formatarData(info.criada_em)} · {info.ativa ? "Aberta" : "Encerrada"}
        </p>
      )}
      {info?.ativa && (
        <p className="muted dica">
          Acompanhe por aqui no seu celular ou notebook. Esta tela mostra quem errou: não é para projetar
          {info.modo === "turma" && <> (para a turma, use a <Link to={"/mestre/sessao/" + id + "/lousa"}>lousa</Link>)</>}.
        </p>
      )}
      {erro && <p className="erro" role="alert">{erro}</p>}

      {respostas && (
        <div className="resumo-vivo">
          <div><b>{aprendizes?.length ?? 0}</b><span>aprendiz(es) na sala</span></div>
          <div><b>{ativosAgora}</b><span>respondendo agora</span></div>
          <div><b>{totalRespostas}</b><span>respostas</span></div>
          <div><b>{pct(acertoGeral)}</b><span>de acerto geral</span></div>
        </div>
      )}

      <div className="card">
        <h2>Questões que mais confundiram</h2>
        <p className="muted">
          A alternativa errada mais marcada mostra a confusão da turma: um bom ponto para retomar
          {info?.ativa ? " ainda nesta aula." : " na próxima aula."}
        </p>
        {lista && lista.length === 0 && <p className="muted">Nenhuma questão com erros ainda.</p>}
        {lista && (todas ? lista : lista.slice(0, 5)).map((q) => <QuestaoConfusa key={q.questao_id} q={q} />)}
        {lista && lista.length > 5 && (
          <button className="btn outline pequeno" type="button" onClick={() => setTodas(!todas)}>
            {todas ? "Mostrar só as 5 primeiras" : `Ver todas (${lista.length})`}
          </button>
        )}
      </div>

      <div className="card">
        <h2>Por aprendiz</h2>
        {aprendizes && aprendizes.length === 0 && <p className="muted">Nenhum aprendiz entrou ainda.</p>}
        {aprendizes && aprendizes.length > 0 && (
          <>
            <p className="muted">{aprendizes.length} aprendiz(es) · {paraReforcar} para reforçar</p>
            <div className="rolagem">
            <table>
              <thead><tr><th>Aprendiz</th><th>Acertos</th><th>%</th><th>Última resposta</th><th>Situação</th></tr></thead>
              <tbody>
                {aprendizes.map((x) => (
                  <tr key={x.participante_id}>
                    <td>{x.nome}</td><td>{x.acertos} de {x.respondidas}</td><td>{pct(x.percentual)}</td>
                    <td>{tempoDesde(ultima.get(x.participante_id), agora)}</td>
                    <td><Situacao percentual={x.percentual} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2>Acertos por assunto</h2>
        <p className="muted">“Reforçar” aparece quando o grupo acertou menos de 60%.</p>
        {assuntos && assuntos.length === 0 && <p className="muted">Ainda não há respostas.</p>}
        {assuntos && assuntos.length > 0 && (
          <table>
            <thead><tr><th>Assunto</th><th>Acertos</th><th>%</th><th>Situação</th></tr></thead>
            <tbody>
              {assuntos.map((x) => (
                <tr key={x.assunto}>
                  <td>{x.assunto}</td><td>{x.acertos} de {x.respondidas}</td><td>{pct(x.percentual)}</td>
                  <td><Situacao percentual={x.percentual} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!info?.ativa && <button className="btn outline" type="button" onClick={() => carregar()}>Atualizar</button>}
    </main>
  );
}
