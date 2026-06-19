import { useState } from "react";
import { PriorityBadge, DecisionBadge } from "./Badge";
import { TaskNotes } from "./TaskNotes";
import { nextQuickStatus } from "../domain/taskWorkflow";
import type { Status, Task } from "../lib/types";
import styles from "./TaskRow.module.css";

export function TaskRow({
  task,
  doneBlockedReason,
  onStatus,
}: {
  task: Task;
  doneBlockedReason: string | null;
  onStatus: (task: Task, s: Status) => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const done = task.status === "done";
  const quickStatus = nextQuickStatus(task.status);
  const quickBlocked = quickStatus === "done" && doneBlockedReason;

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={`${styles.cb} ${done ? styles.on : ""} ${
          task.status === "in_progress" ? styles.partial : ""
        }`}
        aria-label={`${done ? "Reopen" : "Advance"} ${task.id}`}
        title={quickBlocked || `${done ? "Reopen" : "Advance"} ${task.id}`}
        disabled={Boolean(quickBlocked)}
        onClick={() => onStatus(task, quickStatus)}
      />
      <div className={styles.main}>
        <div className={`${styles.title} ${done ? styles.done : ""}`}>
          {task.id} - {task.description}
        </div>
        <div className={styles.badges}>
          <PriorityBadge priority={task.priority} />
          {task.is_decision && <DecisionBadge />}
        </div>
        <div className={styles.metaGrid}>
          <span>Output: {task.output || "Not specified"}</span>
          <span>Deadline: {task.deadline || "Open"}</span>
          <span>Dependencies: {task.dependencies || "None"}</span>
        </div>
        {doneBlockedReason && task.status !== "done" && <div className={styles.rule}>{doneBlockedReason}</div>}
        <div className={styles.actions}>
          <select
            className={styles.status}
            value={task.status}
            aria-label={`Status for ${task.id}`}
            onChange={(event) => onStatus(task, event.target.value as Status)}
          >
            <option value="not_started" disabled={task.status === "done"}>
              Not started
            </option>
            <option value="in_progress">In progress</option>
            <option value="done" disabled={task.status !== "done" && Boolean(doneBlockedReason)}>
              Done
            </option>
          </select>
          <button
            type="button"
            className={styles.noteToggle}
            aria-expanded={notesOpen}
            onClick={() => setNotesOpen((open) => !open)}
          >
            Notes
          </button>
        </div>
        {notesOpen && <TaskNotes taskId={task.id} />}
      </div>
      <div className={styles.owner}>{task.owner}</div>
    </div>
  );
}
