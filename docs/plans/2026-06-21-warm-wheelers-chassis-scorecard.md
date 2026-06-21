# WARM WHEELERS — Chassis Option Scorecard

**Task:** T010 · P0 Decision · Output for the architecture decision (T012)
**Red Bull Soapbox Race · Johannesburg**

Date: 2026-06-21 · Status: Draft — scores are a starting assessment, confirm with your own data
Depends on: Layout sketch (wheelbase, track width, driver+bottle seating position, axle positions)

---

## The three routes (from the brief)

- **A — Shutterply platform:** floor/deck built as a plywood torsion box (two skins + ribs). Cut and screw/glue. No welding.
- **B — Bolt-together angle frame:** mild-steel angle or square tube, drilled and bolted. No welding.
- **C — Limited outsourced welding:** mostly bolted, but pay a local welder to weld only the critical joints (roll hoop, axle brackets).

---

## Scoring

Score 1–5 (5 = best). Weights reflect the brief's priorities: **jump survival (S1)** and **buildability (P1)** dominate; performance is lighter. Weighted total = Σ(score × weight).

| Criterion (ties to matrix) | Weight | A — Shutterply | B — Bolt steel | C — Welded |
|---|---|---|---|---|
| Jump / structural strength — S1 (3 g, FoS ≥ 2) | 20% | 3 | 4 | 5 |
| Buildable solo, first-timer — BU2 | 18% | 5 | 4 | 2 |
| Tooling need / cost (near-zero) — BU2 | 12% | 5 | 4 | 3 |
| Material cost & SA availability — BU1/BU3 | 15% | 5 | 4 | 3 |
| Weight — M1/M2 | 12% | 3 | 3 | 4 |
| Stiffness (no flex → protects steering, ST3) | 10% | 3 | 4 | 5 |
| Trackside repairable — BU6 | 5% | 4 | 5 | 2 |
| Schedule fit, solo control — BU4 | 8% | 5 | 4 | 2 |
| **Weighted total** | **100%** | **4.11** | **3.93** | **3.41** |

### Why these scores (challenge them)

- **A (4.11)** wins on cost, tooling, speed and solo-build. The risk is all in one cell: plywood can **delaminate or crush at fastener points** under a jump landing. It only holds up if built as a proper torsion box (skinned, ribbed, axle loads spread over backing plates), not a flat sheet.
- **B (3.93)** is the predictable all-rounder for someone who can't weld. Strength is **calculable**, joints are repairable. Watch bolt loosening (use nyloc + thread-lock) and don't drill stress-risers near load paths.
- **C (3.41)** gives the strongest, stiffest result and the best roll structure — but welding labour eats your tiny budget, you lose solo control, and you can't re-weld trackside.

> The top two are **close (4.11 vs 3.93)**. The real tie-breaker is S1: run the jump-load check first. If a ply torsion box can't show **FoS ≥ 2 at 3 g**, the decision moves to steel — or to a hybrid.

### The hybrid worth considering
Bolt-together steel perimeter/spine (B) carrying a **shutterply deck** (A) for the low, flat floor the brief wants — and **outsource welding only for the roll hoop + axle brackets** (C) if hand-calcs say bolting won't make FoS ≥ 2. You get B's buildability with C's strength exactly where it matters.

---

## Data you must gather before you trust this scorecard

- [ ] **Layout sketch** done (the dependency) — without wheelbase/track/seat position you can't estimate loads or weight.
- [ ] Shutterply sheet price + steel angle/tube price + bolts — from a local builders' merchant / steel merchant.
- [ ] One welder quote for "roll hoop + 4 axle brackets" (for option C / the hybrid).
- [ ] Rough mass estimate of each option vs your mass budget (M2).
- [ ] Honest tool check: what cutting/drilling tools do you own vs need to buy out of the R9k?

## Recommendation (proposed — confirm with the data above)
**Bolt-together steel spine + shutterply deck**, with welding held in reserve for the roll hoop and axle brackets only. Carry that into the decision log (T012) with the FoS ≥ 2 check as the gate.
