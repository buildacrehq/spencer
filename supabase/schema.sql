-- Buildacre Quotation Builder — Supabase schema
-- Run this once in the Supabase SQL editor for the project.

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quotes_updated_at_idx on quotes (updated_at desc);

alter table quotes enable row level security;

-- Internal team tool behind a single shared anon key for now (no per-user
-- auth yet — see legacy/buildacre-quotation-builder-HANDOFF.md §10 for the
-- multi-user follow-up note). Anon key can read/write freely.
create policy "anon full access" on quotes
  for all
  using (true)
  with check (true);
