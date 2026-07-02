# T024 — Manual "Ignition" Glow Mechanism (no battery)

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P3 (show) — but inspection-critical**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Builds on: [T023 grille](T023-shell-domed-front-boattail.md)
Proves: SP2 (fires every run), SP5 (bar-by-bar), S7 (no fire/no electrical)

> **The signature gag, made legal.** Batteries, electrical and any stored energy are **banned** (handbook
> §2) — so the LED glow in the old docs **fails inspection**. The glow must be **mechanical**. We use a
> **manual driver-lever staged reveal**: the driver pulls a lever and the three grille panels flip from dark
> to bright orange **one by one** — off → 1 → 2 → 3 — across the run. *Judges score the show, and a reliable
> manual sequence beats an automatic one that jams* (handbook §5.7). The **airflow-vane auto version stays
> documented as a future upgrade.**

---

## 1. What the glow has to do

| Function | How delivered | Target |
|---|---|---|
| "Ignite" bar by bar | 3 panels, each tripped in sequence by a detented lever | SP5 |
| Fire reliably every run | Pure mechanical linkage; no electronics to fail | SP2 (3/3) |
| Read at distance | Big bright **fluorescent-orange** panels — 3 full-width bars ~100 mm tall each in the Z 300–650 grille zone (T023 §3.2, scaled from T007) | SP3 (≥ 50 m) |
| Obviously fake fire | Flat orange panels/fabric — no flame, no smoke, no spark | S7 / banned effects |
| Not foul anything | Linkage routed clear of steering (T021) + brake cables (T022) | packaging |
| Cost ~nothing, light | Springs, rod, panels — ~2 kg | M2 |

---

## 2. Mechanism — how it works

Three panels behind the [T023] grille, each on a horizontal **pivot (piano-hinge or rod)** along its top
edge. Each panel has:
- a **dark outer face** (matches the cold heater) showing when closed,
- a **fluorescent-orange inner face** that shows when the panel flips open/rotates,
- a **light spring** biasing it toward the "lit" position,
- a **catch/detent** holding it "dark" until released.

The **driver lever** (right hand) pulls a **rod/cable** running along the spine to a **3-step ratchet or
cam**. Each pull releases the **next** catch in sequence → panel springs to orange. Three pulls = three
panels lit. (Alternatively, one lever throw drives a **cam shaft** with three lobes phased so panels trip at
successive lever angles — same effect, single sweep.)

```
06_Glow                          (matches the assembly tree in T026)
├─ 06a_Panel_1 / _2 / _3      (pivoting, dark/orange faces)
├─ 06b_PanelSprings           (bias to lit)
├─ 06c_Catches                (hold dark)
├─ 06d_Lever                  (driver right hand)
├─ 06e_Rod / Cable            (lever → sequencer, along spine)
├─ 06f_Sequencer             (ratchet or 3-lobe cam)
└─ 06g_Return/ResetHook       (re-cock panels at the top before the run)
```

---

## 3. Build steps in Fusion

1. **Panels (`06a`):** in the glow-grille opening (T023 §3.2 — full width, Z 300–650), model 3 panels
   ~100 mm tall × ~1100 mm wide with even gaps. Each
   pivots on a rod along its **top edge**. Closed = flush dark face out; released = rotates ~70–90° so the
   **orange face** shows to the crowd. Stack them so panel 1 (top) lights first, then 2, then 3 — matching
   "off at the top, building to the finish".
2. **Springs (`06b`) + catches (`06c`):** a light torsion/extension spring per panel pulling it to lit; a
   simple **catch** (hooked lever) holding it dark. Model the catch geometry so the sequencer can release them
   in order.
3. **Lever (`06d`):** at the driver's **right hand**, reachable while harnessed and steering (check against
   T025 driver arms + T021 wheel). A ratchet lever with **3 detents** is the cleanest.
4. **Rod/cable (`06e`):** route along the spine (T020 cable guides) to the sequencer, **clear of the steering
   drag link and both brake cables**. Note the routing in the model so the build doesn't clash.
5. **Sequencer (`06f`):** either
   - a **3-step ratchet** that releases one catch per lever pull, or
   - a **cam shaft** with 3 lobes phased ~20° apart so a single lever sweep trips them in turn.
   Model whichever you'll build; the cam looks more "magical", the ratchet is more foolproof.
6. **Reset (`06g`):** a hook/lever to **re-cock all three panels to dark** at the top of the hill before the
   run (and between rehearsals). Quick, tool-free.

> **Fabric-flame add-on (optional, handbook §5.7):** behind each panel, a tuft of **orange ripstop/tulle**
> can flutter out when the panel opens for extra "flame" read at distance (SP3). Self-actuating, near-free.
> Model as a draped surface if adopted.

---

## 4. The start-gag choreography (ties to the brief)

The 30-second start (design brief crowd hook), now all-mechanical:
1. Cart arrives as a **cold dark heater** — all 3 panels dark (pre-cocked at the top).
2. The **gas-delivery crew** "connect" the orange bottle-driver (T025) to the heater.
3. Driver hits the lever → **panel 1 flares orange**, then **2**, then **3** as they're pushed off →
   *ignition*, building bar by bar.
4. Crew signal **"warmth delivered"** and shove it off. *Light only — no smoke, sound props or thrown items*
   (SP6).

(Optional course-driven variant for later: trip-points along the course, or the airflow-vane upgrade, fire
the panels by speed instead of by hand — but the **manual lever is the primary** for reliability.)

---

## 5. Validation

1. **Reach (CAD):** lever reachable by the harnessed 95th-%ile driver without fouling wheel/brakes (T025/T021).
2. **Sequence (bench, SP5):** the mechanism trips 1→2→3 cleanly, every time; re-cock works.
3. **Reliability (rehearse, SP2):** fires in **3/3** rehearsal runs, no missed bar.
4. **Distance (rehearse, SP3):** panels clearly visible at **≥ 50 m** in daylight — size/colour confirmed.
5. **Inspection (S7):** **no electrical, no battery, no flame, no smoke** anywhere; gas bottle is an empty
   decoy. Passes the banned-effects rule outright.

---

## 6. Done criteria for T024

- [ ] 3 pivoting panels (dark/orange) in the grille, sprung to lit, held by catches.
- [ ] Driver lever + rod/cable + **sequencer** (ratchet or cam) modelled; **routed clear** of steering + brakes.
- [ ] Reset/re-cock mechanism modelled.
- [ ] Lever reachable while harnessed + steering (checked vs T025/T021).
- [ ] Bench sequence 1→2→3 proven; rehearsal 3/3 (SP2); visible ≥ 50 m (SP3).
- [ ] **Zero electrical/battery/flame/smoke** confirmed (S7).
- [ ] Glow mass recorded: ______ kg (allowance ~2).

*Next: [T025 — driver seat, harness, costume, egress](T025-driver-seat-harness-costume.md).*
</content>
