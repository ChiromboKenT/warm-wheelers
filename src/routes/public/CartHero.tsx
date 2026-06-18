import styles from "./CartHero.module.css";

export function CartHero() {
  return (
    <div className={styles.cart} aria-label="Gas-heater soapbox cart">
      <div className={styles.road} />
      <div className={styles.body} />
      <div className={styles.grille}>
        <div className={styles.gp} />
        <div className={styles.gp} />
        <div className={styles.gp} />
      </div>
      <div className={`${styles.w} ${styles.f}`}>
        <i />
      </div>
      <div className={`${styles.w} ${styles.r}`}>
        <i />
      </div>
    </div>
  );
}
