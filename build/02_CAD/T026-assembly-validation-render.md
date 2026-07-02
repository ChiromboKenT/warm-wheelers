# T026 — Final Assembly, Validation & Red Bull Submission Pack

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P0 (design freeze)**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Pulls together: T019–T025
Proves: the whole [validation matrix](../../docs/plans/2026-06-21-warm-wheelers-validation-criteria-matrix.md) → **design freeze** + the application submission

> **Where it all comes together.** This doc assembles every subsystem into the master model, runs the
> validation chain that unlocks the design freeze, and produces the **two things the Red Bull application
> needs: how it looks (renders) and that it's a real, rules-legal design.** *Your first deliverable is not a
> pretty render — it's a parametric master model* (strategy doc); the renders fall out of it at the end.

---

## 1. Assemble the master model

Bring the components together (they already share the one parametric file + origin):

```
WarmWheelers-Cart-v1
├─ 01_RollingChassis   (T019: 6 wheels, dual axle, bushings)
├─ 02_Chassis          (T020: spine, deck, roll hoop, brackets)
├─ 03_Steering         (T021: pitman, kingpins, column)
├─ 04_Brakes           (T022: 2 discs, 2 circuits)
├─ 05_Shell            (T023: domed front, boat-tail, grille)
├─ 06_Glow             (T024: 3 panels, lever, sequencer)
├─ 07_DriverEnvelope   (T025: reclined 95th-%ile)
└─ 08_DriverPackage    (T025: seat, harness, costume)
```

1. Check **every interface from T018 §5** is connected and **clash-free**: glow lever vs steering vs brake
   cables; boat-tail vs rear wheels/brakes/hoop; shell vs driver visibility; steering sweep vs body/legs.
2. Run `Inspect ▸ Interference` on the whole assembly → **zero interferences** at static, full steer lock, and
   through suspension compliance travel.

---

## 2. The validation chain (the design-freeze gate)

Assign realistic physical materials/masses to every component first, then run each check. Record the result
in the table — **the cart freezes only when all P1 are PASS and no P2 is FAIL.**

| ID | Check | Method | Target | Result |
|----|-------|--------|--------|--------|
| Env | Bounding box | CAD measure | < 6000 / **< 2000** / < 2500 mm | ____ |
| M1/M2 | Mass (excl driver) | CAD mass + scale | **≤ 80 kg** (aim ≤ 76, 5 % margin) | ____ |
| C1 | CoG height | CAD `Center of Mass` | **≤ 540 mm** (0.45 × track) | ____ |
| C2 | Rollover threshold | CALC | > 1.3 × course lateral g (≈1.11 g avail.) | ____ |
| C3 | Fore/aft balance | CAD | 45–55 % front | ____ |
| ST1 | Turning radius | CAD sweep | ≤ 6 m (≈ 3.5 m) | ____ |
| ST3 | Bump-steer | CAD | toe change < 1° | ____ |
| S1 | Jump landing | FEA | **FoS ≥ 2 at 4–5× static** | ____ |
| S2 | Roll envelope | FEA + line | head inside hoop envelope | ____ |
| S6 | Forward visibility | CAD | ≥ 100° | ____ |
| A1 | Net lift | CFD | lift ≤ 0 at top speed | ____ |
| A2 | Drag | CFD | < upright-box baseline | ____ |
| SP1 | Reads as heater | REHEARSE | ≥ 90 % name it | ____ |

> **If CoG > 540** (the tight one): recline driver lower / drop seat / lower floor / lighten shell top —
> **not** widen track (capped at 1200). **If mass > 80:** trim per T018 §4, and the **single-rear fallback**
> is on the table (saves ~5 kg). Re-measure; never declare freeze on the spreadsheet alone (M4: as-built
> within ±5 % of CAD).

---

## 3. Simulation runbook (FEA then CFD)

Follow the strategy doc's disciplined loop — **one variable family per run, against a locked baseline.**

