# T027 — Fusion 360 Master Build Guide (validated end-to-end workflow)

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · The one guide you model from**
Date: 2026-07-02 · Rev: **v1 (integration-validated)** · Status: **READY TO MODEL** · Priority: **P0**
Tool: **Autodesk Fusion** (Personal edition) · Sim: SimScale Community (FEA/CFD)
Parameters: [T018-parameters.csv](T018-parameters.csv) (import once, §1.2)

> **What this document is.** The single, ordered, click-level workflow that takes you from an empty Fusion
> file to a frozen, validated, manufacturable cart design. Every dimension here was re-derived on 2026-07-02
> and cross-checked against every subsystem doc; where the old docs disagreed or left a gap, this guide (and
> the matching corrections now written into T019–T025) is the resolved truth. Work the phases **in order** —
> each ends with a **gate** you must pass before starting the next. The subsystem docs (T019–T026) stay the
> deep reference for each phase; this guide is the spine that connects them.

---

## 0. The design you are building (30-second orientation)

A compact **six-wheel gas-heater cart**: two steered front wheels, dual rear wheels each side, a tall
domed-front heater shell that boat-tails into an orange gas-bottle pod formed by the reclined driver.
Steel bolt-together spine + 12 mm shutterply deck, welded roll hoop and axle brackets, pitman steering,
two independent rear disc brakes, and an all-mechanical 3-panel "ignition" glow. No batteries, no springs,
no stored energy — all rules-legal per the Red Bull handbook.

**Hard limits it is designed inside:** length < 6000 (ours ≈ 2550) · width < 2000 (ours ≈ 1395) ·
height < 2500 (ours 1600) · mass ≤ 80 kg excl. driver (budget ≈ 76.4) · ground clearance ≥ ~100 (ours
105–150, see §2.3) · turning radius ≤ 6 m (ours ≈ 3.5).

---

## 1. Phase 0 — File, parameters, datums (do once, ~20 min)

### 1.1 File
1. `File ▸ New Design`, save immediately as **`WarmWheelers-Cart-v1`**. Every save is a recoverable cloud
   version in Personal edition — save at every gate.
2. `Document Settings ▸ Units ▸ mm`.

### 1.2 Parameters
1. `Solid ▸ Modify ▸ Change Parameters` (the `fx` icon).
2. Import [T018-parameters.csv](T018-parameters.csv) via the dialog's import icon — **if your Fusion build
   has no import button, type the rows by hand** (10 minutes; the CSV is the master list either way). Type
   units into expressions (`1700 mm`) so document units can never bite you.
3. **Prove the chain is live:** confirm `axle_height` shows the *expression* `wheel_dia / 2` (reads 130),
   `rear_pair_width` reads 195, `overall_width_calc` reads 1395, `deck_top_z` reads 192,
   `overall_length_calc` reads 2550. Change `wheel_dia` to 300, watch `axle_height` become 150, set it back
   to 260. ✔
4. Parameter names are **case-sensitive lowercase** — always type the *name* into sketch dimensions, never
   the number.

### 1.3 Coordinate convention (never deviate — from T017 §1, unchanged)
**+X forward · +Y left · +Z up · origin on the ground, on the centreline, at mid-wheelbase.**
Model the left side, mirror about the **XZ (Y = 0) plane** for the right.

1. Browser ▸ **Origin** folder ▸ turn on all planes + the origin point.
2. Create the reusable construction planes (`Construct ▸ Offset Plane`), typing the **expression** as the
   offset so they self-correct if a parameter changes:

| Plane name (rename in browser) | Offset from | Expression | Evaluates to |
|---|---|---|---|
| `Plane_FrontAxle` | YZ plane | `wheelbase / 2` | +850 |
| `Plane_RearAxle` | YZ plane | `-wheelbase / 2` | −850 |
| `Plane_FrameCL` | XY plane | `ground_clearance + frame_tube / 2` | 165 |
| `Plane_DeckUnderside` | XY plane | `ground_clearance + frame_tube` | 180 |
| `Plane_BodyFront` | YZ plane | `body_front_x` | +1200 |
| `Plane_TailEnd` | YZ plane | `body_front_x - body_length_main - boattail_len` | −1150 |

**Gate 0:** all parameters present, test change propagates, six named planes exist. Save.

