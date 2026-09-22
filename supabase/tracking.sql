-- Tracking sessions for Meta/Vega attribution.
-- Run this once in the Supabase SQL Editor.
-- Browser clients never access this table directly; writes happen only through
-- the server endpoint using SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.tracking_sessions (
  tracking_id text primary key,
  landing_ts bigint,
  fbclid text,
  fbp text,
  fbc text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  user_agent text,
  landing_url text,
  referrer text,
  ip_address text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists tracking_sessions_created_at_idx
  on public.tracking_sessions (created_at desc);

create index if not exists tracking_sessions_fbclid_idx
  on public.tracking_sessions (fbclid)
  where fbclid is not null;

alter table public.tracking_sessions enable row level security;

-- Intentionally no anon/authenticated policies.
-- The backend uses the Supabase service-role key, which bypasses RLS.
