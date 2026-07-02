# T018 — CAD Master Design Spec & Build Guide (index)

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · Full CAD + detailed design**
Date: 2026-06-26 · Rev: **validation pass 2026-07-02** · **Status: IN PROGRESS** · Priority: **P0**
Tool: **Autodesk Fusion** (Personal edition) · Sim: SimScale Community (FEA/CFD)
Supersedes the geometry assumptions in [T016](T016-fusion-parameters-guide.md) / [T017](T017-cad-skeleton-v0.md) where they conflict (see §1).
Parameters: [T018-parameters.csv](T018-parameters.csv)

> **What this document is.** The single front door to the complete CAD and detailed design of the
> Warm Wheelers cart — everything Red Bull needs to see "how it will look", *and* everything you need
> to build it as drawn. It links out to nine subsystem task docs (T019–T026 + this index). Read this
> first, then work the subsystem docs in order. Every dimension in every doc is driven by the named
> parameters in [T018-parameters.csv](T018-parameters.csv), so changing one number rebuilds the model.
>
> **To actually model in Fusion, follow [T027 — the master build guide](T027-fusion360-master-build-guide.md):**
> the ordered, gate-by-gate workflow (with the round-2 integration fixes of 2026-07-02) that sequences all
> the subsystem docs into one validated path from empty file to design freeze.

---

## 0. The one-paragraph design

A **deliberately compact, tall-but-narrow domestic gas-heater cart** on **six wheels** (two steered at
the front, **dual wheels each side at the rear** for a gas-delivery-truck read and jump-landing load
capacity). The body keeps an **upright heater stance with a convex domed front face** that sheds air,
and **boat-tails at the rear into the orange LP-gas-bottle driver pod** — the driver *is* the fuel.
The driver reclines feet-forward at the floor for a low centre of gravity. Steering is **custom pitman
on a front beam axle**; braking is **two independent rear discs**; the "ignition" glow is a
**manual driver-lever staged reveal** of three grille panels (no battery — electrical energy storage is
banned). The structure is a **bolt-together steel spine + shutterply deck with welded roll hoop and axle
brackets**, proven by **CAD → FEA → CFD** before anything is cut.

---

## 1. Binding rules & the corrections they force (read before modelling)

These come straight from the official [Red Bull Box Cart handbook](../../Vision/RedBull_BoxCart_Joburg2026_Team_Handbook.docx)
(§2) and override earlier working assumptions:

| Rule (official) | Value | What it corrects in our old docs |
|---|---|---|
| Length / Width / Height | **< 6000 / < 2000 / < 2500 mm** | Old `body_width = 2000` was *at* the limit → **fail**. Now 1300 shell, ~1395 over wheels. |
| Race mass | **≤ 80 kg excluding driver** | Was an open `[RB?]`. Now **binding** — drives the whole mass budget (§4). |
| Propulsion / energy | **Gravity + push only. No engines, batteries, electrical, stored energy.** | The **LED+12 V battery glow** in T017 / materials list would **fail inspection** → replaced by a **mechanical lever glow** (T024). |
| Ground clearance | **~100 mm min** (build generous) | We design **150 mm** (nose ~180) so the nose can't jam the start-ramp lip. |
| Steering / brakes | **Fitted & functional, hand-built, non-motorised** | Confirms ADR-002 (pitman) + dual-disc brakes (T022). |
| Effects | **No pyro, no smoke.** Glow must read as obviously fake fire. | Manual orange-panel reveal only (T024). |
| Driver kit | Helmet + long sleeves/trousers/gloves/closed shoes, **every time the cart moves** | Built into the bottle costume (T025). |

> **Aero & wheels guidance from the same handbook (§5):** rake/curve the body, hollow the upper two-thirds,
> boat-tail the rear, keep the driver low, robust pneumatic wheels that double as suspension, stiff
> triangulated chassis, braced roll bar, harness always. FEA the jump landing at **4–5× static weight**,
> target **safety factor ≈ 2**. We follow all of this.

---

## 2. Locked architecture decisions

