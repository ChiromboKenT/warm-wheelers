import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Milestone } from "../lib/types";

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("milestones")
      .select("*")
      .order("order_index")
      .order("target_date", { ascending: true });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setError(null);
    setMilestones((data as Milestone[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("milestones-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "milestones" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  return { milestones, loading, error };
}
