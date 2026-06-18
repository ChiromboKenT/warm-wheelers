import { useState } from "react";
import { useTasks } from "../../store/useTasks";
import { useSettings } from "../../store/useSettings";
import { deriveMetrics } from "../../domain/progress";
import { ProgressBar } from "../../components/ProgressBar";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { settings, loading: settingsLoading, error: settingsError, update } = useSettings();
  const metrics = deriveMetrics(tasks);
  const [date, setDate] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveEventDate = async () => {
    if (!date) return;
    setSaveError(null);
    const err = await update({ event_date: new Date(date).toISOString() });
    if (err) {
      setSaveError(err);
      return;
    }
    setDate("");
  };

  const displayError = tasksError ?? settingsError ?? saveError;
  const loading = tasksLoading || settingsLoading;

  if (loading) {
    return <p className={styles.status}>Loading dashboard…</p>;
  }

  return (
    <div>
      {displayError && <p className={styles.error}>{displayError}</p>}
      <div className={styles.metrics}>
        <div className={styles.met}>
          <div className={styles.label}>Total tasks</div>
          <div className={styles.value}>{metrics.total}</div>
        </div>
        <div className={styles.met}>
          <div className={styles.label}>Completed</div>
          <div className={styles.value}>{metrics.completed}</div>
        </div>
        <div className={styles.met}>
          <div className={styles.label}>Open decisions</div>
          <div className={`${styles.value} ${styles.accent}`}>{metrics.openDecisions}</div>
        </div>
        <div className={styles.met}>
          <div className={styles.label}>Progress</div>
          <div className={styles.value}>{metrics.percent}%</div>
          <ProgressBar percent={metrics.percent} />
        </div>
      </div>
      <div className={styles.setting}>
        <strong>Event date (countdown target):</strong>{" "}
        {settings?.event_date
          ? new Date(settings.event_date).toLocaleString()
          : "not set (TBD)"}
        <div className={styles.settingRow}>
          <input
            type="datetime-local"
            aria-label="Event date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button type="button" onClick={saveEventDate} disabled={!date}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
