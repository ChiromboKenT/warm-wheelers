import { useMemo } from "react";
import { usePrep } from "../../store/usePrep";
import { useAuth } from "../../store/useAuth";
import { PREP_SECTIONS, PHASE_LABELS, type PrepKind, type PrepPhase } from "./prepData";
import styles from "./Prep.module.css";

const KIND_LABEL: Record<PrepKind, string> = {
  material: "BUY",
  tool: "TOOL",
  test: "TEST",
  model: "MODEL",
  input: "INPUT",
};

export function Prep() {
  const { checked, loading, error, toggle } = usePrep();
  const { session } = useAuth();
  const author = session?.user.email ?? "team";

  const allItems = useMemo(() => PREP_SECTIONS.flatMap((s) => s.items), []);
  const doneCount = allItems.filter((i) => checked[i.id]).length;

  if (loading) {
    return <p className={styles.foot}>Loading prep catalogue…</p>;
  }

  let lastPhase: PrepPhase | null = null;

  return (
    <div>
      {error && (
        <p className={styles.error} role="alert">
          {error} — progress may not be saving. Has the <code>prep_progress</code> migration been
          applied?
        </p>
      )}

      <section className={styles.intro}>
        <div className={styles.introHead}>
          <span className={styles.badge}>Prep</span>
          <span className={styles.introText}>
            Everything you might need — full-scale build <b>and</b> a hand-carryable scale model to
            experiment with first. Each line has options/alternatives; ticks sync across devices.
          </span>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            {doneCount}/{allItems.length} done
          </div>
          <div className={styles.track}>
            <div
              className={styles.fill}
              style={{ width: `${(doneCount / allItems.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {PREP_SECTIONS.map((section) => {
        const showPhase = section.phase !== lastPhase;
        lastPhase = section.phase;
        const done = section.items.filter((i) => checked[i.id]).length;
        return (
          <div key={section.key}>
            {showPhase && <h2 className={styles.phase}>{PHASE_LABELS[section.phase]}</h2>}
            <section className={styles.group}>
              <div className={styles.groupHead}>
                <div>
                  <div className={styles.groupTitle}>{section.title}</div>
                  <div className={styles.groupBlurb}>{section.blurb}</div>
                </div>
                <div className={styles.groupCount}>
                  {done}/{section.items.length}
                </div>
              </div>

              {section.items.map((item) => {
                const isDone = !!checked[item.id];
                return (
                  <label
                    key={item.id}
                    className={`${styles.item} ${isDone ? styles.itemDone : ""}`}
                  >
                    <input
                      type="checkbox"
                      className={styles.check}
                      checked={isDone}
                      onChange={() => toggle(item.id, author)}
                    />
                    <div className={styles.body}>
                      <div className={styles.itemHead}>
                        <span className={styles.itemId}>{item.id}</span>
                        <span className={styles.itemName}>{item.label}</span>
                        <span className={`${styles.kind} ${styles[`k_${item.kind}`]}`}>
                          {KIND_LABEL[item.kind]}
                        </span>
                      </div>
                      <div className={styles.meta}>
                        <span>
                          <b>Where:</b> {item.where}
                        </span>
                        <span>
                          <b>For:</b> {item.forWhat}
                        </span>
                      </div>
                      {item.options && (
                        <ul className={styles.options}>
                          {item.options.map((opt) => (
                            <li key={opt}>{opt}</li>
                          ))}
                        </ul>
                      )}
                      {item.refs && <div className={styles.refs}>Others use: {item.refs}</div>}
                    </div>
                  </label>
                );
              })}
            </section>
          </div>
        );
      })}

      <p className={styles.foot}>
        Build the model first (Track A solder-braze · Track B 3D print · Track C foam) to prove
        geometry, the heater look and the glow before cutting steel. Full source:{" "}
        <code>docs/plans/2026-06-22-warm-wheelers-materials-and-build-tracks.md</code>.
      </p>
    </div>
  );
}
