// Busca a conexão com o Supabase só quando ela é usada.
// A biblioteca do Supabase é a parte mais pesada do site; assim a tela inicial e a
// entrada do aprendiz aparecem sem esperar por ela (o download começa logo em seguida).
export const obterSb = () => import("./supabase.js").then((m) => m.sb);
