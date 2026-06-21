import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import styles from "./CockpitLayout.module.css";

export function CockpitLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : "");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <span className={styles.brand}>
          Warm <b>Wheelers</b>
        </span>
        <nav className={styles.nav}>
          <NavLink to="/build" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/build/tasks" className={linkClass}>
            Tasks
          </NavLink>
          <NavLink to="/build/decisions" className={linkClass}>
            Decisions
          </NavLink>
          <NavLink to="/build/validation" className={linkClass}>
            Validation
          </NavLink>
          <NavLink to="/build/notes" className={linkClass}>
            Notes
          </NavLink>
        </nav>
        <div className={styles.spacer} />
        <button type="button" className={styles.signout} onClick={handleSignOut}>
          Sign out
        </button>
      </header>
      <main className={styles.body}>
        <Outlet />
      </main>
    </div>
  );
}
