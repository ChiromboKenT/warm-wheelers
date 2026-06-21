import { createClient } from "@supabase/supabase-js";
import schedule from "./schedule.json";
import validation from "./validation.json";
import { parseSchedule } from "./parse";

const CATEGORY_ORDER = [
  "safety",
  "steering",
  "braking",
  "mass",
  "cog",
  "aero",
  "buildability",
  "spectacle",
] as const;

function buildValidationRows() {
  const perCategory = new Map<string, number>();
  return validation.map((row) => {
    const next = (perCategory.get(row.category) ?? 0) + 1;
    perCategory.set(row.category, next);
    return {
      ...row,
      category_order: CATEGORY_ORDER.indexOf(row.category as (typeof CATEGORY_ORDER)[number]) + 1,
      order_index: next,
    };
  });
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(url, key);

async function main() {
  const { phases, days, tasks, decisions } = parseSchedule(schedule);

  const { error: phasesError } = await supabase.from("phases").upsert(phases);
  if (phasesError) throw new Error(`phases: ${phasesError.message}`);
  console.log(`seeded ${phases.length} phases`);

  const { error: daysError } = await supabase.from("days").upsert(days);
  if (daysError) throw new Error(`days: ${daysError.message}`);
  console.log(`seeded ${days.length} days`);

  // Refresh the task spec but never resend `status`: re-seeding must not reset
  // live progress (and the status-workflow trigger rejects done -> not_started).
  // New rows fall back to the column default ('not_started'); the schedule only
  // ever carries "Not Started" anyway.
  const taskSpec = tasks.map(({ status: _status, ...rest }) => rest);
  const { error: tasksError } = await supabase.from("tasks").upsert(taskSpec);
  if (tasksError) throw new Error(`tasks: ${tasksError.message}`);
  console.log(`seeded ${taskSpec.length} tasks`);

  const { error: decisionsError } = await supabase
    .from("decisions")
    .upsert(decisions, { onConflict: "task_id" });
  if (decisionsError) throw new Error(`decisions: ${decisionsError.message}`);
  console.log(`seeded ${decisions.length} decisions`);

  // Validation rows carry only the fixed spec columns (no status), so a
  // re-seed refreshes the spec while leaving any Pass/Fail the team recorded
  // untouched on conflict.
  const validationRows = buildValidationRows();
  const { error: validationError } = await supabase
    .from("validation_criteria")
    .upsert(validationRows, { onConflict: "id", ignoreDuplicates: false });
  if (validationError) throw new Error(`validation: ${validationError.message}`);
  console.log(`seeded ${validationRows.length} validation criteria`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
