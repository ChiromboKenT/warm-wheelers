import { createClient } from "@supabase/supabase-js";
import schedule from "./schedule.json";
import { parseSchedule } from "./parse";

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

  const { error: tasksError } = await supabase.from("tasks").upsert(tasks);
  if (tasksError) throw new Error(`tasks: ${tasksError.message}`);
  console.log(`seeded ${tasks.length} tasks`);

  const { error: decisionsError } = await supabase
    .from("decisions")
    .upsert(decisions, { onConflict: "task_id" });
  if (decisionsError) throw new Error(`decisions: ${decisionsError.message}`);
  console.log(`seeded ${decisions.length} decisions`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
