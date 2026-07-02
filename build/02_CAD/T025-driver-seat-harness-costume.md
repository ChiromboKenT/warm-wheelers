# T025 — Driver Package: Seat, Harness, Costume & Egress

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P1 (safety) / P1 (recognisability)**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Feeds: roll hoop (T020), shell/pod (T023), CoG (T026)
Proves: S2 (roll envelope), S3 (harness ≥ 5 g), S4 (egress ≤ 10 s), S5 (PPE), S6 (visibility ≥ 100°), C5 (low mass)

> **The driver package is the master volume of the whole cart** — it sets the cockpit, the roll-hoop height,
> the harness path, the seat, *and* the visible bottle costume. Build it first conceptually (we are now
> formalising it), and everything else packages around it. The driver is the **single biggest mass**, so its
> low position is what makes the tall heater's CoG land **≤ 540 mm** (C1/C5). Design to the **95th-percentile
> male** so any cast driver fits.

---

## 1. What the driver package has to do

| Function | How delivered | Target |
|---|---|---|
| Fit a large driver | 95th-%ile envelope (1.88 m, 530 mm shoulders), seat-adjustable | fit + S4 |
| Carry mass low | Reclined feet-forward, hips at `seat_pan_z` 280, CoG ~380 | C5 (≤ 540 total) |
| Protect in a roll | Head + torso inside the roll-hoop envelope (T020) | S2 |
| Restrain the driver | **4-point harness**, anchored to the frame (not ply) | S3 (≥ 5 g forward) |
| Let the driver out fast | Self-extraction in costume + helmet | S4 (≤ 10 s) |
| See the course | ≥ 100° forward arc around shell + costume | S6 |
| Be the gas bottle | Orange LP-cylinder costume = the visible boat-tail pod | SP1 / theme |

---

## 2. The reclined driver envelope (geometry)

Model the driver as a **posable mannequin or a layered proxy** (cylinders for torso/limbs + a head sphere),
reclined feet-forward:

| Element | Value | Source / role |
|---|---|---|
| Recline angle | `recline_angle` 35° from horizontal | low CoG + low frontal area |
| Hip point (H-point) | `seat_pan_z` 280 mm | hips low |
| Package length (feet→head) | `driver_pkg_len` 1450 mm along X | sits between the axles |
| Shoulder width | `shoulder_width` 530 mm | sets cockpit + hoop width |
| Helmet top (reclined) | `head_top_z` 1050 mm | sets `roll_hoop_z` 1150 |
| Driver mass-centre | `driver_cg_z` 380 mm | dominates total CoG |
| Fore/aft driver centre | tune to land 45–55 % front (C3) | balance |

1. New Component `07_DriverEnvelope`. Place the mannequin/proxy reclined at 35°, hips at (X tuned, Z 280),
   feet toward +X (front), helmet toward −X (rear, under the roll hoop). 
2. Make it a **translucent colour** — it's a keep-clear envelope, not a part. Everything else must avoid it.

---

## 3. Seat & H-point

```
08_DriverPackage
├─ 08a_SeatPan         (adjustable, low)
├─ 08b_Backrest        (raked to recline_angle)
├─ 08c_Headrest        (inside roll envelope)
├─ 08d_Harness         (4-point, frame-anchored)
├─ 08e_Footrest/Pedals (steering reach datum)
└─ 08f_Costume         (orange LP-bottle shell)
```

1. **Seat pan (`08a`):** moulded foam + ply base on the deck (T020), top at `seat_pan_z` 280, on **adjustable
   rails** (fore/aft) so smaller cast drivers reach the wheel/pedals. Cradles the driver low.
2. **Backrest (`08b`):** raked to `recline_angle` 35°, supporting the torso; sized to `shoulder_width`.
3. **Headrest (`08c`):** foam-backed, **inside the roll-hoop envelope** (S2), behind the helmet.
4. **Footrest/pedals (`08e`):** at the front, sets the arm/leg reach datum used by steering (T021 wheel) and
   the brake levers (T022) and the glow lever (T024).

---

## 4. Harness & roll protection (S2, S3)

