import { useState } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../store/useTasks";
import { useSettings } from "../../store/useSettings";
import { useValidation } from "../../store/useValidation";
import { deriveMetrics } from "../../domain/progress";
import { deriveValidationSummary } from "../../domain/validation";
import { ProgressBar } from "../../components/ProgressBar";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { settings, loading: settingsLoading, error: settingsError, update } = useSettings();
  const { criteria, loading: validationLoading, error: validationError } = useValidation();
  const metrics = deriveMetrics(tasks);
  const validation = deriveValidationSummary(criteria);
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

  const displayError = tasksError ?? settingsError ?? validationError ?? saveError;
  const loading = tasksLoading || settingsLoading || validationLoading;

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
      {validation.total > 0 && (
        <Link to="/build/validation" className={styles.setting} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
          <strong>Design-freeze gate:</strong>{" "}
          {validation.freezeReady ? "ready to freeze ✓" : "not frozen"}
          <div className={styles.settingRow}>
            P1 cleared {validation.p1Pass}/{validation.p1Total} · P2 failing{" "}
            {validation.p2Fail} · {validation.validatedPercent}% validated
            {validation.rbOpen > 0 ? ` · ${validation.rbOpen} Red Bull item(s) open` : ""}
          </div>
        </Link>
      )}
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
