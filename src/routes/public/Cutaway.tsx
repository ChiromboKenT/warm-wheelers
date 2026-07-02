import { useCallback, useState } from "react";
import { CutawayCart } from "./CutawayCart";
import styles from "./Cutaway.module.css";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  tag: string;
  title: string;
  body: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "dome",
    x: 28,
    y: 30,
    tag: "DOMED FRONT",
    title: "The front bows out",
    body: "Instead of a flat wall, the whole front face bows forward 200 mm. Air rolls up and over it instead of slamming into it, so there's less drag — and it still reads as a heater's softly curved front.",
  },
  {
    id: "read",
    x: 41,
    y: 29,
    tag: "THE READ",
    title: "It has to say “heater”",
    body: "Nine of ten strangers have to call it a heater in one second. The domed front, chrome grille, two control knobs, the WARM WHEELERS nameplate and the tall upright stance do that job — not paint.",
  },
  {
    id: "view",
    x: 30,
    y: 41,
    tag: "VIEW BAND",
    title: "The driver sees through it",
    body: "The heater's upper grille is really an open mesh band. From outside it looks like part of the appliance; from the reclined seat it's the windscreen the driver reads the course through.",
  },
  {
    id: "grille",
    x: 27,
    y: 55,
    tag: "MANUAL GLOW",
    title: "The grille lights up",
    body: "Behind the chrome guard sit three ceramic panels. The driver pulls a lever and they flare off → one → two → three. Obviously fake fire — no flames, no smoke, no battery — exactly as the rules demand.",
  },
  {
    id: "pod",
    x: 74,
    y: 54,
    tag: "BOAT-TAIL POD",
    title: "The driver is the fuel",
    body: "The body boat-tails into an orange LP-gas bottle — the reclined driver’s own body is the bottle. It drops the tail to a small pod so the wake stays tight, and the gag lands: heater → bottle → driver.",
  },
  {
    id: "hoop",
    x: 73,
    y: 38,
    tag: "ROLL HOOP",
    title: "A welded cage over the head",
    body: "A steel roll hoop is welded across the open pod, above the helmet line, harness always on. That’s the real crash structure — the light shell around it is sacrificial and can’t jam a wheel.",
  },
  {
    id: "front",
    x: 32,
    y: 76,
    tag: "STEERED AXLE",
    title: "Hand-built steering",
    body: "Two steered wheels on a front beam axle, turned by a custom pitman linkage. Enough lock for a 3.5 m turning circle, braced so a rough course can’t knock it off line.",
  },
  {
    id: "rear",
    x: 75,
    y: 76,
    tag: "DUAL REAR · DISC",
    title: "Six wheels, twin brakes",
    body: "Load-sharing dual wheels each side give the gas-truck stance and take the jump landings. Two independent disc brakes — one per side — are what stop the cart, not the hay bales.",
  },
];

export function Cutaway() {
  const [active, setActive] = useState<Hotspot>(HOTSPOTS[3]);

  // Skip the state update entirely when the target is already active, so a
  // stray hover/focus on the current pin can't queue a redundant render.
  const select = useCallback(
    (h: Hotspot) => setActive((prev) => (prev.id === h.id ? prev : h)),
    [],
  );

  return (
    <section className={styles.section} id="cutaway">
      <div className={styles.head}>
        <span className={styles.eyebrow}>Cutaway · how it works</span>
        <h2 className={styles.title}>How the whole thing works</h2>
        <p className={styles.lead}>
          Nothing on the cart is there by accident. Tap a point on the drawing to see what it does and how it helps
          the cart go faster or stay safe.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.stage}>
          <div className={styles.blueprint} />
          <div className={styles.cartHolder}>
            <CutawayCart rolling={false} />
          </div>
          {HOTSPOTS.map((h, i) => (
            <button
              key={h.id}
              type="button"
              className={`${styles.spot} ${active.id === h.id ? styles.spotOn : ""}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onMouseEnter={() => select(h)}
              onFocus={() => select(h)}
              onClick={() => select(h)}
              aria-label={`${h.title}, ${h.tag}`}
              aria-pressed={active.id === h.id}
            >
              <span className={styles.spotNum}>{i + 1}</span>
            </button>
          ))}
        </div>

        <aside className={styles.readout} aria-live="polite">
          <div className={styles.readTag}>{active.tag}</div>
          <h3 className={styles.readTitle}>{active.title}</h3>
          <p className={styles.readBody}>{active.body}</p>
          <div className={styles.chips}>
            {HOTSPOTS.map((h, i) => (
              <button
                key={h.id}
                type="button"
                className={`${styles.chip} ${active.id === h.id ? styles.chipOn : ""}`}
                onMouseEnter={() => select(h)}
                onFocus={() => select(h)}
                onClick={() => select(h)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {h.title}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