| Subsystem | Decision | Source |
|---|---|---|
| Chassis | Bolt-together mild-steel spine + shutterply deck; **welded** roll hoop + axle brackets | ADR-001 ([decision log](../../docs/plans/2026-06-21-warm-wheelers-decision-log.md)) |
| Steering | **Custom pitman**, steered front beam axle, Ackermann, braced column; pivot-axle fallback | ADR-002 |
| Suspension | **No springs** — rubber-bushed axle mounts + pneumatic tyres as compliance | This brainstorm (2026-06-26) |
| Wheels | **6-wheel:** 2 steered front + **dual rear each side**, Rybro 260 mm pneumatic (25 mm bore) | This brainstorm / T019 §2.1 |
| Brakes | **Dual rear discs, two independent circuits**, cable hand-levers | This brainstorm |
| Shell | Upright heater stance, **convex full-height domed front**, boat-tailed rear into bottle pod | This brainstorm |
| Glow | **Manual driver-lever staged reveal**, 3 panels off→1→2→3 (airflow-vane = future upgrade) | This brainstorm |
| Driver | 95th-%ile male (1.88 m, ~95 kg), reclined feet-forward, seat-adjustable | This brainstorm |

---

## 3. Master geometry (baseline v1)

All values live in [T018-parameters.csv](T018-parameters.csv). Coordinate convention (kept from T017):
**+X forward, +Y left, +Z up; origin on the ground, on the centreline, mid-wheelbase.** Model one side,
mirror about the XZ (Y=0) plane.

| Param | Value | Param | Value |
|---|---|---|---|
| `wheelbase` | 1700 mm | `body_width` (shell) | 1300 mm |
| `track_width` | 1200 mm (capped) | `body_height` | 1450 mm |
| `wheel_dia` | **260 mm** (Rybro) | `body_length_main` | 1850 mm |
| `wheel_width` | 85 mm | `boattail_len` | 500 mm |
| `rear_dual_gap` | 25 mm | `body_rake` | 5° (+ domed front) |
| overall width (incl. duals) | ~1395 mm ✓ | overall length | ~2550 mm ✓ (incl. dome) |
| `ground_clearance` | 150 mm (nose ~180) | `cog_target_z` | **≤ 540 mm** |
| `axle_height` | **130 mm** (= `wheel_dia`/2) | est. turning radius | ~3.5 m ✓ |

**Sanity already provable:** width 1395 < 2000 (605 margin) · height 1450 < 2500 · length ~2.55 m < 6 m ·
turning radius ~3.5 m < 6 m (ST1) · rollover threshold ≈ (track/2)/CoG = 600/540 ≈ **1.11 g lateral** at the
CoG *cap* (C2) — the CoG budget check in §6 typically lands nearer 340 mm (driver-dominated), i.e. ~1.8 g, so
1.11 g is the conservative floor, not the expected value.

### 3.1 Longitudinal datum — where every part sits along X (resolves the integration gap)

Earlier drafts fixed heights and widths but never pinned the **fore/aft (X) position** of the body, so the
subsystem docs could not be checked for length-wise clash. We now anchor the whole cart to **one datum
parameter, `body_front_x` (= +1200 mm)** — the X of the main heater-box flat front face — and derive every
other longitudinal feature from it (type these as expressions so the layout moves as one piece):

| Feature | X position (expression) | Value | Note / check |
|---|---|---|---|
| Domed nose apex (front-most point) | `body_front_x + front_dome_depth` | **+1400** | overall front; must clear front tyres |
| Main box front face | `body_front_x` | +1200 | flat grille face |
| Front axle / wheel centre | `+wheelbase / 2` | +850 | front tyre front edge = +850 + `wheel_dia/2` = **+980** (< 1400 ✓ nose leads) |
| Driver feet (front of package) | `driver_center_x + driver_pkg_len / 2` | +625 | feet just behind front axle |
| Mid-wheelbase origin | 0 | 0 | datum |
| Driver torso centre | `driver_center_x` | −100 | tune for 45–55 % front (C3) |
| Main box rear face | `body_front_x − body_length_main` | −650 | where the boat-tail starts |
| Rear axle / wheel centre | `−wheelbase / 2` | −850 | rear tyre rear edge = −850 − `wheel_dia/2` = **−980** |
| Driver head / helmet (rear of package) | `driver_center_x − driver_pkg_len / 2` | −825 | **roll hoop sits here**, over the head (T020 §3.3) |
| Boat-tail / bottle-pod rear end | `body_front_x − body_length_main − boattail_len` | −1150 | rear-most point |

