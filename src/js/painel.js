// TAREFA (Pessoa 1): criar sessão. Ver TAREFAS.md.
// Passos sugeridos:
// 1) const sessao = await exigirLogin();   // já está abaixo
// 2) Preencher o <select id="habilidade"> com:  await sb.from("habilidade").select("*")
// 3) Ao clicar em "Gerar link da sessão", inserir a sessão:
//      const { data, error } = await sb.from("sessao")
//        .insert({ professor_id: sessao.user.id, habilidade_id, disciplina, serie })
//        .select("id, codigo").single();
// 4) Mostrar o código (data.codigo) e o link:  location.origin + "/entrar.html?codigo=" + data.codigo
// 5) Link para o relatório:  relatorio.html?sessao=" + data.id
// 6) Listar "minhas sessões":  await sb.from("sessao").select("*").order("criada_em", { ascending: false })
exigirLogin().then((sessao) => {
  if (sessao) $("quem").textContent = sessao.user.email;
});
$("sair").addEventListener("click", sair);
