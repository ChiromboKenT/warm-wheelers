import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { ValidationCriterion, ValidationStatus } from "../lib/types";

export function useValidation() {
  const [criteria, setCriteria] = useState<ValidationCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("validation_criteria")
      .select("*")
      .order("category_order")
      .order("order_index");
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setError(null);
    setCriteria((data as ValidationCriterion[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("validation-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "validation_criteria" },
        load,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  const update = useCallback(
    async (
      id: string,
      patch: { status?: ValidationStatus; evidence?: string | null; owner?: string | null },
      updatedBy: string,
    ): Promise<string | null> => {
      const updated_at = new Date().toISOString();
      const payload = { ...patch, updated_by: updatedBy, updated_at };
      const { error: err } = await supabase
        .from("validation_criteria")
        .update(payload)
        .eq("id", id);
      if (!err) {
        setCriteria((current) =>
          current.map((c) => (c.id === id ? { ...c, ...payload } : c)),
        );
      }
      return err?.message ?? null;
    },
    [],
  );

  const setStatus = useCallback(
    (id: string, status: ValidationStatus, updatedBy: string) => update(id, { status }, updatedBy),
    [update],
  );

  const setEvidence = useCallback(
    (id: string, evidence: string, updatedBy: string) =>
      update(id, { evidence: evidence.trim() || null }, updatedBy),
    [update],
  );

  return { criteria, loading, error, setStatus, setEvidence };
}