**Overall length** = nose apex − tail end = `+1400 − (−1150)` = **2550 mm** (`overall_length_calc`) < 6000 ✓.
**Front overhang** past front axle ≈ 550 mm; **rear overhang** ≈ 300 mm — nose-forward "leaning heater" stance.
**Integration checks this datum now makes possible (run in T026):** ① domed nose (+1400) clears the front
tyre front edge (+980); ② boat-tail end (−1150) clears the rear tyre rear edge (−980) — the tail extends
170 mm past the rear tyres, so verify vertical/lateral clearance over them (T023 §3.3); ③ the roll hoop at
X ≈ −825 lands over the helmet and can triangulate to the rear cross member. **`body_front_x` and
`driver_center_x` are the two tuning knobs** for fore/aft balance (C3) — change them and the whole envelope
slides coherently.

---

## 4. Mass budget — the tightest constraint (M1/M2)

The 80 kg cap (excluding driver) is the hardest number on the project, and **dual-rear wheels spend into
it.** Carry this table live; update every subsystem doc as real masses land.

| Subsystem | Allowance (kg) | Doc | Notes |
|---|---|---|---|
| Steel spine + cross members | 16 | T020 | minimise; let the ply deck do structural work |
| Shutterply deck (12 mm) | 9 | T020 | torsion skin |
| Roll hoop + gussets + axle brackets | 6 | T020 | welded |
| Front beam axle + steering | 6 | T021 | |
| Rear axle + 4 hubs + bushings | 7 | T019 | dual-rear cost |
| Wheels ×6 | **8.4** | T019 | ✅ **reconciled** — Rybro 260 @ **1.4 kg ea** (§2.1); was budgeted 12–15, freed ~4–7 kg |
| Bearings | 3 | T019 | supplied fitted in the wheels |
| Brakes (2 discs, calipers, cables) | 5 | T022 | |
| Seat + harness + padding | 5 | T025 | |
| Shell (correx/foam, hollow top) | 6 | T023 | sacrificial, light |
| Glow mechanism | 2 | T024 | |
| Fasteners / misc | 3 | all | |
| **Running total** | **~76.4** | — | **under 80 with ~3.6 kg margin — hold the line, no ballast** |

