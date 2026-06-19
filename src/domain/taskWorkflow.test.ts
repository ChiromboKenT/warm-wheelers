import { describe, expect, it } from "vitest";
import type { Task } from "../lib/types";
import { dependencyTaskIds, nextQuickStatus, validateTaskStatusTransition } from "./taskWorkflow";

const task = (overrides: Partial<Task> = {}): Task => ({
  id: "T010",
  day_date: "2026-06-18",
  description: "Task",
  output: "Output",
  est_hours: 1,
  deadline: "2026-06-18",
  priority: "P1",
  owner: "Kenny",
  dependencies: "",
  source: "",
  is_decision: false,
  decision_question: null,
  status: "not_started",
  done_at: null,
  ...overrides,
});

describe("task workflow", () => {
  it("extracts structured task dependencies from free-text dependencies", () => {
    expect(dependencyTaskIds("Needs T001, T002 and T001 again")).toEqual(["T001", "T002"]);
    expect(dependencyTaskIds("Design brief")).toEqual([]);
  });

  it("does not allow skipping directly from not started to done", () => {
    const result = validateTaskStatusTransition(task(), "done");
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("in progress");
  });

  it("requires linked decisions to be resolved before a decision task is done", () => {
    const result = validateTaskStatusTransition(task({ status: "in_progress", is_decision: true }), "done", {
      decisionStatus: "open",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Resolve");
  });

  it("requires structured task dependencies to be complete", () => {
    const tasksById = new Map([
      ["T001", task({ id: "T001", status: "done" })],
      ["T002", task({ id: "T002", status: "in_progress" })],
    ]);
    const result = validateTaskStatusTransition(
      task({ status: "in_progress", dependencies: "Needs T001 and T002" }),
      "done",
      { tasksById },
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("T002");
  });

  it("allows done when the task is in progress and its gates are satisfied", () => {
    const tasksById = new Map([["T001", task({ id: "T001", status: "done" })]]);
    const result = validateTaskStatusTransition(
      task({ status: "in_progress", dependencies: "Needs T001", is_decision: true }),
      "done",
      { decisionStatus: "resolved", tasksById },
    );
    expect(result.allowed).toBe(true);
  });

  it("uses a safe quick-action progression", () => {
    expect(nextQuickStatus("not_started")).toBe("in_progress");
    expect(nextQuickStatus("in_progress")).toBe("done");
    expect(nextQuickStatus("done")).toBe("in_progress");
  });
});
