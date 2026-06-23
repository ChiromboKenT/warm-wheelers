import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { PrepProgress } from "../lib/types";

export function usePrep() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("prep_progress").select("*");
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setError(null);
    const map: Record<string, boolean> = {};
    for (const row of (data as PrepProgress[]) ?? []) map[row.item_id] = row.checked;
    setChecked(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("prep-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "prep_progress" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  const toggle = useCallback(
    async (itemId: string, updatedBy: string): Promise<string | null> => {
      const next = !checked[itemId];
      // optimistic
      setChecked((current) => ({ ...current, [itemId]: next }));
      const { error: err } = await supabase.from("prep_progress").upsert({
        item_id: itemId,
        checked: next,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      });
      if (err) {
        // roll back on failure
        setChecked((current) => ({ ...current, [itemId]: !next }));
        setError(err.message);
        return err.message;
      }
      setError(null);
      return null;
    },
    [checked],
  );

  return { checked, loading, error, toggle };
}
