// Opções para marcar com um toque (no lugar de listas suspensas).
// Com muitas opções, aparece um campo para digitar e filtrar.
import { useState } from "react";

export default function Chips({ rotulo, opcoes, valor, onEscolher, buscaAPartirDe = 10 }) {
  const [busca, setBusca] = useState("");
  const filtradas = busca
    ? opcoes.filter((o) => o.rotulo.toLowerCase().includes(busca.trim().toLowerCase()))
    : opcoes;
  return (
    <fieldset className="chips">
      <legend>{rotulo}</legend>
      {opcoes.length >= buscaAPartirDe && (
        <input className="chips-busca" type="search" placeholder="Digite para buscar..." value={busca}
          onChange={(e) => setBusca(e.target.value)} aria-label={"Buscar " + rotulo.toLowerCase()} />
      )}
      <div className="chips-lista">
        {filtradas.map((o) => (
          <button key={o.valor} type="button" className={"chip" + (o.valor === valor ? " ativo" : "")}
            aria-pressed={o.valor === valor} onClick={() => onEscolher(o.valor)}>
            {o.rotulo}
          </button>
        ))}
        {filtradas.length === 0 && <span className="muted dica">Nada encontrado.</span>}
      </div>
    </fieldset>
  );
}
