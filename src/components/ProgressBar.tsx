import styles from "./ProgressBar.module.css";

export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={styles.wrap}>
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}
