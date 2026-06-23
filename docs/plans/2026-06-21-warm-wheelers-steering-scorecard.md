# WARM WHEELERS — Steering / Front-End Option Scorecard

**Task:** T011 · P0 Decision · Output for the architecture decision (T012)
**Red Bull Soapbox Race · Johannesburg**

Date: 2026-06-21 · Status: DECIDED — Option B (custom pitman steering) chosen, conditional on the slop test
Depends on: Layout sketch (track width, wheelbase, front-axle position)

---

## The three routes (from the brief)

- **A — Donor pedal kart:** salvage the steering column, track-rod and stub axles from a kids' pedal go-kart and adapt them.
- **B — Custom pitman steering:** steering wheel → column → pitman arm → drag link → steering arms on kingpins, built from scratch.
- **C — Simple pivot axle (fallback):** whole front axle is a beam pivoting on one central kingpin bolt, steered by a bar (classic soapbox).

---

## Scoring

Score 1–5 (5 = best). Weighted total = Σ(score × weight). **Trackside repairable (BU6) dropped** for consistency with the chassis scorecard — its 5% redistributed across the remaining criteria.

| Criterion (ties to matrix) | Weight | A — Donor kart | B — Custom pitman | C — Pivot axle |
|---|---|---|---|---|
| Precision / low slop — ST2 (< 5°) | 19% | 3 | 4 | 2 |
| Geometry / no bump-steer — ST3 (< 1°) | 16% | 4 | 5 | 2 |
| Buildable solo, first-timer — BU2 | 19% | 4 | 2 | 5 |
| Cost & part availability — BU1/BU3 | 16% | 3 | 3 | 5 |
| Turning radius — ST1 (≤ 6 m) | 13% | 4 | 5 | 4 |
| Strength / load (adult + bottle + jump) | 12% | 2 | 4 | 4 |
| Self-centring / straight tracking — ST5 | 5% | 3 | 4 | 2 |
| **Weighted total** | **100%** | **3.36** | **3.75** | **3.55** |

### Why these scores (challenge them)

- **B — Custom pitman (3.75)** scores highest because *you design it to the targets*: ≤ 6 m radius, Ackermann, minimal bump-steer, rod ends to kill slop. The catch is **buildability (2)** — fabricating stub axles/kingpins to tolerance is the hardest job on the whole cart for a first-timer.
- **C — Pivot axle (3.55)** is the dependable fallback: cheapest, simplest, robust, always works. It loses on **precision and self-centring** — a pivoting beam scrubs the tyres, can dart, and feels twitchy in a chicane at speed. The brief already labels it the fallback for good reason.
- **A — Donor kart (3.36)** is dragged down by **load rating** — kart parts are child-rated, and an adult + bottle costume + a jump landing is the risk. Worth it *only* if a suitable adult-scale, low-slop donor actually turns up cheap. Treat as opportunistic, not the plan.

> Steering choice is **skill-gated**, so make it testable: cheaply mock up a pitman linkage and measure free play at the wheel. **If you can get slop < 5° (ST2), commit to B. If you can't, the pivot axle (C) becomes the primary, not just the fallback.**

---

## Data you must gather before you trust this scorecard

- [ ] **Layout sketch** done (the dependency) — track width sets your steering geometry and radius.
- [ ] Search Gumtree / Facebook Marketplace for an adult-scale donor pedal kart and a realistic price (settles option A).
- [ ] Price rod ends/heim joints + bushes + kingpin stock (settles option B cost).
- [ ] Decide your honest fabrication confidence: can you cut/drill/align stub axles to tolerance? (gates B vs C).
- [ ] Confirm tightest course chicane radius assumption against the ≤ 6 m target (ST1).

## Decision (final) — Option B: custom pitman steering
**Chosen: Option B — custom pitman steering**, with **simple pivot axle as the named fallback**. The choice is conditional on one check: mock up the linkage and confirm free play < 5° at the wheel (ST2). If the mock-up can't hold tolerance, the pivot axle becomes primary. Donor kart only if a strong, cheap adult-scale donor turns up. Recorded in the [decision log](2026-06-21-warm-wheelers-decision-log.md) (T012).
