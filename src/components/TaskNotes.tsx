import { useState } from "react";
import { useNotes } from "../store/useNotes";
import { useAuth } from "../store/useAuth";
import styles from "./TaskRow.module.css";

export function TaskNotes({ taskId }: { taskId: string }) {
  const { notes, loading, error, add } = useNotes(taskId);
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
    try {
      const err = await add(trimmed, author);
      if (err) {
        setActionError(err);
        return;
      }
      setBody("");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to post note.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className={styles.notes}>
      {(error || actionError) && (
        <div className={styles.rule} role="alert">
          {error ?? actionError}
        </div>
      )}
      <textarea
        aria-label={`New note for ${taskId}`}
        placeholder="Add task note..."
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />
      <button type="button" disabled={!body.trim() || posting} onClick={post}>
        {posting ? "Posting..." : "Post note"}
      </button>
      {loading ? (
        <div className={styles.noteMeta}>Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className={styles.noteMeta}>No notes for this task yet.</div>
      ) : (
        notes.map((note) => (
          <div key={note.id} className={styles.note}>
            <div>{note.body}</div>
            <div className={styles.noteMeta}>
              {note.author ?? "team"} - {new Date(note.created_at).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
