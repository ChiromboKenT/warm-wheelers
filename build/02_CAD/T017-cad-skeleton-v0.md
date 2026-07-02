# T017 — CAD Skeleton v0 (proxy geometry modeling spec)

> ## ⛔ SUPERSEDED — historical proxy skeleton, do not model to these numbers
> This was the first block-out skeleton. Its **approach** (proxy solids → measure CoG/fit before detailing)
> is sound and still describes what the skeleton is *for*. **But its geometry is obsolete:** `wheel_dia` 400,
> `wheelbase` 1800, `track_width` 1300, `body_width` 2000, `ground_clearance` 220, `driver_cyl` proxy, etc.
> The current, validated geometry lives in the **[T018 master spec](T018-CAD-master-design-spec.md)** and
> **[T018-parameters.csv](T018-parameters.csv)** — including a real driver package (T025), the Rybro 260 mm
> wheel (T019), and the fore/aft **longitudinal datum** (T018 §3.1) this doc never had.
> **Build the real subsystems from T019–T026;** keep this only as the origin/coordinate reference (§1, which
> is unchanged and still authoritative: +X fwd, +Y left, +Z up, origin on ground at mid-wheelbase).

**Warm Wheelers · Red Bull Soapbox JHB 2026 · CAD**
Date: 2026-06-23 · **Status: SUPERSEDED by [T018](T018-CAD-master-design-spec.md)** (coordinate convention §1 still authoritative)
Tool: **Autodesk Fusion** (Personal edition)
Depends on: [T009 layout sketch / geometry (ADR-003)](T009-geometry-decision.md) · [T016 parameters](T016-fusion-parameters-guide.md)
Feeds: CoG / anti-tip check (**C1, C2**), mass budget (**M2**), roll protection (**S2**), turning radius (**ST1**), jump landing (**C4**)

> **Reminder from the task:** this is now marked *In progress*. Flip the same cell in
> [soapbox_daily_schedule_tracker.xlsx](../../Vision/soapbox_daily_schedule_tracker.xlsx) and only move it to
> *Done* after the "Done criteria" at the bottom are all ticked.

> **What "proxy geometry" means here:** we are NOT detailing the real frame yet. We block out every major
> mass and volume as the simplest solid that captures its size and position — boxes and cylinders — all
> driven by named parameters. The payoff: we can immediately *measure* centre of gravity, check the driver
> fits, check the roll envelope, and confirm we're inside the Red Bull box — and change one number to fix
> any of it. This skeleton is the truth source every later detailed part snaps to.

---

## 0. Before you start — open the right file

Open the design you saved in T016 (`WarmWheelers-Chassis-v0`) so the 6 parameters are already present.
If you haven't done T016 yet, do it first — **everything below references those parameters by name.**

---

## 1. Coordinate system & origin convention (read this twice — it prevents all the pain later)

We fix one convention and never deviate:

| Axis | Direction | Meaning |
|------|-----------|---------|
| **X** | +X = **forward** (toward the front axle) | vehicle length |
| **Y** | +Y = **left** of driver | track / width |
| **Z** | +Z = **up** | height above ground |

**Origin (0,0,0) = on the ground, on the centreline, exactly mid-wheelbase.**

That makes the model **symmetric about the XZ plane** (the `Y = 0` plane), so we model one side and mirror.
Reference positions that fall out of this:

| Feature | X | Y | Z |
|---------|---|---|---|
| Front axle centreline | `+wheelbase / 2` (= +900) | 0 | `wheel_dia / 2` (= 200) |
| Rear axle centreline | `-wheelbase / 2` (= −900) | 0 | `wheel_dia / 2` (= 200) |
| Wheel centres | at each axle X | `±track_width / 2` (= ±650) | `wheel_dia / 2` |
| Floor pan (top of clearance) | — | — | `ground_clearance` (= 220) |
| Body box bottom | — | — | `ground_clearance` |
| Body box top | — | — | `ground_clearance + body_height` (= 1720) |

> **Sanity already visible:** top of body 1720 mm < RB max **2500**. Body width 2000 = RB max **2000** (no margin
> — flag). Body overhangs each axle by `(body_length − wheelbase)/2` ≈ 275 mm front and rear.

---

## 2. Add the T017 proxy parameters

