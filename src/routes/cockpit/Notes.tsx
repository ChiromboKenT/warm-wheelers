import { useState } from "react";
import { useNotes } from "../../store/useNotes";
import { useAuth } from "../../store/useAuth";
import styles from "./Notes.module.css";

export function Notes() {
  const { notes, loading, error, add } = useNotes();
  const { session } = useAuth();
  const author = session?.user.email ?? "team";
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const post = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setPosting(true);
    setActionError(null);
    const err = await add(trimmed, author);
    setPosting(false);
    if (err) {
      setActionError(err);
      return;
    }
    setBody("");
  };

  if (loading) {
    return <p className={styles.empty}>Loading notes…</p>;
  }

  return (
    <div>
      {(error || actionError) && <p className={styles.error}>{error ?? actionError}</p>}
      <div className={styles.composer}>
        <textarea
          placeholder="Team note, link, blocker, idea…"
          aria-label="New team note"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="button" disabled={!body.trim() || posting} onClick={post}>
          {posting ? "Posting…" : "Post note"}
        </button>
      </div>
      {notes.length === 0 ? (
        <p className={styles.empty}>No team notes yet.</p>
      ) : (
        notes.map((n) => (
          <div key={n.id} className={styles.note}>
            <div>{n.body}</div>
            <div className={styles.meta}>
              {n.author ?? "team"} · {new Date(n.created_at).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
