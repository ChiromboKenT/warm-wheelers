# T009 — Concept Geometry Decision (ADR-003)

**Warm Wheelers · Red Bull Soapbox JHB 2026 · Concept Geometry**
Date: 2026-06-22 · Status: PROPOSED v0 (awaiting builder sign-off)
Drawing: [T009-layout-sketch-v0.png](T009-layout-sketch-v0.png) · source: [T009-layout-sketch-v0.svg](T009-layout-sketch-v0.svg)
Depends on: T007 reference dims · T008 driver envelope
Relates to: [Validation criteria matrix](../../docs/plans/2026-06-21-warm-wheelers-validation-criteria-matrix.md) · [Decision log](../../docs/plans/2026-06-21-warm-wheelers-decision-log.md)

> A decision is only "recorded" when it states: what was chosen, what was rejected and why, the
> **fallback** if it fails, and the **risk controls** that keep it safe.

---

## ADR-003 — Concept layout geometry v0

- **Decision (proposed):** baseline rolling geometry —

  | Parameter | Value | Driver |
  |-----------|-------|--------|
  | Wheelbase | **1800 mm** | stable straight-line, fits seated recumbent driver |
  | Track width | **1300 mm** | anti-tip margin; sets CoG-height budget (**C1**) |
  | Ground clearance | **~220 mm** | clears course + ramp landing without bottoming |
  | Shell height | **1500 mm** (rake ~3°) | honest tall-heater silhouette, well under RB 2500 |
  | Overall L×W×H | **2350 × 2000 × 1500 mm** | compact; inside RB max **6000 × 2000 × 2500** |
  | Mass placement | driver + bottle + ballast **at floor** | low CoG (**C5**) |

- **Rejected — wider track / longer wheelbase ("max it out"):** more outright stability but heavier, harder
  to build solo, slower to turn, and risks breaking the compact heater read. The brief explicitly calls for
  *deliberately compact*.
- **Rejected — narrow kart-like track (<1000 mm):** lighter and nimble but pushes CoG-height budget below what a
  tall shell can achieve → tip risk on the ramp; fails the spirit of **C1/C2**.
- **Fallback:** if measured CoG (tilt-table, **C1**) exceeds **0.45 × track = 585 mm**, widen track in 100 mm steps
  and/or lower the floor pan before adding structural mass. If turning radius can't meet **ST1 (≤ 6 m)**, shorten
  wheelbase toward 1600 mm.
- **Risk controls:**
  - Geometry is **v0 / not frozen** — confirmed only after CAD measurement of CoG (C1), turning radius (ST1),
    and the jump landing attitude (C4).
  - Real wheel diameter to be selected and re-checked against the 220 mm ground-clearance assumption.
  - All values stay inside RB envelope with margin; re-check against **official weight limit `[RB?]`** once confirmed.
  - Driver envelope (T008) must physically close inside this footprint before any cutting.

---

## Open items `[RB?]`
- Official cart weight limit — sets how much ballast the low-CoG strategy can afford.

## Sign-off
- [ ] Concept geometry v0 (ADR-003) confirmed by builder — date: ______ · name: Kenny

*Tracker: T009 is a Decision task — move In progress → Done once this box is ticked. Tick it only after a quick CAD/CoG sanity check, or accept v0 explicitly as a working assumption.*
