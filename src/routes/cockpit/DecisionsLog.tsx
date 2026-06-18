import { useState } from "react";
import { useDecisions } from "../../store/useDecisions";
import { useAuth } from "../../store/useAuth";
import styles from "./DecisionsLog.module.css";

export function DecisionsLog() {
  const { decisions, loading, error, resolve, reopen } = useDecisions();
  const { session } = useAuth();
  const author = session?.user.email ?? "team";
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const handleResolve = async (id: string) => {
    const answer = (drafts[id] ?? "").trim();
    if (!answer) return;
    setActionError(null);
    const err = await resolve(id, answer, author);
    if (err) {
      setActionError(err);
      return;
    }
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleReopen = async (id: string) => {
    setActionError(null);
    const err = await reopen(id);
    if (err) setActionError(err);
  };

  if (loading) {
    return <p className={styles.empty}>Loading decisions…</p>;
  }

  return (
    <div>
      {(error || actionError) && <p className={styles.error}>{error ?? actionError}</p>}
      {decisions.length === 0 ? (
        <p className={styles.empty}>No decisions recorded yet.</p>
      ) : (
        decisions.map((d) => {
          const draft = drafts[d.id] ?? "";
          return (
            <div
              key={d.id}
              className={`${styles.item} ${d.status === "open" ? styles.open : styles.resolved}`}
            >
              <div className={styles.q}>
                {d.task_id} · {d.question}
              </div>
              <div className={styles.meta}>
                {d.status === "resolved"
                  ? `Resolved by ${d.decided_by ?? "team"}${
                      d.decided_at ? ` · ${new Date(d.decided_at).toLocaleDateString()}` : ""
                    }`
                  : "Open"}
              </div>
              {d.status === "resolved" && d.answer && (
                <div className={styles.meta}>Answer: {d.answer}</div>
              )}
              {d.status === "open" ? (
                <>
                  <textarea
                    className={styles.answer}
                    placeholder="Record the decision…"
                    aria-label={`Answer for ${d.task_id}`}
                    value={draft}
                    onChange={(e) => setDrafts({ ...drafts, [d.id]: e.target.value })}
                  />
                  <button
                    type="button"
                    className={styles.btn}
                    disabled={!draft.trim()}
                    onClick={() => handleResolve(d.id)}
                  >
                    Resolve
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.ghost}`}
                  onClick={() => handleReopen(d.id)}
                >
                  Reopen
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
