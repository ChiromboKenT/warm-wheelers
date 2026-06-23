// Prep / materials catalogue — full-scale build + hand-carryable scale model.
// Mirrors docs/plans/2026-06-22-warm-wheelers-materials-and-build-tracks.md.
// Quantities/specs are starting suggestions; confirm against the T009 layout + budget.

export type PrepKind = "material" | "tool" | "test" | "model" | "input";
export type PrepPhase = "full" | "model" | "cross";

export interface PrepItem {
  id: string;
  label: string;
  where: string;
  forWhat: string;
  kind: PrepKind;
  options?: string[]; // alternatives you can experiment with
  refs?: string; // what other soapbox / gravity-racer builds use
}

export interface PrepSection {
  key: string;
  phase: PrepPhase;
  title: string;
  blurb: string;
  items: PrepItem[];
}

export const PHASE_LABELS: Record<PrepPhase, string> = {
  full: "Full-scale build",
  model: "Scale model — build this first, pick a track to experiment",
  cross: "Tools & gating tests",
};

export const PREP_SECTIONS: PrepSection[] = [
  // ---------------------------------------------------------------- FULL BUILD
  {
    key: "frame",
    phase: "full",
    title: "1 · Frame & chassis",
    blurb: "Option C hybrid: welded critical joints, bolted spine, ply deck.",
    items: [
      {
        id: "F1",
        label: "Main spine / longerons",
        where: "Steel merchant (BSi Steel, Stewarts & Lloyds)",
        forWhat: "Chassis structure · S1/M2",
        kind: "material",
        options: ["MS square tube 25–30 mm 1.6–2 mm wall", "Steel angle iron", "Aluminium extrusion (lighter, dearer)", "Ply torsion box"],
        refs: "Red Bull carts: welded mild-steel box/tube; soapbox derby: plywood monocoque",
      },
      {
        id: "F2",
        label: "Roll hoop / driver protection",
        where: "Steel merchant",
        forWhat: "Roll protection · S2",
        kind: "material",
        options: ["Welded steel tube (the critical joint)", "Bolted + gusseted (fallback)"],
        refs: "Tube roll hoop near-universal where rules demand roll protection",
      },
      {
        id: "F3",
        label: "Floor / deck",
        where: "Builders Warehouse / timber merchant",
        forWhat: "Low flat floor · BU1",
        kind: "material",
        options: ["12–18 mm shutterply (sealed)", "Marine ply", "OSB (cheaper, weaker)", "Aluminium sheet"],
        refs: "Plywood deck is the soapbox standard",
      },
      {
        id: "F4",
        label: "Axle mounts / brackets + gussets",
        where: "Steel merchant + offcuts",
        forWhat: "Spread axle/jump loads · S1",
        kind: "material",
        options: ["Welded steel plate + backing plates", "Bolt-through with backing plates (fallback)"],
        refs: "Welded brackets or bolt-on kart hangers",
      },
      {
        id: "F5",
        label: "Fasteners",
        where: "Hardware store",
        forWhat: "Bolted joints · ADR-001 risk controls",
        kind: "material",
        options: ["M8/M10 bolts + nyloc + thread-lock + washers", "Rivnuts for thin sheet", "Coach bolts into ply"],
      },
      {
        id: "F6",
        label: "Welding consumables + ballast",
        where: "Welding supplier / Makro",
        forWhat: "Welds + low CoG tuning · C5",
        kind: "material",
        options: ["Wire/rods, gas/flux, anti-spatter", "Removable lead/steel ballast", "Sandbags / paving offcuts (tunable)"],
      },
    ],
  },
  {
    key: "steering",
    phase: "full",
    title: "2 · Steering & front end",
    blurb: "Option B: custom pitman (kart wheel → column → pitman → drag link → kingpins).",
    items: [
      {
        id: "S1",
        label: "Wheel + column + bearing",
        where: "Kart shop / bearing supplier",
        forWhat: "Driver input · ST4",
        kind: "material",
        options: ["Small kart wheel + steel column + flange bearings", "Donor kart column", "Tiller bar (pivot-axle fallback)"],
        refs: "Kart wheel or tiller on built-up carts",
      },
      {
        id: "S2",
        label: "Stub axles / kingpins + Ackermann arms",
        where: "Engineering supplier / donor kart",
        forWhat: "Steering geometry · ST1/ST3",
        kind: "material",
        options: ["Machined/bought kingpin + spindle", "Donor go-kart stub axles", "Central pivot beam (fallback)"],
        refs: "Kart stub axles + Ackermann arms",
      },
      {
        id: "S3",
        label: "Pitman arm + drag link + rod ends/bushes + stops",
        where: "Engineering / bearing supplier",
        forWhat: "Kill slop < 5° · ST2",
        kind: "material",
        options: ["Steel arm + threaded rod + heim/rod ends", "Plain bushes (cheaper, more slop)", "Steering stops to limit travel"],
        refs: "Heim/rod ends used to minimise slop",
      },
    ],
  },
  {
    key: "brakes",
    phase: "full",
    title: "3 · Braking",
    blurb: "Rules require working brakes; aim ≥0.4 g (B1).",
    items: [
      {
        id: "BR1",
        label: "Brake assembly",
        where: "Kart / bike shop",
        forWhat: "Stop the cart · B1/B2",
        kind: "material",
        options: ["Go-kart disc + mechanical caliper (cable)", "Band/drum on rear axle", "Bicycle/BMX disc caliper", "Drag-skid brake (simplest)"],
        refs: "Go-kart/BMX disc, cable or hydraulic, is common",
      },
      {
        id: "BR2",
        label: "Lever/pedal + cable + mounts",
        where: "Bike shop / hardware",
        forWhat: "Actuation ≤200 N · B2 (one-handed ST4)",
        kind: "material",
        options: ["Bike lever + Bowden cable", "Hand lever (one-handed)", "Pedal"],
      },
    ],
  },
  {
    key: "wheels",
    phase: "full",
    title: "4 · Wheels, axles & bearings",
    blurb: "Pneumatic wheels cushion the jump and add grip.",
    items: [
      {
        id: "W1",
        label: "Wheels",
        where: "Kart shop / Gumtree",
        forWhat: "Rolling + jump cushioning",
        kind: "material",
        options: ["Pneumatic go-kart ~200–300 mm", "BMX/bicycle wheels (smoother)", "Solid PU/hard rubber (no punctures, harsher)"],
        refs: "Pneumatic kart wheels favoured for grip + jump cushioning",
      },
      {
        id: "W2",
        label: "Rear axle + collars/keys/circlips",
        where: "Steel / kart supplier",
        forWhat: "Drive brake disc / carry load",
        kind: "material",
        options: ["Steel live axle (drives disc)", "Dead stub axles each side"],
        refs: "Live axle or dead stubs both common",
      },
      {
        id: "W3",
        label: "Bearings + hubs",
        where: "Bearing supplier",
        forWhat: "Free, true running",
        kind: "material",
        options: ["Sealed ball bearings + pillow blocks", "Kart hubs", "Flanged bearings"],
      },
    ],
  },
  {
    key: "driver",
    phase: "full",
    title: "5 · Driver: seat, restraint & safety",
    blurb: "Non-negotiable P1 safety items.",
    items: [
      {
        id: "D1",
        label: "Seat (low H-point)",
        where: "Kart shop / DIY",
        forWhat: "Low CoG · C5",
        kind: "material",
        options: ["Moulded foam + ply base", "Salvaged kart/bucket seat"],
      },
      {
        id: "D2",
        label: "4–5 point harness (frame-anchored)",
        where: "Motorsport supplier",
        forWhat: "Restraint ≥5 g · S3",
        kind: "material",
        refs: "4-point harness is the rules minimum",
      },
      {
        id: "D3",
        label: "Helmet + gloves + closed shoes (PPE)",
        where: "Motorsport / cycle shop",
        forWhat: "Scrutineering · S5",
        kind: "material",
        options: ["Certified motorsport helmet", "Certified cycle helmet"],
      },
      {
        id: "D4",
        label: "Edge protection + headrest",
        where: "Hardware",
        forWhat: "No sharp edges, roll envelope · S8/S2",
        kind: "material",
        options: ["Rubber edging + foam padding", "Pool-noodle padding (budget)"],
      },
    ],
  },
  {
    key: "shell",
    phase: "full",
    title: "6 · Body shell — the heater look",
    blurb: "Recognisability is a Goal-1 promise (SP1).",
    items: [
      {
        id: "SH1",
        label: "Shell sub-frame + skin panels",
        where: "Plastics / hardware / timber",
        forWhat: "Reads as a heater · SP1",
        kind: "material",
        options: ["Coroplast (corrugated plastic)", "EPS/XPS foam", "Thin ply / hardboard", "Fibreglass", "Cardboard + resin"],
        refs: "Themed shells usually coroplast / foam / fibreglass over a light sub-frame",
      },
      {
        id: "SH2",
        label: "Grille + knobs + nameplate",
        where: "Plastics / 3D print / vinyl",
        forWhat: "Heater cues + glow housing · SP5",
        kind: "material",
        options: ["Slatted ply/plastic bars", "Expanded metal mesh", "3D-printed knobs + vinyl nameplate", "Repurposed real knobs"],
      },
      {
        id: "SH3",
        label: "Fixings + paint & finish",
        where: "Hardware / paint shop",
        forWhat: "Clean themed finish",
        kind: "material",
        options: ["Self-tappers / hot glue / panel clips / Velcro / zip ties", "Matte dark spray + primer + masking", "Vinyl wrap", "Brush enamel"],
      },
    ],
  },
  {
    key: "glow",
    phase: "full",
    title: "7 · Glow system (light only — no fire, S7)",
    blurb: "Driver-triggered, bar-by-bar ignition; fused, electrical only.",
    items: [
      {
        id: "G1",
        label: "Light source + sequencer",
        where: "Electronics supplier",
        forWhat: "Bar-by-bar ignition · SP5",
        kind: "material",
        options: ["12 V red LED strip", "Addressable LEDs (WS2812) for sequencing", "Red festoon", "Manual multi-switch (one per bar)"],
      },
      {
        id: "G2",
        label: "Battery + trigger + wiring (fused)",
        where: "Electronics / auto supplier",
        forWhat: "Endurance ≥2× run · SP4 · S7",
        kind: "material",
        options: ["12 V SLA or LiFePO4 + fuse", "AA/18650 pack (low-power LEDs)", "Reach momentary/latching trigger", "Wire, fuse holder, connectors, heat-shrink"],
      },
    ],
  },
  {
    key: "costume",
    phase: "full",
    title: "8 · Bottle-driver costume",
    blurb: "The gag: driver = fuel. Based on the 9 kg bottle (T007).",
    items: [
      {
        id: "C1",
        label: "Bottle shell + valve detail",
        where: "Foam / craft supplier",
        forWhat: "Reads as gas bottle seated",
        kind: "material",
        options: ["Orange EVA/EPS foam cylinder ~310 Ø × 580", "Papier-mâché", "Vacuum-formed plastic", "3D-printed valve"],
      },
      {
        id: "C2",
        label: "Straps + crew overalls",
        where: "Workwear shop",
        forWhat: "Quick on/off + delivery-crew look",
        kind: "material",
      },
    ],
  },
  // ------------------------------------------------------------------- TOOLS
  {
    key: "tools",
    phase: "cross",
    title: "Tools & consumables",
    blurb: "Out of the R9k tooling budget (BU2). Honest check: own vs must-buy.",
    items: [
      {
        id: "T1",
        label: "Welder + auto-dark helmet",
        where: "Makro / Builders / online",
        forWhat: "The Option-C purchase",
        kind: "tool",
        options: ["Cheap MIG", "Stick/arc"],
      },
      {
        id: "T2",
        label: "Angle grinder + discs",
        where: "Hardware",
        forWhat: "Cut / grind / clean welds",
        kind: "tool",
        options: ["Cut discs", "Grind discs", "Flap disc"],
      },
      {
        id: "T3",
        label: "Drill + bits, saw, clamps",
        where: "Hardware",
        forWhat: "Cutting, drilling, holding",
        kind: "tool",
        options: ["Cordless drill + metal/wood/step bits", "Metal chop saw / hacksaw / jigsaw", "G-clamps + welding magnets + square"],
      },
      {
        id: "T4",
        label: "Measuring/marking + PPE + consumables",
        where: "Hardware",
        forWhat: "Accuracy + safety",
        kind: "tool",
        options: ["Tape, square, scriber, punch, level", "Welding gloves, mask, eye/ear protection", "Cutting fluid, files, sandpaper, tape, adhesives"],
      },
    ],
  },
  // ----------------------------------------------------------- GATING TESTS
  {
    key: "tests",
    phase: "cross",
    title: "Gating tests (decisions hinge on these)",
    blurb: "The real tie-breakers — data, not scoring, decides.",
    items: [
      {
        id: "B1",
        label: "Jump-load on chassis — FoS ≥ 2 at 3 g",
        where: "FEA at race mass",
        forWhat: "Confirms Option C · S1",
        kind: "test",
      },
      {
        id: "B2",
        label: "Practice weld soundness — destructively test a coupon",
        where: "Weld scrap, then bend/break it",
        forWhat: "Trust any structural weld",
        kind: "test",
        options: ["Rehearse at model scale first (Track A brazing)"],
      },
      {
        id: "B3",
        label: "Steering slop mock-up — free play < 5°",
        where: "Cheap pitman linkage mock-up",
        forWhat: "Commit Option B vs pivot axle · ST2",
        kind: "test",
      },
      {
        id: "B4",
        label: "Turning-radius check — radius ≤ 6 m",
        where: "Tightest course chicane vs design",
        forWhat: "Validate steering geometry · ST1",
        kind: "test",
      },
    ],
  },
  // ------------------------------------------------------------- SCALE MODEL
  {
    key: "model-scale",
    phase: "model",
    title: "Scale & approach",
    blurb: "Hand-carryable replica to prove geometry, look, glow & packaging before cutting steel.",
    items: [
      {
        id: "M0",
        label: "Pick a scale",
        where: "Decision",
        forWhat: "Carryable + detailed",
        kind: "input",
        options: ["1:5 (~470 mm) — recommended", "1:6–1:8 (pocketable)", "1:4 (test real-ish joints)"],
      },
    ],
  },
  {
    key: "model-a",
    phase: "model",
    title: "Track A — Solderable metal (\"weld the model\")",
    blurb: "Most realistic — silver-solder/braze brass = true analog to welding the real frame.",
    items: [
      {
        id: "MA1",
        label: "Brass rod 2–3 mm + brass tube (K&S)",
        where: "Hobby shop",
        forWhat: "Frame members you braze together",
        kind: "model",
        options: ["Steel wire/rod + resistance/mini-spot welder"],
      },
      {
        id: "MA2",
        label: "Silver solder / brazing rod + flux + torch",
        where: "Hobby / hardware",
        forWhat: "The 'welds' — strong fillable joints",
        kind: "model",
        options: ["Soft solder + iron (weaker, easier)", "Mini butane torch", "Resistance solderer"],
      },
      {
        id: "MA3",
        label: "Brass sheet + files + flux brush + pickle",
        where: "Hobby shop",
        forWhat: "Gussets, brackets, joint cleanup",
        kind: "model",
      },
    ],
  },
  {
    key: "model-b",
    phase: "model",
    title: "Track B — 3D printed",
    blurb: "Fastest geometry iteration — reprint a new wheelbase/track in an evening.",
    items: [
      {
        id: "MB1",
        label: "PLA/PETG filament (or print service)",
        where: "Online / maker space",
        forWhat: "Frame, shell, wheels, fixtures",
        kind: "model",
        options: ["Resin print for fine detail"],
      },
      {
        id: "MB2",
        label: "CAD model + joiners + add-in weights",
        where: "Your machine",
        forWhat: "Iterate geometry + tune CoG · C1",
        kind: "model",
        options: ["Press-fit pins / small screws", "CA glue / epoxy", "Coins / fishing weights for CoG"],
      },
    ],
  },
  {
    key: "model-c",
    phase: "model",
    title: "Track C — Foam / styrene / card",
    blurb: "Cheapest, fastest for the LOOK — prove the heater silhouette & gag for almost nothing.",
    items: [
      {
        id: "MC1",
        label: "Foamboard / XPS + styrene sheet + cement",
        where: "Craft / hardware",
        forWhat: "Heater body block + panels · SP1",
        kind: "model",
        options: ["Plasticard", "Card + PVA", "Balsa/bamboo skewer frame"],
      },
      {
        id: "MC2",
        label: "Spray primer + matte dark + orange",
        where: "Hardware / craft",
        forWhat: "Test heater + bottle read",
        kind: "model",
        options: ["Acrylic brush paint"],
      },
    ],
  },
  {
    key: "model-shared",
    phase: "model",
    title: "Shared model parts (any track)",
    blurb: "The rolling, glowing, snap-together bits.",
    items: [
      {
        id: "MS1",
        label: "Model wheels ~40–60 mm + axles + bearings",
        where: "Hobby / RC shop",
        forWhat: "Rolling chassis",
        kind: "model",
        options: ["RC/diecast wheels", "3D-printed wheels", "Music wire / brass rod axles", "Micro ball bearings or tube bushes"],
      },
      {
        id: "MS2",
        label: "3 mm red LEDs + coin cell/AAA + switch",
        where: "Electronics shop",
        forWhat: "Working mini glow — test bar-by-bar · SP5",
        kind: "model",
        options: ["Addressable micro-LED for sequencing"],
      },
      {
        id: "MS3",
        label: "Magnets + glues + primer/paint + hobby tools",
        where: "Hobby shop",
        forWhat: "Snap-in bottle-driver + assembly/finish",
        kind: "model",
        options: ["Magnets (snap-in gag) / Velcro dots", "CA, epoxy, plastic cement", "Razor saw, knife, mini files, pin vice, helping-hands"],
      },
    ],
  },
];
