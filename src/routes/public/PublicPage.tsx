import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../store/useTasks";
import { useSettings } from "../../store/useSettings";
import { deriveMetrics } from "../../domain/progress";
import { Countdown } from "./Countdown";
import { CutawayCart } from "./CutawayCart";
import { Telemetry } from "./Telemetry";
import { Cutaway } from "./Cutaway";
import { Journey } from "./Journey";
import { StoryTeaser } from "./StoryTeaser";
import { PHASES, ACTIVE_PHASE } from "./phases";
import styles from "./PublicPage.module.css";

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61) % 100,
  delay: (i % 8) * 0.9,
  dur: 4.5 + ((i * 7) % 30) / 10,
  drift: ((i % 5) - 2) * 16,
  size: 3 + (i % 4),
}));

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function PublicPage() {
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { settings, loading: settingsLoading, error: settingsError } = useSettings();
  const heroRef = useRef<HTMLElement>(null);
  const heroRect = useRef<DOMRect | null>(null);
  const frame = useRef(0);

  const m = deriveMetrics(tasks);
  const displayError = tasksError ?? settingsError;

  // The phase currently in development is a curated single source of truth
  // (see phases.ts), independent of overall task completion %.
  const phaseIndex = ACTIVE_PHASE;
  const phaseName = PHASES[phaseIndex].name;

  const { nextId, daysToEvent } = useMemo(() => {
    const next = tasks.find((t) => t.status !== "done");
    let days: number | null = null;
    if (settings?.event_date) {
      const target = new Date(settings.event_date).getTime();
      if (!Number.isNaN(target)) {
        days = Math.max(0, Math.ceil((target - Date.now()) / 86_400_000));
      }
    }
    return { nextId: next?.id ?? null, daysToEvent: days };
  }, [tasks, settings?.event_date]);

  function onEnter() {
    if (heroRef.current) heroRect.current = heroRef.current.getBoundingClientRect();
  }

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reducedMotion() || !heroRef.current) return;
    const el = heroRef.current;
    const rect = heroRect.current ?? el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    });
  }

  function onLeave() {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty("--px", "0");
    heroRef.current.style.setProperty("--py", "0");
  }

  if (tasksLoading || settingsLoading) {
    return (
      <div className={styles.boot}>
        <div className={styles.bootMark}>WW</div>
        <p>Warming up the wheels…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {displayError && (
        <p className={styles.error} role="alert">
          {displayError}
        </p>
      )}

      <header ref={heroRef} className={styles.hero} onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className={styles.sun} aria-hidden="true" />
        <div className={styles.heat} aria-hidden="true" />
        <div className={styles.halftone} aria-hidden="true" />
        <div className={styles.embers} aria-hidden="true">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              style={
                {
                  left: `${e.left}%`,
                  width: e.size,
                  height: e.size,
                  animationDelay: `${e.delay}s`,
                  animationDuration: `${e.dur}s`,
                  "--drift": `${e.drift}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <Link to="/build" className={styles.teamLink}>
          Team <span aria-hidden="true">→</span>
        </Link>

        <div className={styles.inner}>
          <div className={styles.copy}>
            <div className={styles.cap}>
              <span className={styles.spark} />
              {settings?.event_name ?? "Red Bull Soapbox"} · Build in public
            </div>
            <h1 className={styles.title}>
              <span>WARM</span>
              <span className={styles.titleLine2}>WHEELERS</span>
            </h1>
            <p className={styles.sub}>
              We took a domestic gas heater, dropped it low and pointed it downhill. Follow along as we build it in
              the open, from an empty workshop floor to the start line.
            </p>
            <Countdown targetIso={settings?.event_date ?? null} />
          </div>
          <div className={styles.cartWrap}>
            <div className={styles.cartFloat}>
              <CutawayCart />
            </div>
            <div className={styles.cartTag}>side profile · v0.1</div>
          </div>
        </div>

      </header>

      <div id="telemetry" className={styles.telemetryBand}>
        <Telemetry
          percent={m.percent}
          completed={m.completed}
          total={m.total}
          openDecisions={m.openDecisions}
          phaseName={phaseName}
          phaseIndex={phaseIndex}
          totalPhases={PHASES.length}
          daysToEvent={daysToEvent}
          nextId={nextId}
        />
      </div>

      <Cutaway />
      <Journey />
      <StoryTeaser phaseName={phaseName} />

      <footer className={styles.footer}>
        <div className={styles.footInner}>
          <div className={styles.footMark}>
            Warm Wheelers
            <span>Red Bull Soapbox · build in public</span>
          </div>
          <Link to="/build" className={styles.footLink}>
            Team cockpit →
          </Link>
        </div>
      </footer>
    </div>
  );
}
