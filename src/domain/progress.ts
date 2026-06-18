import type { Task } from "../lib/types";

export interface Metrics {
  total: number;
  completed: number;
  percent: number;
  openDecisions: number;
}

export function deriveMetrics(tasks: Task[]): Metrics {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const openDecisions = tasks.filter((t) => t.is_decision && t.status !== "done").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent, openDecisions };
}
