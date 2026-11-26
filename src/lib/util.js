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

// Regras de senha do Mestre (usadas no cadastro e na troca de senha).
// Devolve uma mensagem explicando o problema, ou "" se a senha estiver boa.
// O Supabase também precisa da mesma regra configurada no servidor (ver docs/configurar-supabase.md),
// porque quem quiser pode tentar criar uma conta sem passar pelo site.
export const REGRA_SENHA = "Mínimo de 8 caracteres, com letras e números.";
export function problemaNaSenha(senha) {
  if (!senha || !senha.trim()) return "A senha não pode ser vazia nem só espaços.";
  if (senha !== senha.trim()) return "A senha não pode começar nem terminar com espaço.";
  if (senha.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
  if (!/[A-Za-zÀ-ÿ]/.test(senha) || !/[0-9]/.test(senha)) return "A senha precisa ter letras e números.";
  return "";
}
