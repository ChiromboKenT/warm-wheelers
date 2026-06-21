# WARM WHEELERS — Architecture Decision Log

**Task:** T012 · P1 Decision · Records the outcome of T010 (chassis) + T011 (steering)
**Red Bull Soapbox Race · Johannesburg**

Date: 2026-06-21 · Status: PROPOSED — awaiting builder sign-off
Depends on: [Chassis scorecard](2026-06-21-warm-wheelers-chassis-scorecard.md) · [Steering scorecard](2026-06-21-warm-wheelers-steering-scorecard.md)

> A decision is only "recorded" when it states: what was chosen, what was rejected and why, the **fallback** if the choice fails, and the **risk controls** that keep it safe. Fill the sign-off line at the bottom to mark T012 done.

---

## ADR-001 — Chassis architecture

- **Decision (proposed):** Bolt-together mild-steel spine carrying a shutterply deck. Welding held in reserve for the roll hoop + axle brackets only.
- **Rejected — Shutterply-only platform:** highest buildability but jump-load strength depends on a perfect torsion box; one delamination at a fastener is a safety failure.
- **Rejected — Fully outsourced welding:** strongest, but eats the R9k budget, removes solo control, and isn't trackside-repairable.
- **Fallback:** if the bolted spine can't show **FoS ≥ 2 at 3 g** (S1), escalate the roll hoop + axle brackets to outsourced welding (the held-in-reserve option).
- **Risk controls:**
  - Gate: no cutting until S1 (jump) and S2 (roll) pass FEA at FoS ≥ 2.
  - Nyloc nuts + thread-lock on every structural bolt; backing plates under axle mounts; no drilled holes in primary load paths.
  - Mass logged per member against the M2 budget as it's built.

## ADR-002 — Steering / front-end architecture

- **Decision (proposed):** Custom pitman steering as primary, **conditional on a slop test** (free play < 5° at the wheel, ST2). Simple pivot axle as the named fallback.
- **Rejected — Donor pedal kart (as primary):** child-rated load capacity is a safety risk under adult + bottle + jump; availability of a good adult-scale donor is unreliable. Kept only as opportunistic.
- **Fallback:** simple pivot beam axle — accept the handling compromise (scrub, weaker self-centring) in exchange for a guaranteed-buildable, robust front end.
- **Risk controls:**
  - Decision gate: build a cheap pitman mock-up and measure slop **before committing**; fail the test → switch to pivot axle.
  - Validate ST1 (≤ 6 m radius) and ST3 (bump-steer < 1°) in CAD before fabrication.
  - Rod ends/bushes specced to load; steering stops fitted so geometry can't over-travel.

---

## Open items to confirm with Red Bull (carry forward — `[RB?]`)
- Official cart weight limit (sets the chassis material/weight trade-off).
- Event date (sets schedule slack for any outsourced welding turnaround).
- Permitted branding (not architecture-critical, tracked elsewhere).

## Sign-off
- [ ] Chassis decision (ADR-001) confirmed by builder — date: ______ · name: ______
- [ ] Steering decision (ADR-002) confirmed by builder — date: ______ · name: ______

*Once both boxes are ticked, T012 is Done.*
