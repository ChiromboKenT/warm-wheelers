-- Run on existing databases that were created before decisions.task_id was unique.
alter table decisions
  add constraint decisions_task_id_key unique (task_id);
