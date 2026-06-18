import { PriorityBadge, DecisionBadge } from "./Badge";
import type { Task, Status } from "../lib/types";
import styles from "./TaskRow.module.css";

export function TaskRow({
  task,
  onStatus,
}: {
  task: Task;
  onStatus: (id: string, s: Status) => void;
}) {
  const done = task.status === "done";

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={`${styles.cb} ${done ? styles.on : ""}`}
        aria-label={`Toggle ${task.id} done`}
        onClick={() => onStatus(task.id, done ? "not_started" : "done")}
      />
      <div>
        <div className={`${styles.title} ${done ? styles.done : ""}`}>
          {task.id} · {task.description}
        </div>
        <PriorityBadge priority={task.priority} />
        {task.is_decision && <DecisionBadge />}
        <div>
          <select
            className={styles.status}
            value={task.status}
            aria-label={`Status for ${task.id}`}
            onChange={(e) => onStatus(task.id, e.target.value as Status)}
          >
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div className={styles.owner}>{task.owner}</div>
    </div>
  );
}
