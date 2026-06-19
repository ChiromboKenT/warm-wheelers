-- Ensure decisions.task_id has a unique constraint.
-- The current base schema already declares it unique inline; this guard makes
-- the migration idempotent and also fixes older databases created before that.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'decisions'::regclass
      and contype = 'u'
      and conkey = array[
        (select attnum from pg_attribute
          where attrelid = 'decisions'::regclass and attname = 'task_id')
      ]
  ) then
    alter table decisions add constraint decisions_task_id_key unique (task_id);
  end if;
end $$;
