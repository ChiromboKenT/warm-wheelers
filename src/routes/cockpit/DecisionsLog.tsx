import { useState } from "react";
import { useDecisions } from "../../store/useDecisions";
import { useAuth } from "../../store/useAuth";
import styles from "./DecisionsLog.module.css";

const DECISION_PAGE_SIZE = 8;

export function DecisionsLog() {
  const { decisions, loading, error, resolve, reopen } = useDecisions();
  const { session } = useAuth();
  const author = session?.user.email ?? "team";
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(DECISION_PAGE_SIZE);
  const visibleDecisions = decisions.slice(0, visibleLimit);
  const remaining = Math.max(0, decisions.length - visibleDecisions.length);

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
    return <p className={styles.empty}>Loading decisions...</p>;
  }

  return (
    <div>
      {(error || actionError) && (
        <p className={styles.error} role="alert">
          {error ?? actionError}
        </p>
      )}
      {decisions.length === 0 ? (
        <p className={styles.empty}>No decisions recorded yet.</p>
      ) : (
        <>
          <div className={styles.count}>
            Showing {visibleDecisions.length} of {decisions.length} decisions
          </div>
          {visibleDecisions.map((decision) => {
            const draft = drafts[decision.id] ?? "";
            return (
              <div
                key={decision.id}
                className={`${styles.item} ${
                  decision.status === "open" ? styles.open : styles.resolved
                }`}
              >
                <div className={styles.q}>
                  {decision.task_id} - {decision.question}
                </div>
                <div className={styles.meta}>
                  {decision.status === "resolved"
                    ? `Resolved by ${decision.decided_by ?? "team"}${
                        decision.decided_at
                          ? ` - ${new Date(decision.decided_at).toLocaleDateString()}`
                          : ""
                      }`
                    : "Open"}
                </div>
                {decision.status === "resolved" && decision.answer && (
                  <div className={styles.meta}>Answer: {decision.answer}</div>
                )}
                {decision.status === "open" ? (
                  <>
                    <textarea
                      className={styles.answer}
                      placeholder="Record the decision..."
                      aria-label={`Answer for ${decision.task_id}`}
                      value={draft}
                      onChange={(event) =>
                        setDrafts((current) => ({ ...current, [decision.id]: event.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className={styles.btn}
                      disabled={!draft.trim()}
                      onClick={() => handleResolve(decision.id)}
                    >
                      Resolve
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.ghost}`}
                    onClick={() => handleReopen(decision.id)}
                  >
                    Reopen
                  </button>
                )}
              </div>
            );
          })}
          {remaining > 0 && (
            <button
              type="button"
              className={`${styles.btn} ${styles.ghost} ${styles.more}`}
              onClick={() => setVisibleLimit((current) => current + DECISION_PAGE_SIZE)}
            >
              Show {Math.min(DECISION_PAGE_SIZE, remaining)} more decisions
            </button>
          )}
        </>
      )}
    </div>
  );
}
