// Masmorra solo: escolher classe → 3 ondas (a última é o chefão) → vitória.
// Acertar = atacar. Errar = levar dano e ver a explicação. Entre as ondas, um baú com recompensas.
// A "fonte" (fontes.js) decide de onde vêm as questões e quem corrige:
// no protótipo é o próprio navegador; na sala do Mestre é o servidor.
import { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { CLASSES, POCOES, medalha, ondasDe } from "./dados.js";
import { regras, estadoInicial, resumoPorAssunto } from "./regras.js";
import Questao, { BarraVida } from "./Questao.jsx";
import { EfeitoAtaque, EfeitoEscudo, EfeitoGarras } from "./Efeitos.jsx";
import { som, BotaoSom } from "./sons.jsx";
import "./masmorra.css";

// Frasco de poção desenhado em CSS (cor do líquido por tipo: cura, visão, escudo).
function Frasco({ tipo, grande = false }) {
  return (
    <span className={"frasco frasco-" + tipo + (grande ? " grande" : "")} aria-hidden="true">
      <span className="liquido"><i /><i /><i /></span>
    </span>
  );
}

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

function EscolhaClasse({ ondas, titulo, marca, prototipo, onEscolher }) {
  const chefao = ondas[ondas.length - 1];
  return (
    <div className="tela">
      <div className="topo-batalha">
        <p className="marca-masmorra">{marca}</p>
        <BotaoSom />
      </div>
      <h1 className="titulo-masmorra">{titulo}</h1>
      <div className="pergaminho">
        <h2>Como jogar</h2>
        <ul className="lista-regras">
          <li>⚔️ <b>Acertou?</b> Você ataca o monstro.</li>
          <li>💥 <b>Acertos seguidos</b> viram golpe crítico (dano em dobro).</li>
          <li>💔 <b>Errou?</b> O monstro te acerta, e você vê a explicação da resposta.</li>
          <li>🧪 <b>Poções</b> ajudam: cura, visão (tira 2 alternativas erradas) e escudo.</li>
          <li>🎁 Entre as ondas, abra o <b>baú</b> e escolha uma recompensa.</li>
          <li>{chefao.icone} Vença {ondas.length} ondas e desencante o <b>{chefao.nome}</b>!</li>
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
      {prototipo && <Link className="link-claro" to="/masmorra/turma">Ver o modo turma (demonstração) →</Link>}
      <Link className="link-claro" to="/">‹ Voltar ao início</Link>
    </div>
  );
}

function Batalha({ jogo, ondas, enviando, erro, onResponder, onPocao, onContinuar }) {
  const onda = ondas[jogo.onda];
  const questao = jogo.baralho[jogo.indice];
  const { resposta, efeito, heroi } = jogo;
  const derrotado = jogo.monstroVida <= 0;
  const faltaParaCritico = jogo.classe.criticoACada - (jogo.sequencia % jogo.classe.criticoACada);

  return (
    <div className="tela">
      <div className="topo-batalha">
        <span className="onda">{onda.chefao ? "Chefão!" : `Onda ${jogo.onda + 1} de ${ondas.length}`}</span>
        <span className="heroi-info">
          {jogo.classe.icone} {heroi.espada && "🗡️"} <Coracoes vida={heroi.vida} max={heroi.vidaMax} escudo={heroi.escudo} />
          <BotaoSom />
        </span>
      </div>

      <div className={"arena cenario-" + onda.cenario + (onda.chefao ? " chefao" : "")} style={{ "--cor": onda.cor }}>
        <span className="tocha esquerda" aria-hidden="true">🔥</span>
        <span className="tocha direita" aria-hidden="true">🔥</span>
        <p className="lugar">{onda.lugar}</p>
        {jogo.respostasNaOnda === 0 && <div className="fala">“{onda.fala}”</div>}
        <div key={"p" + efeito?.id} className={"palco" + (efeito?.tipo === "critico" ? " tremer" : "")}>
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
          <div className="sombra" />
          {(efeito?.tipo === "acerto" || efeito?.tipo === "critico") && (
            <EfeitoAtaque key={"fx" + efeito.id} classe={jogo.classe.id} critico={efeito.tipo === "critico"} />
          )}
          {efeito?.tipo === "bloqueio" && <EfeitoEscudo key={"fx" + efeito.id} />}
        </div>
        {efeito && (efeito.tipo === "acerto" || efeito.tipo === "critico") && (
          <div key={"d" + efeito.id} className={"dano" + (efeito.tipo === "critico" ? " critico" : "")}>
            {efeito.tipo === "critico" ? "CRÍTICO! " : ""}-{efeito.valor}
          </div>
        )}
        <p className="nome-monstro">{onda.nome}</p>
        <BarraVida atual={jogo.monstroVida} max={onda.vida} />
      </div>

      {efeito?.tipo === "erro" && (
        <>
          <div key={"t" + efeito.id} className="tela-treme" />
          <EfeitoGarras key={"g" + efeito.id} />
        </>
      )}

      <Questao
        questao={questao}
        resposta={resposta}
        eliminadas={jogo.eliminadas}
        desativada={enviando}
        onResponder={onResponder}
      />

      <div aria-live="polite">
        {erro && <p className="aviso-batalha ruim">{erro}</p>}
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
            {resposta.explicacao && <p><b>Por quê?</b> {resposta.explicacao}</p>}
            <button className="botao-ouro" type="button" onClick={onContinuar}>Continuar</button>
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
                  disabled={!qtd || inutil || enviando}
                  title={p.efeito}
                  onClick={() => onPocao(id)}
                >
                  <Frasco tipo={id} />
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

function Bau({ jogo, ondas, despachar }) {
  const proxima = ondas[jogo.onda + 1];
  return (
    <div className="tela">
      <h1 className="titulo-masmorra">🎁 Você encontrou um baú!</h1>
      <p className="texto-claro">Escolha uma recompensa antes de enfrentar {proxima.chefao ? "o chefão" : "a próxima onda"}: <b>{proxima.nome}</b> {proxima.icone}</p>
      <div className="classes">
        {jogo.bau.map((r) => (
          <button key={r.id} type="button" className="carta-classe" onClick={() => despachar({ tipo: "ESCOLHER_RECOMPENSA", recompensa: r })}>
            <span className="icone-grande">{r.tipo === "pocao" ? <Frasco tipo={r.id} grande /> : r.icone}</span>
            <strong>{r.nome} <span className="tipo-recompensa">{r.tipo === "pocao" ? "poção" : "equipamento"}</span></strong>
            <span>{r.efeito}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Derrota({ jogo, ondas, despachar }) {
  return (
    <div className="tela centro">
      <div className="icone-enorme">😵‍💫</div>
      <h1 className="titulo-masmorra">Você desmaiou!</h1>
      <p className="texto-claro">Calma, aprendiz: errar faz parte. Respire, revise as explicações e tente de novo.</p>
      <p className="texto-claro">Você volta com os corações cheios, e o {ondas[jogo.onda].nome} também se recupera.</p>
      <button className="botao-ouro" type="button" onClick={() => despachar({ tipo: "TENTAR_DE_NOVO" })}>Tentar de novo</button>
    </div>
  );
}

function Vitoria({ jogo, ondas, prototipo, despachar }) {
  const total = jogo.historico.length;
  const acertos = jogo.historico.filter((h) => h.acertou).length;
  const m = medalha(acertos, total, total - acertos);
  const assuntos = resumoPorAssunto(jogo.historico);
  const chefao = ondas[ondas.length - 1];
  return (
    <div className="tela">
      <div className="confete" aria-hidden="true">
        {["✨", "🎉", "⭐", "🎊", "✨", "⭐", "🎉"].map((c, i) => <span key={i} style={{ left: i * 14 + 4 + "%", animationDelay: i * 0.15 + "s" }}>{c}</span>)}
      </div>
      <h1 className="titulo-masmorra centro">{chefao.icone} → ✨<br />O {chefao.nome} foi desencantado!</h1>
      <div className="pergaminho centro">
        <div className="icone-enorme">{m.icone}</div>
        <h2>{m.nome}</h2>
        <p>{m.texto}</p>
        <p className="placar">{acertos} acertos em {total} questões</p>
      </div>
      <div className="pergaminho">
        <h2>Seu desempenho por assunto</h2>
        <p className="mini">
          {prototipo
            ? "É isto que o Mestre vê no relatório (abaixo de 60% aparece “Reforçar”)."
            : "Suas respostas já foram enviadas para o relatório do Mestre."}
        </p>
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
      {prototipo && <Link className="link-claro" to="/masmorra/turma">Ver o modo turma (demonstração) →</Link>}
    </div>
  );
}

export default function Masmorra({ fonte, disciplina = "Língua Portuguesa", prototipo = false }) {
  const [jogo, despachar] = useReducer(regras, estadoInicial);
  const [questoes, setQuestoes] = useState(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  // Sorteia os monstros da partida (de novo a cada "Jogar de novo").
  const [ondas, setOndas] = useState(() => ondasDe(disciplina, true));
  useEffect(() => {
    if (jogo.fase === "escolha") setOndas(ondasDe(disciplina, true));
  }, [jogo.fase, disciplina]);
  const titulo = "Masmorra de " + disciplina;
  const marca = prototipo ? "Quizzes & Masmorras · protótipo" : "Quizzes & Masmorras";

  // Carrega as questões uma vez, ao abrir a masmorra.
  useEffect(() => {
    fonte.carregar().then(setQuestoes).catch((e) => setErro(e.message));
  }, [fonte]);

  // Depois de um acerto, avança sozinho (o erro espera o "Continuar", para ler a explicação).
  useEffect(() => {
    if (jogo.fase === "batalha" && jogo.resposta?.acertou) {
      const t = setTimeout(() => despachar({ tipo: "AVANCAR" }), 1300);
      return () => clearTimeout(t);
    }
  }, [jogo.fase, jogo.resposta]);

  // Sons: um para cada golpe e um para cada tela (baú, vitória, derrota).
  useEffect(() => {
    const tocar = { acerto: som.acerto, critico: som.critico, erro: som.erro, bloqueio: som.bloqueio }[jogo.efeito?.tipo];
    if (tocar) tocar();
  }, [jogo.efeito?.id]);
  useEffect(() => {
    if (jogo.fase === "bau") som.bau();
    if (jogo.fase === "vitoria") som.vitoria();
    if (jogo.fase === "derrota") som.derrota();
  }, [jogo.fase]);

  // Volta ao topo a cada tela nova.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [jogo.fase, jogo.onda]);

  // Responder: a fonte corrige (no servidor, na sala real) e devolve o resultado para as regras.
  async function responder(i) {
    if (jogo.resposta || enviando) return;
    const questao = jogo.baralho[jogo.indice];
    setEnviando(true);
    setErro("");
    try {
      const resultado = await fonte.responder(questao, questao.opcoes[i].letra);
      despachar({ tipo: "RESPONDER", opcao: i, resultado });
    } catch (e) {
      setErro(e.message);
    }
    setEnviando(false);
  }

  async function usarPocao(id) {
    som.pocao();
    if (id !== "visao") return despachar({ tipo: "USAR_POCAO", pocao: id });
    setEnviando(true);
    try {
      const eliminar = await fonte.eliminar(jogo.baralho[jogo.indice]);
      despachar({ tipo: "USAR_POCAO", pocao: "visao", eliminar });
    } catch (e) {
      setErro(e.message);
    }
    setEnviando(false);
  }

  if (!questoes) {
    return (
      <div className="masmorra">
        <div className="tela centro">
          <p className="marca-masmorra">{marca}</p>
          <p className="texto-claro">{erro || "Abrindo a masmorra..."}</p>
        </div>
      </div>
    );
  }
  if (questoes.length === 0) {
    return (
      <div className="masmorra">
        <div className="tela centro">
          <h1 className="titulo-masmorra">Masmorra vazia!</h1>
          <p className="texto-claro">Não há questões para esta sala. Avise o Mestre.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="masmorra">
      {jogo.fase === "escolha" && (
        <EscolhaClasse
          ondas={ondas}
          titulo={titulo}
          marca={marca}
          prototipo={prototipo}
          onEscolher={(c) => despachar({ tipo: "ESCOLHER_CLASSE", classe: c, questoes })}
        />
      )}
      {jogo.fase === "batalha" && (
        <Batalha
          jogo={jogo}
          ondas={ondas}
          enviando={enviando}
          erro={erro}
          onResponder={responder}
          onPocao={usarPocao}
          onContinuar={() => despachar({ tipo: "AVANCAR" })}
        />
      )}
      {jogo.fase === "bau" && <Bau jogo={jogo} ondas={ondas} despachar={despachar} />}
      {jogo.fase === "derrota" && <Derrota jogo={jogo} ondas={ondas} despachar={despachar} />}
      {jogo.fase === "vitoria" && <Vitoria jogo={jogo} ondas={ondas} prototipo={prototipo} despachar={despachar} />}
    </div>
  );
}
