// Formulário de entrada do aprendiz: código da sala + apelido, sem conta.
// Usado na tela inicial e na página /jogar.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obterSb } from "../lib/obterSb.js";
import { apelidoImproprio } from "../lib/apelido.js";

export default function FormAprendiz({ codigoInicial = "", botao = "Entrar" }) {
  const navegar = useNavigate();
  const [codigo, setCodigo] = useState(codigoInicial);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Já começa a baixar a conexão com o banco enquanto o aprendiz digita.
  useEffect(() => { obterSb().catch(() => {}); }, []);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    if (!codigo.trim() || !nome.trim()) return setErro("Preencha o código e o seu nome.");
    // O apelido aparece na lousa para a turma toda: palavrões e ofensas não passam.
    if (apelidoImproprio(nome)) return setErro("Esse apelido não pode ser usado. Use seu primeiro nome ou outro apelido.");
    setEnviando(true);
    // O aprendiz não acessa tabelas: chama a função entrar_na_sessao do banco.
    let data, error;
    try {
      const sb = await obterSb();
      ({ data, error } = await sb.rpc("entrar_na_sessao", { p_codigo: codigo.trim(), p_nome: nome.trim() }));
    } catch (falha) {
      error = falha; // não conseguiu baixar a biblioteca (sem internet)
    }
    setEnviando(false);
    if (error) {
      const m = error.message || "";
      if (m.includes("encerrada")) setErro("Essa sala já foi encerrada. Fale com o Mestre.");
      else if (m.includes("não encontrado")) setErro("Não encontramos essa sala. Confira o código com o Mestre.");
      else setErro("Sem conexão com o servidor. Tente de novo.");
      return;
    }
    sessionStorage.setItem("participante", JSON.stringify(data));
    // A sala define o modo: masmorra solo ou turma contra o chefão.
    navegar(data.modo === "turma" ? "/jogar/turma" : "/jogar/masmorra");
  }

  return (
    <form onSubmit={entrar}>
      <label htmlFor="codigo">Código da sala</label>
      <input id="codigo" autoComplete="off" required value={codigo} onChange={(e) => setCodigo(e.target.value)}
        className="campo-codigo" placeholder="EX: AB12CD" />
      <label htmlFor="nome">Seu primeiro nome ou apelido</label>
      <input id="nome" maxLength={30} autoComplete="off" required value={nome} onChange={(e) => setNome(e.target.value)} />
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="btn" type="submit" disabled={enviando}>{enviando ? "Entrando..." : botao}</button>
    </form>
  );
}
