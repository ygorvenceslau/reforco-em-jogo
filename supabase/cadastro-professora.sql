-- Cria a linha da professora automaticamente quando ela se cadastra em cadastro.html.
-- Rode uma vez no SQL Editor do Supabase. Pode rodar de novo sem problema.

create or replace function public.criar_professora_no_cadastro()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.professor (id, nome, escola)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'nome'), ''), 'Professora'),
    nullif(trim(new.raw_user_meta_data->>'escola'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_professora_no_cadastro();