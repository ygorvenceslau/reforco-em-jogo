// Relatório de uma sala: acertos por assunto e por aprendiz.
// As contas são feitas no banco por duas views; aqui só desenhamos as tabelas.
// As views respeitam o RLS: o Mestre só vê os próprios aprendizes.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { formatarData } from "../lib/util.js";

const LIMITE_REFORCO = 60; // abaixo de 60% de acerto → "Reforçar"

function Situacao({ percentual }) {
  if (percentual === null) return <span className="selo fechada">Sem respostas</span>;
  if (percentual < LIMITE_REFORCO) return <span className="selo reforcar">Reforçar</span>;
  return <span className="selo ok">Bom</span>;
}

const pct = (p) => (p === null ? "-" : p + "%");

export default function Relatorio() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [assuntos, setAssuntos] = useState(null);
  const [aprendizes, setAprendizes] = useState(null);
  const [erro, setErro] = useState("");

  async function carregar() {
    setErro("");
    const sala = await sb
      .from("sessao")
      .select("codigo, ativa, criada_em, serie, disciplina, habilidade(nome)")
      .eq("id", id)
      .maybeSingle();
    if (sala.error || !sala.data) return setErro("Sala não encontrada.");
    setInfo(sala.data);

    // As duas consultas rodam ao mesmo tempo.
    const [a, b] = await Promise.all([
      sb.from("v_acertos_por_assunto").select("*").eq("sessao_id", id).order("percentual"),
      sb.from("v_acertos_por_aluno").select("*").eq("sessao_id", id)
        .order("percentual", { ascending: true, nullsFirst: false }).order("nome"),
    ]);
    if (a.error || b.error) return setErro("Não foi possível carregar o relatório.");
    setAssuntos(a.data);
    setAprendizes(b.data);
  }

  useEffect(() => { carregar(); }, [id]);

  const paraReforcar = (aprendizes || []).filter((x) => x.percentual !== null && x.percentual < LIMITE_REFORCO).length;

  return (
    <main className="largo">
      <Link to="/mestre">‹ Painel</Link>
      <h1>Relatório da sala</h1>
      {info && (
        <p className="muted">
          Código {info.codigo} · {info.serie} · {info.disciplina} · {info.habilidade ? info.habilidade.nome : "Todos os assuntos"} ·{" "}
          {formatarData(info.criada_em)} · {info.ativa ? "Aberta" : "Encerrada"}
        </p>
      )}
      {erro && <p className="erro" role="alert">{erro}</p>}

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

      <div className="card">
        <h2>Por aprendiz</h2>
        {aprendizes && aprendizes.length === 0 && <p className="muted">Nenhum aprendiz entrou ainda.</p>}
        {aprendizes && aprendizes.length > 0 && (
          <>
            <p className="muted">{aprendizes.length} aprendiz(es) · {paraReforcar} para reforçar</p>
            <table>
              <thead><tr><th>Aprendiz</th><th>Acertos</th><th>%</th><th>Situação</th></tr></thead>
              <tbody>
                {aprendizes.map((x) => (
                  <tr key={x.participante_id}>
                    <td>{x.nome}</td><td>{x.acertos} de {x.respondidas}</td><td>{pct(x.percentual)}</td>
                    <td><Situacao percentual={x.percentual} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <button className="btn outline" type="button" onClick={carregar}>Atualizar</button>
    </main>
  );
}
