// Lousa do Mestre no modo turma: para projetar na sala.
// Mostra o código para os aprendizes entrarem, o chefão com a vida da turma e os golpes.
// A cada 2 segundos pergunta ao servidor o estado da batalha (estado_turma_mestre).
// Só os acertos aparecem: ninguém é exposto por errar.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { ondasDe } from "../masmorra/dados.js";
import { BarraVida } from "../masmorra/Questao.jsx";
import "../masmorra/masmorra.css";

// Vida do chefão: 5 golpes por aprendiz (mínimo 10), para a batalha durar alguns minutos.
const vidaPara = (aprendizes) => Math.max(10, aprendizes * 5);

export default function Lousa() {
  const { id } = useParams();
  const [sala, setSala] = useState(null);
  const [estado, setEstado] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    sb.from("sessao").select("codigo, disciplina, serie, ativa, modo").eq("id", id).maybeSingle()
      .then(({ data, error }) => (error || !data ? setErro("Sala não encontrada.") : setSala(data)));
  }, [id]);

  useEffect(() => {
    let ativo = true;
    async function atualizar() {
      const { data, error } = await sb.rpc("estado_turma_mestre", { p_sessao: id });
      if (!ativo) return;
      if (error) setErro("Sem conexão com o servidor.");
      else if (data) { setErro(""); setEstado(data); }
    }
    atualizar();
    const t = setInterval(atualizar, 2000);
    return () => {
      ativo = false;
      clearInterval(t);
    };
  }, [id]);

  async function comecar() {
    const { error } = await sb.rpc("iniciar_turma", { p_sessao: id, p_vida: vidaPara(estado?.aprendizes || 0) });
    if (error) return setErro("Não deu para começar a batalha.");
    const { data } = await sb.rpc("estado_turma_mestre", { p_sessao: id });
    if (data) setEstado(data);
  }

  if (!sala || !estado) {
    return <div className="masmorra"><div className="tela"><p className="texto-claro">{erro || "Abrindo a lousa..."}</p></div></div>;
  }

  const chefao = ondasDe(sala.disciplina)[2];
  const link = location.origin + "/jogar?codigo=" + sala.codigo;
  const vida = Math.max(0, estado.vida_max - estado.dano);
  const vencida = estado.iniciada && vida <= 0;

  return (
    <div className="masmorra">
      <div className="tela larga">
        <div className="topo-batalha">
          <Link className="link-claro" to="/mestre">‹ Painel</Link>
          <span className="onda">{sala.serie} · {sala.disciplina}</span>
        </div>

        {!estado.iniciada && (
          <div className="lousa centro">
            <p className="rotulo">Entre pelo celular</p>
            <p className="codigo-lousa">{sala.codigo}</p>
            <p className="texto-claro">{link.replace(/^https?:\/\//, "")}</p>
            <div className="monstro chefao-grande">{chefao.icone}</div>
            <p className="nome-monstro">{chefao.nome}</p>
            <p className="titulo-masmorra">{estado.aprendizes} aprendiz(es) na sala</p>
            <button className="botao-ouro" type="button" onClick={comecar} disabled={!sala.ativa}>
              ⚔️ Começar a batalha
            </button>
            <p className="mini claro">A vida do chefão é calculada pelo número de aprendizes: {vidaPara(estado.aprendizes)} de vida agora.</p>
          </div>
        )}

        {estado.iniciada && (
          <div className="duas-telas">
            <section className="lousa">
              <p className="rotulo">Código {sala.codigo} · {estado.aprendizes} aprendiz(es)</p>
              <div className={"monstro chefao-grande" + (vencida ? " desencantado" : "")} key={estado.dano}>
                {vencida ? "✨" : chefao.icone}
              </div>
              <p className="nome-monstro">{chefao.nome}</p>
              <BarraVida atual={vida} max={estado.vida_max} grande />
              {vencida && <p className="titulo-masmorra">🏆 A turma venceu!</p>}
            </section>
            <section className="celular">
              <p className="rotulo">⚔️ Golpes da turma</p>
              <ul className="feed">
                {estado.golpes.map((g) => <li key={g.id}>⚔️ {g.nome} acertou! −1</li>)}
                {estado.golpes.length === 0 && <li className="vazio">A batalha começou! Respondam no celular…</li>}
              </ul>
              <p className="mini claro">Total de acertos: {estado.dano}</p>
              {vencida && (
                <>
                  <button className="botao-ouro" type="button" onClick={comecar}>Nova batalha</button>
                  <Link className="link-claro" to={"/mestre/sessao/" + id}>Ver relatório da sala →</Link>
                </>
              )}
            </section>
          </div>
        )}
        {erro && <p className="aviso-batalha ruim">{erro}</p>}
      </div>
    </div>
  );
}
