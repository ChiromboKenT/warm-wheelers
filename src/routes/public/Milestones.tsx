import type { ReactNode } from "react";
import styles from "./Milestones.module.css";

export function Milestones({ items }: { items: ReactNode[] }) {
  const doubled = [...items, ...items];

  return (
    <div className={styles.rail}>
      <div className={styles.track}>
        {doubled.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
    </div>
  );
}
