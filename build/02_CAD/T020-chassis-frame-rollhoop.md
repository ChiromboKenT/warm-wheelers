# T020 — Chassis Frame & Roll Hoop

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P0 (safety-critical)**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Builds on: [T019 rolling chassis](T019-wheels-axles-suspension.md)
Implements: ADR-001 (Option C hybrid) · Proves: S1 (jump), S2 (roll)

> **This is the safety-critical doc.** The frame is "the single most important safety and handling item —
> flex under cornering load ruins steering and is dangerous" (handbook §5.1). Everything bolts or welds to
> it. We design a **stiff, triangulated, bolt-together steel spine + shutterply deck**, with **welded roll
> hoop and axle brackets** — the few joints where a person's safety rides on the weld (ADR-001). Nothing is
> cut until this frame passes **FEA: FoS ≥ 2 at a 4–5× static jump load** (S1) and the roll check (S2).

---

## 1. What the frame has to do

| Function | How delivered | Ties to |
|---|---|---|
| Survive the jump landing | Triangulated steel spine + welded axle brackets + rubber bushings (T019) | S1 (FoS ≥ 2 @ 4–5×) |
| Protect the driver in a roll | Welded, braced **roll hoop** above the helmet (`roll_hoop_z` 1150) | S2 |
| Hold steering geometry true | Stiff frame → no flex → toe stays put | ST3 (bump-steer < 1°) |
| Carry mass low | Low flat **shutterply deck** at `ground_clearance` 150 | C1/C5 |
| Anchor everything | Mount points for axles (T019), steering (T021), brakes (T022), seat/harness (T025) | all |
| Stay under 80 kg | Steel only where it must be; ply does the rest | M1/M2 |

---

## 2. Architecture — the hybrid, member by member

```
            (roll hoop, welded, braced)
                 ___________
                /           \
   front       |   COCKPIT   |        rear
   beam o======|=============|======o dual axle
   axle  \     |  shutterply |     /  (bushed brackets, welded)
          \    |    deck     |    /
  bolted spine rails (steel square tube) + welded brackets at each axle
```

- **Spine / longerons:** 2 mild-steel **square tube 25–30 mm, 1.6–2 mm wall**, running full length along
  `Y = ±~250`, at deck height. Bolted, with corner gussets. *(handbook §5.1 — bolt-together steel)*
- **Cross members:** 3–4 steel tubes tying the longerons: at front-axle, mid (under seat), rear-axle, and
  one under the roll hoop feet.
- **Shutterply deck:** **12 mm shutterply** skinned over the spine = a torsion box floor; the flat low
  floor the brief wants. Sealed against weather.
- **Roll hoop:** **steel tube, welded** — the critical joint. A braced hoop over the driver's head,
  triangulated back to the rear cross member.
- **Axle brackets:** **steel plate + backing plates, welded**, at front and rear, receiving the T019 rubber
  bushings. *Splayed/snapped axles on landing are a classic failure (handbook §5.4) — these brackets are why
  we learn to weld.*
- **Triangulation:** gussets at every corner; diagonal braces in the spine and from hoop to frame.
  *Triangles are what stop a frame flexing (handbook §5.1).*

---

## 3. Build steps in Fusion

> Build the frame as construction-line geometry first (the **load path**), then give the lines real tube
> sections. This makes the later FEA and the cut-list trivial.

### 3.0 — The vertical stack, pinned (added 2026-07-02 — the old text was ambiguous)

`ground_clearance` (150) is the **underside of the longerons**, and the ply deck sits **on top of** the
steel (§2: "skinned over the spine"). With `frame_tube` = 30 mm square and `deck_thickness` = 12 mm:

| Level | Expression | Z (mm) |
|---|---|---|
| Longeron underside (design ground clearance) | `ground_clearance` | 150 |
| Longeron centreline (sketch the frame lines here) | `ground_clearance + frame_tube/2` | 165 |
| Longeron top = deck underside | `ground_clearance + frame_tube` | 180 |
| **Deck top (the floor everything sits on)** | `deck_top_z` | **192** |
| Rear axle centreline (hangs *below* the frame on drop brackets) | `axle_height` | 130 |

> **Lowest points on the cart, for the ~100 mm rule:** the frame is at 150, but the **rear axle** (Ø32
> central → underside 114) and the **bushing eyes** (Ø50 around the axle → underside ~105) hang below it.
> Both still clear the 100 mm minimum — that is expected and normal (the axle height is set by the wheel
> radius, as on every cart) — but know that 105–114 mm, not 150, is the true minimum when scrutineered.

