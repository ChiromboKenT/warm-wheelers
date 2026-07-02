# T016 — Create Fusion Parameters (guide)

> ## ⛔ SUPERSEDED VALUES — read before you type anything
> This guide's **method** (how to add User Parameters and drive sketches from them) is still correct and
> worth reading. **But the six parameter *values* below are the old T009 concept numbers and are now WRONG.**
> They would build a cart that **fails the Red Bull width rule** (`body_width` 2000 is *at* the 2000 mm limit
> → fail) and uses a 400 mm wheel we didn't buy.
>
> **Use the current parameter set instead:** import **[T018-parameters.csv](T018-parameters.csv)** (30+
> named parameters, all validated in the [T018 master spec](T018-CAD-master-design-spec.md), §9 changelog).
> Key corrections: `body_width` **1300** (not 2000), `wheel_dia` **260** (not 400), `wheelbase` **1700**
> (not 1800), `track_width` **1200** (not 1300), `ground_clearance` **150** (not 220), `body_rake` **5°**.
> Follow the *steps* here, but type the *numbers* from the T018 CSV.

**Warm Wheelers · Red Bull Soapbox JHB 2026 · CAD setup**
Date: 2026-06-23 · Status: **SUPERSEDED by [T018](T018-CAD-master-design-spec.md)** (method still valid; values stale)
Tool: **Autodesk Fusion** (Personal / community edition — fully supported, no add-ins needed)
Depends on: [T009 concept geometry (ADR-003)](T009-geometry-decision.md) · feeds all downstream sketches

> Goal: drive the whole model from **6 named parameters** so when CoG (C1) or turning radius (ST1)
> testing says "widen the track" or "shorten the wheelbase", you change **one number** and the
> model rebuilds itself. This is the single most useful 10 minutes you'll spend in CAD.

---

## The 6 parameters (values come straight from T009)

| Name (use exactly) | Value | Unit | Why / source |
|--------------------|-------|------|--------------|
| `wheelbase`       | 1800  | mm  | front-to-rear axle spacing (T009) |
| `track_width`     | 1300  | mm  | left-to-right wheel centre spacing; sets anti-tip margin C1 (T009) |
| `ground_clearance`| 220   | mm  | floor pan underside to ground (T009) |
| `body_rake`       | 3     | deg | forward lean of the shell, gives the "leaning heater" read (T009) |
| `body_height`     | 1500  | mm  | shell height, well under RB 2500 max (T009) |
| `body_width`      | 2000  | mm  | overall width, equals RB 2000 max (T009) |

**Naming rules in Fusion:** no spaces, start with a letter, use `_` to separate words. Names are
**case-sensitive**. Keep them lowercase so they're easy to type into sketch dimensions later.

---

## Step-by-step

### 1. Open (or create) the design
Open Fusion and create a new design (`File ▸ New Design`). Save it now with a clear name, e.g.
**`WarmWheelers-Chassis-v0`**, so the parameters live in a real file.

### 2. Open the Parameters dialog
Top toolbar: **`Modify` ▸ `Change Parameters`**.
(It's in the **Solid** tab, and also in the **Sketch** contextual menu. The icon is `fx`.)

A dialog opens with two sections:
- **Model Parameters** — auto-created later when you add dimensions to sketches. Ignore for now.
- **User Parameters** — the ones *you* create. This is where all 6 go.

### 3. Add each parameter
Click the green **`+`** next to **User Parameters**. For each row fill in:

| Field | What to type |
|-------|--------------|
| **Name** | e.g. `wheelbase` |
| **Unit** | `mm` for the lengths, `deg` for `body_rake` |
| **Expression** | the number, e.g. `1800 mm` |
| **Comment** | optional but recommended — paste the "Why" from the table above |

Click **OK** on the small add-row, then repeat the **`+`** for all six.

> Tip: type the unit in the Expression too (`1800 mm`). Fusion is unit-aware — if your document
> default is cm or inches, typing `mm` forces the value you actually mean.

### 4. (Optional but smart) Make some parameters depend on others
Expressions can reference other parameter names. This keeps relationships true automatically.
Example — if you decide the **track should never be narrower than the body minus 700 mm**, you
*could* later set `track_width` to an expression like `body_width - 700 mm`. For v0, keep them as
plain numbers (above) — only link them once a relationship is a real design rule, not a guess.

### 5. Verify and close
Check all six appear under **User Parameters** with the right values and units, then click **OK**.

### 6. Use the parameters in sketches (this is the payoff)
When you draw and add a dimension (`Sketch ▸ ... ` then `D` for dimension):
- Instead of typing a number, **type the parameter name**, e.g. `wheelbase`.
- For half-distances (very common — e.g. wheel offset from centreline), type `track_width / 2`.
- For the rake, when you draw the shell profile, set its lean dimension to `body_rake`.

From then on, editing the parameter in **Change Parameters** updates every sketch that uses it.

---

## Quick test that it works
1. Draw a simple rectangle, dimension its length to `wheelbase` and width to `track_width`.
2. Open **Change Parameters**, change `wheelbase` to `1600 mm`, click OK.
3. The rectangle should resize instantly. If it does — the parametric chain is live. Set it back to `1800`.

---

## If you'd rather not type them one by one
Fusion's Personal edition supports **CSV import** of parameters:
**Change Parameters ▸** the small **import/export** icons (top-right of the dialog) **▸ Import**.
A ready-to-import file is provided here: [T016-parameters.csv](T016-parameters.csv)
(If the import button isn't shown in your version, just type the six rows by hand — it's quick.)

---

## Gotchas (Personal/community edition)
- **Nothing here is locked behind the paid tier** — user parameters, expressions, and CSV
  import/export all work in Personal use.
- Personal-use designs are **cloud-saved and read-only export-limited** (e.g. STEP export is
  restricted), but that does **not** affect parametric modelling. You can model freely.
- Keep the file **saved**; Personal edition auto-manages versions in the cloud, so each save is a
  recoverable version if you break the model.

---

## Done criteria for T016
- [ ] All 6 user parameters exist with the values/units above.
- [ ] At least one sketch dimension references a parameter (proves the chain is live).
- [ ] File saved as `WarmWheelers-Chassis-v0`.

*Tracker: move T016 In progress → Done once the 6 parameters are entered and a test dimension reacts to a change.*
</content>
</invoke>
