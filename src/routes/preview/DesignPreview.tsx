import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createCartScene, type CartSceneHandles, type ViewName } from "./cartScene";
import alvaImg from "../../assets/reference/alva_gas_1.jpg";
import russellImg from "../../assets/reference/russel_gas_1.png";
import curveImg from "../../assets/reference/curve_profile_of_gas_1.png";
import bottleImg from "../../assets/reference/back_of_tank.jpg";
import styles from "./DesignPreview.module.css";

const VIEW_LABELS: { id: ViewName; label: string }[] = [
  { id: "hero", label: "¾ Front" },
  { id: "side", label: "Profile" },
  { id: "rear", label: "¾ Rear" },
  { id: "face", label: "Grille" },
];

const STAGE_READOUT = ["COLD", "STAGE I", "STAGE II", "FULL GLOW"];

const REFERENCES = [
  {
    src: alvaImg,
    name: "alva_gas_1.jpg",
    caption: "Overall stance — charcoal shell, recessed grille, badge low on the face.",
  },
  {
    src: russellImg,
    name: "russel_gas_1.png",
    caption: "Two-stage front: upper grille (our view band) over the radiant ceramic panels.",
  },
  {
    src: curveImg,
    name: "curve_profile_of_gas_1.png",
    caption: "Convex bowed front and ribbed side panels — the 200 mm dome and flank ribs.",
  },
  {
    src: bottleImg,
    name: "back_of_tank.jpg",
    caption: "Orange LP bottle riding in the open back — the boat-tail driver pod. The driver is the fuel.",
  },
];

const SPECS = [
  {
    k: "Envelope",
    v: "2 550 × 1 395 × 1 600",
    r: "mm, over the duals. Limit 6 000 × 2 000 × 2 500 — clears width by 605 mm ✓",
  },
  { k: "Mass budget", v: "76.4 kg", r: "Cap 80 kg excluding driver — 3.6 kg in hand, no ballast ✓" },
  { k: "Wheels", v: "6 × Ø260", r: "Rybro pneumatics: steered pair up front, load-sharing duals at the rear ✓" },
  { k: "Brakes", v: "2 × rear disc", r: "Independent circuits, hand levers. 40→0 km/h in 15.7 m ✓" },
  { k: "Steering", v: "Pitman + beam axle", r: "Ackermann geometry, braced column. Turning radius 3.5 m ✓" },
  { k: "Stability", v: "CoG ≈ 340 mm", r: "Driver-dominated and low. Rollover threshold ≈ 1.8 g lateral ✓" },
  { k: "Ignition", v: "Lever + ratchet", r: "Three ceramic panels flare in sequence — obviously fake fire, per the rules ✓" },
  { k: "Clearance", v: "150 mm", r: "180 mm at the nose, so the start-ramp lip can't bite ✓" },
];

