# WARM WHEELERS — Prep Action Sheet

**Data to gather + gating tests · Red Bull Soapbox JHB 2026**
Date: 2026-06-22 · Status: Open
Source: pulled together from the [chassis scorecard](2026-06-21-warm-wheelers-chassis-scorecard.md) (T010) and [steering scorecard](2026-06-21-warm-wheelers-steering-scorecard.md) (T011) — the decisions are made, these items *de-risk* them.

> The architecture decisions (Option C chassis / Option B steering) are recorded and signed off.
> Each one is **conditional on data and tests not yet done**. This is the one page to work from
> when you go shopping and when you run the two gating tests.

---

## A. Prices to gather (shopping list)

One pricing run at a builders' merchant + steel merchant settles most of this.

| # | Item | Where | For | Got it? |
|---|------|-------|-----|---------|
| A1 | Shutterply sheet price (18 mm) | Builders Warehouse / local timber merchant | Chassis deck (Option C hybrid) · BU1 | ☐ |
| A2 | Mild steel angle / square tube price | Local steel merchant (e.g. BSi Steel, Stewarts & Lloyds) | Chassis spine · BU1/M2 | ☐ |
| A3 | Bolts, nyloc nuts, thread-lock, backing plate stock | Hardware store | Bolted joints · ADR-001 risk controls | ☐ |
| A4 | Cheap arc/MIG welder + auto-darkening helmet + angle grinder | Makro / Builders / Cashbuild / online | DIY welding tooling (out of R9k budget) · BU2 | ☐ |
| A5 | Rod ends / heim joints + bushes + kingpin stock | Bearing/engineering supplier | Custom pitman steering (Option B) · BU1 | ☐ |
| A6 | Adult-scale donor pedal kart — realistic price | Gumtree / Facebook Marketplace | Settles whether steering Option A ever beats B | ☐ |

**Roll-up after pricing:** total against the **~R9,000** budget (tools *and* materials) and the **M2 mass budget**.

## B. Gating tests (the decisions hinge on these)

These are the real tie-breakers — the scorecards are close enough that data, not scoring, decides.

| # | Test | Method | Pass condition | Gates | Done? |
|---|------|--------|----------------|-------|-------|
| B1 | Jump-load on chassis | FEA at race mass | **FoS ≥ 2 at 3 g** (matrix S1) | Confirms Option C; fail → rethink structure | ☐ |
| B2 | Practice weld soundness | Weld scrap coupons, then **destructively bend/break** one | Joint holds; good penetration, no cold welds | Permission to trust any structural weld | ☐ |
| B3 | Steering slop mock-up | Cheap pitman linkage mock-up, measure free play at the wheel | **Free play < 5°** (matrix ST2) | Pass → commit Option B; fail → pivot axle becomes primary | ☐ |
| B4 | Turning-radius check | Confirm tightest course chicane vs design | **Radius ≤ 6 m** (matrix ST1) | Validates steering geometry | ☐ |

## C. Inputs needed before A/B mean anything

| # | Item | Status |
|---|------|--------|
| C1 | Layout sketch (wheelbase/track/seat/axle positions) — T009 | done v0 → [T009 layout](../../build/02_CAD/T009-layout-sketch-v0.png) |
| C2 | Honest tool check: what cutting/drilling tools you already own vs must buy | ☐ |
| C3 | Red Bull **official weight limit** `[RB?]` — sets ballast/material trade-off | ☐ |

---

*Once A + B are filled in, fold the numbers back into the BOM/budget and tick the matrix rows
(S1, ST1, ST2). The two gating tests (B1–B3) are what move the chassis and steering decisions
from "proposed/conditional" to "confirmed."*
