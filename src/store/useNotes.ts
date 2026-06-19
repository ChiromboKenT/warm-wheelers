import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Note } from "../lib/types";

export function useNotes(taskId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    let q = supabase.from("notes").select("*").order("created_at", { ascending: false });
    q = taskId ? q.eq("task_id", taskId) : q.is("task_id", null);
    const { data, error: err } = await q;
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setError(null);
    setNotes((data as Note[]) ?? []);
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`notes-rt-${taskId ?? "general"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load, taskId]);

  const add = useCallback(
    async (body: string, author: string): Promise<string | null> => {
      const { data, error: err } = await supabase
        .from("notes")
        .insert({ task_id: taskId ?? null, body, author })
        .select("*")
        .single();
      if (!err && data) {
        setNotes((current) => [data as Note, ...current.filter((note) => note.id !== (data as Note).id)]);
      }
      return err?.message ?? null;
    },
    [taskId],
  );

  return { notes, loading, error, add };
}
