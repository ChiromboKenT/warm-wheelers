import { useCallback, useEffect, useMemo, useState } from "react";
import { useTasks } from "../../store/useTasks";
import { useDecisions } from "../../store/useDecisions";
import { supabase } from "../../lib/supabase";
import { TaskRow } from "../../components/TaskRow";
import { localDateKey } from "../../domain/date";
import { validateTaskStatusTransition } from "../../domain/taskWorkflow";
import type { Day, Phase, Status, Task } from "../../lib/types";
import styles from "./TaskTracker.module.css";

const DAY_PAGE_SIZE = 8;

export function TaskTracker() {
  const { tasks, loading, error, setStatus } = useTasks();
  const {
    decisions,
    loading: decisionsLoading,
    error: decisionsError,
  } = useDecisions();
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("");
  const [phase, setPhase] = useState("");
  const [decisionsOnly, setDecisionsOnly] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const [dayLimit, setDayLimit] = useState(DAY_PAGE_SIZE);
  const today = localDateKey();

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

  useEffect(() => {
    setDayLimit(DAY_PAGE_SIZE);
  }, [q, priority, phase, decisionsOnly, todayOnly]);

  const tasksById = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const phasesById = useMemo(() => new Map(phases.map((item) => [item.id, item])), [phases]);
  const decisionsByTaskId = useMemo(
    () => new Map(decisions.map((decision) => [decision.task_id, decision])),
    [decisions],
  );

  const visibleByDay = useMemo(() => {
    const query = q.trim().toLowerCase();

    return days
      .map((day) => {
        const dayTasks = tasks.filter((task) => {
          if (task.day_date !== day.date) return false;
          if (priority && task.priority !== priority) return false;
          if (phase && day.phase_id !== phase) return false;
          if (decisionsOnly && !task.is_decision) return false;
          if (todayOnly && day.date !== today) return false;
          if (query) {
            const hay = `${task.id} ${task.description} ${task.output} ${task.dependencies} ${day.focus}`.toLowerCase();
            return hay.includes(query);
          }
          return true;
        });
        return { day, dayTasks };
      })
      .filter((item) => item.dayTasks.length > 0);
  }, [days, tasks, q, priority, phase, decisionsOnly, todayOnly, today]);

  const visibleDays = visibleByDay.slice(0, dayLimit);
  const remainingDays = Math.max(0, visibleByDay.length - visibleDays.length);

  const doneBlockReason = useCallback(
    (task: Task) =>
      validateTaskStatusTransition(task, "done", {
        decisionStatus: decisionsByTaskId.get(task.id)?.status ?? null,
        tasksById,
      }).reason,
    [decisionsByTaskId, tasksById],
  );

  const handleStatus = useCallback(
    async (task: Task, nextStatus: Status) => {
      setActionError(null);
      const transition = validateTaskStatusTransition(task, nextStatus, {
        decisionStatus: decisionsByTaskId.get(task.id)?.status ?? null,
        tasksById,
      });
      if (!transition.allowed) {
        setActionError(`${task.id}: ${transition.reason}`);
        return;
      }

      const err = await setStatus(task.id, nextStatus);
      if (err) setActionError(`${task.id}: ${err}`);
    },
    [decisionsByTaskId, setStatus, tasksById],
  );

  const displayError = error ?? metaError ?? decisionsError ?? actionError;

  if (loading || decisionsLoading) {
    return <p className={styles.empty}>Loading tasks...</p>;
  }

  return (
    <div>
      {displayError && (
        <p className={styles.error} role="alert">
          {displayError}
        </p>
      )}
      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="Search tasks..."
          value={q}
          aria-label="Search tasks"
          onChange={(event) => setQ(event.target.value)}
        />
        <select value={phase} aria-label="Filter by phase" onChange={(event) => setPhase(event.target.value)}>
          <option value="">All phases</option>
          {phases.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={priority}
          aria-label="Filter by priority"
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="">All priorities</option>
          <option>P0</option>
          <option>P1</option>
          <option>P2</option>
          <option>P3</option>
        </select>
        <div className={styles.checks}>
          <label>
            <input
              type="checkbox"
              checked={decisionsOnly}
              onChange={(event) => setDecisionsOnly(event.target.checked)}
            />
            Decisions
          </label>
          <label>
            <input
              type="checkbox"
              checked={todayOnly}
              onChange={(event) => setTodayOnly(event.target.checked)}
            />
            Today
          </label>
        </div>
      </div>
      {visibleByDay.length === 0 ? (
        <p className={styles.empty}>No tasks match the current filters.</p>
      ) : (
        <>
          <div className={styles.count}>
            Showing {visibleDays.length} of {visibleByDay.length} matching days
          </div>
          {visibleDays.map(({ day, dayTasks }) => {
            const doneCount = dayTasks.filter((task) => task.status === "done").length;
            const ph = phasesById.get(day.phase_id);
            return (
              <section key={day.date} className={styles.day}>
                <div className={styles.dh}>
                  <div className={styles.dateLabel}>
                    {day.day_of_week} {day.date.slice(8)}
                  </div>
                  <div className={styles.dayTitle}>
                    <div className={styles.phase}>{ph?.name}</div>
                    <div className={styles.focus}>{day.focus}</div>
                  </div>
                  <div className={styles.prog}>
                    {doneCount}/{dayTasks.length} done
                  </div>
                </div>
                {dayTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    doneBlockedReason={doneBlockReason(task)}
                    onStatus={handleStatus}
                  />
                ))}
              </section>
            );
          })}
          {remainingDays > 0 && (
            <button
              type="button"
              className={styles.more}
              onClick={() => setDayLimit((current) => current + DAY_PAGE_SIZE)}
            >
              Show {Math.min(DAY_PAGE_SIZE, remainingDays)} more days
            </button>
          )}
        </>
      )}
    </div>
  );
}
