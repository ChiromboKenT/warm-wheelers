# WARM WHEELERS — Chassis Option Scorecard

**Task:** T010 · P0 Decision · Output for the architecture decision (T012)
**Red Bull Soapbox Race · Johannesburg**

Date: 2026-06-21 · Status: DECIDED — Option C (DIY welding) chosen; the scores below informed the call
Depends on: Layout sketch (wheelbase, track width, driver+bottle seating position, axle positions)

---

## The three routes (from the brief)

- **A — Shutterply platform:** floor/deck built as a plywood torsion box (two skins + ribs). Cut and screw/glue. No welding.
- **B — Bolt-together angle frame:** mild-steel angle or square tube, drilled and bolted. No welding.
- **C — DIY welding (learn & do):** buy a cheap welder, learn the skill, and weld the critical joints yourself (roll hoop, axle brackets) — bolt and ply the rest.

---

## Scoring

Score 1–5 (5 = best). Weighted total = Σ(score × weight). Two criteria dropped at your call — **trackside repairable (BU6)** and **schedule fit (BU4)** — and the freed 13% redistributed across the rest, nudged toward **jump survival (S1)** since safety is the whole point.

Note on Option C: it's now **DIY welding** (learn & do), not outsourced. That removes the third-party penalties but adds the cost of buying a welder (tooling ↓) and a learning curve (buildability ↓).

| Criterion (ties to matrix) | Weight | A — Shutterply | B — Bolt steel | C — DIY weld |
|---|---|---|---|---|
| Jump / structural strength — S1 (3 g, FoS ≥ 2) | 23% | 3 | 4 | 5 |
| Buildable solo, first-timer — BU2 | 21% | 5 | 4 | 3 |
| Material cost & SA availability — BU1/BU3 | 17% | 5 | 4 | 4 |
| Tooling need / cost — BU2 | 14% | 5 | 4 | 2 |
| Weight — M1/M2 | 13% | 3 | 3 | 4 |
| Stiffness (no flex → protects steering, ST3) | 12% | 3 | 4 | 5 |
| **Weighted total** | **100%** | **4.04** | **3.87** | **3.86** |

### Why these scores (challenge them)

- **A (4.04)** still tops the raw score on cost, tooling and solo-build. The risk is all in one cell: plywood can **delaminate or crush at fastener points** under a jump landing. It only holds up as a proper torsion box (skinned, ribbed, axle loads spread over backing plates), never a flat sheet.
- **B (3.87)** is the predictable all-rounder. Strength is **calculable**; watch bolt loosening (nyloc + thread-lock) and don't drill stress-risers near load paths.
- **C (3.86)** jumped from 3.41 once welding became DIY and the repairability/schedule penalties were dropped. It now gives the **strongest, stiffest result and the best roll structure** — held back only by the welder purchase eating tooling budget and the first-timer learning curve on welds that must hold a person at 3 g.

> The three are now **within 0.18 of each other** — effectively a tie, so the scorecard alone won't decide it. The real tie-breaker is S1: run the jump-load check. If a ply torsion box can't show **FoS ≥ 2 at 3 g**, you're into steel — and since you're up for welding, that points straight at the hybrid.

### The hybrid — now the front-runner, given you'll weld
Bolt-together steel spine (B) + a **shutterply deck** (A) for the low flat floor the brief wants + **DIY-weld the safety-critical joints yourself** (C): the roll hoop and axle brackets. This is the best possible use of learning to weld — you put the new skill exactly where strength matters most (S1/S2) and keep everything else cheap and boltable. One contained welding project instead of a whole welded frame.

---

## Data you must gather before you trust this scorecard

- [ ] **Layout sketch** done (the dependency) — without wheelbase/track/seat position you can't estimate loads or weight.
- [ ] Shutterply sheet price + steel angle/tube price + bolts — from a local builders' merchant / steel merchant.
- [ ] Price a cheap arc/MIG welder + auto-darkening helmet + grinder in SA (comes out of the R9k tooling budget) — and block a weekend of scrap-steel practice before welding anything structural.
- [ ] Rough mass estimate of each option vs your mass budget (M2).
- [ ] Honest tool check: what cutting/drilling tools do you own vs need to buy out of the R9k?

## Decision (final) — Option C: DIY welding
**Chosen: Option C.** Buy a cheap welder, learn the skill, and DIY-weld the safety-critical joints (roll hoop + axle brackets); bolt-together steel spine + shutterply deck for everything else. Learning to weld is worth it spent exactly on those joints. Recorded in the [decision log](2026-06-21-warm-wheelers-decision-log.md) (T012), gated on **FoS ≥ 2 at 3 g** and on validating your practice welds before trusting them.

> Note: Option C as scored already means "weld the critical joints, bolt + ply the rest" — not a fully welded frame. If you actually want every joint welded, say so and I'll re-score (buildability and tooling load both shift down).
