# T022 — Dual-Disc, Two-Circuit Braking

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P0 (mandatory, safety-linked)**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Builds on: [T019 rear axle](T019-wheels-axles-suspension.md), [T020 mounts](T020-chassis-frame-rollhoop.md)
Proves: B1 (stops), B2 (≤200 N), B4 (no spin), B5 (redundancy)

> **Brakes are mandatory and a primary tech-inspection item** — *"the cart must be able to stop"* (handbook
> §2/§5.3). We use **two independent rear disc circuits** (one per side), each on its own lever and cable, so
> a single failure still leaves a working brake (B5). Acting on **both rear sides** also keeps braking
> balanced (B4). The handbook's belt-and-braces suggestion — a hinged **drag-brake** backup — is kept as a
> documented option.

---

## 1. What the brakes have to do

| Function | How delivered | Target |
|---|---|---|
| Stop the cart | Disc + mechanical caliper on **each rear side** | B1: ≥ 0.4 g; 40 km/h → ≤ 16 m |
| Within one person's strength | Bike-lever + cable leverage | B2: input ≤ 200 N |
| No fade over a run | Steel discs shed heat; cable (no fluid to boil) | B3: < 15 % loss |
| No lock-up spin | Two balanced rear circuits, modulated | B4: no yaw > 5° |
| Fail-safe | **Two circuits** — one side fails, other still stops it | B5 |

**Decel sanity (B1):** 40 km/h = 11.1 m/s. At 0.4 g (3.92 m/s²), stop distance = v²/(2a) = 123.4 / 7.85 ≈
**15.7 m ≤ 16 m**. ✔ Two discs comfortably exceed 0.4 g on a cart this light — the limit is **tyre grip and
not locking**, which is why two balanced circuits + sensible modulation matter more than raw clamp force.

---

## 2. Architecture

```
        rear dual axle (T019)
   [disc L]                 [disc R]
      |                        |
  caliper L                caliper R     ← each: mechanical (cable) caliper
      |                        |
   cable L                  cable R
      |                        |
  lever L (e.g. left hand)  lever R (right hand)   ← two independent circuits
```

- **Two discs**, one inboard of each rear dual pair, on the disc seats modelled in [T019 §5.4]. `disc_dia` 160.
- **Two mechanical (cable) calipers** — go-kart or bicycle mechanical disc calipers; **no hydraulics** (cheap,
  serviceable, nothing to boil/leak; handbook §5.3).
- **Two levers** — bike brake levers. Option: both on one handlebar/grip for two-handed normal use, or split
  so either hand can stop the cart. Either way each circuit is independent (B5).
- **Drag-brake backup (optional, documented):** a hinged lever-operated beam/pad that presses onto the road —
  the handbook's belt-and-braces. Model the pivot + pad if you adopt it; keep it from fouling the boat-tail.

---

## 3. Build steps in Fusion

```
04_Brakes
├─ 04a_Disc_L / _R           (on T019 disc seats)
├─ 04b_Caliper_L / _R        (straddling each disc)
├─ 04c_CaliperBracket_L / _R (to T020 caliper mounts)
├─ 04d_Cable_L / _R          (route to levers)
├─ 04e_Lever_L / _R          (cockpit, driver reach)
└─ 04f_DragBrake (optional)
```

### 3.1 — Discs
1. New Component `04a_Disc_L`. On the rear-axle plane, sketch a circle Ø `disc_dia` (160) centred on the axle
   at the **left disc seat** (T019 §5.4, `Y = +(track_width/2 − rear_pair_width/2 − 30)` = +472.5). Extrude
   ~4–5 mm. Add bolt-circle holes to the hub. Mirror to `04a_Disc_R` (the `04b` prefix belongs to the calipers).
2. **Ground-clearance note (validated 2026-07-02):** a Ø160 disc on the 130 mm axle line puts the disc's lower
   edge at **Z = 50 mm**. That is below the ~100 mm clearance guideline, but acceptable here because the disc
   sits **between the dual tyres** (inboard face 502.5, disc at 472.5) — the two 260 mm tyres either side of it
   bottom out long before the disc can touch, even at full jump-landing tyre squash (~25–30 mm). Flag it to
   scrutineers proactively; if challenged, dropping to Ø140 keeps torque adequate (see §4.2 calc) and lifts the
   edge to Z = 60.

### 3.2 — Calipers + brackets
1. `04b_Caliper_L`: a body straddling the disc edge at a convenient clock position (top/rear of the disc, clear
   of the wheel and the ground). 
2. `04c_CaliperBracket_L`: a steel plate tying the caliper to the **caliper mount on the rear frame** (T020
   §4). The bracket must be **stiff** — caliper flex = lost lever travel and that spongy feeling. Mirror right.

### 3.3 — Cables + levers
1. `04d_Cable_L`: route a Bowden cable from the caliper arm forward along the spine to the cockpit, **clear of
   the steering drag link (T021) and the glow cable (T024)** — use the cable guides from T020 §4. Gentle bends
   only (sharp bends add friction → more lever effort, hurts B2).
2. `04e_Lever_L`: a bike lever at the driver's reach (set against T025 driver arms/hand). Lever ratio sets
   input force — size so **full braking needs ≤ 200 N** at the hand (B2). Mirror right.

### 3.4 — Optional drag brake
1. `04f_DragBrake`: a hinged beam pivoting off the rear frame with a friction pad, pulled down by a third
   lever/cable. Useful as the fail-safe and for low-speed holding. Ensure it **cannot drop and jam** at speed
   and clears the boat-tail.

---

## 4. Validation

1. **Packaging (CAD):** confirm both discs, calipers and cable runs **clear the wheels, axle, frame and
   bodywork** through full suspension compliance travel and at full steering lock up front. *"Design this in
   now, not after the body shell is finished"* (strategy doc).
2. **Clamp/decel calc (B1):** with chosen disc radius, pad µ and caliper force, confirm braking torque exceeds
   what's needed for 0.4 g without exceeding tyre grip (so it slows, doesn't just lock). Document the numbers.
3. **Lever force (B2):** lever ratio × cable efficiency → hand force ≤ 200 N. 
4. **Balance (B4):** two equal rear circuits → no left/right bias; bench-bleed/adjust both to equal bite.
5. **Redundancy (B5):** demonstrate (bench) the cart still stops with one circuit disabled.

> Brakes + steering are **the gate items at inspection** — *"build and test both first"* (handbook risk
> register). Prove the rolling chassis **rolls, steers and stops** before the body goes on (handbook §8.4).

---

## 5. Done criteria for T022

- [ ] Two discs on the T019 seats; two calipers on stiff brackets to T020 mounts.
- [ ] Two independent cables routed clear of steering + glow; two cockpit levers at driver reach.
- [ ] CAD shows **zero clash** through suspension travel + full steer lock.
- [ ] Decel calc shows ≥ 0.4 g achievable without lock (B1); lever force ≤ 200 N (B2).
- [ ] Redundancy demonstrated: stoppable on one circuit (B5).
- [ ] (Optional) drag-brake modelled and shown not to foul/jam.
- [ ] Brake mass recorded: ______ kg (allowance ~5).

*Next: [T023 — shell, domed front, boat-tail](T023-shell-domed-front-boattail.md) wraps the rolling chassis.*
</content>
