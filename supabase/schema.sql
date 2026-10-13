-- CtrlZ · esquema del panel de administración e ingesta de fuentes (Supabase).
-- Ejecútalo en el SQL Editor de Supabase. Guardamos TEXTO + metadatos + enlace,
-- nunca binarios pesados (así todo cabe en el plan gratuito).

create table if not exists public.fuentes (
  id         uuid primary key default gen_random_uuid(),
  tipo       text not null check (tipo in ('web','snapshot','pdf','texto')),
  titulo     text not null,
  url        text,
  texto      text not null default '',
  conceptos  text[] not null default '{}',   -- slugs de conceptos que respalda
  etiquetas  text[] not null default '{}',
  estado     text not null default 'pendiente'
             check (estado in ('pendiente','procesada','revisada')),
  created_by uuid references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.fuentes enable row level security;

-- Solo usuarios autenticados pueden leer y escribir; el público (anon) no.
create policy "fuentes_select_auth" on public.fuentes
  for select to authenticated using (true);
create policy "fuentes_insert_auth" on public.fuentes
  for insert to authenticated with check (true);
create policy "fuentes_update_auth" on public.fuentes
  for update to authenticated using (true) with check (true);
create policy "fuentes_delete_auth" on public.fuentes
  for delete to authenticated using (true);

grant select, insert, update, delete on public.fuentes to authenticated;
