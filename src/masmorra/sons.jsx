// Sons do jogo, gerados pelo próprio navegador (Web Audio): sem arquivos de áudio para baixar.
// O aprendiz pode desligar; a escolha fica guardada neste aparelho.
import { useEffect, useState } from "react";

let contexto = null;
let ligado = lerPreferencia();

function lerPreferencia() {
  try {
    return localStorage.getItem("sons") !== "desligado";
  } catch {
    return true;
  }
}

function ctx() {
  if (!contexto) {
    const Classe = window.AudioContext || window.webkitAudioContext;
    if (!Classe) return null;
    contexto = new Classe();
  }
  if (contexto.state === "suspended") contexto.resume();
  return contexto;
}

// Toca uma sequência de notas: [frequência em Hz, duração em segundos].
function tocar(notas, tipo = "square", volume = 0.08) {
  if (!ligado) return;
  const c = ctx();
  if (!c) return;
  let t = c.currentTime;
  for (const [freq, dur] of notas) {
    const osc = c.createOscillator();
    const ganho = c.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, t);
    ganho.gain.setValueAtTime(volume, t);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(ganho).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur);
    t += dur * 0.9;
  }
}

export const som = {
  acerto: () => tocar([[523, 0.08], [784, 0.12]]),
  critico: () => tocar([[523, 0.07], [659, 0.07], [1047, 0.18]]),
  erro: () => tocar([[220, 0.12], [165, 0.2]], "triangle", 0.12),
  bloqueio: () => tocar([[392, 0.06], [392, 0.1]], "triangle"),
  pocao: () => tocar([[880, 0.06], [1175, 0.06], [1568, 0.1]], "sine", 0.1),
  bau: () => tocar([[659, 0.08], [784, 0.08], [988, 0.14]], "sine", 0.1),
  vitoria: () => tocar([[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.35]], "square", 0.07),
  derrota: () => tocar([[392, 0.15], [330, 0.15], [262, 0.3]], "triangle", 0.1),
};

// Botão de ligar e desligar os sons.
export function BotaoSom() {
  const [on, setOn] = useState(ligado);
  useEffect(() => {
    ligado = on;
    try {
      localStorage.setItem("sons", on ? "ligado" : "desligado");
    } catch {
      // Sem armazenamento (aba anônima, por exemplo): vale só nesta visita.
    }
  }, [on]);
  return (
    <button type="button" className="botao-icone" onClick={() => setOn(!on)} aria-label={on ? "Desligar sons" : "Ligar sons"} title={on ? "Desligar sons" : "Ligar sons"}>
      {on ? "🔊" : "🔇"}
    </button>
  );
}
