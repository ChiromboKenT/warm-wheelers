# T023 — Body Shell: Domed Heater Front & Boat-Tail Pod

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P1 (recognisability) / P2 (aero)**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Builds on: [T020 frame](T020-chassis-frame-rollhoop.md), [T025 driver](T025-driver-seat-harness-costume.md)
Proves: SP1 (reads as heater ≥ 90 %), A1 (lift ≤ 0), A2 (drag), A3 (crosswind)

> **The body does two jobs at once:** be **instantly recognisable as a Goldair-style gas heater** (SP1 — a
> Goal-1 promise), and **interact with the air as little as possible** (handbook §5.5). Our resolution
> (this brainstorm): keep the **upright, tall-narrow heater stance** but give it a **convex full-height
> domed front face** that sheds air, **hollow the upper two-thirds** (light, low CoG), and **boat-tail the
> rear into the orange LP-gas-bottle driver pod**. The driver *is* the fuel.

---

## 1. What the shell has to do

| Function | How delivered | Target |
|---|---|---|
| Read as a heater in 1 second | Tall narrow box, **front grille** (3 panels), control knobs, nameplate, castor cues | SP1 ≥ 90 % |
| Cut drag without losing the look | **Convex domed front** + **boat-tail**, smooth surfaces, small frontal area | A2 |
| Stay planted (no lift on the jump) | Domed/boat-tail shape tuned to net lift ≤ 0 | A1 |
| Keep CoG low | Upper two-thirds **hollow**, built from correx/foam (light) | C1/C5 |
| Be safe & sheddable | Panels light, edges radiused, sacrificial — can't jam a wheel/steering | S8, risk reg |
| House the glow | 3 grille panels + lever linkage (T024) | SP5 |

**Frontal area note:** narrow shell (`body_width` 1300) × height (`body_height` 1450) ≈ 1.9 m² gross, reduced
by the domed top and the fact the driver pod tapers. The dome + boat-tail are worth more here than aggressive
rake because they keep the **flat heater face** the concept needs.

---

## 2. Geometry recap (from T018)

| Param | Value | Role |
|---|---|---|
| `body_width` | 1300 | shell width (inboard of wheels) |
| `body_height` | 1450 | tall heater |
| `body_length_main` | 1850 | main heater box |
| `boattail_len` | 500 | rear taper into the bottle pod |
| `body_rake` | 5° | slight lean; aero mainly from dome+tail |
| `front_dome_depth` | 200 | how far the front bows forward at mid-height |
| bottom of shell | Z = `ground_clearance` 150 | sits above the deck |
| top of shell | Z = 150 + 1450 = 1600 | < 2500 (huge margin) |

---

## 3. Modelling approach — surface, but buildable

The shell is built in real life from **flat correx/foam panels on a light batten/timber sub-frame** (it's
sacrificial — "fine if it flies off, as long as it can't jam a wheel or steering", handbook §5.5). So model a
**smooth reference surface** for looks + CFD, then **panelise** it for the cut-list. Use Fusion's **Form
(T-spline)** environment for the dome and boat-tail, and the **Solid** environment for the flat faces and
grille.

```
05_Shell
├─ 05a_SubFrame       (light battens following the surface)
├─ 05b_FrontDome      (convex front face + grille opening)
├─ 05c_MainBody       (upright box sides, hollow upper)
├─ 05d_BoatTail       (taper to the bottle pod)
├─ 05e_Grille         (3 panels + bars — glow sits behind, T024)
├─ 05f_Details        (knobs, nameplate, castor cues)
└─ 05g_PanelCutlist   (flattened panels for build)
```

### 3.1 — Main body (the heater box)
1. New Component `05c_MainBody`. On the **Center (XZ) plane**, sketch the side silhouette: bottom at
   Z = `ground_clearance`, height `body_height`, length `body_length_main`, leaning back `body_rake` 5°
   (top edge toward −X / rearward, the "leaning into speed" read). **Extrude symmetric** width `body_width`.
2. **Hollow the upper two-thirds:** shell it out / model only as panels around the driver envelope (T025).
   No structural mass up high — this is how the tall shape keeps CoG ≤ 540 (C1).

