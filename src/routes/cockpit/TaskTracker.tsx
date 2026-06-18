import { useEffect, useMemo, useState } from "react";
import { useTasks } from "../../store/useTasks";
import { supabase } from "../../lib/supabase";
import { TaskRow } from "../../components/TaskRow";
import type { Day, Phase } from "../../lib/types";
import styles from "./TaskTracker.module.css";

export function TaskTracker() {
  const { tasks, loading, error, setStatus } = useTasks();
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("");
  const [phase, setPhase] = useState("");
  const [decisionsOnly, setDecisionsOnly] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function loadMeta() {
      const [daysRes, phasesRes] = await Promise.all([
        supabase.from("days").select("*").order("date"),
        supabase.from("phases").select("*").order("order_index"),
      ]);
      if (daysRes.error || phasesRes.error) {
        setMetaError(daysRes.error?.message ?? phasesRes.error?.message ?? "Failed to load schedule");
        return;
      }
      setMetaError(null);
      setDays((daysRes.data as Day[]) ?? []);
      setPhases((phasesRes.data as Phase[]) ?? []);
    }
    loadMeta();
  }, []);

  const visibleByDay = useMemo(() => {
    return days
      .map((d) => {
        const dayTasks = tasks
          .filter((t) => t.day_date === d.date)
          .filter((t) => {
            if (priority && t.priority !== priority) return false;
            if (phase && d.phase_id !== phase) return false;
            if (decisionsOnly && !t.is_decision) return false;
            if (todayOnly && d.date !== today) return false;
            if (q) {
              const hay = `${t.id} ${t.description} ${t.output} ${d.focus}`.toLowerCase();
              if (!hay.includes(q.toLowerCase())) return false;
            }
            return true;
          });
        return { day: d, dayTasks };
      })
      .filter((x) => x.dayTasks.length > 0);
  }, [days, tasks, q, priority, phase, decisionsOnly, todayOnly, today]);

  const displayError = error ?? metaError;

  if (loading) {
    return <p className={styles.empty}>Loading tasks…</p>;
  }

  return (
    <div>
      {displayError && <p className={styles.error}>{displayError}</p>}
      <div className={styles.controls}>
        <input
          placeholder="Search tasks…"
          value={q}
          aria-label="Search tasks"
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={phase} aria-label="Filter by phase" onChange={(e) => setPhase(e.target.value)}>
          <option value="">All phases</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={priority}
          aria-label="Filter by priority"
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All priorities</option>
          <option>P0</option>
          <option>P1</option>
          <option>P2</option>
          <option>P3</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={decisionsOnly}
            onChange={(e) => setDecisionsOnly(e.target.checked)}
          />
          Decisions
        </label>
        <label>
          <input type="checkbox" checked={todayOnly} onChange={(e) => setTodayOnly(e.target.checked)} />
          Today
        </label>
      </div>
      {visibleByDay.length === 0 ? (
        <p className={styles.empty}>No tasks match the current filters.</p>
      ) : (
        visibleByDay.map(({ day, dayTasks }) => {
          const doneCount = dayTasks.filter((t) => t.status === "done").length;
          const ph = phases.find((p) => p.id === day.phase_id);
          return (
            <section key={day.date} className={styles.day}>
              <div className={styles.dh}>
                <div className={styles.dateLabel}>
                  {day.day_of_week} {day.date.slice(8)}
                </div>
                <div>
                  <div className={styles.phase}>{ph?.name}</div>
                  <div className={styles.focus}>{day.focus}</div>
                </div>
                <div className={styles.prog}>
                  {doneCount}/{dayTasks.length} done
                </div>
              </div>
              {dayTasks.map((t) => (
                <TaskRow key={t.id} task={t} onStatus={setStatus} />
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}