---

## 2. The master position tables (pin these up — every later step checks against them)

### 2.1 Along X (from T018 §3.1 — the longitudinal datum)

| Feature | Expression | X (mm) |
|---|---|---|
| Domed nose apex | `body_front_x + front_dome_depth` | +1400 |
| Main box front face | `body_front_x` | +1200 |
| Front wheel-arch zone (steering sweep + clearance) | — | +670 … +1030 |
| Front axle | `+wheelbase/2` | +850 |
| Driver feet | `driver_center_x + driver_pkg_len/2` | +625 |
| Origin (mid-wheelbase) | 0 | 0 |
| Driver torso centre (balance knob) | `driver_center_x` | −100 |
| Main box rear face / boat-tail start / cockpit opening starts | `body_front_x - body_length_main` | −650 |
| Rear wheel-box zone | — | −690 … −1010 |
| Roll hoop / helmet plane | — | −825 |
| Rear axle | `-wheelbase/2` | −850 |
| Tail / pod end | — | −1150 |

### 2.2 Across Y (half-widths; mirror for the other side)

| Feature | Y (mm) | Source |
|---|---|---|
| Spine longerons | ±250 | T020 §3.1 |
| Harness lap anchors | ±260 | T020 §4 |
| Roll-hoop legs | ±315 (feet cross member runs to ±330) | T020 §3.3 |
| Front wheel-well inner wall | ±460 | T023 §3.6 |
| Disc seats | ±472.5 | T019 §5.4 / T022 |
| Rear wheel-box inner wall / tail keep-out below Z 300 | ±475 | T023 §3.3 |
| Rear dual tyres | 502.5 … 697.5 | T019 §5.3 |
| Front tyre (straight ahead) | 557.5 … 642.5 | T019 §5.1 |
| Kingpins | ±560 | T021 §2 |
| Deck edge (notched at the wheel zones) | ±600 | T020 §3.2 |
| Wheel centres (front single / rear pair centre) | ±600 | T019 |
| Shell sides | ±650 | T023 |
| Overall (outer rear tyre face) | ±697.5 → **1395 wide ✓** | T019 §6.1 |

### 2.3 Up Z (the vertical stack — resolves the old deck ambiguity, T020 §3.0)