> **Honest risk & escape hatch (updated 2026-07-02):** the wheel line is the one that moved the budget.
> The real Rybro 260 wheels weigh **1.4 kg each** (§2.1, T019 §2.1), not the 2 kg the old table assumed, so
> six wheels = **8.4 kg** instead of 12–15 kg. That alone drops the running total from ~80–87 to **~76.4 kg —
> now inside the 80 kg cap with ~3.6 kg (≈4.5 %) margin.** Hold it there: no added ballast (the low
> driver-dominated CoG doesn't need it — see §6), thinner deck only where FEA (T020) allows, ply over steel
> for non-critical members. **Documented fallback still stands: revert to single-rear** (saves ~5 kg) if the
> as-built scale exceeds 80 kg. Decide on the scale, not the spreadsheet (M4) — the ~4.5 % margin is thin, so
> weigh sub-assemblies as they are built.

---

## 5. How the subsystems tie together (interfaces)

Build in **hardpoint order** (both official docs prescribe this): driver package → wheel centres → axles
→ steering pivots → brake mounts → chassis rails → frame → shell → show parts.

- **Driver envelope (T025)** is the master volume: it sets the cockpit, the **roll-hoop height** (T020),
  the **harness path**, the **seat (T025)**, *and* the bottle-costume outer surface (T023/T025). Everything
  packages around it.
- **Rear dual axle (T019)** carries the four wheels, **both brake discs** (one per side = the two circuits,
  T022), the rubber bushings to the frame, and sits under the **boat-tail pod** (T023).
- **Front beam axle (T021)** carries the two steered wheels, kingpins, Ackermann arms, and the drag link
  back to the **pitman arm on the braced column** in the cockpit.
- **Glow lever (T024)** mounts at the driver's right hand, routes rod/cable along the steel spine to the
  **three grille panels** in the domed front (T023) — routed clear of the steering column and harness.
- **Chassis (T020)** is the spine every hardpoint bolts/welds to; its stiffness protects steering geometry
  (ST3) and carries the jump load (S1) into the axle brackets.

---

## 6. Validation chain (nothing is cut until these pass)

Mapped to the [validation criteria matrix](../../docs/plans/2026-06-21-warm-wheelers-validation-criteria-matrix.md):

| Check | Method | Target | Doc |
|---|---|---|---|
| Fits RB envelope | CAD measure | < 6000 / < 2000 / < 2500 | T026 |
| CoG height | CAD mass props | **≤ 540 mm** (0.45 × track) | T026 |
| Anti-tip / rollover | CALC | threshold > 1.3 × course lateral g | T026 |
| Fore/aft balance | CAD | 45–55 % front | T026 |
| Turning radius | CAD sweep | ≤ 6 m, no body/tyre fouls | T021/T026 |
| Bump-steer | CAD | toe change < 1° over travel | T021 |
| Jump landing | FEA | FoS ≥ 2 at 4–5× static | T020/T026 |
| Roll protection | FEA + RULES | head inside envelope at full roll | T020 |
| Aero (lift/drag) | CFD | net lift ≤ 0; drag < upright-box baseline | T023/T026 |
| Mass | CALC + scale | ≤ 80 kg excl driver | all/T026 |
| Recognisable heater | REHEARSE | ≥ 90 % name it "heater" | T023 |

---

## 7. Document roadmap

| Doc | Subsystem | Builds | Feeds |
|---|---|---|---|
| **T018** (this) | Master spec + parameters | — | all |
| [T019](T019-wheels-axles-suspension.md) | Wheels, dual-rear axle, bushings | T018 | T020, T022, CoG |
| [T020](T020-chassis-frame-rollhoop.md) | Chassis frame + roll hoop | T018, T019 | S1, S2, all mounts |
| [T021](T021-steering-pitman.md) | Custom pitman steering | T018, T019, T020 | ST1–ST5 |
| [T022](T022-brakes-dual-disc.md) | Dual-disc two-circuit brakes | T018, T019, T020 | B1–B5 |
| [T023](T023-shell-domed-front-boattail.md) | Shell, domed front, boat-tail | T018, T025 | SP1, A1–A3 |
| [T024](T024-glow-mechanism.md) | Manual glow mechanism | T018, T023 | SP2/SP5 |
| [T025](T025-driver-seat-harness-costume.md) | Seat, harness, costume, egress | T018 | S2–S6, packaging |
| [T026](T026-assembly-validation-render.md) | Assembly + CoG/FEA/CFD + renders | all | design freeze + RB submission |
| [T027](T027-fusion360-master-build-guide.md) | **Master Fusion build guide** — the phase/gate workflow that sequences all of the above | T018–T026 | the modelling itself |

---

## 8. Done criteria for T018

- [ ] `T018-parameters.csv` imported into Fusion as User Parameters; a test dimension reacts to a change.
- [ ] Coordinate convention and origin set as in §3.
- [ ] Mass budget table (§4) pinned and tracked.
- [ ] Each subsystem doc T019–T026 worked in order; its own done-criteria ticked.
- [ ] Validation chain (§6) all green → **design freeze** declared in T026.
- [ ] Tracker cell updated in [soapbox_daily_schedule_tracker.xlsx](../../Vision/soapbox_daily_schedule_tracker.xlsx).

*The cart is frozen and ready to cut only when every P1 row in the matrix is PASS and no P2 row is FAIL.*

---

## 9. Validation changelog (2026-07-02 review pass)

A full cross-document validation pass was run against this spec, all subsystem docs (T019–T026) and the
parameter CSV. Every quantitative claim was re-derived; the design is **geometrically and functionally
coherent**. The following corrections and hydrations were applied so the docs integrate cleanly and a builder
can model from them without hitting a contradiction:

| # | Issue found | Resolution | Files touched |
|---|---|---|---|
| 1 | `wheel_dia`/`axle_height` still read **280/140** in the master table & prose, but the selected Rybro wheel and the CSV are **260/130** (flagged open in T019 §2.5). | Corrected everywhere to **260 / 130**; CSV comments fixed (they said 140). | T018 §2/§3, T018-parameters.csv, T019, T020, T021, T025 |
| 2 | **No doc pinned the body's fore/aft (X) position** — subsystems could not be checked for length-wise clash. | Added datum parameter **`body_front_x`** and the full longitudinal layout table (§3.1); every feature X now derives from it. | T018 §3.1, T018-parameters.csv |
| 3 | `driver_center_x` was used by T020 but **undefined** in the T018 CSV (only lived in the superseded T017). | Added to the CSV as a tunable balance knob. | T018-parameters.csv |
| 4 | `overall_length_calc` ignored the domed nose (read ~2350, real ~2550). | Expression now includes `front_dome_depth`. | T018-parameters.csv, §3 |
| 5 | Mass budget assumed **12–15 kg** of wheels; real Rybro wheels are **8.4 kg** total → total was ~80–87 kg. | Reconciled to **~76.4 kg** (inside 80 with ~4.5 % margin). | T018 §4 |
| 6 | Glow component named **`04_Glow`** in one place but `06_Glow` in the assembly tree. | Standardised on **`06_Glow`**. | T024 |
| 7 | Rear axle specified as plain **25 mm** solid across the full overhung span — bending under the dual-wheel jump load unproven. | Added **stepped-axle** option (25 mm bore stubs + larger central span) and an explicit **rear-axle bending** FEA load case. | T019 §5.4, T020 §5 |
| 8 | T009/T016/T017 still show superseded values (2000 width, 400 wheel, 1800 wheelbase, 1300 track, 220 clearance) with no warning. | Added prominent **SUPERSEDED** banners pointing to this spec + the CSV. | T009, T016, T017 |

**Verified correct (no change needed):** turning radius `1700/tan30° + 600 ≈ 3.54 m` (ST1 ✓); Ackermann arm
splay `atan(560/1700) ≈ 18°` ✓; brake stop `40 km/h → 15.7 m @ 0.4 g` (≤ 16 m ✓); rear-tyre jump load
`0.6 × 175 × 5 ≈ 525 kg < 680 kg` rating ✓; overall width `1200 + 195 = 1395 < 2000` ✓; roll hoop
`1050 + 100 = 1150 < 1600` shell top ✓; disc-seat clearance (±472.5 vs inner-tyre face 502.5) ✓; combined CoG
estimate ~340 mm (driver-dominated) well under the 540 cap ✓.

> **Still open (tracked, not blocking the design freeze work):** the `[RB?]` race-date/deadline confirmation
> (T026 §5); the physical prep-test gates (weld coupon B2, steering slop mock-up B3); and the CAD→FEA→CFD runs
> themselves, which are the T020/T023/T026 deliverables. These are *execution* items — the *documentation* is
> now internally consistent and ready to model against.

## 10. Round-2 validation (2026-07-02) — integration pass + master build guide

A second pass re-derived every cross-subsystem interface (positions in all three axes, not just parameter
values) and found seven **integration** gaps that round 1's parameter reconciliation could not see — most
seriously: no wheel openings in a shell that overlaps the steered tyres, no forward-vision opening for a
driver seated 670 mm below the shell top, a roll-over check that counted the crushable correx shell as
protection, and harness straps routed 40° upward. All seven are fixed in the subsystem docs (see the full
table in [T027 §13](T027-fusion360-master-build-guide.md)), 11 parameters were added to
[T018-parameters.csv](T018-parameters.csv) (`frame_tube`, `deck_thickness`, `deck_top_z`, `rear_axle_dia`,
`caster_angle`, `harness_bar_z`, `pod_end_dia`, `pod_center_z`, `view_band_lo`/`_hi`, `wheelwell_clearance`),
and the whole workflow is now sequenced as **[T027 — the Fusion 360 master build guide](T027-fusion360-master-build-guide.md)**:
ten phases, each ending in a measurable gate, from empty file to design freeze.
</content>
</invoke>
