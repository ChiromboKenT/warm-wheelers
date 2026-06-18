import { useEffect, useState } from "react";
import { timeLeft } from "../../domain/countdown";
import styles from "./Countdown.module.css";

export function Countdown({ targetIso }: { targetIso: string | null }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!targetIso) {
    return <div className={styles.tbd}>Event date to be confirmed.</div>;
  }

  const t = timeLeft(new Date(targetIso).getTime(), now);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      <div className={styles.label}>{t.done ? "We have ignition" : "Ignition in"}</div>
      <div className={styles.units}>
        <div className={styles.u}>
          <b>{t.days}</b>
          <span>days</span>
        </div>
        <div className={styles.u}>
          <b>{pad(t.hours)}</b>
          <span>hrs</span>
        </div>
        <div className={styles.u}>
          <b>{pad(t.minutes)}</b>
          <span>min</span>
        </div>
        <div className={styles.u}>
          <b>{pad(t.seconds)}</b>
          <span>sec</span>
        </div>
      </div>
    </div>
  );
}
