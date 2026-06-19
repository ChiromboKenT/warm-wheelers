import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../store/useTasks";
import { useSettings } from "../../store/useSettings";
import { useMilestones } from "../../store/useMilestones";
import { deriveMetrics } from "../../domain/progress";
import { Countdown } from "./Countdown";
import { Milestones } from "./Milestones";
import { CartHero } from "./CartHero";
import { StoryTeaser } from "./StoryTeaser";
import styles from "./PublicPage.module.css";

export function PublicPage() {
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { settings, loading: settingsLoading, error: settingsError } = useSettings();
  const { milestones, error: milestonesError } = useMilestones();
  const m = deriveMetrics(tasks);
  const displayError = tasksError ?? settingsError ?? milestonesError;

  const { railItems, currentPhase } = useMemo(() => {
    const milestoneItems = milestones.map((milestone) => {
      const date = milestone.target_date
        ? new Date(`${milestone.target_date}T00:00:00`).toLocaleDateString()
        : "date TBD";
      return (
        <>
          <b>{milestone.achieved ? "Done" : "Next"}</b>: {milestone.label} <b>{date}</b>
        </>
      );
    });
    const done = tasks
      .filter((t) => t.status === "done")
      .slice()
      .sort((a, b) => (a.done_at ?? a.id).localeCompare(b.done_at ?? b.id));
    const lastDone = done[done.length - 1];
    const next = tasks.find((t) => t.status !== "done");

    return {
      currentPhase: next ? "the build" : "race readiness",
      railItems:
        milestoneItems.length > 0
          ? milestoneItems
          : [
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
  }, [milestones, tasks, m.percent, m.completed, m.total]);

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
