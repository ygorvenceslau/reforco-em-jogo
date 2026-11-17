// Protótipo da masmorra solo: escolher classe → 3 ondas (a última é o chefão) → vitória.
// Acertar = atacar. Errar = levar dano e ver a explicação. Entre as ondas, um baú com recompensas.
import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { CLASSES, ONDAS, POCOES, medalha } from "./dados.js";
import { regras, estadoInicial, resumoPorAssunto } from "./regras.js";
import Questao from "./Questao.jsx";
import "./masmorra.css";

function Coracoes({ vida, max, escudo }) {
  return (
    <span className="coracoes" aria-label={`${vida} de ${max} corações`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < vida ? "" : "vazio"}>{i < vida ? "❤️" : "🖤"}</span>
      ))}
      {escudo && <span className="escudo-ativo" title="Escudo ativo">🛡️</span>}
    </span>
  );
}

function BarraVida({ atual, max }) {
  return (
    <div className="barra-vida" aria-label={`Vida do monstro: ${atual} de ${max}`}>
      <div style={{ width: (atual / max) * 100 + "%" }} />
      <span>{atual} / {max}</span>
    </div>
  );
}

function EscolhaClasse({ onEscolher }) {
  return (
    <div className="tela">
      <p className="marca-masmorra">Quizzes &amp; Masmorras · protótipo</p>
      <h1 className="titulo-masmorra">Masmorra da Língua Portuguesa</h1>
      <div className="pergaminho">
        <h2>Como jogar</h2>
        <ul className="lista-regras">
          <li>⚔️ <b>Acertou?</b> Você ataca o monstro.</li>
          <li>💥 <b>Acertos seguidos</b> viram golpe crítico (dano em dobro).</li>
          <li>💔 <b>Errou?</b> O monstro te acerta, e você vê a explicação da resposta.</li>
          <li>🧪 <b>Poções</b> ajudam: cura, visão (tira 2 alternativas erradas) e escudo.</li>
          <li>🎁 Entre as ondas, abra o <b>baú</b> e escolha uma recompensa.</li>
          <li>🐉 Vença 3 ondas e desencante o <b>Dragão da Gramática</b>!</li>
        </ul>
      </div>
      <h2 className="subtitulo">Escolha sua classe</h2>
      <div className="classes">
        {CLASSES.map((c) => (
          <button key={c.id} type="button" className="carta-classe" onClick={() => onEscolher(c.id)}>
            <span className="icone-grande">{c.icone}</span>
            <strong>{c.nome}</strong>
            <span>{c.descricao}</span>
          </button>
        ))}
      </div>
      <Link className="link-claro" to="/masmorra/turma">Ver o modo turma (demonstração) →</Link>
      <Link className="link-claro" to="/">‹ Voltar ao início</Link>
    </div>
  );
}

