// Modo turma, no celular do aprendiz: a turma toda ataca o mesmo chefão.
// A cada 2 segundos o celular pergunta ao servidor a vida do chefão (estado_turma).
// Errar não tira coração de ninguém: é cooperativo.
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import { aprendizAtual } from "../lib/util.js";
import { fonteSala } from "../masmorra/fontes.js";
import { ondasDe } from "../masmorra/dados.js";
import { novoBaralho } from "../masmorra/regras.js";
import Questao, { BarraVida } from "../masmorra/Questao.jsx";
import { EfeitoAtaque } from "../masmorra/Efeitos.jsx";
import Monstro from "../masmorra/Monstro.jsx";
import { som, BotaoSom } from "../masmorra/sons.jsx";
import "../masmorra/masmorra.css";

export default function JogarTurma() {
  const aprendiz = aprendizAtual();
  const fonte = useMemo(() => (aprendiz ? fonteSala(aprendiz.participante_id) : null), [aprendiz?.participante_id]);
  const [estado, setEstado] = useState(null);
  const [questoes, setQuestoes] = useState(null);
  const [baralho, setBaralho] = useState([]);
  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState(null);
  const [meus, setMeus] = useState({ acertos: 0, total: 0 });
  const [erradas, setErradas] = useState([]); // ids das questões erradas, para a revisão
  const [revisao, setRevisao] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  // Pergunta ao servidor o estado da batalha a cada 2 segundos.
  useEffect(() => {
    if (!aprendiz) return;
    let ativo = true;
    async function atualizar() {
      const { data, error } = await sb.rpc("estado_turma", { p_participante: aprendiz.participante_id });
      if (ativo && !error && data) setEstado(data);
    }
    atualizar();
    const t = setInterval(atualizar, 2000);
    return () => {
      ativo = false;
      clearInterval(t);
    };
  }, [aprendiz?.participante_id]);

  // Carrega as questões uma vez.
  useEffect(() => {
    if (!fonte) return;
    fonte.carregar().then((qs) => {
      setQuestoes(qs);
      setBaralho(novoBaralho(qs));
    }).catch((e) => setErro(e.message));
  }, [fonte]);

  // Passa por todas as questões sem repetir; quando acabam, revisa só as que o aprendiz errou
  // (se não errou nenhuma, revisa todas). Mesma ideia da masmorra solo.
  function proxima() {
    setResposta(null);
    if (indice + 1 < baralho.length) return setIndice(indice + 1);
    const paraRevisar = questoes.filter((q) => erradas.includes(q.id));
    setBaralho(novoBaralho(paraRevisar.length ? paraRevisar : questoes));
    setIndice(0);
    setRevisao(true);
  }

  // Depois de um acerto, a próxima questão vem sozinha.
  useEffect(() => {
    if (resposta?.acertou) {
      const t = setTimeout(proxima, 900);
      return () => clearTimeout(t);
    }
  }, [resposta]);

  // Fanfarra quando a turma vence.
  const venceuAgora = estado?.iniciada && estado.vida_max > 0 && estado.dano >= estado.vida_max;
  useEffect(() => {
    if (venceuAgora) som.vitoria();
  }, [venceuAgora]);

  if (!aprendiz) return <Navigate to="/jogar" replace />;
  if (aprendiz.modo !== "turma") return <Navigate to="/jogar/masmorra" replace />;

  const chefao = ondasDe(aprendiz.disciplina)[2];
  const vidaMax = estado?.vida_max || 0;
  const vida = Math.max(0, vidaMax - (estado?.dano || 0));
  const vencida = estado?.iniciada && vidaMax > 0 && vida <= 0;

  async function responder(i) {
    if (resposta || enviando || vencida) return;
    const q = baralho[indice];
    setEnviando(true);
    setErro("");
    try {
      const r = await fonte.responder(q, q.opcoes[i].letra);
      setResposta({ opcao: i, acertou: r.acertou, certa: r.certa, explicacao: r.explicacao });
      setErradas((lista) => (r.acertou ? lista.filter((id) => id !== q.id) : [...new Set([...lista, q.id])]));
      if (r.acertou) som.acerto();
      else som.erro();
      setMeus((m) => ({ acertos: m.acertos + (r.acertou ? 1 : 0), total: m.total + 1 }));
      // Atualiza a barra na hora, sem esperar a próxima consulta.
      if (r.acertou) setEstado((e) => (e ? { ...e, dano: e.dano + 1 } : e));
    } catch (e) {
      setErro(e.message);
    }
    setEnviando(false);
  }

  let conteudo;
  if (!estado || !questoes) {
    conteudo = <p className="texto-claro centro">{erro || "Entrando na masmorra..."}</p>;
  } else if (!estado.ativa) {
    conteudo = (
      <div className="pergaminho centro">
        <h2>A sala foi encerrada</h2>
        <p>Você acertou {meus.acertos} de {meus.total}. Obrigado por lutar com a turma!</p>
        <Link className="botao-ouro" to="/jogar">Entrar em outra sala</Link>
      </div>
    );
  } else if (!estado.iniciada) {
    conteudo = (
      <div className="pergaminho centro">
        <div className="monstro monstro-espera" style={{ "--cor": chefao.cor }}><Monstro tipo={chefao.tipo} cor={chefao.cor} nome={chefao.nome} /></div>
        <h2>Prepare-se, {aprendiz.nome}!</h2>
        <p>O {chefao.nome} está chegando. Olhe para a lousa: quando o Mestre começar a batalha, as questões aparecem aqui.</p>
        <p className="mini">Cada acerto seu tira 1 de vida do chefão. A turma vence junta!</p>
      </div>
    );
  } else if (vencida) {
    conteudo = (
      <div className="pergaminho centro">
        <div className="icone-enorme">🏆</div>
        <h2>A turma venceu!</h2>
        <p>Você acertou {meus.acertos} de {meus.total} e ajudou a desencantar o {chefao.nome}.</p>
        <p className="mini">Se o Mestre começar outra batalha, ela aparece aqui sozinha.</p>
      </div>
    );
  } else {
    const q = baralho[indice];
    conteudo = (
      <>
        <div className="arena chefao cenario-trono" style={{ "--cor": chefao.cor }}>
          <div className="palco">
            <div className={"monstro" + (resposta?.acertou ? " levou-golpe" : "")} key={"m" + meus.total}><Monstro tipo={chefao.tipo} cor={chefao.cor} nome={chefao.nome} /></div>
            <div className="sombra" />
            {resposta?.acertou && <EfeitoAtaque key={"fx" + meus.total} classe="guerreiro" />}
          </div>
          <p className="nome-monstro">{chefao.nome}</p>
          <BarraVida atual={vida} max={vidaMax} />
        </div>
        <Questao questao={q} resposta={resposta} desativada={enviando} revisao={revisao} onResponder={responder} />
        {erro && <p className="aviso-batalha ruim">{erro}</p>}
        {resposta?.acertou && <p className="aviso-batalha bom">⚔️ Você atacou o chefão!</p>}
        {resposta && !resposta.acertou && (
          <div className="explicacao">
            <p className="aviso-batalha neutro">Quase! A turma continua atacando.</p>
            {resposta.explicacao && <p><b>Por quê?</b> {resposta.explicacao}</p>}
            <button className="botao-ouro" type="button" onClick={proxima}>Próxima</button>
          </div>
        )}
        <p className="sequencia">Seus acertos: {meus.acertos}</p>
      </>
    );
  }

  return (
    <div className="masmorra">
      <div className="tela">
        <div className="topo-batalha">
          <p className="marca-masmorra">Quizzes &amp; Masmorras · modo turma</p>
          <BotaoSom />
        </div>
        {conteudo}
      </div>
    </div>
  );
}
