import type { ReactNode } from "react";
import styles from "./Badge.module.css";
import type { Priority } from "../lib/types";

const priorityClass: Record<Priority, string> = {
  P0: styles.p0,
  P1: styles.p1,
  P2: styles.p2,
  P3: styles.p3,
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`${styles.badge} ${priorityClass[priority]}`}>{priority}</span>;
}

export function DecisionBadge() {
  return <span className={`${styles.badge} ${styles.decision}`}>Decision</span>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className={`${styles.badge} ${styles.plain}`}>{children}</span>;
}