### 3.2 — Convex domed front (the agreed compromise)
1. New Component `05b_FrontDome`. In the **Form** environment, build a **convex face** across the front: flat
   at the very top and bottom edges, **bowing forward by `front_dome_depth` (200) at mid-height**, and with
   **rounded vertical leading edges** (corner radius ~80–100). 
2. The dome reads as a softened heater front (heaters have a gently curved grille face) **and** rolls air over
   the top instead of slamming a flat wall into it. Keep the **lower front upright and flat enough** for the
   grille + knobs to sit cleanly and read correctly.
3. Cut the **glow-grille opening** in the dome's lower-mid face: **full width, Z ≈ 300–650** — a ~350 mm tall
   zone holding the 3 glow panels (~100 mm tall each + gaps, T024). *Scaling note (corrected 2026-07-02): the
   T007 reference heater is ~700 tall with a ~220 grille; our shell is 1450 tall (≈2× scale), so a copied
   220 mm grille would read wrong and give panels too small to see at 50 m (SP3). ~350 mm at this scale keeps
   the heater proportion and makes each panel a full-width ~100 mm orange bar.*
4. **View band (S6 — added 2026-07-02; without this the driver cannot see).** The reclined driver's eye point
   is at roughly (X −750, Z ~930) — **670 mm below the 1600 shell top**, looking at the *inside* of the front
   face 2 m ahead. Cut a second full-width opening at **Z = `view_band_lo` (650) to `view_band_hi` (1050)**
   and fill it with **dark open mesh / spaced slats** — it reads as the heater's upper grille from outside,
   and the driver sees the course through it. Geometry check: sightline through the band bottom
   (650 @ X +1200) reaches the ground ~5 m ahead of the nose; through the band top, level-and-up vision ✓.
   Keep the **interior corridor** from the eye point to this band clear of bracing (the thin steering column
   may cross it, like an A-pillar). Verify the arc from the real eye point in T025 §5 and tune the band edges
   — these are validated starting values, not guesses.

### 3.3 — Boat-tail into the bottle pod (end section now pinned — 2026-07-02)
1. New Component `05d_BoatTail`. From the rear of the main body (X −650, full 1300 × 1450 section), **taper
   the sides and top inward over `boattail_len` (500)** to the pod end section at X = −1150: an
   **≈ Ø `pod_end_dia` (700) circle centred at Z = `pod_center_z` (650)** — bottom edge at 300, top at 1000.
   This **is** the gas-bottle read — the driver's upper body/costume forms the visible "bottle" (T025). It
   shrinks the low-pressure wake (the biggest drag source after frontal area; handbook §5.5) and ties the gag
   together: heater body → bottle tail → driver.
2. **Rear-wheel clearance (the integration check from T018 §3.1 ②, now with numbers):** the rear duals span
   Y 502.5–697.5, top at Z 260, under the tail at X −720…−980. Two rules make the tail clear them:
   - **Below Z = 300, no tail surface aft of X = −690** — step the tail's under-surface up to Z ≥ 300 over
     the wheel zone (the pod bottom at 300 continues this line to the tail end). This also protects the
     departure angle over the 170 mm tail overhang.
   - The side taper alone is **not** enough down low (at X −850 the planform is still ~1060 wide > the
     1005 inner-tyre line) — the step-up rule above is what actually clears the wheels; treat the tyre
     surfaces + `wheelwell_clearance` (25) as a keep-out solid and run `Inspect ▸ Interference`.
3. **Cockpit / egress opening:** leave the tail **open on top from X ≈ −650 rearward** (opening ~650 wide,
   matching the hoop interior) — the driver-in-costume *is* the visible top of the pod (T025 §6), the roll
   hoop crosses it at X −825, and this is the ≤ 10 s egress route (S4). Hard shell exists only below and
   beside the driver in this zone.
4. Keep the boat-tail clear of the brakes (T022) and the roll-hoop brace (T020).

