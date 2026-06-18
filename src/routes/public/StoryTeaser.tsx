import styles from "./StoryTeaser.module.css";

export function StoryTeaser({ phaseName }: { phaseName: string }) {
  return (
    <section className={styles.wrap}>
      <h2>The build, in the open</h2>
      <div className={styles.card}>
        Currently in <strong>{phaseName}</strong>. Full build-in-public story, photos and lessons land here soon —
        follow along as a domestic gas heater becomes a gravity racer.
      </div>
    </section>
  );
}
