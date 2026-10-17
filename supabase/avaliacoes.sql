-- Execute no SQL Editor do mesmo projeto Supabase usado pela aplicação.
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  nome varchar(70) not null,
  comentario varchar(1200) not null,
  estrelas int not null check (estrelas between 1 and 5),
  aprovado boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists avaliacoes_publicadas_idx on public.avaliacoes (created_at desc) where aprovado=true;
alter table public.avaliacoes enable row level security;
-- Nenhuma política pública: somente backend com SERVICE_ROLE_KEY pode listar ou inserir.
-- Para aprovar, no Supabase Table Editor altere aprovado para true.
