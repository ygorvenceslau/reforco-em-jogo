// =====================================================================
// config.js — liga o site (Netlify) ao banco (Supabase).
// Os dois valores vêm do painel do Supabase: Project Settings > API Keys.
//
// A chave "publishable" (ou "anon") é PÚBLICA de propósito: qualquer pessoa pode vê-la no navegador.
// Ela não dá acesso livre aos dados, porque o banco aplica as regras de RLS (ver supabase/schema.sql).
// NUNCA coloque aqui a chave secreta ("service_role" ou "sb_secret_..."), que ignora essas regras.
// =====================================================================
window.CONFIG = {
  SUPABASE_URL: "https://tookljqvdhgiqknsrkby.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_4Wnpc7pAkhQap6mwL7J2Rg_CS2JvGWL"
};