### 3.1 — Spine longerons
1. New Component `02_Chassis ▸ 02a_Spine`.
2. On an **offset plane at Z = `ground_clearance + frame_tube/2`** (165 — the tube **centreline**, per the
   §3.0 stack), sketch the frame plan: longerons at `Y = ±250`, running X ≈ +1000 → −900 (they must reach
   past both axle bracket zones). Dimension with parameters.
3. Draw the two longeron lines and the cross-member lines (front-axle X = +850, under-seat X = `driver_center_x`,
   rear-axle X = −850, hoop-feet X = −825). **Make the hoop-feet cross member run out to `Y = ±330`** — wider
   than the longerons — because the hoop legs land at ±315 (§3.3), outboard of the ±250 spine. Gusset its
   junction with each longeron.
4. Use **`Create ▸ Pipe`** (or sweep a `frame_tube` square profile) along each line → steel tube members.
   Keep wall thickness in the comment for mass (`Modify ▸ Physical Material ▸ Steel`).

### 3.2 — Shutterply deck
1. New Component `02b_Deck`. Sketch the floor outline on the **deck-underside plane at
   Z = `ground_clearance + frame_tube`** (180), width ±600 max, **extrude `deck_thickness` (12) upward**
   (top lands at `deck_top_z` 192). Material: plywood. This is the torsion skin + the floor the driver and
   seat sit on.
