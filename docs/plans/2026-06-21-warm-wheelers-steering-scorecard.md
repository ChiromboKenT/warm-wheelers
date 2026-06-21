# WARM WHEELERS — Steering / Front-End Option Scorecard

**Task:** T011 · P0 Decision · Output for the architecture decision (T012)
**Red Bull Soapbox Race · Johannesburg**

Date: 2026-06-21 · Status: Draft — scores are a starting assessment, confirm with your own data
Depends on: Layout sketch (track width, wheelbase, front-axle position)

---

## The three routes (from the brief)

- **A — Donor pedal kart:** salvage the steering column, track-rod and stub axles from a kids' pedal go-kart and adapt them.
- **B — Custom pitman steering:** steering wheel → column → pitman arm → drag link → steering arms on kingpins, built from scratch.
- **C — Simple pivot axle (fallback):** whole front axle is a beam pivoting on one central kingpin bolt, steered by a bar (classic soapbox).

---

## Scoring

Score 1–5 (5 = best). Weights load toward the steering criteria the matrix gates on (ST1–ST3) and buildability. Weighted total = Σ(score × weight).

| Criterion (ties to matrix) | Weight | A — Donor kart | B — Custom pitman | C — Pivot axle |
|---|---|---|---|---|
| Precision / low slop — ST2 (< 5°) | 18% | 3 | 4 | 2 |
| Geometry / no bump-steer — ST3 (< 1°) | 15% | 4 | 5 | 2 |
| Turning radius — ST1 (≤ 6 m) | 12% | 4 | 5 | 4 |
| Buildable solo, first-timer — BU2 | 18% | 4 | 2 | 5 |
| Cost & part availability — BU1/BU3 | 15% | 3 | 3 | 5 |
| Strength / load (adult + bottle + jump) | 12% | 2 | 4 | 4 |
| Self-centring / straight tracking — ST5 | 5% | 3 | 4 | 2 |
| Trackside repairable — BU6 | 5% | 3 | 4 | 5 |
| **Weighted total** | **100%** | **3.33** | **3.76** | **3.62** |

### Why these scores (challenge them)

- **B — Custom pitman (3.76)** scores highest because *you design it to the targets*: ≤ 6 m radius, Ackermann, minimal bump-steer, rod ends to kill slop. The catch is **buildability (2)** — fabricating stub axles/kingpins to tolerance is the hardest job on the whole cart for a first-timer.
- **C — Pivot axle (3.62)** is the dependable fallback: cheapest, simplest, robust, always works. It loses on **precision and self-centring** — a pivoting beam scrubs the tyres, can dart, and feels twitchy in a chicane at speed. The brief already labels it the fallback for good reason.
- **A — Donor kart (3.33)** is dragged down by **load rating** — kart parts are child-rated, and an adult + bottle costume + a jump landing is the risk. Worth it *only* if a suitable adult-scale, low-slop donor actually turns up cheap. Treat as opportunistic, not the plan.

> Steering choice is **skill-gated**, so make it testable: cheaply mock up a pitman linkage and measure free play at the wheel. **If you can get slop < 5° (ST2), commit to B. If you can't, the pivot axle (C) becomes the primary, not just the fallback.**

---

## Data you must gather before you trust this scorecard

- [ ] **Layout sketch** done (the dependency) — track width sets your steering geometry and radius.
- [ ] Search Gumtree / Facebook Marketplace for an adult-scale donor pedal kart and a realistic price (settles option A).
- [ ] Price rod ends/heim joints + bushes + kingpin stock (settles option B cost).
- [ ] Decide your honest fabrication confidence: can you cut/drill/align stub axles to tolerance? (gates B vs C).
- [ ] Confirm tightest course chicane radius assumption against the ≤ 6 m target (ST1).

## Recommendation (proposed — confirm with the data above)
**Primary: custom pitman steering** if the slop test passes; **Fallback: simple pivot axle** if it doesn't. Donor kart only if a strong, cheap adult-scale donor appears. Carry both the primary and the named fallback into the decision log (T012).