**Structural (round 1, gates S1/S2):** export STEP → SimScale. Load cases: jump landing (4–5× static at axle
brackets), hard braking, cornering side load, roll (hoop apex). Restrain at contact patches. Read stress at
**welded brackets + hoop feet**; target **FoS ≥ 2**. Fix with triangulation before mass. Freeze "Rev A"
geometry when the structure is credible.

**Aero (round 2, gates A1/A2/A3):** export the shell → SimScale virtual wind tunnel at ~12–15 m/s. A/B:
upright box vs domed+boat-tail; dome depth; boat-tail length; wheel exposure. Read drag + net lift. Confirm
**lift ≤ 0**, **drag < baseline**, no silhouette change that breaks SP1. Cross-check with tuft + coast-down on
the real shell later.

**Variants (round 3):** keep three named only — conservative-buildable, aggressive-low-drag, final-compromise.
Use explicit Fusion version names + parameter snapshots.

---

## 4. Build pack (so the model is buildable, not just pretty)

Produce from the frozen model — this is the manufacturability gate (strategy doc criterion 7):
- **Dimensioned general-arrangement drawing** (side, front, top, iso) with overall L×W×H, track, wheelbase,
  clearances.
- **Cut lengths** for every steel member + the shutterply deck panels.
- **Panel cut-list** for the shell (T023 §3.5).
- **Donor-part interfaces** (front axle/steering source, wheel bore/bearing, disc/caliper part numbers).
- **Bill of materials + tools**, totalled against **~R9,000** (BU1) and the **80 kg** budget (M1).
- **Assembly order:** rolling chassis (prove it rolls/steers/stops) → frame/hoop → brakes → driver fit →
  shell → glow → costume → livery. *(handbook §8.4.)*

---

## 5. Red Bull application / submission pack ("how it will look")

The application is **online form + concept sketch upload, selected on creativity** (handbook §8.2). From the
frozen model, produce:
1. **Hero renders** — 3/4 front (domed heater face + grille glowing), side (showing the boat-tail → bottle
   driver + dual rear wheels), rear 3/4. Matte-dark body, orange glow panels, orange bottle driver. Use
   Fusion **Render** workspace; staged "cold heater" vs "ignited" pair to tell the gag.
2. **The story board** — the 30-second start gag (T024 §4) as 3–4 stills.
3. **One annotated GA** — proves it's a real, rules-legal design (dimensions inside the envelope, brakes +
   steering + roll hoop + harness visible).
4. **Tagline + nameplate** — quiet "WARM WHEELERS" (SP7); no unapproved third-party logos.

> **Timeline reality (handbook §8):** the application is a **creativity selection** — renders + concept carry
> it. The full FEA/CFD freeze is Phase 2 (July). So you can **submit the application off the renders + GA now**
> and complete the structural/aero freeze before cutting. Confirm the **race date (20 vs 27 Sep 2026)** and
> the **application deadline** on the portal; submit early.

---

## 6. Done criteria for T026 (= design freeze)

- [ ] Full assembly clash-free at static, full lock, and through compliance travel.
- [ ] Validation table (§2) complete; **all P1 PASS, no P2 FAIL**.
- [ ] FEA (S1/S2) and CFD (A1/A2) evidence linked.
- [ ] Mass ≤ 80 kg path proven (or single-rear fallback taken); CoG ≤ 540.
- [ ] Build pack produced (GA, cut lists, BOM ≤ R9k, assembly order).
- [ ] Submission pack produced (hero renders, gag board, annotated GA, tagline).
- [ ] **Design freeze declared** in [T018](T018-CAD-master-design-spec.md); tracker updated.
- [ ] Race date + application deadline confirmed on the Red Bull portal; application submitted.

*Design freeze = every P1 row green, no P2 red, all `[RB?]` items confirmed-or-conservatively-assumed, and the
CAD→FEA→CFD chain complete for S1, S2, ST3, C4, A1. Then — and only then — cut material.*
</content>
