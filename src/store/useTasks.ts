import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Task, Status } from "../lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("tasks").select("*").order("id");
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setError(null);
    setTasks((data as Task[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("tasks-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  const setStatus = useCallback(async (id: string, status: Status): Promise<string | null> => {
    const done_at = status === "done" ? new Date().toISOString() : null;
    const { error: err } = await supabase.from("tasks").update({ status, done_at }).eq("id", id);
    return err?.message ?? null;
  }, []);

  return { tasks, loading, error, setStatus };
}