function Batalha({ jogo, despachar }) {
  const onda = ONDAS[jogo.onda];
  const questao = jogo.baralho[jogo.indice];
  const { resposta, efeito, heroi } = jogo;
  const derrotado = jogo.monstroVida <= 0;
  const faltaParaCritico = jogo.classe.criticoACada - (jogo.sequencia % jogo.classe.criticoACada);

  return (
    <div className="tela">
      <div className="topo-batalha">
        <span className="onda">{onda.chefao ? "Chefão!" : `Onda ${jogo.onda + 1} de ${ONDAS.length}`}</span>
        <span className="heroi-info">
          {jogo.classe.icone} {heroi.espada && "🗡️"} <Coracoes vida={heroi.vida} max={heroi.vidaMax} escudo={heroi.escudo} />
        </span>
      </div>

      <div className={"arena" + (onda.chefao ? " chefao" : "")}>
        {jogo.respostasNaOnda === 0 && <div className="fala">“{onda.fala}”</div>}
        <div
          key={efeito?.id}
          className={
            "monstro" +
            (derrotado ? " desencantado" : "") +
            (efeito?.tipo === "acerto" || efeito?.tipo === "critico" ? " levou-golpe" : "") +
            (efeito?.tipo === "erro" ? " atacou" : "")
          }
        >
          {derrotado ? "✨" : onda.icone}
        </div>
        {efeito && (efeito.tipo === "acerto" || efeito.tipo === "critico") && (
          <div key={"d" + efeito.id} className={"dano" + (efeito.tipo === "critico" ? " critico" : "")}>
            {efeito.tipo === "critico" ? "CRÍTICO! " : ""}-{efeito.valor}
          </div>
        )}
        <p className="nome-monstro">{onda.nome}</p>
        <BarraVida atual={jogo.monstroVida} max={onda.vida} />
      </div>

      {efeito?.tipo === "erro" && <div key={"t" + efeito.id} className="tela-treme" />}

      <Questao
        questao={questao}
        resposta={resposta}
        eliminadas={jogo.eliminadas}
        onResponder={(i) => despachar({ tipo: "RESPONDER", opcao: i })}
      />

      <div aria-live="polite">
        {resposta?.acertou && (
          <p className="aviso-batalha bom">
            {derrotado
              ? `✨ ${onda.nome} foi desencantado!`
              : resposta.critico
                ? `💥 Golpe crítico! ${resposta.dano} de dano.`
                : `⚔️ Acertou! ${resposta.dano} de dano.`}
          </p>
        )}
        {resposta && !resposta.acertou && (
          <div className="explicacao">
            <p className="aviso-batalha ruim">
              {resposta.bloqueou ? "🛡️ Seu escudo bloqueou o golpe!" : `${onda.icone} O monstro te acertou! −1 ❤️`}
            </p>
            <p><b>Por quê?</b> {questao.explicacao}</p>
            <button className="botao-ouro" type="button" onClick={() => despachar({ tipo: "AVANCAR" })}>Continuar</button>
          </div>
        )}
      </div>

      {!resposta && (
        <>
          <p className="sequencia">
            {jogo.sequencia > 0 ? `🔥 ${jogo.sequencia} seguido(s) · ` : ""}
            crítico em {faltaParaCritico} acerto(s)
          </p>
          <div className="cinto">
            {Object.entries(POCOES).map(([id, p]) => {
              const qtd = heroi.pocoes[id] || 0;
              const inutil =
                (id === "cura" && heroi.vida >= heroi.vidaMax) ||
                (id === "escudo" && heroi.escudo) ||
                (id === "visao" && jogo.eliminadas.length > 0);
              return (
                <button
                  key={id}
                  type="button"
                  className="pocao"
                  disabled={!qtd || inutil}
                  title={p.efeito}
                  onClick={() => despachar({ tipo: "USAR_POCAO", pocao: id })}
                >
                  <span className="icone-pocao">🧪{p.icone}</span>
                  <span>{p.nome.replace("Poção de ", "")}</span>
                  <span className="qtd">×{qtd}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Bau({ jogo, despachar }) {
  const proxima = ONDAS[jogo.onda + 1];
  return (
    <div className="tela">
      <h1 className="titulo-masmorra">🎁 Você encontrou um baú!</h1>
      <p className="texto-claro">Escolha uma recompensa antes de enfrentar {proxima.chefao ? "o chefão" : "a próxima onda"}: <b>{proxima.nome}</b> {proxima.icone}</p>
      <div className="classes">
        {jogo.bau.map((r) => (
          <button key={r.id} type="button" className="carta-classe" onClick={() => despachar({ tipo: "ESCOLHER_RECOMPENSA", recompensa: r })}>
            <span className="icone-grande">{r.icone}</span>
            <strong>{r.nome} <span className="tipo-recompensa">{r.tipo === "pocao" ? "poção" : "equipamento"}</span></strong>
            <span>{r.efeito}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Derrota({ jogo, despachar }) {
  return (
    <div className="tela centro">
      <div className="icone-enorme">😵‍💫</div>
      <h1 className="titulo-masmorra">Você desmaiou!</h1>
      <p className="texto-claro">Calma, aprendiz: errar faz parte. Respire, revise as explicações e tente de novo.</p>
      <p className="texto-claro">Você volta com os corações cheios, e o {ONDAS[jogo.onda].nome} também se recupera.</p>
      <button className="botao-ouro" type="button" onClick={() => despachar({ tipo: "TENTAR_DE_NOVO" })}>Tentar de novo</button>
    </div>
  );
}

function Vitoria({ jogo, despachar }) {
  const total = jogo.historico.length;
  const acertos = jogo.historico.filter((h) => h.acertou).length;
  const m = medalha(acertos, total, total - acertos);
  const assuntos = resumoPorAssunto(jogo.historico);
  return (
    <div className="tela">
      <div className="confete" aria-hidden="true">{["✨", "🎉", "⭐", "🎊", "✨", "⭐", "🎉"].map((c, i) => <span key={i} style={{ left: i * 14 + 4 + "%", animationDelay: i * 0.15 + "s" }}>{c}</span>)}</div>
      <h1 className="titulo-masmorra centro">🐉 → ✨<br />O Dragão foi desencantado!</h1>
      <div className="pergaminho centro">
        <div className="icone-enorme">{m.icone}</div>
        <h2>{m.nome}</h2>
        <p>{m.texto}</p>
        <p className="placar">{acertos} acertos em {total} questões</p>
      </div>
      <div className="pergaminho">
        <h2>Seu desempenho por assunto</h2>
        <p className="mini">É isto que o Mestre vê no relatório (abaixo de 60% aparece “Reforçar”).</p>
        <table className="tabela-masmorra">
          <tbody>
            {assuntos.map((a) => (
              <tr key={a.assunto}>
                <td>{a.assunto}</td>
                <td>{a.acertos}/{a.total}</td>
                <td><span className={"selo " + (a.percentual < 60 ? "reforcar" : "ok")}>{a.percentual < 60 ? "Reforçar" : `${a.percentual}%`}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="botao-ouro" type="button" onClick={() => despachar({ tipo: "REINICIAR" })}>Jogar de novo</button>
      <Link className="link-claro" to="/masmorra/turma">Ver o modo turma (demonstração) →</Link>
    </div>
  );
}

export default function Masmorra() {
  const [jogo, despachar] = useReducer(regras, estadoInicial);

  // Depois de um acerto, avança sozinho (o erro espera o "Continuar", para ler a explicação).
  useEffect(() => {
    if (jogo.fase === "batalha" && jogo.resposta?.acertou) {
      const t = setTimeout(() => despachar({ tipo: "AVANCAR" }), 1300);
      return () => clearTimeout(t);
    }
  }, [jogo.fase, jogo.resposta]);

  // Volta ao topo a cada tela nova.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [jogo.fase, jogo.onda]);

  return (
    <div className="masmorra">
      {jogo.fase === "escolha" && <EscolhaClasse onEscolher={(c) => despachar({ tipo: "ESCOLHER_CLASSE", classe: c })} />}
      {jogo.fase === "batalha" && <Batalha jogo={jogo} despachar={despachar} />}
      {jogo.fase === "bau" && <Bau jogo={jogo} despachar={despachar} />}
      {jogo.fase === "derrota" && <Derrota jogo={jogo} despachar={despachar} />}
      {jogo.fase === "vitoria" && <Vitoria jogo={jogo} despachar={despachar} />}
    </div>
  );
}
