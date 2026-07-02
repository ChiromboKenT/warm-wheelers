# T021 — Custom Pitman Steering & Front End

**Warm Wheelers · Red Bull Box Cart Race JHB 2026 · CAD subsystem**
Date: 2026-06-26 · **Status: IN PROGRESS** · Priority: **P0**
Part of: [T018 master spec](T018-CAD-master-design-spec.md) · Builds on: [T019](T019-wheels-axles-suspension.md), [T020](T020-chassis-frame-rollhoop.md)
Implements: ADR-002 (Option B pitman) · Proves: ST1 (≤6 m), ST2 (<5° slop), ST3 (bump-steer <1°)

> **The hardest job on the cart** (steering scorecard, buildability = 2/5) — and the most rewarding to get
> right, because *you design it directly to the targets.* Path: **steering wheel → braced column → pitman
> arm → drag link → steering arms on kingpins → front stub axles.** Build it to ≤ 6 m radius, Ackermann
> geometry and minimal bump-steer, with rod ends to kill slop. **Pivot beam axle is the named fallback** if
> the slop test (ST2) fails (prep test B3).

---

## 1. What the steering has to do

| Function | How delivered | Target |
|---|---|---|
| Turn the course | Pitman linkage sized to lock angle | ST1: radius ≤ 6 m |
| Be precise, no slop | **Rod ends / heim joints** at every pivot; braced column | ST2: free play < 5° |
| No bump-steer | Drag link parallel to axle travel; pivots aligned | ST3: toe change < 1° |
| Not dart or scrub | Correct **Ackermann** (inner wheel turns more) + kingpin geometry | ST5: tracks straight |
| Survive adult + bottle + jump | Steel arms, kingpins sized to load, **steering stops** | strength |
| Be controllable one-handed | Low effort, self-centring tendency | ST4 |

