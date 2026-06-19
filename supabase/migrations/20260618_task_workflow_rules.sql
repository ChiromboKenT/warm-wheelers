alter table decisions
  drop constraint if exists decisions_resolved_has_answer;

create or replace function enforce_task_status_workflow()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  dependency_id text;
begin
  if new.status = old.status then
    return new;
  end if;

  if old.status = 'done' and new.status = 'not_started' then
    raise exception 'Reopen % to in_progress before moving it to not_started.', new.id;
  end if;

  if new.status <> 'done' then
    return new;
  end if;

  if old.status = 'not_started' then
    raise exception 'Move % to in_progress before marking it done.', new.id;
  end if;

  if coalesce(new.is_decision, false) and not exists (
    select 1
    from public.decisions
    where decisions.task_id = new.id
      and decisions.status = 'resolved'
  ) then
    raise exception 'Resolve the linked decision before marking % done.', new.id;
  end if;

  for dependency_id in
    select match[1]
    from regexp_matches(coalesce(new.dependencies, ''), '\m(T[0-9]{3,})\M', 'g') as match
  loop
    if not exists (
      select 1
      from public.tasks
      where tasks.id = dependency_id
        and tasks.status = 'done'
    ) then
      raise exception 'Complete dependency % before marking % done.', dependency_id, new.id;
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists tasks_status_workflow on tasks;

create trigger tasks_status_workflow
before update of status on tasks
for each row
execute function enforce_task_status_workflow();

alter table decisions
  add constraint decisions_resolved_has_answer
  check (
    status = 'open'
    or (
      answer is not null
      and length(trim(answer)) > 0
      and decided_at is not null
    )
  )
  not valid;
