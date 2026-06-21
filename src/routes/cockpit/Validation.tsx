import { useMemo, useState } from "react";
import { useValidation } from "../../store/useValidation";
import { useAuth } from "../../store/useAuth";
import {
  CATEGORIES,
  STATUS_LABELS,
  STATUS_ORDER,
  deriveValidationSummary,
} from "../../domain/validation";
import type { ValidationCategory, ValidationStatus } from "../../lib/types";
import styles from "./Validation.module.css";

const PRIORITY_CLASS: Record<string, string> = {
  P1: styles.p1,
  P2: styles.p2,
  P3: styles.p3,
};

export function Validation() {
  const { criteria, loading, error, setStatus, setEvidence } = useValidation();
  const { session } = useAuth();
  const author = session?.user.email ?? "team";

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<ValidationCategory | "">("");
  const [status, setStatusFilter] = useState<ValidationStatus | "">("");
  const [priority, setPriority] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const summary = useMemo(() => deriveValidationSummary(criteria), [criteria]);

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return criteria.filter((c) => {
      if (category && c.category !== category) return false;
      if (status && c.status !== status) return false;
      if (priority && c.priority !== priority) return false;
      if (query) {
        const hay = `${c.id} ${c.criterion} ${c.target} ${c.acceptance} ${c.method}`.toLowerCase();
        return hay.includes(query);
      }
      return true;
    });
  }, [criteria, q, category, status, priority]);

  const grouped = useMemo(
    () =>
      CATEGORIES.map((meta) => ({
        meta,
        rows: visible.filter((c) => c.category === meta.key),
      })).filter((group) => group.rows.length > 0),
    [visible],
  );

  const handleStatus = async (id: string, next: ValidationStatus) => {
    setActionError(null);
    const err = await setStatus(id, next, author);
    if (err) setActionError(`${id}: ${err}`);
  };

  const handleEvidence = async (id: string) => {
    setActionError(null);
    const err = await setEvidence(id, drafts[id] ?? "", author);
    if (err) {
      setActionError(`${id}: ${err}`);
      return;
    }
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  if (loading) {
    return <p className={styles.empty}>Loading validation matrix…</p>;
  }

  if (criteria.length === 0) {
    return (
      <p className={styles.empty}>
        No validation criteria loaded yet. Run the seed (<code>npm run seed</code>) to populate the
        matrix.
      </p>
    );
  }

  return (
    <div>
      {(error || actionError) && (
        <p className={styles.error} role="alert">
          {error ?? actionError}
        </p>
      )}

      <section className={`${styles.gate} ${summary.freezeReady ? styles.gateReady : ""}`}>
        <div className={styles.gateHead}>
          <span className={styles.gateBadge}>
            {summary.freezeReady ? "Freeze-ready" : "Not frozen"}
          </span>
          <span className={styles.gateText}>
            {summary.freezeReady
              ? "Every P1 criterion passes and no P2 is failing. The structure can be frozen."
              : "Design freezes when every P1 passes and no P2 is failing."}
          </span>
        </div>
        <div className={styles.gateStats}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>P1 cleared</div>
            <div className={styles.statValue}>
              {summary.p1Pass}/{summary.p1Total}
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>P2 failing</div>
            <div className={`${styles.statValue} ${summary.p2Fail ? styles.bad : ""}`}>
              {summary.p2Fail}
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Validated</div>
            <div className={styles.statValue}>{summary.validatedPercent}%</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Red Bull open</div>
            <div className={`${styles.statValue} ${summary.rbOpen ? styles.warn : ""}`}>
              {summary.rbOpen}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="Search criteria…"
          aria-label="Search criteria"
          value={q}
          onChange={(event) => setQ(event.target.value)}
        />
        <select
          value={category}
          aria-label="Filter by category"
          onChange={(event) => setCategory(event.target.value as ValidationCategory | "")}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((meta) => (
            <option key={meta.key} value={meta.key}>
              {meta.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          aria-label="Filter by status"
          onChange={(event) => setStatusFilter(event.target.value as ValidationStatus | "")}
        >
          <option value="">All statuses</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={priority}
          aria-label="Filter by priority"
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="">All priorities</option>
          <option>P1</option>
          <option>P2</option>
          <option>P3</option>
        </select>
      </div>

      {grouped.length === 0 ? (
        <p className={styles.empty}>No criteria match the current filters.</p>
      ) : (
        grouped.map(({ meta, rows }) => {
          const passed = rows.filter((c) => c.status === "pass").length;
          return (
            <section key={meta.key} className={styles.group}>
              <div className={styles.groupHead}>
                <div>
                  <div className={styles.groupTitle}>{meta.label}</div>
                  <div className={styles.groupBlurb}>{meta.blurb}</div>
                </div>
                <div className={styles.groupCount}>
                  {passed}/{rows.length} pass
                </div>
              </div>

              {rows.map((c) => (
                <div key={c.id} className={`${styles.item} ${styles[`s_${c.status}`] ?? ""}`}>
                  <div className={styles.itemHead}>
                    <span className={styles.itemId}>{c.id}</span>
                    <span className={styles.itemName}>{c.criterion}</span>
                    <span className={`${styles.chip} ${PRIORITY_CLASS[c.priority] ?? ""}`}>
                      {c.priority}
                    </span>
                    <span className={styles.gateChip}>{c.gate}</span>
                    {c.rb_dependent && <span className={styles.rbChip}>RB?</span>}
                  </div>

                  <div className={styles.spec}>
                    <span>
                      <b>Target:</b> {c.target}
                    </span>
                    <span>
                      <b>Method:</b> {c.method}
                    </span>
                    <span>
                      <b>Pass when:</b> {c.acceptance}
                    </span>
                  </div>

                  <div className={styles.statusRow}>
                    {STATUS_ORDER.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.statusBtn} ${
                          c.status === s ? `${styles.statusOn} ${styles[`on_${s}`] ?? ""}` : ""
                        }`}
                        aria-pressed={c.status === s}
                        onClick={() => handleStatus(c.id, s)}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>

                  <details className={styles.evidence}>
                    <summary>
                      Evidence{c.evidence ? "" : " — none yet"}
                      {c.updated_by && (
                        <span className={styles.updated}>
                          {" "}
                          · {c.updated_by} · {new Date(c.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </summary>
                    <textarea
                      className={styles.evidenceInput}
                      placeholder="Link the FEA/CFD report, test photo, scale reading, calc sheet…"
                      aria-label={`Evidence for ${c.id}`}
                      value={drafts[c.id] ?? c.evidence ?? ""}
                      onChange={(event) =>
                        setDrafts((current) => ({ ...current, [c.id]: event.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className={styles.saveBtn}
                      disabled={(drafts[c.id] ?? c.evidence ?? "") === (c.evidence ?? "")}
                      onClick={() => handleEvidence(c.id)}
                    >
                      Save evidence
                    </button>
                  </details>
                </div>
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}
