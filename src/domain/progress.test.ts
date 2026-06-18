import { describe, it, expect } from "vitest";
import { deriveMetrics } from "./progress";
import type { Task } from "../lib/types";

const mk = (id: string, status: Task["status"], is_decision = false): Task => ({
  id,
  day_date: "2026-06-18",
  description: "",
  output: "",
  est_hours: 1,
  deadline: "2026-06-18",
  priority: "P1",
  owner: "",
  dependencies: "",
  source: "",
  is_decision,
  decision_question: null,
  status,
  done_at: null,
});

describe("deriveMetrics", () => {
  it("counts totals, completed and percentage", () => {
    const m = deriveMetrics([
      mk("T1", "done"),
      mk("T2", "not_started"),
      mk("T3", "done"),
      mk("T4", "in_progress"),
    ]);
    expect(m.total).toBe(4);
    expect(m.completed).toBe(2);
    expect(m.percent).toBe(50);
  });

  it("counts open decisions (decision tasks not done)", () => {
    const m = deriveMetrics([mk("T1", "done", true), mk("T2", "not_started", true)]);
    expect(m.openDecisions).toBe(1);
  });

  it("handles empty list", () => {
    const m = deriveMetrics([]);
    expect(m.total).toBe(0);
    expect(m.percent).toBe(0);
  });
});
