// TAREFA (Pessoa 3): relatório da sessão. Ver TAREFAS.md.
// A URL traz o id da sessão:  relatorio.html?sessao=<id>
// Consultas prontas (views do schema.sql, já filtradas pelo RLS):
//   await sb.from("v_acertos_por_aluno").select("*").eq("sessao_id", id).order("percentual")
//   await sb.from("v_acertos_por_assunto").select("*").eq("sessao_id", id)
// Marque "reforçar" quando percentual < 60.
const sessaoId = new URLSearchParams(location.search).get("sessao");
exigirLogin().then((s) => {
  if (s) $("info").textContent = "Sessão: " + (sessaoId || "(sem id na URL)");
});