| Level | Z (mm) | Note |
|---|---|---|
| Ground | 0 | |
| Brake-disc lower edge | 50 | protected between the dual tyres (T022 §3.1.2) |
| Bushing-eye / axle underside | ~105 / 114 | **true lowest points** — still > 100 rule ✓ |
| Axle centrelines | `axle_height` = 130 | = wheel radius, on drop brackets below the frame |
| Longeron underside | `ground_clearance` = 150 | the "design clearance" line |
| Longeron centreline | 165 | sketch frame lines here (`Plane_FrameCL`) |
| Deck top | `deck_top_z` = 192 | the floor |
| Wheel tops | 260 | taller than the deck → deck is notched |
| Seat-pan top | `seat_pan_z` = 280 | hips low |
| Tail underside aft of X −690 / pod bottom | ≥ 300 | clears the rear duals |
| Glow-grille zone | 300 – 650 | 3 orange panels (T023/T024) |
| Harness bar / driver shoulders | `harness_bar_z` = 620 | straps run 0–40° **down** |
| Pod end-section centre | `pod_center_z` = 650 | Ø `pod_end_dia` 700 → top 1000 |
| View band (driver's window, dark mesh) | 650 – 1050 | S6 — sightline to road ~5 m ahead of nose |
| Driver eye point | ≈ 930 | at X ≈ −750 |
| Helmet top | `head_top_z` = 1050 | |
| Roll-hoop apex | `roll_hoop_z` = 1150 | 2 × 50 clearance over helmet |
| Shell top | 1600 | < 2500 with 900 to spare |

---

## 3. Phase 1 — Driver envelope first (the master keep-out, ~30 min)

Everything packages around the driver ([T025](T025-driver-seat-harness-costume.md)); place the envelope
*before* any hardware so every later part is checked against it, not the other way round.

1. New Component `07_DriverEnvelope`. Build a layered proxy (cylinders + head sphere) or Fusion mannequin:
   reclined **35°** feet-forward; hips at (X ≈ −300, Z 330); shoulders ≈ (X −726, Z 628); helmet sphere top
   at **Z 1050, X −825**; feet at X +625. Package spans +625 … −825 (= `driver_pkg_len` 1450 about
   `driver_center_x` −100).
2. Make it translucent red. Override its mass to **95 kg** with centre at Z ≈ `driver_cg_z` 380 (counts for
   CoG/FEA, *not* for the 80 kg cart mass).
3. Keep a construction point at the **eye point (X −750, Z 930)** — the visibility check (Phase 8) sweeps
   from it.

**Gate 1:** envelope inside the future shell box (±650 wide ✓ shoulders 530), helmet 100 below hoop line.
Save.

---

## 4. Phase 2 — Rolling chassis: wheels, axles, bushings (T019, ~2 h)

Full beginner detail in [T019 §5](T019-wheels-axles-suspension.md). Condensed sequence:

1. **Front-left wheel** `01a_Wheel_FL`: sketch on `Plane_FrontAxle`, circle Ø `wheel_dia`, centre
   `track_width/2` from centreline and `axle_height` above ground; extrude `wheel_width` **outboard**.
   Sketch must go fully black (constrained). Mirror → `01b_Wheel_FR`.
2. **Rear-left dual pair**: inner wheel on `Plane_RearAxle`, inner face at Y 502.5 (extrude with the pair
   centred on 600); rectangular-pattern one copy outboard at spacing `wheel_width + rear_dual_gap` (110) →
   outer wheel. Mirror both → right pair. **6 wheels total.**
3. **Rear axle** `03_RearAxle`: **stepped** — central Ø `rear_axle_dia` (32) between the bracket zones
   (Y ±250 region), turned down to **Ø25 stubs** through the hubs (the Rybro bore is fixed at 25). Extrude
   symmetric ≈ `track_width + rear_pair_width` (1395). Add the two **disc-seat collars at Y ±472.5**.
   Decision already made: **dead axle** (wheels spin on their own supplied bearings).
4. **Front beam placeholder** `02_FrontAxleBeam`: 40×40 box at Z 130, symmetric ≈ `kingpin_track` (1120).
   Leave sketch points at the wheel centres (±600, 130) visible for Phase 4. Disposable — T021 replaces it.
5. **Hubs** (6 × Ø45×80 at each wheel centre), **bearing proxy rings** (Ø25 bore — supplied fitted in the
   wheels), **bushings** `06_Bushings` (Ø50×30 rubber annuli at the 4 axle-bracket points, Y ≈ ±250 at each
   axle).
6. Materials: wheels **override mass 1.4 kg each**, steel axles/hubs, rubber bushings.

**Gate 2 (measure, don't trust):** overall width 1395 ✓ < 2000 · wheel centres at ±850/±600/130 ✓ ·
dual gap 25 ✓ · disc collars clear the inner tyres ✓ · rolling-chassis mass ≈ **17 kg** (record it). Save.

---

## 5. Phase 3 — Frame, deck, roll hoop, brackets (T020, ~3 h)

The safety-critical phase — [T020](T020-chassis-frame-rollhoop.md) has the full detail including the §3.0
vertical stack.

1. **Spine** `02a_Spine`: on `Plane_FrameCL` (Z 165), longerons at Y ±250 from X ≈ +1000 to −900; cross
   members at X +850, `driver_center_x` (−100), −825 (**hoop feet — this one runs out to Y ±330**), −850.
   Pipe/sweep `frame_tube` (30) square, 2 mm wall, steel.
2. **Deck** `02b_Deck`: on `Plane_DeckUnderside` (180), ±600 wide, extrude `deck_thickness` (12) up →
   top at 192. **Notch the four wheel zones** (outboard of Y 460 @ X +670…+1030; outboard of Y 475 @
   X −690…−1010). Plywood.
3. **Roll hoop** `02c_RollHoop`: legs at Y ±315 from the hoop-feet member (Z 165) to apex `roll_hoop_z`
   (1150) at X −825; rearward brace to the rear cross member; **harness bar between the legs at
   `harness_bar_z` (620)**. Ø30–32 tube, welded, gusseted feet.
4. **Axle brackets** `02d_AxleBrackets`: steel plate + backing plates at both axles, bushings captive
   between bracket and axle; rear pair beefiest (dual load).
5. **Gussets/triangulation** `02e_Gussets` at every corner + hoop feet + diagonal bays.

**Gate 3:** deck top measures 192 · hoop apex (−825, 1150) · **roll-line check passes against structural
points only** — construction line from hoop apex to front-tyre tops (+850, 260): helmet 1050 < line 1150 ✓,
chest ~900 < ~1030 ✓, feet ~300 < ~380 ✓ (the shell never counts — it crushes) · frame mass ≈ steel 16 +
deck 9 + hoop/brackets 6 (record). **Do not proceed to fabrication thinking here — FEA comes in Phase 9.**
Save.

---

## 6. Phase 4 — Pitman steering (T021, ~2–3 h)

Numbers already validated: radius `1700/tan30° + 600 ≈ 3.54 m` ✓ · Ackermann splay `atan(560/1700) ≈ 18°` ✓.

1. **Stub axles**: Ø25 spindles (same bearing size as the rear — the wheels' fixed bore) on kingpin bosses
   at Y ±560; **kingpins** leaned back `caster_angle` (4°).
2. **Steering arms** rearward-inboard at 18° splay (centrelines aimed at the rear-axle centre).
3. **Linkage**: pitman arm on the column base → drag link → left arm; track rod ties L↔R. **Rod ends at
   every pivot** (this is what holds slop < 5°). Size the throws so full pitman swing = 30° at the wheels.
4. **Column**: braced at **two** frame points (pillow blocks) — e.g. base bearing ≈ (X +150, Z 300), upper
   ≈ (X −150, Z 650), wheel ≈ (X −280, Z 720) at the reclined driver's reach; verify against the Phase-1
   envelope's arms and the view corridor (the thin column may cross it; nothing else).
5. **Steering stops** at ±30°.

**Gate 4:** sweep lock-to-lock — zero fouls against tyres/arch keep-outs/frame/driver legs; both wheels
follow Ackermann (inner > outer); bump-steer over bushing travel < 1° (keep drag link parallel to the axle's
compliance motion). Save. *Physical gate B3 (slop mock-up < 5°) before committing steel.*

---

## 7. Phase 5 — Brakes (T022, ~1 h)

1. Discs Ø `disc_dia` (160) × 4–5 mm on the Phase-2 seats at Y ±472.5 (`04a_Disc_L/R`).
2. Mechanical (cable) calipers + **stiff** brackets to the rear frame mounts (`04b`/`04c`).
3. Two independent cables along the spine (gentle bends) to two cockpit levers at the Phase-1 hand
   positions. Route **clear of the drag link and the glow rod** — reserve three separate guide lines on the
   spine now: steering centre, brake cables left, glow rod right.

**Gate 5:** zero clash through steer sweep + bushing travel; stop maths holds (40 km/h → 15.7 m @ 0.4 g ≤
16 m ✓); disc lower edge Z 50 noted as protected between duals. Save.

---

## 8. Phase 6 — Seat, harness, costume (T025, ~1–2 h)

1. Seat pan top at 280 on rails on the deck (88 mm of structure above the 192 floor ✓); backrest at 35°;
   headrest inside the hoop.
2. **Harness**: shoulder straps over the **harness bar (Z 620)** running 0–40° *down* behind the shoulders;
   lap belt to the under-seat cross-member anchors (Y ±260, steel + backing plates).
3. Footrest/pedal datum at X +625 — add a guard so feet can't reach the drag link.
4. Bottle costume shell over the torso: its outer surface = the visible pod top through the cockpit opening.

**Gate 6:** helmet + shoulders inside the hoop with 50 mm ring · strap angles correct · egress path up
through the tail opening rehearsable ≤ 10 s (plan it now, prove it on the real cart). Save.

---

## 9. Phase 7 — Shell + glow (T023 + T024, ~4–6 h)

1. **Main body** `05c_MainBody`: side silhouette on the centre plane — bottom Z 150, height 1450, length
   1850 from `body_front_x`, top leaning **rearward** 5° (`body_rake`); extrude symmetric `body_width`
   (1300). Hollow the upper two-thirds (panels on battens, no mass up high).
2. **Cut the two front-face zones** (both full width): **glow grille Z 300–650** and **view band
   Z 650–1050** (dark mesh — the driver's window; verify the sightline from the Phase-1 eye point reaches
   the ground ~5 m ahead of the nose).
3. **Front dome** `05b_FrontDome`: Form-environment convex face bowing +200 at mid-height, edge radii
   80–100, wrapping those openings.
4. **Front wheel arches**: keep-out per side Y ≥ 460, X +670…+1030, Z 0–300 — cut the shell; the tyre pokes
   ~46 mm proud at full lock, by design. Style the castor cues here.
5. **Boat-tail** `05d_BoatTail`: taper from the full section at X −650 to the **Ø700 pod at (X −1150,
   Z centre 650)**; under-surface steps up to ≥ 300 aft of X −690 (over the rear duals); **top open from
   X −650 rearward** (cockpit/egress; the costume is the visible pod top).
6. **Details**: 2 knobs Ø40 lower-left, nameplate lower-right, matte-dark body.
7. **Glow mechanism** `06_Glow`: 3 pivoting panels (~100 × 1100) in the grille zone, sprung to orange,
   catches + 3-step ratchet (or 3-lobe cam) sequencer, driver lever at the right hand, rod along the spine's
   reserved right-hand guide line, reset hook. All mechanical — zero electrics.
8. **Sub-frame battens** + panel cut-list for the build pack.

**Gate 7:** `Inspect ▸ Interference` shell vs tyres through full steering sweep = zero · tail clears duals
(keep-out solid) · silhouette still reads "heater" (show someone cold — SP1 ≥ 90 %) · shell mass ≤ ~6 kg.
Save.

---

## 10. Phase 8 — Assembly checks (T026 §1–§2, ~2 h)

1. Verify the tree matches T026 §1 (`01_RollingChassis` … `08_DriverPackage`).
2. `Inspect ▸ Interference` on everything, in three states: static, full left/right lock, and with the
   axles displaced through bushing compliance (~5–10 mm) — **zero interferences**.
3. **Measure and record** in the T026 §2 table:
   - Bounding box ≈ 2550 × 1395 × 1600 (< 6000/2000/2500) ✓
   - Mass excl. driver ≤ 80 (budget path 76.4)
   - CoG Z ≤ 540 (expect ≈ 340–400, driver-dominated)
   - Fore/aft balance 45–55 % front (tune `driver_center_x`; the whole layout follows)
   - Visibility ≥ 100° arc through the view band from the eye point
   - Turning radius ≈ 3.5 m from the Phase-4 sweep

**Gate 8:** every row measured and inside target. Save as the **geometry-freeze candidate**.

---

## 11. Phase 9 — Simulation gates (T020 §5 + T026 §3)

Fusion Personal has **no built-in FEA/CFD** — use **SimScale Community** (free). Personal edition **does
export STEP** for single designs (mesh STL also works); the old "STEP restricted" note in T016 is outdated.

1. **FEA (gates S1/S2, before any steel is cut):** export STEP → SimScale. Load cases: jump landing
   (4–5 × 175 kg static at the axle brackets), **rear-axle bending** (rear-share jump load at the four wheel
   centres, supports at the brackets — this decides plain-25 vs stepped-32 axle), hard braking, cornering,
   hoop-apex roll load. Restrain at contact patches. **Pass: FoS ≥ 2 on yield everywhere, welded joints
   first.** Fix failures with triangulation before adding section.
2. **CFD (gates A1/A2/A3):** shell-only model at 12–15 m/s. A/B one variable per run: dome depth, tail
   length, wheel shrouding, rake. Pass: net lift ≤ 0, drag < upright-box baseline, silhouette still a heater.
3. Keep three named variants max; snapshot parameters with each.

**Gate 9 = design freeze** (all P1 rows PASS, no P2 FAIL in the T026 matrix). Only then produce the build
pack + renders (T026 §4–§5) and cut material.

---

## 12. Fusion Personal-edition notes (verified)

| Capability | Status |
|---|---|
| User parameters, expressions, components, Form/T-splines, mirror, interference, mass properties | ✅ fully available |
| CSV parameter import | dialog import icon if present; otherwise type by hand (10 min) — don't block on it |
| STEP export (single design) | ✅ available (T016's "restricted" note was from a walked-back 2020 change) |
| Built-in Simulation / Generative | ❌ not in Personal — use SimScale Community |
| Drawings | single-sheet only — enough for the GA drawing; export/print to PDF |
| Cloud versioning | every save is a restorable version — save at every gate |

---

## 13. What this guide corrected (round-2 validation, 2026-07-02)

Round 1 (T018 §9) fixed the parameter-level conflicts. This pass fixed the **integration** gaps a builder
would have hit mid-model — all now also patched into the subsystem docs:

| # | Gap found | Resolution | Where fixed |
|---|---|---|---|
| 1 | Shell (±650) passes **through the front wheels' steering sweep** (tyres at 493–696 under lock) and the rear duals; no wheel openings existed in any doc | Front arches (Y ≥ 460, X +670…+1030, Z ≤ 300) + rear keep-outs + tail step-up rule | T023 §3.3/§3.6, T020 §3.2 |
| 2 | **Driver could not see**: eye ≈ 930 vs solid 1600 front box; no view opening specified anywhere | Full-width dark-mesh **view band Z 650–1050** in the front face; sightline validated to ~5 m ahead of nose | T023 §3.2.4, T025 §5, CSV |
| 3 | Roll check line used the **domed front + boat-tail — sacrificial correx that crushes in a roll** | Check re-based on structural points only: hoop apex → front-tyre tops; all driver stations re-verified against it | T020 §3.3.5 |
| 4 | Harness straps routed **over the 1150 hoop apex** — a ~40° *upward* pull from 620 shoulders (spinal compression) | **Harness bar at Z 620** on the hoop legs; straps 0–40° down | T020 §3.3.4/§4, T025 §4, CSV |
| 5 | Deck/longeron stack self-contradictory (deck sketched *at* 150 but "skinned over" the tubes); hoop legs (±315) landed on nothing (longerons at ±250) | Pinned stack: longeron underside 150, CL 165, deck 180–192 (`deck_top_z`); hoop-feet cross member widened to ±330; deck notched at all four wheel zones | T020 §3.0–§3.2 |
| 6 | Grille copied from T007 **unscaled** (220 mm on a 2× taller body → panels ~70 mm, unreadable at 50 m) | Glow zone scaled to Z 300–650; 3 panels ~100 × 1100 | T023 §3.2.3, T024 |
| 7 | Parameters used in prose but **missing from the CSV** (`rear_axle_dia`, `frame_tube`, `deck_thickness`, caster…); front spindle Ø unspecified; disc edge at Z 50 unexamined; T022 disc-mirror naming collision; stray pasted text in T019 | 11 parameters added to the CSV; spindle pinned Ø25 (= wheel bore); disc clearance justified (protected between duals) with Ø140 fallback; naming + text fixed | CSV, T021 §3.1, T022 §3.1, T019 |

**Re-verified unchanged:** turning radius 3.54 m · Ackermann 18° · brake stop 15.7 m · rollover floor
1.11 g (expected ≈ 1.8 g at the real ~340–400 CoG) · jump tyre load 525 < 680 kg · width 1395 · length 2550 ·
mass path 76.4 kg · fore/aft ≈ 46 % front at `driver_center_x` −100.

---

## 14. Done criteria for T027

- [ ] Phases 0–8 completed in order, every gate measured and passed, file saved at each gate.
- [ ] Phase 9 FEA + CFD run and passed → design freeze declared in T026/T018.
- [ ] Any parameter change made along the way entered in **Change Parameters** (never a raw number in a
      sketch) and back-noted in the CSV.
- [ ] Tracker updated in [soapbox_daily_schedule_tracker.xlsx](../../Vision/soapbox_daily_schedule_tracker.xlsx).

*The subsystem docs remain the deep reference: [T019](T019-wheels-axles-suspension.md) wheels ·
[T020](T020-chassis-frame-rollhoop.md) frame · [T021](T021-steering-pitman.md) steering ·
[T022](T022-brakes-dual-disc.md) brakes · [T023](T023-shell-domed-front-boattail.md) shell ·
[T024](T024-glow-mechanism.md) glow · [T025](T025-driver-seat-harness-costume.md) driver ·
[T026](T026-assembly-validation-render.md) assembly/freeze.*
