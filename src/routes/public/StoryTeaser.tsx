import styles from "./StoryTeaser.module.css";

const NOTES: { k: string; title: string; body: string }[] = [
  {
    k: "01",
    title: "Nothing hidden",
    body: "Every call, dead end and small win goes on the record. The whole build, out in the open.",
  },
  {
    k: "02",
    title: "Maths before metal",
    body: "We run it through a virtual wind tunnel and test it on screen long before anyone picks up a grinder.",
  },
  {
    k: "03",
    title: "A heater that races",
    body: "An ordinary gas heater, rebuilt low and mean, chasing a clean line down the hill.",
  },
];

export function StoryTeaser({ phaseName }: { phaseName: string }) {
  return (
    <section className={styles.wrap} id="story">
      <div className={styles.inner}>
        <div className={styles.lead}>
          <span className={styles.eyebrow}>The build, in the open</span>
          <p className={styles.statement}>
            We're turning a <em>domestic gas heater</em> into a gravity racer, and showing every bolt of it.
            Right now we're busy with <strong>{phaseName}</strong>.
          </p>
          <p className={styles.note}>
            Photos, write-ups and the odd hard lesson will land here as the cart comes together. Bookmark the page
            and check back as it takes shape.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#journey">
              Follow the run →
            </a>
            <a className={styles.ghost} href="#cutaway">
              See how it works
            </a>
          </div>
        </div>
        <ul className={styles.notes}>
          {NOTES.map((n) => (
            <li key={n.k} className={styles.card}>
              <span className={styles.num}>{n.k}</span>
              <div>
                <h3>{n.title}</h3>
                <p>{n.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
