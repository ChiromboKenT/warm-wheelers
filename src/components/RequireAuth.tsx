import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export function RequireAuth({ children }: { children: ReactElement }) {
  const { session, ready, error } = useAuth();
  if (!ready) {
    return <div aria-live="polite">Loading…</div>;
  }
  if (error) {
    return <div role="alert">Unable to confirm your session: {error}</div>;
  }
  if (!session) return <Navigate to="/login" replace />;
  return children;
}