1. **4-point harness (`08d` — corrected 2026-07-02):** two shoulder straps over the **harness cross bar on
   the hoop legs at Z = `harness_bar_z` (620) — shoulder height** (T020 §3.3.4), lap belt to the **frame
   anchors** on the under-seat cross member (T020 §4 — bolted to **steel, never ply alone**). Model the strap
   path and check it runs **0–40° downward** from the shoulders to the bar. *Not over the 1150 hoop apex:*
   with shoulders at ~620 that pulls ~40° upward and compresses the spine in a frontal stop.
2. **Anchor strength (S3):** anchors must hold **≥ 5 g forward** pull — that's the bench test (BENCH gate);
   in CAD just ensure the anchors land on frame members with backing plates.
3. **Roll envelope (S2):** confirm **helmet + shoulders sit inside the roll-hoop line** (the construction line
   from T020 §3.3) with `roll_clearance` 50 mm. Pad the cockpit — *"the driver will thank you on landing"*
   (handbook §5.9).

---

## 5. Visibility (S6)

1. From the **helmet eye-point** of the reclined mannequin — approximately **(X −750, Z 930)**, i.e. inside
   the shell, 670 mm below the 1600 shell top — sweep the **forward field of view** in CAD. The driver sees
   the course **through the view band** (T023 §3.2.4: dark mesh, Z `view_band_lo` 650 – `view_band_hi` 1050,
   full width of the front face). Target **≥ 100° horizontal clear forward arc** through the band;
   ground visible ~5 m ahead of the nose (sightline through the band's bottom edge); cones/course visible at
   braking distance.
2. If the band, costume collar, or interior bracing blocks the view, **adjust `view_band_lo`/`view_band_hi`**,
   lower the line of sight (recline tweak), or trim the collar — and keep the eye-to-band interior corridor
   free of structure (only the thin steering column may cross it). Visibility is a P1 safety row — it wins
   over styling.

---

## 6. The bottle costume (the gag) — and how it reads as the boat-tail

1. **Costume shell (`08f`):** an **orange EVA/EPS foam LP-gas-cylinder** worn over the driver's torso —
   domed top + valve/collar detail (grey), per [T007 §2] (9 kg bottle basis ~310 Ø scaled up to fit a seated
   adult torso). The **costume's outer surface = the visible boat-tail pod** of the shell (T023 §3.3): heater
   body tapers back → becomes the bottle → which is the driver. *The driver literally is the fuel.*
2. **Helmet under the costume (S5):** design the collar so a **certified helmet fits underneath** and the
   safety kit (long sleeves/trousers/gloves/closed shoes) is built in, **not optional dress-up** (handbook
   §2.1). Worn every time the cart moves.
3. **Egress (S4):** the costume must allow **self-extraction in ≤ 10 s** with no tools — quick-release harness,
   costume that doesn't trap arms, clear path up/out past the hoop. Rehearse it. Secure all costume edges so
   nothing snags (S8) or can foul a wheel.

---

## 7. Mass & CoG contribution (C5)

1. Give the driver proxy **~95 kg** (not counted in the 80 kg cart limit, but **is** counted for CoG and FEA
   load). Place its mass-centre at `driver_cg_z` 380.
2. This single low mass is what pulls total CoG toward the **≤ 540 mm** target. Read combined occupant CoG in
   T026; it should sit **at/below the axle line (130) region's influence** — i.e. as low as the reclined
   posture allows. If total CoG > 540, **recline lower / drop the seat / lower the floor** before anything else
   (anti-tip fallback, since track is capped at 1200).

---

## 8. Done criteria for T025

- [ ] 95th-%ile reclined driver envelope placed (35°, hips 280, helmet top 1050).
- [ ] Adjustable seat + backrest + headrest; footrest/pedal datum set for steering/brake/glow reach.
- [ ] **4-point harness** to **frame anchors** (steel + backing plates); helmet + shoulders **inside roll
      envelope** (S2) with 50 mm clearance.
- [ ] Forward visibility **≥ 100°** confirmed (S6).
- [ ] Bottle costume modelled as the **boat-tail pod**; helmet fits under; PPE built in (S5).
- [ ] Egress path proven **≤ 10 s** in costume (S4, rehearse); edges secured (S8).
- [ ] Driver mass-centre at 380; contribution to total CoG checked (feeds T026, C5).

*Next: [T026 — assembly, validation & render/submission pack](T026-assembly-validation-render.md).*
</content>
