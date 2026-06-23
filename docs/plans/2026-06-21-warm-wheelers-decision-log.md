# WARM WHEELERS — Architecture Decision Log

**Task:** T012 · P1 Decision · Records the outcome of T010 (chassis) + T011 (steering)
**Red Bull Soapbox Race · Johannesburg**

Date: 2026-06-21 · Status: DECIDED — ADR-001 (chassis) + ADR-002 (steering) signed off · T012 complete
Depends on: [Chassis scorecard](2026-06-21-warm-wheelers-chassis-scorecard.md) · [Steering scorecard](2026-06-21-warm-wheelers-steering-scorecard.md)

> A decision is only "recorded" when it states: what was chosen, what was rejected and why, the **fallback** if the choice fails, and the **risk controls** that keep it safe. Fill the sign-off line at the bottom to mark T012 done.

---

## ADR-001 — Chassis architecture

- **Decision (final):** **Option C — DIY welding.** Buy a cheap welder, learn the skill, and weld the safety-critical joints yourself (roll hoop + axle brackets); bolt-together mild-steel spine + shutterply deck for the rest. Scored 3.86 — effectively tied with the alternatives — and chosen for the strongest jump/roll structure plus a reusable skill aimed exactly where strength matters. See [chassis scorecard](2026-06-21-warm-wheelers-chassis-scorecard.md).
- **Rejected — Shutterply-only platform (A, 4.04):** topped the raw score on cost/buildability, but jump-load strength rides entirely on a perfect torsion box; one delamination at a fastener is a safety failure.
- **Rejected — Bolt-only steel frame (B, 3.87):** solid and calculable, but bolted joints are heavier and weaker than welds at the critical roll/axle points, and bolts can loosen under impact.
- **Fallback:** if your practice welds can't be shown sound, or DIY joints can't make **FoS ≥ 2 at 3 g** (S1), outsource only those critical welds to a pro; if that's out of budget, revert the critical joints to heavily-gusseted bolted connections (Option B).
- **Risk controls:**
  - **Welding competence gate:** a weekend of scrap-steel practice, then destructively test a sample joint (bend/break it) before welding anything structural; no structural weld trusted until a practice coupon holds.
  - Analysis gate: no cutting until S1 (jump) and S2 (roll) pass FEA at FoS ≥ 2.
  - Visually inspect every structural weld for penetration/undercut; grind out and re-run any that look cold.
  - Nyloc nuts + thread-lock on every bolted joint; backing plates under axle mounts; no drilled holes in primary load paths.
  - Mass logged per member against the M2 budget as it's built.

## ADR-002 — Steering / front-end architecture

- **Decision (final):** **Option B — custom pitman steering** (steering wheel → column → pitman arm → drag link → steering arms on kingpins). Scored 3.75, top of the three; chosen to design directly to the ST1/ST2/ST3 targets. Commitment is **conditional on a slop test** (free play < 5° at the wheel, ST2) — see risk controls. Simple pivot axle is the named fallback. See [steering scorecard](2026-06-21-warm-wheelers-steering-scorecard.md).
- **Rejected — Donor pedal kart (as primary, 3.36):** child-rated load capacity is a safety risk under adult + bottle + jump; availability of a good adult-scale donor is unreliable. Kept only as opportunistic.
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
- [x] Chassis decision (ADR-001) confirmed by builder — date: 2026-06-21 · name: Kenny
- [x] Steering decision (ADR-002) confirmed by builder — date: 2026-06-21 · name: Kenny

*Once both boxes are ticked, T012 is Done.*
