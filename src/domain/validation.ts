import type { ValidationCategory, ValidationCriterion, ValidationStatus } from "../lib/types";

export interface CategoryMeta {
  key: ValidationCategory;
  label: string;
  blurb: string;
}

// Display order and labels for the eight matrix dimensions.
export const CATEGORIES: CategoryMeta[] = [
  { key: "safety", label: "Safety", blurb: "Finish clean, safe and upright." },
  { key: "steering", label: "Steering", blurb: "Turns the course, no slop." },
  { key: "braking", label: "Braking", blurb: "Stops, every time." },
  { key: "mass", label: "Mass", blurb: "Within the limit, tracked." },
  { key: "cog", label: "Centre of Gravity", blurb: "Mass low, won't tip." },
  { key: "aero", label: "Aerodynamics", blurb: "Planted, without breaking the look." },
  { key: "buildability", label: "Buildability", blurb: "Solo, cheap, on time." },
  { key: "spectacle", label: "Spectacle", blurb: "Reads as a heater; the glow fires." },
];

export const STATUS_LABELS: Record<ValidationStatus, string> = {
  pending: "Pending",
  pass: "Pass",
  partial: "Partial",
  fail: "Fail",
  na: "N/A",
};

export const STATUS_ORDER: ValidationStatus[] = ["pending", "pass", "partial", "fail", "na"];

export interface ValidationSummary {
  total: number;
  byStatus: Record<ValidationStatus, number>;
  /** Rows that count toward progress (everything except N/A). */
  tracked: number;
  /** Tracked rows resolved to pass — as a 0–100 percentage. */
  validatedPercent: number;
  p1Total: number;
  p1Pass: number;
  p2Fail: number;
  /** Unconfirmed Red Bull dependencies still pending or failing. */
  rbOpen: number;
  /**
   * The design-freeze rule from the matrix: every P1 row is `pass` and no P2
   * row is `fail`. N/A P1 rows are treated as not-yet-cleared on purpose —
   * a criterion that matters at P1 should not be waved through.
   */
  freezeReady: boolean;
}

function emptyByStatus(): Record<ValidationStatus, number> {
  return { pending: 0, pass: 0, partial: 0, fail: 0, na: 0 };
}

export function deriveValidationSummary(criteria: ValidationCriterion[]): ValidationSummary {
  const byStatus = emptyByStatus();
  let p1Total = 0;
  let p1Pass = 0;
  let p2Fail = 0;
  let rbOpen = 0;

  for (const c of criteria) {
    byStatus[c.status] += 1;
    if (c.priority === "P1") {
      p1Total += 1;
      if (c.status === "pass") p1Pass += 1;
    }
    if (c.priority === "P2" && c.status === "fail") p2Fail += 1;
    if (c.rb_dependent && (c.status === "pending" || c.status === "fail")) rbOpen += 1;
  }

  const total = criteria.length;
  const tracked = total - byStatus.na;
  const validatedPercent = tracked ? Math.round((byStatus.pass / tracked) * 100) : 0;
  const freezeReady = total > 0 && p1Total > 0 && p1Pass === p1Total && p2Fail === 0;

  return {
    total,
    byStatus,
    tracked,
    validatedPercent,
    p1Total,
    p1Pass,
    p2Fail,
    rbOpen,
    freezeReady,
  };
}
