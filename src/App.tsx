import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicPage } from "./routes/public/PublicPage";
import { Login } from "./routes/auth/Login";

// three.js is heavy — load the preview page only when it's visited
const DesignPreview = lazy(() =>
  import("./routes/preview/DesignPreview").then((m) => ({ default: m.DesignPreview })),
);
import { RequireAuth } from "./components/RequireAuth";
import { CockpitLayout } from "./routes/cockpit/CockpitLayout";
import { Dashboard } from "./routes/cockpit/Dashboard";
import { TaskTracker } from "./routes/cockpit/TaskTracker";
import { DecisionsLog } from "./routes/cockpit/DecisionsLog";
import { Validation } from "./routes/cockpit/Validation";
import { Prep } from "./routes/cockpit/Prep";
import { Notes } from "./routes/cockpit/Notes";

// Shown while the heavy three.js preview chunk downloads — matches the dark render stage.
function PreviewFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeContent: "center",
        justifyItems: "center",
        gap: 14,
        background: "radial-gradient(120% 90% at 50% 30%, #1d150c 0%, #100b06 75%)",
        color: "#98876c",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        fontSize: 11,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 52,
          letterSpacing: "-0.02em",
          color: "#ff8c1a",
        }}
      >
        WW
      </div>
      Loading the 3D preview…
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route
        path="/preview"
        element={
          <Suspense fallback={<PreviewFallback />}>
            <DesignPreview />
          </Suspense>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/build"
        element={
          <RequireAuth>
            <CockpitLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TaskTracker />} />
        <Route path="decisions" element={<DecisionsLog />} />
        <Route path="validation" element={<Validation />} />
        <Route path="prep" element={<Prep />} />
        <Route path="notes" element={<Notes />} />
      </Route>
    </Routes>
  );
}
