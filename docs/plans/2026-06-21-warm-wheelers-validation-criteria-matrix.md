# WARM WHEELERS — Validation Criteria Matrix

**Red Bull Soapbox Race · Johannesburg**

*The acceptance gate for "proven before it's built." Nothing gets cut until every P1 criterion has a green path through CAD → FEA → CFD → validation → design freeze.*

Date: 2026-06-21 · Status: Draft for review

---

## How to read this matrix

Each criterion has a **measurable target**, a **method** that proves it, and a **pass condition**. The design is **frozen** only when every P1 row is `PASS` and no P2 row is `FAIL`.

**Priority** (from the brief's engineering goals, in order):
- **P1 — Critical:** finish clean, safe, upright, and unmistakably a heater. A `FAIL` here blocks design freeze and blocks racing.
- **P2 — Performance:** genuinely fast with good handling.
- **P3 — Show:** reliable, driver-triggered glow and the start gag.

**Method** — how a row is proven:
- `CALC` hand calculation / spreadsheet · `CAD` model measurement · `FEA` finite-element analysis · `CFD` flow simulation · `BENCH` static rig/bench test · `TRACK` roll-down + ramp test · `RULES` Red Bull rulebook check · `REHEARSE` dress-rehearsal of the start gag.

**Gate** — when the row must be green: `Design` (before freeze) · `Build` (during/after build) · `Pre-race` (scrutineering & shakedown).

> ⚠️ **Open dependency:** rows tagged `[RB?]` depend on values to confirm with Red Bull — **official cart weight limit**, **event date**, and **permitted branding**. Targets below are working assumptions until confirmed; see [design brief](2026-06-21-warm-wheelers-design-brief.md) → *Open items to confirm with Red Bull*.

---

## 1. Safety — *P1*

> *Goal 1: finish clean, safe and upright. A `FAIL` here is non-negotiable.*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| S1 | Frame survives the course jump | Withstand design landing load of **3 g vertical** at race mass | FEA | Factor of safety **≥ 2.0** on yield; no permanent deformation | Design |
| S2 | Roll protection | Structure protects head/torso if cart tips or rolls | FEA + RULES | Driver's head inside structural envelope at full roll; meets RB roll requirement | Design |
| S3 | Driver restraint | Min **4-point harness**, anchored to frame | BENCH + RULES | Anchors hold **≥ 5 g forward** pull without failure | Build |
| S4 | Driver egress | Self-extraction, no assistance, no tools | REHEARSE | Out in **≤ 10 s** in full bottle costume + helmet | Pre-race |
| S5 | Helmet & PPE | Certified helmet; gloves; closed shoes | RULES | Present and compliant at scrutineering | Pre-race |
| S6 | Driver visibility | Forward field of view around shell + costume | CAD + TRACK | **≥ 100° horizontal** clear forward arc; cones visible at braking distance | Design |
| S7 | No fire / no pyro | "Ignition" is **light only** — no flame, smoke, fuel | RULES | Zero combustion source; electrical only, fused | Design |
| S8 | Edges & entanglement | No exposed sharp edges, no loose costume snag points | BENCH | All edges radiused/capped; costume secured | Build |

---

## 2. Steering — *P2*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| ST1 | Turns the course | Negotiate tightest course chicane at speed | CAD + TRACK | Turning radius **≤ 6 m**; clears chicane without lifting a wheel | Design |
| ST2 | Steering precision | Minimal slop in the linkage | BENCH | Free play **< 5°** at the steering input | Build |
| ST3 | No bump-steer | Toe stays stable over bumps/jump compression | CAD + FEA | Toe change **< 1°** across suspension/flex travel | Design |
| ST4 | Driver effort | Steerable one-handed if needed | TRACK | Input effort comfortable for full run; no fade in control | Pre-race |
| ST5 | Self-centring tendency | Stable straight-line tracking | TRACK | Tracks straight hands-light on the flat-out section | Pre-race |

---

## 3. Braking — *P2 (safety-linked)*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| B1 | Stops the cart | Decelerate from top speed in a controlled distance | CALC + TRACK | Sustained decel **≥ 0.4 g**; stop from **40 km/h ≤ 16 m** | Design |
| B2 | Driver actuation force | Within one person's strength | BENCH | Full braking at input force **≤ 200 N** | Build |
| B3 | No fade | Holds over a full run length | TRACK | < 15% decel loss from first to last brake on the run | Pre-race |
| B4 | Balanced braking | No lock-induced spin | TRACK | No uncommanded yaw > 5° under hard braking | Pre-race |
| B5 | Redundancy / fail-safe | Brake remains usable if one side degrades | BENCH | Cart still stoppable with a single-circuit/half failure | Build |

---

## 4. Mass — *P1 (rules) / P2 (performance)*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| M1 | Within RB weight limit `[RB?]` | Total race mass under official limit | CALC + BENCH | **≤ limit − 10%** margin; confirmed on a scale | Pre-race |
| M2 | Mass budget tracked | Per-subsystem mass logged vs. allowance | CAD + CALC | Rolling total within budget; no subsystem > +15% over allowance | Design |
| M3 | Ballast strategy | Mass added low and adjustable, not structural | CAD | Ballast removable/tunable; mounted at floor only | Design |
| M4 | As-built ≈ as-modelled | Real mass matches CAD estimate | BENCH | Measured total within **±5%** of CAD prediction | Build |

---

## 5. Centre of Gravity (CoG) — *P1 (anti-tip) / P2 (handling)*

> *Guiding principle from the brief: keep the tall heater silhouette honest, but carry all mass low.*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| C1 | CoG height | Low despite tall shell | CAD + BENCH | CoG height **≤ 0.45 × track width**; measured by tilt-table | Design |
| C2 | Rollover threshold | Won't tip in cornering or on ramp | CALC + TRACK | Static rollover threshold **> 1.3 × max lateral g** seen on course | Design |
| C3 | Fore/aft balance | Front/rear split good for steer + brake | CAD + BENCH | Weight distribution within **45–55%** front, per handling target | Design |
| C4 | Jump pitch stability | Lands nose-slightly-up, not nose-first | CFD + FEA + TRACK | Predicted landing attitude within safe pitch band; verified on ramp | Design |
| C5 | Driver+bottle mass low | Driver, bottle, ballast at floor | CAD | Combined occupant CoG at/below axle line | Design |

---

## 6. Aerodynamics — *P2*

> *Smooth the airflow where it won't break the heater look.*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| A1 | Net lift at speed | Stays planted, esp. on the jump | CFD | Net **lift ≤ 0** (neutral-to-slight-down) at top speed | Design |
| A2 | Drag within silhouette | Reduce drag without losing the heater shape | CFD | Drag reduced vs. baseline box shell with **no silhouette change** that breaks recognisability | Design |
| A3 | Crosswind stability | Predictable in side gusts | CFD | Yaw moment in crosswind within controllable limit | Design |
| A4 | Airborne stability | No flip/lift tendency during jump | CFD + TRACK | Pitch/lift behaviour stable through the air on ramp test | Pre-race |

---

## 7. Buildability — *P1 (project viability)*

> *One handy builder, solo for now · near-zero tooling · ~R9,000 across June–Aug 2026 · cheap, accessible materials.*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| BU1 | Within budget | Tools **and** materials inside ~R9,000 | CALC | Bill of materials + tools total **≤ R9,000**; tracked monthly | Design |
| BU2 | Solo-buildable | No step needs >1 person or specialist machine | CALC + BENCH | Every operation doable with planned hand/portable tools | Design |
| BU3 | Accessible materials | Cheap, locally sourced stock | CALC | All materials available from common SA suppliers; no exotic stock | Design |
| BU4 | On schedule | Buildable June–Aug 2026 `[RB?]` | CALC | Build plan fits timeline with slack before event date | Design |
| BU5 | No banned processes | No suspension/hydraulics/fancy electronics | RULES + CAD | Design uses only "modern, effective, nothing fancy" methods | Design |
| BU6 | Trackside repairable | Common failures fixable on the day | BENCH | Wheels, brakes, steering, glow serviceable with carried tools | Pre-race |

---

## 8. Spectacle — *P3 (and P1 recognisability)*

> *Recognisability is a Goal-1 promise ("unmistakably a heater"); the glow + gag are Goal-3 show.*

| ID | Criterion | Target / Requirement | Method | Acceptance (PASS) | Gate |
|----|-----------|----------------------|--------|-------------------|------|
| SP1 | Reads as a heater | Instantly recognisable as an LPG gas heater | REHEARSE | **≥ 90%** of a cold-audience test names it "heater" unprompted | Design |
| SP2 | Reliable glow | Driver-triggered, fires every run | BENCH + REHEARSE | Glow ignites on trigger in **3/3** rehearsal runs; no missed bar | Pre-race |
| SP3 | Visible from stands | Glow + bottle read at distance | REHEARSE | Panels clearly visible at **≥ 50 m** in daylight | Pre-race |
| SP4 | Battery endurance | Glow lasts the whole event window | CALC + BENCH | Power source runs glow **≥ 2×** the run + staging duration | Build |
| SP5 | Bar-by-bar ignition | Panels light **one by one**, not all at once | BENCH | Sequenced light-up works as scripted | Build |
| SP6 | Clean gag, no banned props | No smoke, sound props, or thrown items | RULES + REHEARSE | 30-second start runs with light only; passes RB content rules | Pre-race |
| SP7 | Branding compliant `[RB?]` | Quiet "WARM WHEELERS" nameplate only | RULES | No unapproved third-party logos at scrutineering | Pre-race |

---

## Design-freeze gate

The structure is **frozen and ready to cut** when **all** of the following hold:

1. Every **P1** row (Safety, Mass-rules, CoG-anti-tip, Buildability, Recognisability) is `PASS`.
2. No **P2** row is `FAIL` — any `PARTIAL` has a written mitigation and a re-test date.
3. All `[RB?]` rows have **either** confirmed Red Bull values **or** a documented conservative assumption flagged for re-check.
4. The CAD → FEA → CFD chain is complete for S1, S2, ST3, C4, and A1 (the load- and flight-critical rows).

> Until then the matrix stays **Draft**. Sign-off line, status column (`PASS / PARTIAL / FAIL / N/A`), evidence link, and owner to be added per row as validation work is logged.
