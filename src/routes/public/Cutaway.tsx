import { useState } from "react";
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
    id: "rake",
    x: 47,
    y: 30,
    tag: "RAKE ≈ 25°",
    title: "The body leans back",
    body: "The heater body leans back on a low chassis. Tilting it cuts the area facing the wind, so there's less drag and more speed down the hill.",
  },
  {
    id: "shell",
    x: 62,
    y: 30,
    tag: "FOAM SHELL",
    title: "Hollow, lightweight skin",
    body: "The shell is hollow foam, not solid metal. That keeps the weight down and low, which makes the cart lighter and steadier on the way down.",
  },
  {
    id: "tail",
    x: 70,
    y: 38,
    tag: "BOAT-TAIL",
    title: "Tapered like a teardrop",
    body: "The back tapers to a point. Air folds in behind the cart instead of ripping away, so the wake is smaller and the drag drops.",
  },
  {
    id: "grille",
    x: 39,
    y: 56,
    tag: "IGNITION GLOW",
    title: "The grille lights up",
    body: "Three burner panels on the nose glow brighter as the cart speeds up. It's all for show, the old heater looking alive again on the move.",
  },
  {
    id: "vane",
    x: 43,
    y: 66,
    tag: "NO BATTERY",
    title: "Driven by the wind",
    body: "A little wind vane in the airflow drives the glow. No batteries, no wiring. The faster it rolls, the hotter it looks.",
  },
  {
    id: "driver",
    x: 57,
    y: 35,
    tag: "LOW C.G.",
    title: "Driver lies back low",
    body: "The driver lies back deep inside the shell. A low centre of gravity keeps the cart planted and steady through the quick corners.",
  },
  {
    id: "front",
    x: 27,
    y: 80,
    tag: "STEERED AXLE",
    title: "Front steering",
    body: "A steered front axle on big air-filled wheels. Enough grip and give to soak up a rough course and still hold a clean line.",
  },
  {
    id: "rear",
    x: 72,
    y: 80,
    tag: "DISC BRAKE",
    title: "Brakes that bite",
    body: "The rear wheels run a disc brake. When the run is over, the driver is what stops the cart, not the hay bales.",
  },
];

export function Cutaway() {
  const [active, setActive] = useState<Hotspot>(HOTSPOTS[3]);

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
              onMouseEnter={() => setActive(h)}
              onFocus={() => setActive(h)}
              onClick={() => setActive(h)}
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
                onMouseEnter={() => setActive(h)}
                onFocus={() => setActive(h)}
                onClick={() => setActive(h)}
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
