-- Validation criteria matrix: the design-freeze acceptance gate.
-- Each row is a criterion the build must prove (safety, steering, braking,
-- mass, CoG, aero, buildability, spectacle). The team tracks Pass/Fail here.
-- Public may read (the journey is shown on the site); only the team can write.
create table if not exists validation_criteria (
  id text primary key,
  category text not null check (category in (
    'safety', 'steering', 'braking', 'mass', 'cog', 'aero', 'buildability', 'spectacle'
  )),
  category_order int not null default 0,
  order_index int not null default 0,
  criterion text not null,
  target text not null,
  method text not null,
  acceptance text not null,
  gate text not null check (gate in ('Design', 'Build', 'Pre-race')),
  priority text not null check (priority in ('P1', 'P2', 'P3')),
  rb_dependent boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'pass', 'partial', 'fail', 'na')),
  evidence text,
  owner text,
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table validation_criteria enable row level security;

drop policy if exists "public read validation_criteria" on validation_criteria;
drop policy if exists "auth write validation_criteria" on validation_criteria;

create policy "public read validation_criteria" on validation_criteria
  for select using (true);

create policy "auth write validation_criteria" on validation_criteria for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
