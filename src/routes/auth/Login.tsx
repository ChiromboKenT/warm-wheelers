import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import styles from "./Login.module.css";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErr(error.message);
        return;
      }
      navigate("/build");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={submit}>
        <h1>Warm Wheelers</h1>
        <p className={styles.subtitle}>Team sign-in</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Entering..." : "Enter the workshop"}
        </button>
        {err && <div className={styles.err}>{err}</div>}
      </form>
    </div>
  );
}
