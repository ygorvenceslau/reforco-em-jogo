// Tela inicial: apresenta o jogo ("Aprenda jogando"), explica como funciona
// e já traz a entrada do Aprendiz e o login/cadastro do Mestre.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sb } from "../lib/supabase.js";
import FormAprendiz from "../components/FormAprendiz.jsx";
import FormLoginMestre from "../components/FormLoginMestre.jsx";
import "../masmorra/masmorra.css";

const DESFILE = ["👾", "🦇", "🐸", "🤖", "🐙", "🐉"];

const PASSOS = [
  {
    icone: "🧙",
    titulo: "O Mestre cria a sala",
    texto: "Escolhe o ano, a disciplina e o modo: masmorra solo ou a turma toda contra um chefão projetado na lousa.",
  },
  {
    icone: "⚔️",
    titulo: "Os aprendizes entram na aventura",
    texto: "Pelo celular, com o código ou o QR Code. Cada acerto é um ataque, e cada erro traz uma explicação curta.",
  },
  {
    icone: "📜",
    titulo: "O Mestre vê o que reforçar",
    texto: "O relatório mostra quem precisa de ajuda, em qual assunto e as questões que mais confundiram.",
  },
];

export default function Inicio() {
  const [mestre, setMestre] = useState(null);

  // Se o Mestre já está conectado, a tela mostra um atalho para o painel em vez do login.
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setMestre(data.session?.user || null));
  }, []);

  return (
    <div className="masmorra inicio">
      <div className="inicio-grade">
        <section className="inicio-hero">
          <p className="marca-masmorra">Quizzes &amp; Masmorras</p>
          <h1 className="titulo-inicio">Aprenda jogando</h1>
          <p className="texto-claro subtitulo-inicio">
            O reforço escolar vira uma aventura: responda questões para derrotar monstros, sozinho ou com a turma toda.
          </p>
          <div className="desfile" aria-hidden="true">
            {DESFILE.map((m, i) => (
              <span key={i} style={{ animationDelay: i * 0.25 + "s" }}>{m}</span>
            ))}
          </div>
          <Link className="botao-ouro" to="/masmorra">⚔️ Experimentar agora (sem cadastro)</Link>
          <div className="selos-inicio">
            <span>📚 Português, Matemática e Tecnologia</span>
            <span>🎒 1º ao 9º ano</span>
            <span>🔈 Questões lidas em voz alta</span>
            <span>🛡️ Grátis, sem anúncios</span>
          </div>
        </section>

        <section className="inicio-acesso">
          <div className="pergaminho">
            <h2>🗡️ Sou Aprendiz</h2>
            <p className="mini">Tenho um código e quero jogar. Não precisa de e-mail nem senha.</p>
            <FormAprendiz botao="Entrar na masmorra" />
          </div>

          <div className="pergaminho">
            <h2>🧙 Sou Mestre</h2>
            {mestre ? (
              <>
                <p className="mini">Você está conectado como {mestre.email}.</p>
                <Link className="btn" to="/mestre">Ir para o painel</Link>
              </>
            ) : (
              <>
                <p className="mini">Para docentes, monitores ou quem quer reunir amigos para estudar.</p>
                <FormLoginMestre />
                <Link className="btn outline" style={{ marginTop: 10 }} to="/mestre/cadastro">Criar conta de Mestre</Link>
              </>
            )}
          </div>
        </section>

        <section className="inicio-passos">
          <h2 className="subtitulo">Como funciona</h2>
          <div className="passos">
            {PASSOS.map((p, i) => (
              <div className="passo" key={i}>
                <span className="passo-icone">{p.icone}</span>
                <div>
                  <strong>{i + 1}. {p.titulo}</strong>
                  <p>{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="rodape-inicio">
            <Link className="link-claro" to="/privacidade">Privacidade</Link> · Projeto acadêmico de reforço escolar
          </p>
        </section>
      </div>
    </div>
  );
}
