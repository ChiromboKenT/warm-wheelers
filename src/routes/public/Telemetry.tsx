import styles from "./Telemetry.module.css";

interface TelemetryProps {
  percent: number;
  completed: number;
  total: number;
  openDecisions: number;
  phaseName: string;
  phaseIndex: number;
  totalPhases: number;
  daysToEvent: number | null;
  nextId: string | null;
}

const CX = 110;
const CY = 110;
const R = 84;
const START = 135;
const SWEEP = 270;

function pt(r: number, deg: number): [number, number] {
  const t = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(t), CY + r * Math.sin(t)];
}

function arcPath(r: number, a0: number, a1: number): string {
  const [sx, sy] = pt(r, a0);
  const [ex, ey] = pt(r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

export function Telemetry({
  percent,
  completed,
  total,
  openDecisions,
  phaseName,
  phaseIndex,
  totalPhases,
  daysToEvent,
  nextId,
}: TelemetryProps) {
  const valueDeg = START + (Math.min(100, Math.max(0, percent)) / 100) * SWEEP;
  const ticks = Array.from({ length: 11 }, (_, i) => START + (i / 10) * SWEEP);
  const [tx, ty] = pt(R, valueDeg);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className={styles.wrap} aria-label="Live build telemetry">
      <div className={styles.dialCard}>
        <svg viewBox="0 0 220 220" className={styles.dial} role="img" aria-label={`${percent}% built`}>
          <path d={arcPath(R, START, START + SWEEP)} className={styles.track} />
          {ticks.map((deg, i) => {
            const [x1, y1] = pt(R + 7, deg);
            const [x2, y2] = pt(R + (i % 5 === 0 ? 16 : 12), deg);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} className={i % 5 === 0 ? styles.tickMajor : styles.tick} />;
          })}
          <path d={arcPath(R, START, valueDeg)} className={styles.value} />
          <circle cx={tx} cy={ty} r="6.5" className={styles.tip} />
          <text x={CX} y={CY + 8} className={styles.bigPct}>
            {percent}
            <tspan className={styles.pctSign}>%</tspan>
          </text>
          <text x={CX} y={CY + 34} className={styles.dialLabel}>
            BUILT
          </text>
        </svg>
        <div className={styles.dialFoot}>
          <span className={styles.dot} />
          {nextId ? (
            <>
              live · up next <b>{nextId}</b>
            </>
          ) : (
            <>live · race ready</>
          )}
        </div>
      </div>

      <div className={styles.tiles}>
        <Tile k="Tasks done" v={`${completed}`} sub={`of ${total} on the list`} />
        <Tile k="Current phase" v={phaseName} sub={`Phase ${pad(phaseIndex + 1)} / ${pad(totalPhases)}`} accent />
        <Tile k="Open decisions" v={`${openDecisions}`} sub={openDecisions === 0 ? "all decided" : "still to decide"} />
        <Tile
          k="Days to ignition"
          v={daysToEvent === null ? "TBC" : `${daysToEvent}`}
          sub={daysToEvent === null ? "date to be confirmed" : daysToEvent <= 0 ? "we have ignition" : "until the start line"}
        />
      </div>
    </section>
  );
}

function Tile({ k, v, sub, accent }: { k: string; v: string; sub: string; accent?: boolean }) {
  return (
    <div className={`${styles.tile} ${accent ? styles.tileAccent : ""}`}>
      <div className={styles.tileK}>{k}</div>
      <div className={styles.tileV}>{v}</div>
      <div className={styles.tileSub}>{sub}</div>
    </div>
  );
}
