import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../store/useTasks";
import { useSettings } from "../../store/useSettings";
import { deriveMetrics } from "../../domain/progress";
import { Countdown } from "./Countdown";
import { Milestones } from "./Milestones";
import { CartHero } from "./CartHero";
import { StoryTeaser } from "./StoryTeaser";
import styles from "./PublicPage.module.css";

export function PublicPage() {
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { settings, loading: settingsLoading, error: settingsError } = useSettings();
  const m = deriveMetrics(tasks);
  const displayError = tasksError ?? settingsError;

  const { railItems, currentPhase } = useMemo(() => {
    const done = tasks.filter((t) => t.status === "done");
    const lastDone = done[done.length - 1];
    const next = tasks.find((t) => t.status !== "done");

    return {
      currentPhase: next ? "the build" : "race readiness",
      railItems: [
        <>
          <b>{m.percent}%</b> built
        </>,
        lastDone ? (
          <>
            Latest: <b>{lastDone.id}</b> done
          </>
        ) : (
          "Build starting soon"
        ),
        next ? (
          <>
            Up next: <b>{next.id}</b>
          </>
        ) : (
          "Race ready"
        ),
        <>
          <b>{m.completed}</b> of <b>{m.total}</b> tasks complete
        </>,
      ],
    };
  }, [tasks, m.percent, m.completed, m.total]);

  if (tasksLoading || settingsLoading) {
    return <p className={styles.status}>Loading…</p>;
  }

  return (
    <div>
      {displayError && (
        <p className={styles.error} role="alert">
          {displayError}
        </p>
      )}
      <header className={styles.hero}>
        <div className={styles.sun} />
        <div className={styles.halftone} />
        <Link to="/build" className={styles.adminlink}>
          Team →
        </Link>
        <div className={styles.inner}>
          <div>
            <div className={styles.cap}>
              {settings?.event_name ?? "Red Bull Soapbox"} · Build in public
            </div>
            <h1 className={styles.title}>
              WARM
              <br />
              WHEELERS
            </h1>
            <p className={styles.sub}>
              A domestic gas heater, raked low and let loose on gravity. Follow the build from blank floor to start
              line.
            </p>
            <Countdown targetIso={settings?.event_date ?? null} />
          </div>
          <CartHero />
        </div>
      </header>
      <div className={styles.railwrap}>
        <Milestones items={railItems} />
      </div>
      <StoryTeaser phaseName={currentPhase} />
    </div>
  );
}