export function DesignPreview() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CartSceneHandles | null>(null);
  const [webglOk, setWebglOk] = useState(true);
  const [loading, setLoading] = useState(true);
  const [glowStage, setGlowStage] = useState(0);
  const [view, setView] = useState<ViewName>("hero");

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let handles: CartSceneHandles | null = null;
    let cancelled = false;
    // Defer the heavy synchronous scene build one paint so the loader shows first.
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        handles = createCartScene(el, () => setLoading(false));
      } catch {
        setWebglOk(false);
        setLoading(false);
        return;
      }
      sceneRef.current = handles;
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      sceneRef.current = null;
      handles?.dispose();
    };
  }, []);

  function pickStage(n: number) {
    setGlowStage(n);
    sceneRef.current?.setStage(n);
  }

  function pickView(v: ViewName) {
    setView(v);
    sceneRef.current?.setView(v);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Link to="/" className={styles.back}>
            ← Warm Wheelers
          </Link>
          <span className={styles.dot} />
          <span>Red Bull Box Cart Race · Johannesburg 2026</span>
          <span>Design preview · T026</span>
        </div>
        <h1 className={styles.title}>
          The finished <span className={styles.flame}>cart</span>
        </h1>
        <p className={styles.dek}>
          A domestic gas heater, re-plumbed for gravity. This is the cart as frozen in the CAD master spec —
          rendered in real time at <b>true T018 dimensions</b>, with materials matched to the reference
          heaters below. Pull the lever to ignite it.
        </p>
      </header>

      <div className={styles.stage} ref={stageRef}>
        {!loading && webglOk && <div className={styles.hint}>drag to orbit · scroll to zoom</div>}
        {loading && webglOk && (
          <div className={styles.loader} role="status" aria-live="polite">
            <div className={styles.loaderMark}>WW</div>
            <div className={styles.loaderRing} aria-hidden="true" />
            <p className={styles.loaderText}>Assembling the cart…</p>
            <div className={styles.loaderBar} aria-hidden="true">
              <span />
            </div>
          </div>
        )}
        {!webglOk && (
          <div className={styles.fallback}>
            <p>This preview needs WebGL. Open it in a current browser to see the cart.</p>
          </div>
        )}
        <div className={styles.hud} data-hidden={loading || !webglOk ? "" : undefined}>
          <div className={styles.views} role="group" aria-label="Camera views">
            {VIEW_LABELS.map((v) => (
              <button key={v.id} aria-pressed={view === v.id} onClick={() => pickView(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
          <div className={styles.ignition}>
            <div className={styles.ignitionLabel}>
              <span>Ignition — driver lever</span>
              <em>{STAGE_READOUT[glowStage]}</em>
            </div>
            <div className={styles.detents} role="group" aria-label="Glow stage">
              {["OFF", "I", "II", "III"].map((label, i) => (
                <button
                  key={label}
                  aria-pressed={glowStage === i}
                  className={i !== 0 && i < glowStage ? styles.passed : undefined}
                  onClick={() => pickStage(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={styles.ignitionNote}>
              Three sprung ceramic panels, one ratchet click each. No battery — stored electrical energy is
              banned, so this is rod and spring.
            </div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.secHead}>
          <h2>Scrutineering card</h2>
          <span>values from the 2026-07-02 validation pass</span>
        </div>
        <div className={styles.specs}>
          {SPECS.map((s) => (
            <div key={s.k} className={styles.spec}>
              <div className={styles.specK}>{s.k}</div>
              <div className={styles.specV}>{s.v}</div>
              <div className={styles.specR}>{s.r}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.secHead}>
          <h2>Why it looks like this</h2>
          <span>form and function, one shape</span>
        </div>
        <div className={styles.notes}>
          <div className={styles.noteCol}>
            <h3>The read</h3>
            <p>
              Nine out of ten strangers have to name it <b>“heater”</b> in a second. That job is carried by the
              recessed grille behind its chromed wire guard, the honeycomb ceramic panels, the two control
              knobs, the nameplate and the tall, slightly leaning stance — not by paint. The look is a Goal-1
              promise, so it wins ties against aero.
            </p>
          </div>
          <div className={styles.noteCol}>
            <h3>The air</h3>
            <p>
              The nose bows <b>200 mm</b> so the flat face never slams the wind, and the tail draws down to a{" "}
              <b>Ø700 pod</b> so the wake stays small. The driver reclines feet-forward with eyes 670 mm below
              the roofline  the orange bottle on the back of the heater. The driver is the fuel.
            </p>
          </div>
          <div className={styles.noteCol}>
            <h3>The rules</h3>
            <p>
              Gravity and a push, nothing stored. Steel spine, shutterply deck, <b>welded roll hoop</b> over the
              helmet line, harness always. Every number on this page passed the envelope, mass and rollover
              checks before anything gets cut.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCopy}>
          <h2>That’s the whole cart.</h2>
          <p>Back to the build in public — follow the countdown, meet the crew, or say hello.</p>
        </div>
        <div className={styles.ctaLinks}>
          <Link to="/" className={styles.ctaPrimary}>
            ← Back to Warm Wheelers
          </Link>
          <Link to="/#cutaway" className={styles.ctaGhost}>
            How it works
          </Link>
          <Link to="/build" className={styles.ctaGhost}>
            Team cockpit →
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        Plans: T018 master spec · shell T023 · glow mechanism T024 · driver package T025 —{" "}
        <span className={styles.footPath}>build/02_CAD</span>
        <br />
        Real-time physically-based render · every dimension driven by T018-parameters.csv · materials matched
        to build/05_media/reference images
      </footer>
    </div>
  );
}
