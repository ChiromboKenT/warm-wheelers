import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Decision } from "../lib/types";

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("decisions").select("*").order("task_id");
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setError(null);
    setDecisions((data as Decision[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("decisions-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "decisions" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  const resolve = useCallback(
    async (id: string, answer: string, decided_by: string): Promise<string | null> => {
      const decided_at = new Date().toISOString();
      const { error: err } = await supabase
        .from("decisions")
        .update({
          answer,
          status: "resolved",
          decided_by,
          decided_at,
        })
        .eq("id", id);
      if (!err) {
        setDecisions((current) =>
          current.map((decision) =>
            decision.id === id
              ? { ...decision, answer, status: "resolved", decided_by, decided_at }
              : decision,
          ),
        );
      }
      return err?.message ?? null;
    },
    [],
  );

  const reopen = useCallback(async (id: string): Promise<string | null> => {
    const { error: err } = await supabase
      .from("decisions")
      .update({
        status: "open",
        answer: null,
        decided_by: null,
        decided_at: null,
      })
      .eq("id", id);
    if (!err) {
      setDecisions((current) =>
        current.map((decision) =>
          decision.id === id
            ? { ...decision, status: "open", answer: null, decided_by: null, decided_at: null }
            : decision,
        ),
      );
    }
    return err?.message ?? null;
  }, []);

  return { decisions, loading, error, resolve, reopen };
}
