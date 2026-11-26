// Demonstração do modo turma: a lousa mostra o chefão com uma vida grande,
// e cada acerto de qualquer aprendiz tira vida dele. A turma vence junta.
// No protótipo os colegas são simulados; na versão final, cada um joga no próprio celular
// e o Supabase Realtime atualiza a lousa ao vivo.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COLEGAS } from "./dados.js";
import { novoBaralho } from "./regras.js";
import { questoesLocais } from "./fontes.js";
import Questao from "./Questao.jsx";
import Monstro from "./Monstro.jsx";
import "./masmorra.css";

const VIDA_CHEFAO = 25;

export default function ModoTurma() {
  const [fase, setFase] = useState("espera"); // espera → batalha → vitoria
  const [vida, setVida] = useState(VIDA_CHEFAO);
  const [golpes, setGolpes] = useState([]); // últimos ataques (só acertos: ninguém é exposto por errar)
  const [baralho, setBaralho] = useState(() => novoBaralho(questoesLocais()));
  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState(null);
  const [meus, setMeus] = useState({ acertos: 0, total: 0 });
  const contador = useRef(0);

  function golpe(nome, voce = false) {
    contador.current += 1;
    setGolpes((g) => [{ id: contador.current, nome, voce }, ...g].slice(0, 6));
    setVida((v) => Math.max(0, v - 1));
  }

  // Colegas simulados: a cada 2,2 s um deles responde; se acertar, ataca.
  useEffect(() => {
    if (fase !== "batalha") return;
    const t = setInterval(() => {
      const c = COLEGAS[Math.floor(Math.random() * COLEGAS.length)];
      if (Math.random() < c.chance) golpe(c.nome);
    }, 2200);
    return () => clearInterval(t);
  }, [fase]);

  useEffect(() => {
    if (fase === "batalha" && vida <= 0) setFase("vitoria");
  }, [vida, fase]);

  function responder(i) {
    if (resposta || fase !== "batalha") return;
    const q = baralho[indice];
    const acertou = q.opcoes[i].letra === q._certa;
    setResposta({ opcao: i, acertou, certa: q._certa });
    setMeus((m) => ({ acertos: m.acertos + (acertou ? 1 : 0), total: m.total + 1 }));
    if (acertou) golpe("Você", true);
  }

  function proxima() {
    setResposta(null);
    if (indice + 1 >= baralho.length) {
      setBaralho(novoBaralho(questoesLocais()));
      setIndice(0);
    } else setIndice(indice + 1);
  }

  // Depois de um acerto, a próxima questão vem sozinha.
  useEffect(() => {
    if (resposta?.acertou) {
      const t = setTimeout(proxima, 900);
      return () => clearTimeout(t);
    }
  }, [resposta]);

  function recomecar() {
    setVida(VIDA_CHEFAO);
    setGolpes([]);
    setMeus({ acertos: 0, total: 0 });
    setResposta(null);
    setFase("batalha");
  }

  const questao = baralho[indice];

  return (
    <div className="masmorra">
      <div className="tela larga">
        <p className="marca-masmorra">Quizzes &amp; Masmorras · protótipo do modo turma</p>
        <h1 className="titulo-masmorra">A turma contra o Dragão</h1>
        <p className="texto-claro">
          À esquerda, o que o Mestre projeta na lousa. À direita, o celular de um aprendiz.
          Os colegas ({COLEGAS.map((c) => c.nome).join(", ")}) são simulados nesta demonstração.
        </p>

        <div className="duas-telas">
          <section className="lousa" aria-label="Lousa projetada">
            <p className="rotulo">📽️ Lousa</p>
            <div className={"monstro chefao-grande" + (vida <= 0 ? " desencantado" : "")} key={golpes[0]?.id}>
              {vida <= 0 ? "✨" : <Monstro tipo="dragao" cor="#5ee07a" nome="Dragão da Gramática" />}
            </div>
            <p className="nome-monstro">Dragão da Gramática</p>
            <div className="barra-vida grande">
              <div style={{ width: (vida / VIDA_CHEFAO) * 100 + "%" }} />
              <span>{vida} / {VIDA_CHEFAO}</span>
            </div>
            <p className="mini claro">{COLEGAS.length + 1} aprendizes na batalha · cada acerto = 1 de dano</p>
            <ul className="feed">
              {golpes.map((g) => (
                <li key={g.id} className={g.voce ? "voce" : ""}>⚔️ {g.nome} acertou! −1</li>
              ))}
              {fase === "batalha" && golpes.length === 0 && <li className="vazio">A batalha começou! Respondam no celular…</li>}
            </ul>
          </section>

          <section className="celular" aria-label="Celular do aprendiz">
            <p className="rotulo">📱 Celular do aprendiz</p>
            {fase === "espera" && (
              <div className="pergaminho centro">
                <p>O Mestre abriu a masmorra. Quando a batalha começar, responda o mais rápido que puder: cada acerto ajuda a turma!</p>
                <button className="botao-ouro" type="button" onClick={() => setFase("batalha")}>Começar a batalha</button>
              </div>
            )}
            {fase === "batalha" && (
              <>
                <Questao questao={questao} resposta={resposta} onResponder={responder} />
                {resposta?.acertou && <p className="aviso-batalha bom">⚔️ Você atacou o dragão!</p>}
                {resposta && !resposta.acertou && (
                  <div className="explicacao">
                    <p className="aviso-batalha neutro">Quase! A turma continua atacando.</p>
                    <p><b>Por quê?</b> {questao._explicacao}</p>
                    <button className="botao-ouro" type="button" onClick={proxima}>Próxima</button>
                  </div>
                )}
              </>
            )}
            {fase === "vitoria" && (
              <div className="pergaminho centro">
                <div className="icone-enorme">🏆</div>
                <h2>A turma venceu!</h2>
                <p>Você acertou {meus.acertos} de {meus.total} e ajudou a desencantar o dragão.</p>
                <p className="mini">No relatório, o Mestre vê os acertos de cada aprendiz e de cada assunto.</p>
                <button className="botao-ouro" type="button" onClick={recomecar}>Jogar de novo</button>
              </div>
            )}
          </section>
        </div>

        <Link className="link-claro" to="/masmorra">‹ Masmorra solo</Link>
      </div>
    </div>
  );
}
