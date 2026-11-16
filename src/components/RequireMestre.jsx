// Protege as telas do Mestre: sem login, manda para a tela de entrar.
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { sb } from "../lib/supabase.js";

export default function RequireMestre({ children }) {
  const [estado, setEstado] = useState({ carregando: true, sessao: null });

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setEstado({ carregando: false, sessao: data.session }));
    // Se o login mudar (ex.: clicou em Sair), a tela reage sozinha.
    const { data } = sb.auth.onAuthStateChange((_evento, sessao) =>
      setEstado({ carregando: false, sessao })
    );
    return () => data.subscription.unsubscribe();
  }, []);

  if (estado.carregando) return <main><p className="muted">Carregando...</p></main>;
  if (!estado.sessao) return <Navigate to="/mestre/entrar" replace />;
  return children(estado.sessao);
}
