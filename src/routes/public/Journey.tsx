import { useLayoutEffect, useRef, useState } from "react";
import { useInView } from "./useInView";
import { PHASES, ACTIVE_PHASE, phaseStateAt, type PhaseState } from "./phases";
import styles from "./Journey.module.css";

interface Pt {
  x: number;
  y: number;
}

/** Smooth (Catmull-Rom → cubic bézier) path through a set of points. */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function Journey() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const medRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geom, setGeom] = useState<{ w: number; h: number; pts: Pt[] }>({ w: 0, h: 0, pts: [] });

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const pts = medRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top };
      });
      setGeom({ w: wr.width, h: wr.height, pts });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    // re-measure once webfonts settle (they reflow card heights)
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const ready = geom.w > 0 && geom.pts.length === PHASES.length && geom.pts.every((p) => p.y > 0);
  const raw = geom.pts;
  let roadPath = "";
  let hotPath = "";
  let start: Pt | null = null;
  let finish: Pt | null = null;
  if (ready) {
    const leadIn: Pt = { x: raw[0].x, y: raw[0].y - 36 };
    const leadOut: Pt = { x: raw[raw.length - 1].x, y: raw[raw.length - 1].y + 36 };
    roadPath = smoothPath([leadIn, ...raw, leadOut]);
    hotPath = smoothPath([leadIn, ...raw.slice(0, ACTIVE_PHASE + 1)]);
    start = leadIn;
    finish = leadOut;
  }

  return (
    <section className={styles.section} id="journey">
      <div className={styles.head}>
        <span className={styles.eyebrow}>The run · 20 phases</span>
        <h2 className={styles.title}>The downhill run, phase by phase</h2>
        <p className={styles.lead}>
          Twenty phases, all downhill. The lit stop is what we're working on right now. Everything below it is
          still locked, waiting its turn down the track.
        </p>
      </div>

      <div ref={wrapRef} className={styles.trackWrap}>
        <svg
          className={styles.road}
          width={geom.w || 1}
          height={geom.h || 1}
          viewBox={`0 0 ${geom.w || 1} ${geom.h || 1}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {roadPath && (
            <>
              <path d={roadPath} className={styles.roadCasing} />
              <path d={roadPath} className={styles.roadBase} />
              <path d={roadPath} className={styles.roadDash} />
              {hotPath && <path d={hotPath} className={styles.roadHot} />}
            </>
          )}
          {start && <circle cx={start.x} cy={start.y} r="6" className={styles.startDot} />}
          {finish && (
            <g transform={`translate(${finish.x} ${finish.y})`} className={styles.finish}>
              <circle r="11" className={styles.finishDisc} />
              <path d="M-5 -5 h5 v5 h-5 z M0 0 h5 v5 h-5 z" className={styles.finishFlag} />
            </g>
          )}
        </svg>

        <ol className={styles.nodes}>
          {PHASES.map((phase, i) => (
            <Node
              key={phase.name}
              index={i}
              name={phase.name}
              desc={phase.desc}
              state={phaseStateAt(i)}
              side={i % 2 === 0 ? "l" : "r"}
              medRef={(el) => {
                medRefs.current[i] = el;
              }}
            />
          ))}
        </ol>

        <div className={styles.endcaps} aria-hidden="true">
          <span className={styles.capTop}>drop-in · phase 01</span>
          <span className={styles.capBottom}>start line</span>
        </div>
      </div>
    </section>
  );
}

const BADGE: Record<PhaseState, string> = {
  done: "done",
  active: "in development",
  upcoming: "locked",
};

function Node({
  index,
  name,
  desc,
  state,
  side,
  medRef,
}: {
  index: number;
  name: string;
  desc: string;
  state: PhaseState;
  side: "l" | "r";
  medRef: (el: HTMLSpanElement | null) => void;
}) {
  const { ref, inView } = useInView<HTMLLIElement>();
  const no = String(index + 1).padStart(2, "0");
  return (
    <li
      ref={ref}
      className={`${styles.node} ${styles[side]} ${styles[state]} ${inView ? styles.in : ""}`}
      style={{ transitionDelay: `${(index % 4) * 60}ms` }}
      aria-current={state === "active" ? "step" : undefined}
    >
      <span ref={medRef} className={styles.medallion}>
        {state === "active" ? (
          <span className={styles.puck} aria-hidden="true" />
        ) : state === "upcoming" ? (
          <svg className={styles.lock} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          no
        )}
      </span>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <span className={styles.phaseNo}>Phase {no}</span>
          <span className={styles.badge}>{BADGE[state]}</span>
        </div>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.desc}>{desc}</p>
      </div>
    </li>
  );
}
