import { describe, it, expect } from "vitest";
import { timeLeft } from "./countdown";

describe("timeLeft", () => {
  it("breaks a future delta into d/h/m/s", () => {
    const now = new Date("2026-06-18T00:00:00Z").getTime();
    const target = new Date("2026-06-20T01:02:03Z").getTime();
    expect(timeLeft(target, now)).toEqual({
      days: 2,
      hours: 1,
      minutes: 2,
      seconds: 3,
      done: false,
    });
  });

  it("clamps past targets to zero and marks done", () => {
    const now = new Date("2026-06-21T00:00:00Z").getTime();
    const target = new Date("2026-06-20T00:00:00Z").getTime();
    expect(timeLeft(target, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      done: true,
    });
  });
});
