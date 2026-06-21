import { describe, it, expect } from "vitest";
import { deriveValidationSummary } from "./validation";
import type { ValidationCriterion } from "../lib/types";

const mk = (
  id: string,
  priority: ValidationCriterion["priority"],
  status: ValidationCriterion["status"],
  extra: Partial<ValidationCriterion> = {},
): ValidationCriterion => ({
  id,
  category: "safety",
  category_order: 1,
  order_index: 1,
  criterion: "",
  target: "",
  method: "",
  acceptance: "",
  gate: "Design",
  priority,
  rb_dependent: false,
  status,
  evidence: null,
  owner: null,
  updated_by: null,
  updated_at: "2026-06-21T00:00:00.000Z",
  ...extra,
});

describe("deriveValidationSummary", () => {
  it("counts statuses and computes validated percent over tracked (non-N/A) rows", () => {
    const s = deriveValidationSummary([
      mk("A", "P1", "pass"),
      mk("B", "P2", "pending"),
      mk("C", "P2", "partial"),
      mk("D", "P3", "na"),
    ]);
    expect(s.total).toBe(4);
    expect(s.byStatus.pass).toBe(1);
    expect(s.byStatus.na).toBe(1);
    expect(s.tracked).toBe(3);
    expect(s.validatedPercent).toBe(33); // 1 pass / 3 tracked
  });

  it("is freeze-ready only when every P1 passes and no P2 fails", () => {
    const ready = deriveValidationSummary([
      mk("A", "P1", "pass"),
      mk("B", "P1", "pass"),
      mk("C", "P2", "partial"),
    ]);
    expect(ready.freezeReady).toBe(true);

    const p1NotDone = deriveValidationSummary([mk("A", "P1", "pass"), mk("B", "P1", "pending")]);
    expect(p1NotDone.freezeReady).toBe(false);

    const p2Failing = deriveValidationSummary([mk("A", "P1", "pass"), mk("B", "P2", "fail")]);
    expect(p2Failing.freezeReady).toBe(false);
    expect(p2Failing.p2Fail).toBe(1);
  });

  it("does not wave through an N/A P1 row", () => {
    const s = deriveValidationSummary([mk("A", "P1", "na")]);
    expect(s.p1Total).toBe(1);
    expect(s.p1Pass).toBe(0);
    expect(s.freezeReady).toBe(false);
  });

  it("flags open Red Bull dependencies that are pending or failing", () => {
    const s = deriveValidationSummary([
      mk("A", "P1", "pending", { rb_dependent: true }),
      mk("B", "P3", "pass", { rb_dependent: true }),
      mk("C", "P2", "fail", { rb_dependent: true }),
    ]);
    expect(s.rbOpen).toBe(2);
  });

  it("handles an empty matrix without dividing by zero", () => {
    const s = deriveValidationSummary([]);
    expect(s.total).toBe(0);
    expect(s.validatedPercent).toBe(0);
    expect(s.freezeReady).toBe(false);
  });
});
