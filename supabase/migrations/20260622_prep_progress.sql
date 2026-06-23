-- Prep / materials catalogue progress: one row per catalogue item id that has
-- been ticked off (shopping items, tools, gating tests, scale-model parts).
-- The catalogue itself lives in code (prepData.ts); this table only stores the
-- checked state so it persists and syncs across devices.
-- Public may read (kept consistent with the rest of the cockpit data); only the
-- team can write.
create table if not exists prep_progress (
  item_id text primary key,
  checked boolean not null default false,
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table prep_progress enable row level security;

drop policy if exists "public read prep_progress" on prep_progress;
drop policy if exists "auth write prep_progress" on prep_progress;

create policy "public read prep_progress" on prep_progress
  for select using (true);

create policy "auth write prep_progress" on prep_progress for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
