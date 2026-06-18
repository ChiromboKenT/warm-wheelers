import { describe, it, expect } from "vitest";
import schedule from "./schedule.json";
import { parseSchedule } from "./parse";

describe("parseSchedule", () => {
  const out = parseSchedule(schedule);

  it("extracts unique ordered phases", () => {
    expect(out.phases.length).toBe(20);
    expect(out.phases[0].order_index).toBe(0);
    expect(out.phases[0].name).toContain("Control Room");
  });

  it("extracts one day row per schedule entry", () => {
    expect(out.days.length).toBe(75);
    expect(out.days[0].date).toBe("2026-06-18");
    expect(out.days[0].phase_id).toBe(out.phases[0].id);
  });

  it("extracts all tasks with normalized status", () => {
    expect(out.tasks.length).toBe(179);
    const t1 = out.tasks.find((t) => t.id === "T001")!;
    expect(t1.status).toBe("not_started");
    expect(t1.priority).toBe("P1");
    expect(t1.day_date).toBe("2026-06-18");
  });

  it("derives decisions from decision-flagged tasks", () => {
    const decisionTasks = out.tasks.filter((t) => t.is_decision);
    expect(out.decisions.length).toBe(decisionTasks.length);
    expect(out.decisions.length).toBeGreaterThan(0);
    expect(out.decisions[0].question.length).toBeGreaterThan(0);
  });
});
