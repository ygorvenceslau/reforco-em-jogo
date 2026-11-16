// Conexão com o Supabase, usada por todas as telas.
// sb.auth = login, sb.from("tabela") = consultas, sb.rpc("funcao") = funções do banco.
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js";

export const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