### 3.6 — Front wheel arches (added 2026-07-02 — the shell walls otherwise pass through the steered tyres)
The shell (±650) is **wider than the front wheels' inner faces** (inner tyre face at 557.5), and both axles
sit inside the shell footprint — so the shell **must** have wheel openings; no earlier doc said so.
1. In `05c_MainBody`, cut **front wheel wells**: keep-out box per side of **Y ≥ 460 (inner wall), X +670 to
   +1030, Z 0 to 300** — this is the full ±30° steering-sweep envelope of the Ø260×85 tyre about the kingpin
   (extremes: Y 493–696, X 696–1004) plus `wheelwell_clearance`. At full lock the tyre pokes ~46 mm proud of
   the 650 shell side — leave the arch open (visually it reads as the heater's castor shadow-gap; style the
   cosmetic castor cues, §3.4, at these corners).
2. Rear duals: covered by the §3.3 step-up rule (tail sides stay above Z 300 over the wheels); if any lower
   side-skirt is added it needs the same Y ≥ 475 cut between X −690 and −1010.
3. **Validation:** sweep the steering through full lock (T021 §4.1) with the shell visible and run
   `Inspect ▸ Interference` — zero contact with tyres anywhere in the sweep.

### 3.4 — Heater details (the recognisability cues, SP1)
1. `05e_Grille`: 3 horizontal panel zones with slatted bars in front (glow behind, T024). These are the
   "ignition panels" — off → 1 → 2 → 3.
2. `05f_Details`: 2 control knobs (Ø~40) lower-left face; **"WARM WHEELERS" nameplate** lower-right (where the
   appliance brand badge sits, SP7); optional **cosmetic castor cues** at the corners (the real running wheels
   are the big pneumatics). Reference proportions from [T007 dimension notes](../05_media/T007-dimension-notes.md).
3. Finish: **matte dark body**, orange glow panels — model as appearances for the render.

### 3.5 — Sub-frame & panelisation (buildable output)
1. `05a_SubFrame`: light timber/aluminium battens following the surface, fixed to the chassis (T020) — **not**
   structural, just holds the skin.
2. `05g_PanelCutlist`: use **Create ▸ Unfold / or the Sheet-Metal flat pattern** on the flatter panels, and
   for the dome/tail approximate with developable strips, to produce a **correx/foam cut-list** for the build
   pack (T026).

---

## 4. CFD — aero validation (A1–A3), after the shape is stable

Run in SimScale Community (free virtual wind tunnel; handbook §6.3). *Aero usefulness, not aero vanity.*

1. **Baseline vs ours:** compare an **upright flat box** vs **our domed + boat-tailed** shell at top speed
   (~12–15 m/s). Read **drag** and **net lift**.
2. **A/B the big levers only** (one change per run, strategy doc): dome depth, boat-tail length, wheel
   exposure/shrouding, rake.
3. **Pass conditions:** **net lift ≤ 0** (A1, stays planted on the jump), **drag clearly < the upright-box
   baseline** with **no silhouette change that breaks the heater read** (A2), crosswind yaw moment
   controllable (A3).
4. **Physical cross-check (cheap, handbook §6.3):** tuft-test the real shell towed behind a car; coast-down
   time boat-tail on vs off. Confirms the sim.

> **Recognisability test (SP1):** show the render/silhouette to a cold audience — **≥ 90 % must name it
> "heater" unprompted.** If the dome/rake has pushed it toward "leaning box", dial the dome back and lean
> harder on grille/knobs/nameplate. The look is a **Goal-1 promise**, so it wins ties against aero.

---

## 5. Done criteria for T023

- [ ] Main body (upright, 5° rake, hollow upper) + **convex domed front** (200 mm bow, rounded edges) modelled.
- [ ] **Boat-tail** tapers into the bottle pod, clear of wheels/brakes/hoop.
- [ ] Grille (3 panels), knobs, nameplate, castor cues — reads as a heater.
- [ ] Light sub-frame to chassis; **panel cut-list** generated for the build pack.
- [ ] **CFD:** net lift ≤ 0 (A1); drag < upright-box baseline (A2); crosswind ok (A3) — evidence in T026.
- [ ] Recognisability: ≥ 90 % name it "heater" (SP1).
- [ ] Shell mass recorded: ______ kg (allowance ~6, light correx/foam).

*Next: [T024 — manual glow mechanism](T024-glow-mechanism.md) lives behind this grille.*
</content>