`Modify ▸ Change Parameters`, add these **User Parameters** (CSV provided: [T017-parameters.csv](T017-parameters.csv)).
Lengths in `mm`. These are **proxy assumptions** — flagged ones must be confirmed against T008/T009.

| Name | Value | Unit | Notes / source |
|------|-------|------|----------------|
| `body_length`        | 2350 | mm | overall length from T009 (L×W×H 2350×2000×1500) |
| `wheel_dia`          | 400  | mm | **assumption — confirm**; sets axle height 200, ties to `ground_clearance` 220 (T009 open item) |
| `wheel_width`        | 80   | mm | proxy tyre width |
| `axle_dia`           | 30   | mm | proxy axle stub diameter |
| `driver_cyl_dia`     | 600  | mm | seated/reclined driver + bottle-costume envelope — **confirm vs T008** |
| `driver_cyl_len`     | 1200 | mm | reclined driver length — **confirm vs T008** |
| `driver_axis_z`      | 520  | mm | height of driver-cylinder axis = `ground_clearance + driver_cyl_dia/2` (rests on floor, low CoG **C5**) |
| `driver_center_x`    | -100 | mm | driver slightly aft of mid-wheelbase for balance — tune after CoG |
| `seat_pan_z`         | 300  | mm | top of seat pan above ground (driver hips low) |
| `seat_width`         | 450  | mm | seat pan + back width |
| `seat_back_height`   | 600  | mm | backrest height above pan |
| `roll_clearance`     | 50   | mm | min gap from helmet to roll structure (**S2**) |
| `head_top_z`         | 950  | mm | est. top of helmet when reclined — **confirm vs T008**; sets roll-hoop height |

> Rule of thumb honored: `driver_axis_z = ground_clearance + driver_cyl_dia/2`. If you'd rather Fusion enforce
> it, set the **Expression** of `driver_axis_z` to `ground_clearance + driver_cyl_dia / 2` instead of a number.

---

## 3. Model tree / naming (do this as you go)

Build each item as its **own Component** (right-click top node ▸ *New Component*, or tick "New Component" in
the create dialog), not loose bodies. Components let you measure per-part mass and CoG and move things.
Name them exactly:

```
WarmWheelers-Chassis-v0  (top)
├─ 01_Wheels        (4 wheel bodies)
├─ 02_Axles         (2 axle bodies)
├─ 03_DriverEnvelope (1 cylinder)
├─ 04_BodyBox       (1 raked box)
├─ 05_Seat          (pan + back)
└─ 06_RollZone      (roll hoop + side zones — construction/visual)
```

