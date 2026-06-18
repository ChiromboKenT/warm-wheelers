import { Routes, Route } from "react-router-dom";
import { PublicPage } from "./routes/public/PublicPage";
import { Login } from "./routes/auth/Login";
import { RequireAuth } from "./components/RequireAuth";
import { CockpitLayout } from "./routes/cockpit/CockpitLayout";
import { Dashboard } from "./routes/cockpit/Dashboard";
import { TaskTracker } from "./routes/cockpit/TaskTracker";
import { DecisionsLog } from "./routes/cockpit/DecisionsLog";
import { Notes } from "./routes/cockpit/Notes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
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
        <Route path="notes" element={<Notes />} />
      </Route>
    </Routes>
  );
}
