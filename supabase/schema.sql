-- Base schema for Warm Wheelers. Idempotent: safe to run repeatedly.

create table if not exists phases (
  id text primary key,
  order_index int not null,
  name text not null
);

create table if not exists days (
  date date primary key,
  day_of_week text not null,
  phase_id text references phases(id),
  focus text,
  outcome text
);

create table if not exists tasks (
  id text primary key,
  day_date date references days(date),
  description text not null,
  output text,
  est_hours numeric,
  deadline date,
  priority text check (priority in ('P0', 'P1', 'P2', 'P3')),
  owner text,
  dependencies text,
  source text,
  is_decision boolean default false,
  decision_question text,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'done')),
  done_at timestamptz
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  task_id text not null unique references tasks(id),
  question text not null,
  answer text,
  status text not null default 'open' check (status in ('open', 'resolved')),
  decided_by text,
  decided_at timestamptz
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  task_id text references tasks(id),
  body text not null,
  author text,
  created_at timestamptz not null default now()
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  target_date date,
  achieved boolean default false,
  order_index int default 0
);

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  event_name text default 'Red Bull Soapbox',
  event_date timestamptz,
  freeze_date date,
  constraint settings_singleton check (id = 1)
);

insert into settings (id, event_name)
  values (1, 'Red Bull Soapbox')
  on conflict (id) do nothing;

alter table phases enable row level security;
alter table days enable row level security;
alter table tasks enable row level security;
alter table decisions enable row level security;
alter table notes enable row level security;
alter table milestones enable row level security;
alter table settings enable row level security;

drop policy if exists "public read phases" on phases;
drop policy if exists "public read days" on days;
drop policy if exists "public read tasks" on tasks;
drop policy if exists "public read decisions" on decisions;
drop policy if exists "public read notes" on notes;
drop policy if exists "public read milestones" on milestones;
drop policy if exists "public read settings" on settings;

create policy "public read phases" on phases for select using (true);
create policy "public read days" on days for select using (true);
create policy "public read tasks" on tasks for select using (true);
create policy "public read decisions" on decisions for select using (true);
create policy "public read notes" on notes for select using (true);
create policy "public read milestones" on milestones for select using (true);
create policy "public read settings" on settings for select using (true);

drop policy if exists "auth write phases" on phases;
drop policy if exists "auth write days" on days;
drop policy if exists "auth write tasks" on tasks;
drop policy if exists "auth write decisions" on decisions;
drop policy if exists "auth write notes" on notes;
drop policy if exists "auth write milestones" on milestones;
drop policy if exists "auth write settings" on settings;

create policy "auth write phases" on phases for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write days" on days for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write tasks" on tasks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write decisions" on decisions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write notes" on notes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write milestones" on milestones for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write settings" on settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
