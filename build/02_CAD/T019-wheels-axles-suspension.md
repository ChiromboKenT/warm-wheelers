# T019 — Wheels, Dual-Rear Axle & Rubber-Bushed Suspension

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P0**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Parameters: [T018-parameters.csv](T018-parameters.csv)
Feeds: chassis axle brackets ([T020](T020-chassis-frame-rollhoop.md)), brake discs ([T022](T022-brakes-dual-disc.md)), CoG ([T026](T026-assembly-validation-render.md))

> **Why this subsystem first.** Wheel centres and axle lines are the lowest hardpoints; the whole cart
> packages up from them. Get these positions right and the frame, steering, brakes and CoG all fall into
> place. Get them wrong and everything above moves. We model the **rolling chassis** here: 6 wheels, 2
> axles, the dual-rear hubs, and the rubber bushings that are our only "suspension".

---

## How to use this guide

This version assumes **you have never opened a CAD program before**. It explains both *what* to do and
*why*, gives the exact menu clicks in **Autodesk Fusion** (Personal edition), tells you the **number you
should expect to see** after each step so you can self-check, and lists what to do when it goes wrong.

- **Read [§0](#0-cad-crash-course-everything-in-this-guide-uses-only-these-six-ideas) once** — it teaches the six CAD ideas every step below uses. Ten minutes now saves an hour later.
- Work **top to bottom**. Each build step depends on the one before it.
- Wherever you see a `parameter_name`, you **type that name** into Fusion, never the raw number. That is
  the whole point of the parametric model: change one number in the parameters table and the model rebuilds.
- ✔ marks a self-check you can confirm before moving on.
- Reference docs: the **[Red Bull Box Cart handbook](../../Vision/RedBull_BoxCart_Joburg2026_Team_Handbook.docx)** (rules + build advice, cited by section §) and **Autodesk Fusion Help** (`Help ▸ Learning & Documentation` inside Fusion) for any command you want to see demonstrated.

---

## 0. CAD crash course (everything in this guide uses only these six ideas)

CAD = drawing the cart on the computer as **real 3-D solids** so we can measure it (size, weight, balance)
and prove it fits the rules **before cutting any metal**. Fusion is the program. You only need six concepts:

| # | Idea | Plain-English meaning | Where in Fusion |
|---|---|---|---|
| 1 | **Parameter** | A named number (e.g. `track_width = 1200`). Type the name into a dimension and everything stays linked. | `Solid ▸ Modify ▸ Change Parameters` (the `fx` icon) |
| 2 | **Component** | A named "part" in the tree (a wheel, the axle). Each one can have its own material and weight, so we can measure mass per part. | Right-click top of browser ▸ *New Component*, or tick **New Component** in a create dialog |
| 3 | **Sketch** | A flat 2-D drawing (circles, lines) on a chosen flat surface. Solids are made *from* sketches. | `Solid ▸ Create ▸ Create Sketch`, then pick a plane |
| 4 | **Plane** | The flat surface you sketch on. The three built-in ones (XY, XZ, YZ) pass through the origin; you can make extra **offset planes** parallel to them. | Browser ▸ *Origin* folder (turn on); `Construct ▸ Offset Plane` |
| 5 | **Extrude** | Push a 2-D sketch profile into a 3-D solid (a circle → a cylinder = a wheel/axle). | `Solid ▸ Create ▸ Extrude` (shortcut **E**) |
| 6 | **Mirror** | Copy a solid to the other side of a plane, so we draw one wheel and get its twin for free. | `Solid ▸ Create ▸ Mirror` |

**The recipe you will repeat all day:** *New Component → pick a plane → sketch a profile dimensioned with
parameter names → Extrude into a solid → Mirror/copy for the other side.* That's it. Every step below is a
variation of this recipe.

**Two orientation facts to keep straight (from [T017](T017-cad-skeleton-v0.md) §1, never changed):**

| Axis | Direction | We use it for |
|---|---|---|
| **X** | +X = forward (toward the front axle) | length / wheelbase |
| **Y** | +Y = left of the driver | width / track |
| **Z** | +Z = up | height above ground |

**Origin (0,0,0) = on the ground, on the centreline, exactly mid-wheelbase.** Because the cart is
symmetric left-to-right, we model the **left** side and **mirror about the XZ plane** (the `Y = 0` plane)
to get the right side.

> **Fusion Personal edition note (from [T016](T016-fusion-parameters-guide.md)):** everything in this guide
> — parameters, expressions, components, sketches, extrude, mirror, mass properties — is **fully available**
> in free Personal use. Only some *export* formats (e.g. STEP) are limited; modelling is not. Each `Save`
> stores a recoverable cloud version, so save often and never fear breaking the model.

---

## 1. What this subsystem has to do (functionality, before geometry)

Before drawing anything, be clear on the *job* each part does. We choose geometry to deliver these
functions — not the other way round.

| Function | How this design delivers it | Ties to |
|---|---|---|
| Carry the cart + driver, survive the jump | 6 pneumatic wheels; **dual rear** spreads landing load over 4 contact patches | S1 ([T020](T020-chassis-frame-rollhoop.md) FEA) |
| Be the "suspension" | Pneumatic tyre sidewalls flex + **rubber-in-shear bushings** at each axle mount | handbook §5.6 |
| Keep CoG low | Small wheels → low axle line → floor can sit low (`ground_clearance` 150) | C1/C5 (CoG ≤ 540 mm) |
| Roll freely (free speed) | Sealed deep-groove ball bearings, clean and free | handbook §5.4 |
| Steer at the front | Front wheels on stub axles/kingpins (built in [T021](T021-steering-pitman.md)) | ST1 |
| Brake at the rear | Rear axle carries one disc per side (built in [T022](T022-brakes-dual-disc.md)) | B1/B5 |
| Look like a delivery truck | Dual rear wheels = the gas-delivery read | SP1 (theme) |

> **The honest trade we accepted ([T018](T018-CAD-master-design-spec.md) §4):** dual-rear adds some drag
> and does **not** improve tip stability (that's track width + CoG). We chose it for **load capacity, jump
> redundancy and theme**. **Good news on mass:** the wheel we actually selected (§2) weighs **1.4 kg each**,
> so 6 wheels ≈ **8.4 kg** — well under the 12–15 kg the master budget feared. That buys back margin in the
> 80 kg cap ([T018](T018-CAD-master-design-spec.md) §4); update that line when you reconcile the budget.

---

## 2. Real parts to design around (so the model matches buyable hardware)

**Why this comes before modelling:** the model must match a wheel you can actually buy in South Africa,
because the wheel's **bore** (centre hole), **hub width** and **rim offset** decide your axle diameter and
bearing size. If you model first and shop second, the numbers won't line up. So pick the real wheel now,
even provisionally, and feed its real dimensions into the parameters.

### 2.1 — ✅ SELECTED WHEEL (decided 2026-06-26)

We are buying the **Rybro® 260 mm Pneumatic Wheel** (in-stock locally, made in RSA). This is now the part
the whole model is dimensioned to.

| Spec | Value | What it drives in the model |
|---|---|---|
| Product | Rybro® 260 mm Pneumatic (3.00-4, 4-ply), **bearing-fitted variant** | the real part |
| Price | ≈ R333.50 each (sold 1 / 2 / 4 packs) | budget line — buy a 4-pack + a 2-pack for 6 |
| **Diameter (D)** | **~255 mm** (marketed 260; varies ±with pressure) | `wheel_dia` → set **260 mm**, `axle_height` = 130 mm |
| **Tread width (A)** | **85 mm** | `wheel_width` = 85 ✔ (already correct) |
| **Hub length (B)** | **80 mm** | hub-proxy width (§5.6) — note it's 5 mm narrower than the tread |
| **Bore (C)** | **25 mm ID, fixed** | **the axle is 25 mm** — no choice to make, no machining |
| **Weight** | **1.4 kg each** | mass budget — 6 wheels ≈ 8.4 kg (much lighter than feared) |
| **Load rating** | **170 kg @ 36 psi each** | jump-load check (§2.3) |
| **Bearings** | ✅ **25 mm ID ball bearings, SUPPLIED FITTED in the box** | free-rolling = free speed (handbook §5.4) — resolved, see §2.2 |

**What's in the box (per wheel):** assembled wheel (rim + tyre + inner tube) **+ a set of 25 mm ID bearings
already fitted.** Nothing to press in, nothing to machine.

### 2.2 — ✅ RESOLVED: bearing-fitted variant chosen (free speed secured)

Earlier the plain-bore version was a worry — for a **gravity race**, free-rolling wheels are literally how
we go fast, and the handbook calls clean ball bearings *"free speed"* (§5.4). **We resolved it the efficient
way: we are buying the variant that ships with 25 mm ID ball bearings already fitted.** No machining, no
pressing bearings into a poly hub, and we get the low rolling resistance for free.

> **Care note (so the free speed stays free):** the supplied bearings are the speed asset — keep them
> **clean and lightly lubricated**, spin-check each wheel before race day, and replace any that feel gritty.
> Treat a notchy bearing as lost time on the hill (handbook §5.4).

### 2.3 — Load-rating sanity (jump survival)

Each wheel is rated **170 kg @ 36 psi**. The four rear wheels together = **680 kg**. Static cart+driver ≈
175 kg; even on a rear-biased jump landing at **4–5× static**, the rear share is roughly
`0.6 × 175 × 5 ≈ 525 kg` < 680 kg → **within rating with margin.** ✔ (Full jump load goes through the
*frame and brackets*, not just the tyres — that's [T020](T020-chassis-frame-rollhoop.md) FEA, S1.) Keep
tyres at the rated **36 psi** band for that load number to hold.

### 2.4 — The rest of the hardware (sized to the chosen wheel)

| Part | Spec (now fixed by the wheel) | Why / notes |
|---|---|---|
| Front axle | Steered stub axles + kingpins | fully detailed in [T021](T021-steering-pitman.md) — here we model only a **placeholder beam** and expose the wheel-centre points. |
| Rear axle | **25 mm steel** (matches the fixed 25 mm bore) | dual hubs each side; also carries the two brake discs ([T022](T022-brakes-dual-disc.md)). The 25 mm bore *is* the axle size — no choice to make. |
| Hubs | Keyed/collared hubs, **80 mm** (= hub length B), one per wheel | dual-rear = **2 hubs per side** = 4 rear hubs + 2 front = 6 total. |
| Bearings | ✅ **25 mm ID ball bearings, supplied fitted** in each wheel | nothing to source separately; sealed-and-clean = free speed (handbook §5.4). |
| Bushings | **Rubber-in-shear** trailer-style isolators, or polyurethane bushes | the axle-to-frame "suspension"; wound to a **firm preload** (handbook §5.6). |

> **The dependency chain, fully resolved:** *Rybro 260 wheel → 25 mm bore (bearings fitted) → 25 mm steel
> axle → 25 mm hub.* One part number settles wheel, bore, bearing and axle size together. No open items.

---

## 2.5 ✅ Parameter reconciliation — RESOLVED to 260 mm

There *was* an inconsistency between source files (the CSV said `wheel_dia` 260, but T018's prose and this
doc's prose said 280). **The selected Rybro wheel (§2.1) settles it: `wheel_dia = 260 mm`**, which matches
the CSV. So `axle_height = wheel_dia / 2 = 130 mm`.

| | `wheel_dia` | `axle_height` (= `wheel_dia / 2`) | Status |
|---|---|---|---|
| **[T018-parameters.csv](T018-parameters.csv)** | **260 mm** | **130 mm** | ✅ correct — no change needed |
| This doc + [T018 master table](T018-CAD-master-design-spec.md) §3 prose | ~~280 / 140~~ → **260 / 130** | — | ✅ **corrected 2026-07-02** (T018 §9) |

**Actions:**

1. In Fusion, `Modify ▸ Change Parameters`, confirm `wheel_dia = 260 mm` and that `axle_height` is the
   **expression** `wheel_dia / 2` (so it reads 130). ✔
2. ✅ **[T018 master spec](T018-CAD-master-design-spec.md) §3 table corrected** to **260 / 130** in the
   2026-07-02 validation pass (T018 §9) — the whole project now agrees.
3. Everywhere below, the real numbers are **`wheel_dia` 260** and **`axle_height` 130**.

> Note: the wheel **centre offset** `track_width / 2 = 600 mm` is **unaffected** (`track_width` is fixed at
> 1200). Only the axle-line **height** (130) and wheel **diameter** (260) were ever in question — both now
> fixed by the real part.

---

## 3. Set-up in Fusion (click-by-click)

### 3.1 — Open the master file and load the parameters

1. Launch Fusion. Open `WarmWheelers-Chassis-v0` (the file from
   [T016](T016-fusion-parameters-guide.md)/[T017](T017-cad-skeleton-v0.md)). If you don't have it, do
   [T016](T016-fusion-parameters-guide.md) first — *everything below references parameters by name.*
2. Load the full parameter set: `Solid ▸ Modify ▸ Change Parameters` → click the small **Import** icon
   (top-right of the dialog) → choose [T018-parameters.csv](T018-parameters.csv) → **OK**.
3. **Confirm these rows are present and correct** (this is your reconciliation check from §2.5 too):

   | Parameter | Expected | What it is |
   |---|---|---|
   | `wheelbase` | 1700 mm | front-to-rear axle spacing |
   | `track_width` | 1200 mm | left-to-right wheel-centre spacing (capped at 1200) |
   | `wheel_dia` | **260 mm** (Rybro, §2.1) | tyre outside diameter — **fixed by the chosen wheel** |
   | `wheel_width` | 85 mm | one tyre's section width (= Rybro tread width A) |
   | `rear_dual_gap` | 25 mm | gap between the two paired rear tyres |
   | `rear_pair_width` | `2 * wheel_width + rear_dual_gap` = 195 mm | total width of one rear dual pair |
   | `axle_height` | `wheel_dia / 2` = **130 mm** | axle centreline height above ground |
   | `ground_clearance` | 150 mm | chassis underside to ground (nose set higher ~180) |
   | `overall_width_calc` | `track_width + rear_pair_width` = 1395 mm | overall width over the rear duals |

   ✔ If `rear_pair_width`, `axle_height` and `overall_width_calc` show as **expressions** (not plain
   numbers), the parametric links are live. Change `wheel_dia` once and watch `axle_height` follow, then set
   it back — that proves the chain works.

### 3.2 — Turn on the origin planes

1. In the **browser** (left panel), expand the **Origin** folder.
2. Click the lightbulb to **turn on** the three origin planes and the origin point. You should now see three
   translucent rectangles intersecting at the origin.
3. Confirm the origin convention from §0: **ground, centreline, mid-wheelbase**. The **XZ plane** (the one
   you see edge-on when looking down the X axis) is your **mirror plane** for left/right.

### 3.3 — Create the two axle construction planes (you will reuse these constantly)

These are flat surfaces sitting exactly at the front and rear axle lines, so every wheel/axle sketch lands
in the right place along the cart's length.

1. `Solid ▸ Construct ▸ Offset Plane`.
2. Click the origin **YZ plane** (the plane that faces forward/back — normal to the X axis).
3. In the **Distance** box, **type** `wheelbase / 2` (Fusion evaluates it to **+850**). Click **OK**.
   → This is your **Front-axle plane**. Rename it in the browser to `Plane_FrontAxle`.
4. Repeat: `Construct ▸ Offset Plane`, pick the YZ plane again, type `-wheelbase / 2` (= **−850**), **OK**.
   → **Rear-axle plane**. Rename to `Plane_RearAxle`.

> **Why 850, not 900?** `wheelbase` is now **1700**, so each axle sits `1700 / 2 = 850 mm` from the origin.
> (Old [T017](T017-cad-skeleton-v0.md) used 1800 → 900. If you see "900" anywhere, it's stale.) Because you
> typed the *expression* `wheelbase / 2`, the planes auto-correct if `wheelbase` ever changes. ✔

---

## 4. Model tree (components) — and why we bother

Build each item below as its **own named Component**, not as loose bodies. Components are what let Fusion
report **mass and centre-of-gravity per part**, which is the entire reason we model before building (CoG is
checked in [T026](T026-assembly-validation-render.md), mass budget in [T018](T018-CAD-master-design-spec.md) §4).

```
WarmWheelers-Chassis-v0
└─ 01_RollingChassis
   ├─ 01a_Wheel_FL / 01b_Wheel_FR              (front, single each side)
   ├─ 01c_Wheel_RL_inner / 01d_Wheel_RL_outer  (rear-left dual pair)
   ├─ 01e_Wheel_RR_inner / 01f_Wheel_RR_outer  (rear-right dual pair)
   ├─ 02_FrontAxleBeam      (placeholder beam; kingpins added in T021)
   ├─ 03_RearAxle           (shaft spanning the track)
   ├─ 04_Hubs               (6 hubs)
   ├─ 05_Bearings           (proxy rings)
   └─ 06_Bushings           (rubber isolators at the 4 mount points)
```

**Naming discipline:** type the names exactly as above. Later docs ([T020](T020-chassis-frame-rollhoop.md),
[T022](T022-brakes-dual-disc.md)) refer to these names when they snap brackets and discs onto your geometry.

---

## 5. Build steps

> For every part you'll follow the §0 recipe. The first wheel is explained in full beginner detail; later
> parts repeat the same moves more briefly.

### 5.1 — One wheel, parametric (model once, reuse everywhere)

The wheel is a simple cylinder: a circle pushed sideways. We build the **front-left** wheel first and reuse
it everywhere.

1. **New Component.** Right-click `01_RollingChassis` in the browser ▸ *New Component*. Rename it
   `01a_Wheel_FL`. Make sure it is the **active** component (it has a small dot/highlight) so your sketch
   lands inside it.
2. **Start a sketch on the front-axle plane.** `Solid ▸ Create ▸ Create Sketch` → click `Plane_FrontAxle`.
   The view rotates to look straight at that plane (you're now drawing the wheel "face-on").
3. **Draw the tyre circle.** `Sketch ▸ Create ▸ Circle ▸ Center Diameter Circle` (shortcut **C**). Click
   roughly where the wheel goes (upper-left area), then click again to set a rough size. Don't worry about
   exact size yet — dimensions come next.
4. **Dimension it with parameters** (this is what makes it parametric):
   - Press **D** (Sketch Dimension). Click the circle's edge → click empty space → **type `wheel_dia`** →
     Enter. The circle snaps to the tyre's true diameter.
   - Press **D** again. Click the circle **centre**, then the **vertical centreline** (the Y=0 line on the
     plane) → type `track_width / 2` → Enter. (This sets the wheel **600 mm** left of centre.)
   - Press **D** again. Click the circle **centre**, then the **horizontal ground line** (Z=0) → type
     `axle_height` → Enter. (This sets the centre **130 mm** above the ground.)
   - The sketch should turn **fully black** = "fully constrained" (nothing can wobble). If anything is
     **blue**, it's still loose — add the missing dimension. ✔
5. **Finish the sketch:** `Sketch ▸ Finish Sketch`.
6. **Extrude into a tyre.** `Solid ▸ Create ▸ Extrude` (shortcut **E**) → click inside the circle to select
   it → in the dialog set:
   - **Direction:** *One Side*
   - **Distance:** type `wheel_width`
   - **Direction of push:** **outboard** (away from the centreline, i.e. toward more +Y). If it pushes the
     wrong way, click the arrow flip or put a minus sign on the distance.
   - **OK.** You now have the **front-left tyre**: a Ø`wheel_dia` × `wheel_width` cylinder, centre at
     `(Y = 600, Z = axle_height)` on the +850 plane. ✔
7. **(Optional realism, keep it light.)** You may add a shallow rim groove and a hub recess purely for looks
   — sketch a smaller circle on the wheel face and extrude-cut a few mm. For **v1, a plain cylinder is
   enough** for packaging, CoG and CFD. Don't spend time on tread.

> **Common beginner snags:**
> - *Circle won't take the parameter name* → you typed it in the wrong dialog (use the **Dimension** tool, press **D**), or the name's capitalisation is off (parameters are case-sensitive — all lowercase).
> - *Sketch stays blue* → a dimension is missing; the wheel isn't pinned to the centreline or ground yet.
> - *Extrude greys out* → your circle isn't a closed profile, or you didn't finish the sketch first.

### 5.2 — Front wheels (mirror to get the right side)

The right wheel is the exact mirror of the left — never model it twice.

1. `Solid ▸ Create ▸ Mirror`.
2. **Type:** *Components* (so it copies the whole `01a_Wheel_FL` part, material and all).
3. **Objects:** select `01a_Wheel_FL` in the browser.
4. **Mirror Plane:** the **Center (XZ) origin plane** (the `Y = 0` plane).
5. **OK.** Rename the new component `01b_Wheel_FR`.

Result: two front wheels, centres at `(±600, axle_height)` on the +850 front-axle plane. ✔

### 5.3 — Rear dual wheels (the truck layout)

The rear has **two wheels per side**, side by side, with the **pair centred** on the same `track_width / 2`
(600 mm) line as the front wheel. We build the left pair, then mirror the whole pair to the right.

**The target geometry for one side** (so you can check your numbers):
- Pair is centred on `Y = 600`.
- Total pair width = `rear_pair_width` = `2 * wheel_width + rear_dual_gap` = **195 mm**.
- So the **inner** wheel's inner face sits at `600 − 195/2 = 502.5`, and the **outer** wheel's outer face at
  `600 + 195/2 = 697.5`, with the `rear_dual_gap` (25 mm) gap between the two tyres.

Steps:

1. **Inner rear-left wheel.** New Component `01c_Wheel_RL_inner`. Create a sketch on `Plane_RearAxle`. Draw
   a circle, dimension exactly as in §5.1 (Ø `wheel_dia`, centre `track_width / 2` from centreline,
   `axle_height` from ground). Finish sketch.
2. **Extrude the inner wheel.** Extrude `wheel_width`, **One Side**, pushing **inboard** (toward the
   centreline) so its **inner face lands at `track_width/2 − rear_pair_width/2`** (= 502.5). The simplest
   reliable way is to extrude with a **Start ▸ Offset** so the inner face sits at 502.5, or extrude then
   reposition the pair as a unit in the next step. Either way, verify the inner-face position by measuring.
3. **Outer rear-left wheel.** New Component `01d_Wheel_RL_outer`. Easiest method: select the inner wheel and
   `Create ▸ Pattern ▸ Rectangular Pattern` for **one** extra copy, spacing = `wheel_width + rear_dual_gap`
   (= 110 mm) **outboard**. This guarantees the `rear_dual_gap` between the two tyres is exactly right and
   stays linked if the parameters change. Rename the copy `01d_Wheel_RL_outer`.
4. **Mirror the whole left pair to the right.** `Create ▸ Mirror` ▸ Type *Components* ▸ select **both**
   `01c` and `01d` ▸ Mirror Plane = **Center (XZ) plane** ▸ OK. Rename the two new parts
   `01e_Wheel_RR_inner` and `01f_Wheel_RR_outer`.

Result: **6 wheels.** Front pair at `(±600, axle_height)` on +850; rear two pairs centred at `(±600,
axle_height)` on −850, each pair **195 mm** wide. **Outer rear face** at `600 + 97.5 = 697.5` → overall
width **1395 mm** (`overall_width_calc`) < 2000 limit. ✔

### 5.4 — Rear axle

1. New Component `03_RearAxle`. Create a sketch on `Plane_RearAxle`.
2. Sketch a small circle **on the centreline** (centre at `Y = 0`) at `Z = axle_height`.
   **⚠️ Robustness decision — the 25 mm bore only fixes the axle diameter *at the wheels*, not across the
   span.** The four rear tyres sit **outboard at `Y = ±600` and `±697.5`**, while the frame brackets support
   the axle **inboard near `Y = ±250`** (the spine longerons, T020). That makes the loaded axle an
   **overhung beam**: the jump load acts at the wheels, well outboard of the supports, so the **bending
   moment peaks between the bracket and the inner wheel**. A plain 25 mm solid shaft may be marginal there at
   4–5× static. Two ways to build it (pick one, both keep the fixed 25 mm bore at the hubs):
   - **(A) Preferred — stepped axle.** A **larger central section (≈ 32–40 mm, tube or solid) between the
     frame brackets**, machined/turned down to **25 mm stub ends** where the wheels' fixed-bore bearings ride.
     Much stiffer in bending for little extra mass; the 25 mm stubs still match the wheels exactly.
   - **(B) Simpler — plain 25 mm solid** across the whole `track_width + rear_pair_width` span. Only accept
     this if the **rear-axle bending FEA case (T020 §5) passes FoS ≥ 2** — otherwise step it up per (A).
   Model diameter **`rear_axle_dia`** (a new working value: **32 mm** central for option A, or **25 mm** for
   option B) so the choice is one parameter; keep the hub/bearing seats at **25 mm** regardless.
3. Finish sketch, then **Extrude ▸ Symmetric**, **Whole Length** = `track_width + rear_pair_width` (≈ 1395)
   so the shaft passes through all four rear hubs and ends just outboard of the outer wheels. (For the
   stepped option, model the central `rear_axle_dia` section between the brackets and add the 25 mm stub ends
   as a second extrude/revolve out to the hubs.)
4. **Dead vs live axle (decide once):**
   - **Dead axle:** the shaft is fixed; each wheel spins on its **own bearings**. Simpler, and fine here.
   - **Live axle:** wheels are keyed to the shaft and turn with it.
   - For **two independent rear disc circuits** ([T022](T022-brakes-dual-disc.md)) the cleanest layout is a
     **dead axle** with **one disc inboard of each side's dual pair**, each disc braked by its own
     caliper/cable = the two independent circuits (B5 redundancy).
5. **Model the two disc seats now** so [T022](T022-brakes-dual-disc.md) can drop discs straight onto them:
   add a short flat collar (a slightly larger-diameter band, a few mm wide) on the axle at
   `Y = ±(track_width/2 − rear_pair_width/2 − 30)` — i.e. just **inboard** of each dual pair. ✔ Confirm these
   collars clear the inner wheel (check in §6.5).

### 5.5 — Front axle beam (placeholder only)

The real steered stub axles, kingpins and Ackermann arms are designed in [T021](T021-steering-pitman.md).
Here you model only a stand-in beam so the chassis ([T020](T020-chassis-frame-rollhoop.md)) has something to
bracket to, and you **expose the wheel-centre points** for T021 to snap to.

1. New Component `02_FrontAxleBeam`. Sketch on `Plane_FrontAxle`.
2. Draw a horizontal beam section (e.g. a **40 × 40 mm box**) centred on the centreline at `Z = axle_height`.
3. Extrude **Symmetric**, length ≈ `kingpin_track` (**1120 mm**, slightly inboard of the wheel centres).
4. **Leave the two wheel-centre sketch points visible** (don't consume them) so T021's kingpins can
   reference them. A quick way: add two sketch points at `(±600, axle_height)` on the front-axle plane and
   keep that sketch unrolled/visible.

> This beam is **disposable** — T021 replaces it with the real steered geometry. Don't detail it.

### 5.6 — Hubs & bearings (proxy parts for mass + position)

1. **Hubs.** New Component `04_Hubs`. At **each wheel centre**, model a short cylinder (Ø ~45 mm, width =
   **80 mm** = the Rybro hub length B, slightly narrower than the 85 mm tread). Build one, then
   **mirror/pattern to all six** (front ×2, rear ×4). These give the model realistic hub **mass** and the
   correct bore/bearing positions.
2. **Bearings.** New Component `05_Bearings`. ✅ **The chosen wheel ships with 25 mm ID ball bearings already
   fitted (§2.2)** — they're integral to the wheel, not a separate buy. Model a thin proxy ring at each
   bearing seat (the 25 mm bore) just for position + mass, and in the component **comment** write **"25 mm ID
   ball bearings — supplied fitted in wheel; keep clean = free speed (handbook §5.4)."** No separate bearing
   line to source.

### 5.7 — Rubber bushings (our entire "suspension")

This is the **suspension subsystem in full** — **no springs**, by deliberate decision and rulebook
practicality ([T018](T018-CAD-master-design-spec.md) §2 ADR; handbook §5.6). The compliance comes from (a)
the pneumatic tyre sidewalls and (b) these rubber bushings at the axle mounts.

1. New Component `06_Bushings`. At each of the **4 axle-to-frame mount points** (2 in the front-beam-end
   region, 2 at the rear-axle bracket points) model a **rubber-in-shear isolator**: a short cylinder/annulus
   (~Ø50 × 30 mm) sitting **between** the axle bracket and the frame rail.
2. **What it does:** carries the static load in compression and absorbs the **jump-landing spike in shear**,
   protecting the welds (S1, [T020](T020-chassis-frame-rollhoop.md)) and taking the edge off the hit —
   *without* the wobble/handling problems of soft springs the handbook warns against (§5.6). It is wound to a
   **firm preload** on the real cart.
3. **Give it the right material** so its mass is correct: select the component ▸ `Modify ▸ Physical Material`
   ▸ drag a **Rubber** material onto it. Its **stiffness** is *not* modelled here as a spring — it's captured
   later in FEA ([T020](T020-chassis-frame-rollhoop.md) §5) as a **compliant mount**, not a rigid one.

> **Tyre pressure is the other half of the suspension.** Record here (it's not a CAD dimension, so it's easy
> to forget): tune pressure **firm enough for low rolling resistance, soft enough to take the jump**
> (handbook §5.6). This is a **track-test variable** for [T026](T026-assembly-validation-render.md) /
> pre-race, *not* something you model — but it lives in this doc so it isn't lost.

---

## 6. Checks to run now (this is why we modelled)

Use Fusion's measuring tools — all in Personal edition. `Inspect ▸ Measure` for distances,
`Inspect ▸ Center of Mass` / component **Properties** for mass and CoG.

1. **Overall width (rule check).** `Inspect ▸ Measure` from the **outer-rear-face** of one side to the
   outer-rear-face of the other → expect **`overall_width_calc` ≈ 1395 mm**, comfortably **< 2000** (the RB
   hard limit, handbook §2; 605 mm margin). ✔
2. **Axle line / ground clearance.** Confirm wheel centres sit at `Z = axle_height` = **130** (= `wheel_dia`/2). Confirm the
   intended **lowest chassis point will sit at `ground_clearance` = 150** (above the 100 mm rule, handbook
   §2). The nose target is 180 — that's checked later in [T023](T023-shell-domed-front-boattail.md). ✔
3. **Track vs wheelbase ratio.** Confirm `track_width / wheelbase = 1200 / 1700 ≈ 0.71` — a stable ratio
   ([T018](T018-CAD-master-design-spec.md) §3). ✔
4. **Rolling-chassis mass subtotal.** Assign real materials (`Modify ▸ Physical Material`): wheels
   **override to 1.4 kg each** (right-click component ▸ *Properties ▸* override — the Rybro spec, §2.1),
   steel axle, steel hubs, bushings (rubber). Then read the subtotal (`Inspect ▸ Center of Mass` shows total
   mass too, or sum the component masses). **Expected: well under the ~30 kg target** now that wheels are
   only **6 × 1.4 ≈ 8.4 kg** (vs the 12–15 kg the budget feared) + axle/hubs ~6–8 + bushings ~2 ≈ **~17 kg**.
   **This frees margin in the 80 kg cap** — note it so [T018](T018-CAD-master-design-spec.md) §4 can be
   updated. **Record the measured number in §7.**
5. **Dual-pair & disc-seat clearance.** Confirm `rear_dual_gap` (25 mm) leaves the two tyres not rubbing, and
   confirm the **disc seats** from §5.4 clear the inner wheel through the wheel's full width. ✔

> **The chassis-first rule (handbook §8.4):** prove the **rolling chassis rolls, steers and stops** before
> any bodywork goes on. This doc delivers the "rolls" part and the hardpoints the other two hang off.

---

## 7. Done criteria for T019

- [x] **Wheel selected** — Rybro® 260 mm, **bearing-fitted variant** (25 mm ID bearings supplied); `wheel_dia` 260, `axle_height` 130 (§2.1/§2.5).
- [x] **Bearing decision resolved (§2.2)** — bearings come fitted in the box; free speed secured, nothing to machine.
- [x] **[T018 master §3](T018-CAD-master-design-spec.md) corrected** from 280/140 → 260/130 (done in the 2026-07-02 validation pass, T018 §9).
- [ ] 6 wheels modelled, parametric, at correct centres (front ±600 @ +850; rear pairs centred ±600 @ −850).
- [ ] Overall width measured **≤ ~1395 mm** (< 2000). 
- [ ] Rear axle (**25 mm**, = wheel bore) + **two disc seats** modelled; front beam placeholder **exposes wheel-centre points** for [T021](T021-steering-pitman.md).
- [ ] 6 hubs + bearing proxies (25 mm ID, supplied fitted) + **4 rubber bushings** modelled and noted with real callouts.
- [ ] Rolling-chassis mass subtotal recorded here: **______ kg** (expected ~17, target ≤ ~30; wheels 6×1.4 = 8.4).
- [ ] Tyre-pressure tuning noted as a pre-race variable (done — see §5.7).
- [ ] File **saved** (Personal edition cloud-versions each save).
- [ ] Tracker cell updated in [soapbox_daily_schedule_tracker.xlsx](../../Vision/soapbox_daily_schedule_tracker.xlsx).

---

## Appendix A — Glossary (plain English)

| Term | Meaning |
|---|---|
| **Bore** | The hole through the centre of the wheel/bearing that the axle passes through. |
| **OD** | Outside diameter — the full tyre diameter (= `wheel_dia`). |
| **Stub axle** | A short axle that carries one wheel and can pivot for steering (front). |
| **Live / dead axle** | Live = wheels turn *with* the shaft; dead = wheels spin on their own bearings, shaft fixed. |
| **Kingpin** | The pivot pin a steered front wheel swivels around. Detailed in [T021](T021-steering-pitman.md). |
| **Deep-groove ball bearing** | The standard low-friction wheel bearing; "6204"/"6004" are sizes (the bore matches the axle). |
| **Rubber-in-shear bushing** | A rubber mount that takes load by twisting/shearing — soft enough to absorb shock, firm enough not to wobble. |
| **Fully constrained sketch** | A 2-D sketch with enough dimensions that nothing can move — shown **black** in Fusion. Blue = still loose. |
| **Construction / offset plane** | An extra flat surface (parallel to a built-in plane) you create to sketch on. |
| **Symmetric extrude** | Pushing a profile equally both ways from the sketch plane (used for the axle so it's centred). |
| **Mass props / CoG** | Fusion-calculated weight and balance point — the whole reason we model before cutting. |

## Appendix B — Parameters this doc uses (from [T018-parameters.csv](T018-parameters.csv))

| Parameter | Value / expression | Used in |
|---|---|---|
| `wheelbase` | 1700 mm | axle planes (§3.3): each axle at `±wheelbase/2` = ±850 |
| `track_width` | 1200 mm | wheel centre offset `track_width/2` = 600 (§5.1, §5.3) |
| `wheel_dia` | **260 mm** (Rybro, §2.1) | tyre diameter; `axle_height = wheel_dia/2` = 130 |
| `wheel_width` | 85 mm | tyre/extrude width (§5.1); pair spacing (§5.3) |
| `rear_dual_gap` | 25 mm | gap between paired rear tyres (§5.3) |
| `rear_pair_width` | `2*wheel_width + rear_dual_gap` = 195 mm | dual-pair width; axle length; disc-seat positions |
| `axle_height` | `wheel_dia/2` = **130 mm** | wheel & axle centre height (§5.1, §5.4) |
| `ground_clearance` | 150 mm | lowest-chassis-point check (§6.2) |
| `overall_width_calc` | `track_width + rear_pair_width` = 1395 mm | width check (§6.1) |
| `kingpin_track` | 1120 mm | front placeholder beam length (§5.5) |
| `disc_dia` | 160 mm | (used in [T022](T022-brakes-dual-disc.md), seats located here in §5.4) |

## Appendix C — When Fusion fights you (quick fixes)

| Symptom | Likely cause | Fix |
|---|---|---|
| Sketch lines stay **blue** | Not fully constrained | Add the missing dimension(s); pin the circle centre to the centreline and ground. |
| Dimension **won't accept** `wheel_dia` | Wrong case, or typo, or parameter not imported | Parameters are case-sensitive lowercase; re-import the CSV (§3.1). |
| **Extrude** is greyed out | Profile not closed, or sketch not finished | Finish the sketch; make sure the circle is a closed loop you can click *inside*. |
| Wheel extrudes the **wrong way** | Direction flipped | Flip the arrow in the Extrude dialog, or negate the distance. |
| Mirror copies a **body**, not a part | Mirror Type set to *Bodies* | Set Type = *Components* so material/mass copy too. |
| Mass reads **0 / wrong** | No material assigned | `Modify ▸ Physical Material`, or right-click component ▸ *Properties ▸* override mass. |
| Planes/wheels in **wrong place** after editing `wheelbase` | This is correct behaviour | The parametric model moved them on purpose; re-read the new positions. |

*Next: [T020 — chassis frame + roll hoop](T020-chassis-frame-rollhoop.md) bolts/welds onto these axle points.*