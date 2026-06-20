-- Public "get in touch" submissions. Anyone may insert (with length guards);
-- only the authenticated team can read or manage them.
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  handled boolean not null default false
);

alter table messages enable row level security;

drop policy if exists "anon submit messages" on messages;
drop policy if exists "auth manage messages" on messages;

-- public visitors (and the team) may submit, with basic shape/length guards
create policy "anon submit messages" on messages
  for insert to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 120
    and char_length(email) between 3 and 200
    and position('@' in email) > 1
    and char_length(btrim(message)) between 1 and 4000
  );

-- only the team can read / triage submissions (no public select)
create policy "auth manage messages" on messages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
