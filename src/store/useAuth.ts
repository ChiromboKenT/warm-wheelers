import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) {
          setError(err.message);
          setSession(null);
          return;
        }
        setError(null);
        setSession(data.session);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to read the current session.");
        setSession(null);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setError(null);
      setSession(nextSession);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return { session, ready, error, signIn, signOut };
}