> **Why not the other options:** rope steering and a single central pivot are simple but **unstable at
> speed** (handbook §5.2). A fixed kingpin + track rod (the geometry a kids' pedal go-kart already has)
> steers far better — the cheapest reliable route is to **strip the front axle/steering off a used pedal
> go-kart** and build on it. The steering **column must be firmly braced to the chassis** — a loose column
> is a classic high-speed-crash cause (handbook §5.2).

---

## 2. The geometry, with numbers

Front track = `track_width` 1200 (wheel centres at ±600). Kingpins sit slightly inboard at
`kingpin_track` 1120 (±560). Wheelbase 1700. Design steer lock `steering_lock` 30°.

**Turning radius (Ackermann mean):**
`R ≈ wheelbase / tan(lock) + track/2 = 1700 / tan 30° + 600 ≈ 2944 + 600 ≈ 3544 mm ≈ 3.5 m`.
→ **well inside ST1's 6 m**, with margin to use less lock (less scrub) if desired. Even at 25° lock,
R ≈ 4.2 m. ✔

**Ackermann:** to make the **inner wheel steer more than the outer** (so both roll without scrub), angle the
steering arms so their centrelines, extended rearward, **meet at the centre of the rear axle**. With wheelbase
1700 and kingpin_track 1120, the steering-arm angle from straight ≈ `atan((kingpin_track/2) / wheelbase) =
atan(560/1700) ≈ 18°`. Model the steering arms at this splay.

**Kingpin geometry (light, for self-centring, ST5):** small positive **caster** (~3–5°, kingpin leaned back)
gives straight-line stability and self-centring; near-zero **scrub radius** keeps effort low and bump-steer
small. Keep it modest — this is a gravity cart, not a race car.

---

## 3. Components & build steps in Fusion

```
03_Steering
├─ 03a_StubAxle_L / _R       (spindle each side)
├─ 03b_Kingpin_L / _R        (pivot pin, caster built in)
├─ 03c_SteeringArm_L / _R    (Ackermann arm off each kingpin)
├─ 03d_DragLink              (rod from pitman to one steering arm)
├─ 03e_TrackRod              (ties L and R steering arms together)
├─ 03f_PitmanArm             (on the column base)
├─ 03g_Column + bearings     (braced to frame at 2 points)
├─ 03h_SteeringWheel         (small kart wheel)
└─ 03i_Stops                 (travel limiters)
```

### 3.1 — Stub axles & kingpins
1. New Component `03a_StubAxle_L`. At the front-left wheel centre (from T019, `(+600 region, axle_height 130)` on the
   front-axle plane) model the **spindle**: a **Ø25 mm** horizontal shaft (matching the Rybro wheel's fixed
   25 mm bearing bore, T019 §2.1 — same size as the rear stubs, one bearing size across the cart), length
   ≥ the 80 mm hub + washer + split-pin/nut stack, attached to a vertical **kingpin boss**. The kingpin sits
   at `Y = kingpin_track/2` (560), so the spindle carries the wheel 40 mm outboard (the scrub radius).
2. `03b_Kingpin_L`: a vertical pin through the boss into the **front bracket on the frame** (T020), leaned
   back `caster_angle` (4°). The wheel + stub pivots about this pin. Mirror to the right.

### 3.2 — Steering arms (Ackermann)
1. `03c_SteeringArm_L`: a short arm projecting **rearward-inboard** from the kingpin, at the **18° Ackermann
   splay** (centreline points at rear-axle centre). The arm's outer hole is the linkage pivot. Mirror right.

### 3.3 — Linkage (pitman + drag link + track rod)
1. `03f_PitmanArm`: a vertical arm on the base of the steering column; its tip swings fore/aft as the wheel
   turns.
2. `03d_DragLink`: a rod from the pitman tip to the **left steering arm** pivot. Use **rod ends (heim joints)**
   at both ends — these are what hold ST2 (< 5° slop).
3. `03e_TrackRod`: ties the left and right steering-arm pivots so both wheels turn together. Rod ends both
   ends. (This is the classic pitman + track-rod layout.)
4. Set link lengths so that **wheel-straight = pitman-centred**, and full pitman swing = `steering_lock` 30°
   at the wheels.

### 3.4 — Column, braced (anti-wobble, ST2)
1. `03g_Column`: steel rod from the cockpit up to the wheel, running on **two flange/pillow bearings** bolted
   to the frame at the **two column mount points exposed in T020 §4** — one low at the pitman, one higher
   under the dash. Bracing both ends is non-negotiable (handbook §5.2).
2. `03h_SteeringWheel`: small kart wheel at a comfortable reclined-driver reach (set against T025 driver arms).

### 3.5 — Steering stops
1. `03i_Stops`: welded/bolted limiters so the linkage **cannot over-travel past 30°** (protects geometry and
   stops the wheels hitting the body/tyres). Model as small blocks the steering arm contacts at full lock.

---

## 4. The two CAD validations that gate fabrication

### 4.1 — Steering sweep (ST1 + clash) 
Drive the linkage through **full left and full right lock** (use a motion study or just rotate the column
joint). Confirm:
- turning radius ≤ 6 m (geometry gives ~3.5 m),
- **nothing fouls** the tyres, body, drag link, frame or the driver's legs at any angle (strategy doc
  criterion 3),
- both wheels follow Ackermann (inner > outer angle).

### 4.2 — Bump-steer check (ST3)
Move the front axle/bushings through their small compliance travel (the rubber-bushing deflection + tyre
squash, a few mm) and measure **toe change at the wheels**. Pass = **< 1°**. Achieve it by keeping the
**drag link and track rod roughly parallel to the line between the bushing pivots** so the rod doesn't pull
the wheels into toe as the axle moves. This is why a stiff frame (T020) matters — less travel, less
bump-steer.

> **Slop mock-up gate (ADR-002, prep B3):** before trusting this in steel, build a cheap physical pitman
> mock-up and measure free play at the wheel. **< 5° → commit Option B. ≥ 5° → switch to the pivot-axle
> fallback** (a beam pivoting on one central kingpin, steered by a bar — robust but scrubs/darts; accept the
> handling compromise). Record the result in T026.

---

## 5. Done criteria for T021

- [ ] Stub axles, kingpins (with caster), Ackermann steering arms (18° splay) modelled both sides.
- [ ] Pitman + drag link + track rod with **rod ends** at every pivot; column **braced at two frame points**.
- [ ] Steering stops at `steering_lock` 30°.
- [ ] **Sweep test:** radius ≈ 3.5 m (≤ 6 m, ST1); **zero clashes** L-to-R lock.
- [ ] **Bump-steer < 1°** over compliance travel (ST3).
- [ ] Physical slop mock-up planned/done: free play < 5° (ST2) — else pivot-axle fallback noted.
- [ ] Steering mass recorded: ______ kg (allowance ~6).

*Next: [T022 — brakes](T022-brakes-dual-disc.md) on the rear axle from T019.*
</content>
