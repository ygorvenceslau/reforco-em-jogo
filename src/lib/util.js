// Data do banco (ISO) no formato brasileiro: 03/11/2026, 18:34.
export function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

// Ordena "1º ano", "2º ano"... pelo número, e não em ordem alfabética.
export function ordenarAnos(anos) {
  return [...anos].sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b));
}

// O aprendiz não tem conta: os dados dele ficam só nesta aba do navegador.
export function aprendizAtual() {
  const bruto = sessionStorage.getItem("participante");
  return bruto ? JSON.parse(bruto) : null;
}
