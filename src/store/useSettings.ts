import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Settings } from "../lib/types";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setError(null);
    setSettings(data as Settings);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("settings-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  const update = useCallback(
    async (patch: Partial<Settings>): Promise<string | null> => {
      const { error: err } = await supabase.from("settings").update(patch).eq("id", 1);
      if (err) return err.message;
      await load();
      return null;
    },
    [load],
  );

  return { settings, loading, error, update };
}