Also create two **construction planes** up front (you'll reuse them):
- **Center plane** = the origin **XZ plane** (already exists as an origin plane — turn on origin planes in the
  browser under *Origin*). This is your mirror plane for left/right.
- **Ground plane** = the origin **XY plane** at Z = 0.

---

## 4. Build steps, component by component

> General method for every part: *New Component → pick plane → sketch a profile dimensioned with parameter
> names → Extrude/Revolve → position → mirror for symmetry.* Always type **parameter names** into dimensions,
> never raw numbers.

### 4.1 — 01_Wheels  *(model one, mirror to four)*
1. New Component `01_Wheels`.
2. Create an **offset construction plane** from the origin **YZ plane** (the plane normal to X) offset by
   `wheelbase / 2` → this sits at the **front axle**.
3. On that plane, sketch a **circle**: centre at `(Y = track_width / 2, Z = wheel_dia / 2)`, diameter `wheel_dia`.
   - To place the centre precisely, draw the circle then add two dimensions: from the centreline to centre =
     `track_width / 2`, and from ground to centre = `wheel_dia / 2`.
4. **Extrude** the circle symmetrically? No — extrude **`wheel_width`**, direction outboard (away from centre).
   (Use *Extent: Distance = wheel_width*, *Direction: One Side*.)
5. This is the **front-left wheel**. **Mirror** it about the **Center (XZ) plane** → front-right.
6. **Mirror** both about the origin **YZ plane** (the X=0 plane) → rear-left + rear-right. (`Create ▸ Mirror`,
   *Pattern Type: Bodies/Components*, *Mirror Plane: YZ origin plane*.)
   - Alternative to the two mirrors: a **Rectangular Pattern** of 2 along X (spacing `wheelbase`) × 2 along Y
     (spacing `track_width`). Mirrors are cleaner for symmetry; either is fine.

Result: 4 wheels, axle centres at Z = 200, contact patches on the ground plane (Z=0). ✔

### 4.2 — 02_Axles
1. New Component `02_Axles`.
2. On the **front-axle offset plane** (reuse from 4.1), sketch a circle on the **centreline at Z = wheel_dia/2**,
   diameter `axle_dia`.
3. **Extrude symmetric**: *Direction: Symmetric*, *Measurement: Whole Length*, distance `track_width` →
   spans wheel to wheel. (Or extrude to `track_width + wheel_width` if you want stub-axle ends inside the hubs.)
4. **Mirror** about the origin **YZ plane** → rear axle.

### 4.3 — 03_DriverEnvelope  *(the "driver cylinder")*
This single cylinder stands in for the **seated/reclined driver inside the bottle costume**. It is the volume
that must *fit inside the body and inside the roll zone*, and it carries the biggest single mass for CoG.

1. New Component `03_DriverEnvelope`.
2. Sketch on the **Center (XZ) plane**: a circle of diameter `driver_cyl_dia`, centre at
   `(X = driver_center_x, Z = driver_axis_z)`.
3. **Extrude symmetric** about the Center plane, total length `driver_cyl_len` (so the cylinder lies along X,
   the driver reclined feet-forward). *Direction: Symmetric, Whole Length = driver_cyl_len.*
   - (If you prefer the axis along X using a revolve, you can instead sketch a half-profile on the XZ plane and
     revolve — but symmetric extrude of a circle on XZ gives the cylinder lying along Y. To get the axis along
     **X** instead, sketch the circle on the **YZ-type plane through driver_center_x** and extrude
     `driver_cyl_len` symmetric. Use whichever orientation matches a reclined driver: **axis along X.**)
4. Make this component a distinct, semi-transparent colour (e.g. translucent red) — it's an envelope, not a part.

> **Orientation note:** a soapbox driver is reclined, head toward the rear-ish / feet toward front. Axis along
> **X** is correct. Re-check length/height against the real **T008 driver envelope** before freezing.

### 4.4 — 04_BodyBox  *(the heater shell, with rake)*
1. New Component `04_BodyBox`.
2. Sketch the **side profile on the Center (XZ) plane**:
   - Draw the bottom edge on the line `Z = ground_clearance`, length `body_length`, centred on X
     (from `X = -body_length/2` to `+body_length/2`).
   - Draw the box up to height `body_height`.
   - Apply the **rake**: tilt the two vertical edges forward by `body_rake` (3°). Easiest: draw the rectangle
     upright, then add an **angular dimension** of `body_rake` between a vertical edge and the construction
     vertical, leaning the **top toward +X (forward)**. The top face shifts forward by
     `body_height * tan(body_rake)` ≈ 79 mm — that's the "leaning heater" stance.
3. **Extrude symmetric** about the Center plane, total width `body_width` (Symmetric, Whole Length = body_width).
4. Make it **translucent** (it's a shell envelope) so you can see the driver and seat inside.

> Check: bottom at Z=220, top ~1720 (front edge ~+1254, leaning). Verify the **driver cylinder and roll zone sit
> fully inside this box** — if the head pokes out the top, lower the driver or raise `body_height` (still must
> stay < 2500).

### 4.5 — 05_Seat
1. New Component `05_Seat`.
2. **Seat pan**: sketch on Center plane a rectangle — top at `Z = seat_pan_z`, under the driver cylinder,
   roughly from `X = driver_center_x - driver_cyl_len/2` forward ~500 mm; thickness ~50 mm. Extrude symmetric
   width `seat_width`.
3. **Backrest**: sketch a rectangle rising `seat_back_height` from the pan at the **rear** end of the pan,
   thickness ~50 mm, raked back slightly (~10–15°) for the reclined posture. Extrude symmetric width `seat_width`.
4. Seat should cradle the lower third of the driver cylinder — it visually supports the envelope.

### 4.6 — 06_RollZone  *(roll + side protection — this is the safety-critical proxy, S2)*
The criterion (**S2 / C2**): *the driver's head and torso stay inside the structural envelope at full roll.*
We model the **protected zone** so later we design real tubing to enclose it.

1. New Component `06_RollZone`.
2. **Main roll hoop (over the head):** on the Center plane, sketch a vertical line at the head X position
   (`X ≈ driver_center_x - driver_cyl_len/2 + 150`, i.e. near the rear of the driver where the head is) rising
   to `Z = head_top_z + roll_clearance` (helmet top + 50 mm gap). Extrude symmetric width
   `track_width` (hoop spans the track, the structural beam line). Keep it a thin bar (~60 mm) — it represents
   where the **real roll bar** must reach.
3. **The roll-protection envelope check line:** draw a construction line from the **top of the front of the body**
   to the **top of the roll hoop** to the **rear top of the body**. The helmet (top of driver cylinder + a head
   sphere at `head_top_z`) must sit **below/inside** this line — that proves a flat surface laid across the cart
   at full roll never touches the helmet. If it does, raise the hoop or recline the driver lower.
4. **Side protection zones:** sketch two vertical planes/bars at `Y = ±(track_width/2)` running the length of the
   driver cylinder, up to mid-driver height — represents side-intrusion protection. Model as thin translucent
   bodies just to reserve the space; real bars come later.
5. Colour the whole `06_RollZone` a bright translucent colour. It is a **keep-this-volume-structural** marker.

---

## 5. Checks to run immediately (this is why we built it)

With the skeleton complete, use Fusion's measurement tools — all available in Personal edition:

1. **Fits inside the RB box** — `Inspect ▸ Measure` the overall bounding box. Must be ≤ **6000 × 2000 × 2500 mm**.
   We expect ≈ 2350 × 2000 × 1720. Width has **0 margin at 2000** → consider trimming `body_width` to ~1950.
2. **Centre of gravity (C1/C2/C5)** — give each component an approximate mass:
   `Modify ▸ Physical Material` (or right-click component ▸ *Properties ▸ override mass*). Rough first pass:
   driver+costume ~90 kg, body shell ~25 kg, wheels ~4 kg each, axles ~3 kg each, seat ~6 kg.
   Then `Inspect ▸ Center of Mass`. Read the **Z** height.
   - **Pass target (C1):** CoG height **< 0.45 × track = 585 mm**. If higher → lower the floor / driver, widen
     track in 100 mm steps (per T009 fallback) — change the **parameter**, model self-updates.
3. **Driver fits (S2/S4):** confirm the driver cylinder is fully enclosed by the body box with clearance, and
   the helmet sphere sits inside the roll-zone envelope line.
4. **Ground clearance / wheel reality (C4, T009 open item):** confirm `wheel_dia/2` (200) vs `ground_clearance`
   (220) is consistent with the wheel you'll actually buy. Adjust `wheel_dia` and re-check.
5. **Save** — Personal edition versions each save in the cloud; this save *is* "skeleton v0".

---

## 6. What this deliberately leaves out (so v0 stays fast)

No frame tubes, no steering linkage, no brake, no fasteners, no fillets, no real costume surfacing. Those are
later tasks that **reference** this skeleton. v0's only job: correct sizes, correct positions, measurable CoG,
provable driver fit, provable RB-envelope fit.

---

## 7. Done criteria for T017 (tick all, then move tracker → Done)

- [ ] All 6 components exist and are correctly named (Wheels, Axles, DriverEnvelope, BodyBox, Seat, RollZone).
- [ ] Every dimension is driven by a **parameter** (test: change `wheelbase` → wheels + axles + body move).
- [ ] Overall bounding box measured and **inside RB 6000 × 2000 × 2500**.
- [ ] Centre of mass measured; **CoG Z recorded** here: ______ mm (target < 585 mm).
- [ ] Driver cylinder fully enclosed; helmet inside roll-zone envelope line.
- [ ] File saved as `WarmWheelers-Chassis-v0` (this save = skeleton v0).
- [ ] Tracker cell moved **In progress → Done** in
      [soapbox_daily_schedule_tracker.xlsx](../../Vision/soapbox_daily_schedule_tracker.xlsx).

*If the CoG check fails, do NOT mark Done — adjust parameters per the T009 fallback and re-measure first.*
</content>