2. **Notch the four wheel zones** — the tyres stand taller than the deck (wheel top Z = 260 > 192), so the
   deck cannot pass through them: cut away the deck **outboard of Y = 460 between X +670 and +1030** (front
   wheels' full-lock steering sweep + `wheelwell_clearance`) and **outboard of Y = 475 between X −690 and
   −1010** (rear dual pairs + clearance). Between the notches the deck keeps its full width.

### 3.3 — Roll hoop (welded, the S2 part)
1. New Component `02c_RollHoop`.
2. On the **Center (XZ) plane**, sketch the hoop centreline: vertical legs rising from the **hoop-feet cross
   member** (§3.1, tube centreline Z = 165) up to the **apex at `roll_hoop_z`** (1150), at **X = −825**
   (directly over the helmet, T025). Add a **rearward brace** from the apex down to the rear cross member
   (the triangle that stops the hoop folding back).
3. `Pipe` a ~30–32 mm tube along the hoop centreline. **Width** the hoop to `shoulder_width + 2×roll_clearance`
   (≈ 630, legs at Y = ±315) so the driver's shoulders/helmet sit inside it. The legs land on the widened
   hoop-feet cross member (±330), **not** on the ±250 longerons — gusset each foot. Mirror legs about the
   Center plane.
4. **Harness cross bar (S3 — corrected 2026-07-02):** weld a horizontal tube between the hoop legs at
   **Z = `harness_bar_z` (620) — driver shoulder height**. The shoulder straps wrap this bar, running
   **0–40° downward** behind the shoulders. *Do not run the straps over the 1150 apex:* from 620-high
   shoulders that is a ~40° **upward** pull, which compresses the spine in a frontal stop instead of
   restraining it.
5. **Roll check (S2 — corrected 2026-07-02, structural points only):** the shell is sacrificial correx/foam
   and **crushes in a roll — it must not be counted as protection.** Draw the construction line from the
   **hoop apex (−825, 1150)** forward to the **top of the front tyres (+850, 260)** — the two hard points the
   inverted cart actually rests on. The **helmet sphere** (top at `head_top_z` 1050) and every part of the
   driver (chest, knees, feet — check each against the line at its own X) must sit **below this line** with
   `roll_clearance` to spare. Verified at the current geometry: helmet 1050 vs 1150 at the hoop plane ✓;
   chest ~900 vs ~1030 at X −600 ✓; feet ~300 vs ~380 at X +625 ✓ (tightest — re-check if the pedal stack
   grows; a padded tube across the front bracket zone is the fix if it ever fails). If anything touches,
   raise the hoop or recline the driver lower.

### 3.4 — Axle brackets (welded, the S1 part)
1. New Component `02d_AxleBrackets`. At each axle, model a **steel plate bracket** bridging the longeron to
   the T019 axle, with a **backing plate** on the far side of the tube (no single-shear bolt in a primary
   load path). The T019 **rubber bushing** sits between bracket and axle.
2. Rear brackets carry the dual-axle load — make them the beefiest. Front brackets receive the steered beam
   (T021).

### 3.5 — Triangulation & gussets
1. New Component `02e_Gussets`: triangular steel plate at every frame corner and at the hoop feet. Add
   diagonal tube braces across the spine bays. These are cheap mass that buys huge stiffness (ST3) and jump
   strength (S1).

---

## 4. Mount-point schedule (so nothing is forgotten)

Expose these named points/sketch-points on the frame for the other docs to snap to:

| Mount | Location | For | Doc |
|---|---|---|---|
| Front axle bracket | X +850, Y ±, Z 150 | steered beam + kingpins | T021 |
| Steering column foot + upper brace | cockpit front, two points | braced column (anti-wobble) | T021 |
| Rear axle brackets | X −850, Y ±, Z 150 | dual axle + bushings | T019 |
| Caliper mounts | at rear disc seats | 2 brake calipers | T022 |
| Seat rails | deck, under driver | adjustable seat | T025 |
| Harness: shoulder straps | **harness bar on hoop legs at Z = `harness_bar_z` 620** (§3.3.4) | 4-point harness ≥ 5 g, straps 0–40° down | T025/S3 |
| Harness: lap anchors | 2 points on the under-seat cross member / longerons, Y ≈ ±260 (steel + backing plates, not ply alone) | 4-point harness ≥ 5 g | T025/S3 |
| Glow-lever pivot + cable guides | cockpit + along spine | manual glow | T024 |

---

## 5. FEA — the gate that unlocks cutting (S1, S2)

Run in Fusion Simulation or SimScale Community. *(handbook §6.4 / strategy doc round 1.)*

1. **Load cases:**
   - **Jump landing (S1):** vertical load = **4–5 × static (cart + driver) weight** applied at the axle
     brackets / deck. Static ≈ (≤80 cart + 95 driver) ≈ 175 kg → design impact ≈ **3.4–4.3 kN per g basis**;
     model 4–5× and read stress at the welded brackets and hoop feet.
   - **Rear-axle bending (S1, added 2026-07-02):** the rear axle is an **overhung beam** — brackets support it
     inboard (≈ `Y ±250`) while the four tyres load it outboard (`Y ±600`/`±697.5`), so the peak bending
     moment sits between bracket and inner wheel. Model the rear-share jump load (~0.6 × 4–5× static) as point
     loads at the four wheel centres, supports at the bracket seats, and **check the axle itself for FoS ≥ 2**.
     If a plain **25 mm** solid fails, adopt the **stepped axle** (≈32–40 mm centre, 25 mm stub ends) from
     [T019 §5.4](T019-wheels-axles-suspension.md). This gates the axle-diameter choice.
   - **Hard braking:** fore load at the rear discs/axle.
   - **Cornering side load:** lateral at the wheels.
   - **Roll (S2):** point load on the hoop apex.
2. **Restraints:** fix at the contact patches (or the bushing seats).
3. **Pass condition:** **FoS ≥ 2 on yield** at every welded joint; no permanent deformation; deflection small
   enough not to disturb steering toe (ST3). 
4. **If it fails:** add triangulation/gusset before adding tube mass; thicken the failing bracket; never
   thin a primary load path to save mass — trim elsewhere (T018 §4).

> **Weld competence gate (ADR-001 risk control):** before trusting any structural weld, weld scrap coupons
> and **destructively bend/break** one (prep test B2). No welded joint in this frame is trusted until a
> practice coupon holds with good penetration.

---

## 6. Checks & done criteria for T020

- [ ] Spine + cross members + 12 mm deck modelled, parametric, at Z = 150.
- [ ] Roll hoop welded-tube modelled to `roll_hoop_z` 1150; **roll line proves helmet inside envelope** (S2).
- [ ] Welded axle brackets + backing plates at both axles; rear sized for dual load.
- [ ] Gussets/triangulation at every corner + hoop feet.
- [ ] Mount-point schedule (§4) exposed for T021/T022/T024/T025.
- [ ] **FEA passes FoS ≥ 2 at 4–5× static** (S1) and the roll load (S2) — evidence linked in T026.
- [ ] Frame mass recorded: ______ kg (allowance steel 16 + deck 9 + hoop/brackets 6 ≈ 31).
- [ ] Practice-weld destructive test (B2) passed before any structural weld is trusted.

*Next: [T021 — steering](T021-steering-pitman.md) mounts to the front bracket + column foot exposed here.*
</content>
