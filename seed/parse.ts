type RawTask = {
  id: string;
  desc: string;
  output: string;
  hours: number;
  deadline: string;
  priority: string;
  status: string;
  dependencies: string;
  decision: string;
  question: string;
  source: string;
  owner: string;
};

type RawDay = {
  date: string;
  day: string;
  phase: string;
  focus: string;
  outcome: string;
  tasks: RawTask[];
};

export type PhaseRow = { id: string; order_index: number; name: string };

export type DayRow = {
  date: string;
  day_of_week: string;
  phase_id: string;
  focus: string;
  outcome: string;
};

export type TaskRow = {
  id: string;
  day_date: string;
  description: string;
  output: string;
  est_hours: number;
  deadline: string;
  priority: "P0" | "P1" | "P2" | "P3";
  owner: string;
  dependencies: string;
  source: string;
  is_decision: boolean;
  decision_question: string | null;
  status: "not_started" | "in_progress" | "done";
};

export type DecisionRow = { task_id: string; question: string; status: "open" };

function phaseId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function priorityCode(p: string): "P0" | "P1" | "P2" | "P3" {
  const m = p.match(/P[0-3]/);
  return (m ? m[0] : "P3") as "P0" | "P1" | "P2" | "P3";
}

function statusCode(s: string): "not_started" | "in_progress" | "done" {
  const v = s.toLowerCase();
  if (v.includes("done") || v.includes("complete")) return "done";
  if (v.includes("progress")) return "in_progress";
  return "not_started";
}

export function parseSchedule(schedule: RawDay[]) {
  const phaseMap = new Map<string, PhaseRow>();
  const days: DayRow[] = [];
  const tasks: TaskRow[] = [];
  const decisions: DecisionRow[] = [];

  for (const day of schedule) {
    if (!phaseMap.has(day.phase)) {
      phaseMap.set(day.phase, {
        id: phaseId(day.phase),
        order_index: phaseMap.size,
        name: day.phase,
      });
    }
    const pid = phaseMap.get(day.phase)!.id;
    days.push({
      date: day.date,
      day_of_week: day.day,
      phase_id: pid,
      focus: day.focus,
      outcome: day.outcome,
    });
    for (const t of day.tasks) {
      const isDecision = t.decision === "Yes";
      tasks.push({
        id: t.id,
        day_date: day.date,
        description: t.desc,
        output: t.output,
        est_hours: t.hours,
        deadline: t.deadline,
        priority: priorityCode(t.priority),
        owner: t.owner,
        dependencies: t.dependencies,
        source: t.source,
        is_decision: isDecision,
        decision_question: isDecision ? t.question : null,
        status: statusCode(t.status),
      });
      if (isDecision) {
        decisions.push({ task_id: t.id, question: t.question, status: "open" });
      }
    }
  }
  return { phases: [...phaseMap.values()], days, tasks, decisions };
}
