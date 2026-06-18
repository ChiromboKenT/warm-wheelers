# Warm Wheelers Team Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite + React + TypeScript SPA, backed by Supabase, that is the internal source of truth for the Warm Wheelers soapbox build (task tracker, decisions, notes) and a bold public "build in public" showcase (hero, countdown, milestones/progress), deployed on Vercel.

**Architecture:** Single SPA with two route zones — public (`/`) open to all, internal cockpit (`/build`) behind Supabase email/password auth. Data lives in Supabase Postgres, accessed directly from the client via `supabase-js` with Row Level Security (public read, authenticated write) and Realtime for live cockpit sync. No custom backend server.

**Tech Stack:** Vite, React 18, TypeScript, react-router-dom, @supabase/supabase-js, plain CSS with CSS variables + CSS Modules, Vitest for pure-logic unit tests, Vercel for hosting.

**Styling decision:** Plain CSS (design tokens as CSS variables) + CSS Modules per component. No UI framework, for full artistic control and a non-templated look.

---

## Conventions

- Package manager: `npm`.
- Run dev server: `npm run dev` (Vite, http://localhost:5173).
- Type check: `npm run typecheck` (alias for `tsc --noEmit`).
- Tests: `npm run test` (Vitest, run mode).
- Commit after each task. Commit message style: `feat:`, `chore:`, `test:`, `style:`.
- Secrets: Supabase URL + anon key in `.env.local` (gitignored), exposed to the client as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The anon key is safe to ship to the browser; RLS is the boundary.

---

## File Structure

```
.
  .env.local                      # Supabase creds (gitignored)
  .env.example                    # template
  index.html
  vite.config.ts
  tsconfig.json
  package.json
  supabase/
    schema.sql                    # tables + RLS policies (run in Supabase SQL editor)
  seed/
    schedule.json                 # extracted from Vision/soapbox_daily_schedule_interactive.html
    parse.ts                      # pure: schedule.json -> rows for phases/days/tasks/decisions
    parse.test.ts                 # Vitest tests for parse.ts
    seed.ts                       # inserts parsed rows into Supabase (run once with tsx)
  src/
    main.tsx                      # app entry + router
    App.tsx                       # route definitions
    lib/
      supabase.ts                 # supabase client
      types.ts                    # DB row types
    store/
      useSettings.ts
      useTasks.ts
      useDecisions.ts
      useNotes.ts
      useAuth.ts
    domain/
      progress.ts                 # pure: derive metrics/progress/current phase
      progress.test.ts
      countdown.ts                # pure: ms -> {days,hrs,min,sec}
      countdown.test.ts
    components/
      Badge.tsx / Badge.module.css
      ProgressBar.tsx / ProgressBar.module.css
      TaskRow.tsx / TaskRow.module.css
      RequireAuth.tsx
    routes/
      public/
        PublicPage.tsx / PublicPage.module.css
        Hero.tsx / Hero.module.css
        Countdown.tsx / Countdown.module.css
        Milestones.tsx / Milestones.module.css
        StoryTeaser.tsx / StoryTeaser.module.css
        CartHero.tsx / CartHero.module.css   # CSS/SVG gas-heater illustration
      cockpit/
        CockpitLayout.tsx / CockpitLayout.module.css
        Dashboard.tsx / Dashboard.module.css
        TaskTracker.tsx / TaskTracker.module.css
        DecisionsLog.tsx / DecisionsLog.module.css
        Notes.tsx / Notes.module.css
      auth/
        Login.tsx / Login.module.css
    theme/
      tokens.css                  # CSS variables (Sunset Garage + calm cockpit)
    styles/
      global.css                  # reset, base, keyframes (sunburst, flicker, ticker)
```

---

## Task 0: Project scaffold and tooling

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`, `.env.example`, `src/main.tsx`, `src/App.tsx`

- [ ] **Step 1: Initialize git and Vite React-TS app**

Run in the project root:
```bash
git init
npm create vite@latest . -- --template react-ts
```
If the directory is non-empty, choose "Ignore files and continue".

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @supabase/supabase-js react-router-dom
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom tsx
```

- [ ] **Step 3: Add scripts to `package.json`**

In `package.json` `"scripts"`, ensure:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "seed": "tsx seed/seed.ts"
  }
}
```

- [ ] **Step 4: Configure Vite + Vitest**

Create `vite.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

- [ ] **Step 5: Set up `.gitignore` and env template**

Append to `.gitignore`:
```
node_modules
dist
.env.local
.superpowers/
```

Create `.env.example`:
```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

- [ ] **Step 6: Verify scaffold runs**

Run: `npm run dev`
Expected: Vite serves the starter page at http://localhost:5173 with no errors. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React TS app with Supabase + router deps"
```

---

## Task 1: Design tokens and global styles

**Files:**
- Create: `src/theme/tokens.css`, `src/styles/global.css`
- Modify: `src/main.tsx` (import the CSS)

- [ ] **Step 1: Create design tokens**

Create `src/theme/tokens.css`:
```css
:root {
  /* Sunset Garage palette */
  --cream: #f1e0c2;
  --cream-soft: #faf6ee;
  --paper: #ffffff;
  --rust: #c8471f;
  --rust-deep: #b03a14;
  --mustard: #e2b773;
  --amber: #d99a3a;
  --brown: #7a2a12;
  --ink: #2f2a23;
  --muted: #8a7d6a;
  --line: #ece3d2;

  /* priority badge colors */
  --p0-bg: #fbe7e0; --p0-fg: #b03a14;
  --p1-bg: #f6ecd6; --p1-fg: #8a5a14;
  --p2-bg: #e7eef0; --p2-fg: #3a5a60;
  --p3-bg: #eee7d8; --p3-fg: #6b5a3a;

  --font-display: Georgia, "Times New Roman", serif;
  --font-ui: "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-mono: "Courier New", ui-monospace, monospace;

  --radius: 12px;
  --shadow-sticker: 4px 4px 0 rgba(122, 42, 18, 0.25);
}
```

- [ ] **Step 2: Create global styles + keyframes**

Create `src/styles/global.css`:
```css
* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; }
body { font-family: var(--font-ui); color: var(--ink); background: var(--cream-soft); }
a { color: var(--rust); }

@keyframes ww-spin { to { transform: rotate(360deg); } }
@keyframes ww-flick { 0%,100% { opacity: .85; filter: brightness(1); } 50% { opacity: 1; filter: brightness(1.25); } }
@keyframes ww-march { to { transform: translateX(-50%); } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 3: Import CSS in entry**

In `src/main.tsx`, replace the default `index.css` import with:
```ts
import "./theme/tokens.css";
import "./styles/global.css";
```
Delete `src/index.css` and `src/App.css` if present, and remove their imports.

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: page background is warm cream, no console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "style: add Sunset Garage design tokens and global styles"
```

---

## Task 2: Supabase schema and RLS policies

**Files:**
- Create: `supabase/schema.sql`

Prerequisite: create a Supabase project at supabase.com, copy the project URL + anon key into `.env.local`.

- [ ] **Step 1: Write the schema SQL**

Create `supabase/schema.sql`:
```sql
-- Phases
create table phases (
  id text primary key,
  order_index int not null,
  name text not null
);

-- Days
create table days (
  date date primary key,
  day_of_week text not null,
  phase_id text references phases(id),
  focus text,
  outcome text
);

-- Tasks
create table tasks (
  id text primary key,
  day_date date references days(date),
  description text not null,
  output text,
  est_hours numeric,
  deadline date,
  priority text check (priority in ('P0','P1','P2','P3')),
  owner text,
  dependencies text,
  source text,
  is_decision boolean default false,
  decision_question text,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','done')),
  done_at timestamptz
);

-- Decisions (seeded from decision-flagged tasks)
create table decisions (
  id uuid primary key default gen_random_uuid(),
  task_id text references tasks(id),
  question text not null,
  answer text,
  status text not null default 'open' check (status in ('open','resolved')),
  decided_by text,
  decided_at timestamptz
);

-- Notes
create table notes (
  id uuid primary key default gen_random_uuid(),
  task_id text references tasks(id),
  body text not null,
  author text,
  created_at timestamptz not null default now()
);

-- Milestones (public rail)
create table milestones (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  target_date date,
  achieved boolean default false,
  order_index int default 0
);

-- Settings (singleton)
create table settings (
  id int primary key default 1 check (id = 1),
  event_name text default 'Red Bull Soapbox',
  event_date timestamptz,
  freeze_date date,
  constraint settings_singleton check (id = 1)
);
insert into settings (id, event_name) values (1, 'Red Bull Soapbox');
```

- [ ] **Step 2: Add RLS policies (public read, authenticated write)**

Append to `supabase/schema.sql`:
```sql
-- Enable RLS
alter table phases enable row level security;
alter table days enable row level security;
alter table tasks enable row level security;
alter table decisions enable row level security;
alter table notes enable row level security;
alter table milestones enable row level security;
alter table settings enable row level security;

-- Public read on every table
create policy "public read phases" on phases for select using (true);
create policy "public read days" on days for select using (true);
create policy "public read tasks" on tasks for select using (true);
create policy "public read decisions" on decisions for select using (true);
create policy "public read notes" on notes for select using (true);
create policy "public read milestones" on milestones for select using (true);
create policy "public read settings" on settings for select using (true);

-- Authenticated write (insert/update/delete) on every table
create policy "auth write tasks" on tasks for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write decisions" on decisions for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write notes" on notes for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write milestones" on milestones for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write settings" on settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write days" on days for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write phases" on phases for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```

- [ ] **Step 3: Apply schema**

In the Supabase dashboard SQL editor, paste and run the full `supabase/schema.sql`.
Expected: all tables created, RLS enabled, one `settings` row present.

- [ ] **Step 4: Enable Realtime**

In Supabase dashboard → Database → Replication, enable Realtime for `tasks`, `decisions`, `notes`.

- [ ] **Step 5: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add Supabase schema and RLS policies"
```

---

## Task 3: Extract schedule data and write the parser (TDD)

**Files:**
- Create: `seed/schedule.json`, `seed/parse.ts`, `seed/parse.test.ts`

- [ ] **Step 1: Extract the schedule JSON**

Open `Vision/soapbox_daily_schedule_interactive.html`. The line beginning `const schedule = [ ... ];` contains a valid JSON array (all keys quoted). Copy everything between `const schedule = ` and the trailing `;` into a new file `seed/schedule.json`. Verify it parses:
```bash
node -e "console.log(require('./seed/schedule.json').length)"
```
Expected: prints `75` (number of day objects).

- [ ] **Step 2: Write failing parser tests**

Create `seed/parse.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import schedule from "./schedule.json";
import { parseSchedule } from "./parse";

describe("parseSchedule", () => {
  const out = parseSchedule(schedule as any);

  it("extracts unique ordered phases", () => {
    expect(out.phases.length).toBe(13);
    expect(out.phases[0].order_index).toBe(0);
    expect(out.phases[0].name).toContain("Control Room");
  });

  it("extracts one day row per schedule entry", () => {
    expect(out.days.length).toBe(75);
    expect(out.days[0].date).toBe("2026-06-18");
    expect(out.days[0].phase_id).toBe(out.phases[0].id);
  });

  it("extracts all tasks with normalized status", () => {
    expect(out.tasks.length).toBe(179);
    const t1 = out.tasks.find((t) => t.id === "T001")!;
    expect(t1.status).toBe("not_started");
    expect(t1.priority).toBe("P1");
    expect(t1.day_date).toBe("2026-06-18");
  });

  it("derives decisions from decision-flagged tasks", () => {
    const decisionTasks = out.tasks.filter((t) => t.is_decision);
    expect(out.decisions.length).toBe(decisionTasks.length);
    expect(out.decisions.length).toBeGreaterThan(0);
    expect(out.decisions[0].question.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `parse.ts` has no `parseSchedule` export.

- [ ] **Step 4: Implement the parser**

Create `seed/parse.ts`:
```ts
type RawTask = {
  id: string; desc: string; output: string; hours: number;
  deadline: string; priority: string; status: string;
  dependencies: string; decision: string; question: string;
  source: string; owner: string;
};
type RawDay = {
  date: string; day: string; phase: string; focus: string;
  outcome: string; tasks: RawTask[];
};

export type PhaseRow = { id: string; order_index: number; name: string };
export type DayRow = {
  date: string; day_of_week: string; phase_id: string;
  focus: string; outcome: string;
};
export type TaskRow = {
  id: string; day_date: string; description: string; output: string;
  est_hours: number; deadline: string; priority: "P0" | "P1" | "P2" | "P3";
  owner: string; dependencies: string; source: string;
  is_decision: boolean; decision_question: string | null;
  status: "not_started" | "in_progress" | "done";
};
export type DecisionRow = { task_id: string; question: string; status: "open" };

function phaseId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function priorityCode(p: string): "P0" | "P1" | "P2" | "P3" {
  const m = p.match(/P[0-3]/);
  return (m ? m[0] : "P3") as "P0" | "P1" | "P2" | "P3";
}
function statusCode(s: string): "not_started" | "in_progress" | "done" {
  const v = s.toLowerCase();
  if (v.includes("done") || v.includes("complete")) return "done";
  if (v.includes("progress")) return "in_progress";
  return "not_started";
}

export function parseSchedule(schedule: RawDay[]) {
  const phaseMap = new Map<string, PhaseRow>();
  const days: DayRow[] = [];
  const tasks: TaskRow[] = [];
  const decisions: DecisionRow[] = [];

  for (const day of schedule) {
    if (!phaseMap.has(day.phase)) {
      phaseMap.set(day.phase, {
        id: phaseId(day.phase),
        order_index: phaseMap.size,
        name: day.phase,
      });
    }
    const pid = phaseMap.get(day.phase)!.id;
    days.push({
      date: day.date, day_of_week: day.day, phase_id: pid,
      focus: day.focus, outcome: day.outcome,
    });
    for (const t of day.tasks) {
      const isDecision = t.decision === "Yes";
      tasks.push({
        id: t.id, day_date: day.date, description: t.desc, output: t.output,
        est_hours: t.hours, deadline: t.deadline, priority: priorityCode(t.priority),
        owner: t.owner, dependencies: t.dependencies, source: t.source,
        is_decision: isDecision, decision_question: isDecision ? t.question : null,
        status: statusCode(t.status),
      });
      if (isDecision) {
        decisions.push({ task_id: t.id, question: t.question, status: "open" });
      }
    }
  }
  return { phases: [...phaseMap.values()], days, tasks, decisions };
}
```

Also ensure `tsconfig.json` has `"resolveJsonModule": true` and `"esModuleInterop": true`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test`
Expected: PASS — all 4 parse tests green.

- [ ] **Step 6: Commit**

```bash
git add seed/ tsconfig.json
git commit -m "feat: extract schedule data and parser with tests"
```

---

## Task 4: Seed script

**Files:**
- Create: `seed/seed.ts`

- [ ] **Step 1: Write the seed script**

Create `seed/seed.ts`:
```ts
import { createClient } from "@supabase/supabase-js";
import schedule from "./schedule.json";
import { parseSchedule } from "./parse";

const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // service role for seeding only
if (!url || !key) throw new Error("Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, key);

async function main() {
  const { phases, days, tasks, decisions } = parseSchedule(schedule as any);
  for (const [label, rows, table] of [
    ["phases", phases, "phases"],
    ["days", days, "days"],
    ["tasks", tasks, "tasks"],
    ["decisions", decisions, "decisions"],
  ] as const) {
    const { error } = await supabase.from(table).upsert(rows as any);
    if (error) throw new Error(`${label}: ${error.message}`);
    console.log(`seeded ${rows.length} ${label}`);
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Run the seed once**

Get the service role key from Supabase dashboard → Settings → API. Run:
```bash
VITE_SUPABASE_URL="https://YOUR.supabase.co" SUPABASE_SERVICE_ROLE_KEY="YOUR-SERVICE-KEY" npm run seed
```
Expected: prints `seeded 13 phases`, `seeded 75 days`, `seeded 179 tasks`, `seeded N decisions`.

- [ ] **Step 3: Verify in Supabase**

In the Supabase Table editor, confirm `tasks` has 179 rows. Do NOT commit the service role key.

- [ ] **Step 4: Commit**

```bash
git add seed/seed.ts
git commit -m "feat: add Supabase seed script"
```

---

## Task 5: Supabase client and types

**Files:**
- Create: `src/lib/supabase.ts`, `src/lib/types.ts`

- [ ] **Step 1: Create the client**

Create `src/lib/supabase.ts`:
```ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon);
```

- [ ] **Step 2: Create row types**

Create `src/lib/types.ts`:
```ts
export type Priority = "P0" | "P1" | "P2" | "P3";
export type Status = "not_started" | "in_progress" | "done";

export interface Phase { id: string; order_index: number; name: string; }
export interface Day {
  date: string; day_of_week: string; phase_id: string;
  focus: string; outcome: string;
}
export interface Task {
  id: string; day_date: string; description: string; output: string;
  est_hours: number; deadline: string; priority: Priority; owner: string;
  dependencies: string; source: string; is_decision: boolean;
  decision_question: string | null; status: Status; done_at: string | null;
}
export interface Decision {
  id: string; task_id: string; question: string; answer: string | null;
  status: "open" | "resolved"; decided_by: string | null; decided_at: string | null;
}
export interface Note {
  id: string; task_id: string | null; body: string;
  author: string | null; created_at: string;
}
export interface Milestone {
  id: string; label: string; target_date: string | null;
  achieved: boolean; order_index: number;
}
export interface Settings {
  id: number; event_name: string; event_date: string | null; freeze_date: string | null;
}
```

- [ ] **Step 3: Verify types compile**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib
git commit -m "feat: add Supabase client and DB types"
```

---

## Task 6: Data hooks with realtime

**Files:**
- Create: `src/store/useTasks.ts`, `src/store/useDecisions.ts`, `src/store/useNotes.ts`, `src/store/useSettings.ts`

- [ ] **Step 1: Implement `useTasks` with realtime**

Create `src/store/useTasks.ts`:
```ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Task, Status } from "../lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("tasks").select("*").order("id");
    setTasks((data as Task[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("tasks-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const setStatus = useCallback(async (id: string, status: Status) => {
    const done_at = status === "done" ? new Date().toISOString() : null;
    await supabase.from("tasks").update({ status, done_at }).eq("id", id);
  }, []);

  return { tasks, loading, setStatus };
}
```

- [ ] **Step 2: Implement `useDecisions`**

Create `src/store/useDecisions.ts`:
```ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Decision } from "../lib/types";

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase.from("decisions").select("*").order("task_id");
    setDecisions((data as Decision[]) ?? []);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("decisions-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "decisions" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const resolve = useCallback(async (id: string, answer: string, decided_by: string) => {
    await supabase.from("decisions").update({
      answer, status: "resolved", decided_by, decided_at: new Date().toISOString(),
    }).eq("id", id);
  }, []);

  const reopen = useCallback(async (id: string) => {
    await supabase.from("decisions").update({ status: "open" }).eq("id", id);
  }, []);

  return { decisions, resolve, reopen };
}
```

- [ ] **Step 3: Implement `useNotes`**

Create `src/store/useNotes.ts`:
```ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Note } from "../lib/types";

export function useNotes(taskId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);

  const load = useCallback(async () => {
    let q = supabase.from("notes").select("*").order("created_at", { ascending: false });
    q = taskId ? q.eq("task_id", taskId) : q.is("task_id", null);
    const { data } = await q;
    setNotes((data as Note[]) ?? []);
  }, [taskId]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`notes-rt-${taskId ?? "general"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, taskId]);

  const add = useCallback(async (body: string, author: string) => {
    await supabase.from("notes").insert({ task_id: taskId ?? null, body, author });
  }, [taskId]);

  return { notes, add };
}
```

- [ ] **Step 4: Implement `useSettings`**

Create `src/store/useSettings.ts`:
```ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Settings } from "../lib/types";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
    setSettings(data as Settings);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async (patch: Partial<Settings>) => {
    await supabase.from("settings").update(patch).eq("id", 1);
    load();
  }, [load]);

  return { settings, update };
}
```

- [ ] **Step 5: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/store
git commit -m "feat: add realtime data hooks for tasks, decisions, notes, settings"
```

---

## Task 7: Domain logic — progress and countdown (TDD)

**Files:**
- Create: `src/domain/progress.ts`, `src/domain/progress.test.ts`, `src/domain/countdown.ts`, `src/domain/countdown.test.ts`

- [ ] **Step 1: Write failing progress tests**

Create `src/domain/progress.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { deriveMetrics } from "./progress";
import type { Task } from "../lib/types";

const mk = (id: string, status: Task["status"], is_decision = false): Task => ({
  id, day_date: "2026-06-18", description: "", output: "", est_hours: 1,
  deadline: "2026-06-18", priority: "P1", owner: "", dependencies: "",
  source: "", is_decision, decision_question: null, status, done_at: null,
});

describe("deriveMetrics", () => {
  it("counts totals, completed and percentage", () => {
    const m = deriveMetrics([mk("T1", "done"), mk("T2", "not_started"), mk("T3", "done"), mk("T4", "in_progress")]);
    expect(m.total).toBe(4);
    expect(m.completed).toBe(2);
    expect(m.percent).toBe(50);
  });

  it("counts open decisions (decision tasks not done)", () => {
    const m = deriveMetrics([mk("T1", "done", true), mk("T2", "not_started", true)]);
    expect(m.openDecisions).toBe(1);
  });

  it("handles empty list", () => {
    const m = deriveMetrics([]);
    expect(m.total).toBe(0);
    expect(m.percent).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm run test`
Expected: FAIL — no `deriveMetrics`.

- [ ] **Step 3: Implement progress logic**

Create `src/domain/progress.ts`:
```ts
import type { Task } from "../lib/types";

export interface Metrics {
  total: number; completed: number; percent: number; openDecisions: number;
}

export function deriveMetrics(tasks: Task[]): Metrics {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const openDecisions = tasks.filter((t) => t.is_decision && t.status !== "done").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent, openDecisions };
}
```

- [ ] **Step 4: Write failing countdown tests**

Create `src/domain/countdown.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { timeLeft } from "./countdown";

describe("timeLeft", () => {
  it("breaks a future delta into d/h/m/s", () => {
    const now = new Date("2026-06-18T00:00:00Z").getTime();
    const target = new Date("2026-06-20T01:02:03Z").getTime();
    expect(timeLeft(target, now)).toEqual({ days: 2, hours: 1, minutes: 2, seconds: 3, done: false });
  });

  it("clamps past targets to zero and marks done", () => {
    const now = new Date("2026-06-21T00:00:00Z").getTime();
    const target = new Date("2026-06-20T00:00:00Z").getTime();
    expect(timeLeft(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });
});
```

- [ ] **Step 5: Run to verify fail**

Run: `npm run test`
Expected: FAIL — no `timeLeft`.

- [ ] **Step 6: Implement countdown logic**

Create `src/domain/countdown.ts`:
```ts
export interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number; done: boolean;
}

export function timeLeft(targetMs: number, nowMs: number): TimeLeft {
  let delta = Math.floor((targetMs - nowMs) / 1000);
  if (delta <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const days = Math.floor(delta / 86400); delta -= days * 86400;
  const hours = Math.floor(delta / 3600); delta -= hours * 3600;
  const minutes = Math.floor(delta / 60); delta -= minutes * 60;
  return { days, hours, minutes, seconds: delta, done: false };
}
```

- [ ] **Step 7: Run to verify pass**

Run: `npm run test`
Expected: PASS — all progress + countdown tests green.

- [ ] **Step 8: Commit**

```bash
git add src/domain
git commit -m "feat: add progress and countdown domain logic with tests"
```

---

## Task 8: Shared components

**Files:**
- Create: `src/components/Badge.tsx` + `Badge.module.css`, `src/components/ProgressBar.tsx` + `ProgressBar.module.css`

- [ ] **Step 1: Badge component**

Create `src/components/Badge.module.css`:
```css
.badge { display: inline-block; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; margin: 4px 6px 0 0; }
.p0 { background: var(--p0-bg); color: var(--p0-fg); }
.p1 { background: var(--p1-bg); color: var(--p1-fg); }
.p2 { background: var(--p2-bg); color: var(--p2-fg); }
.p3 { background: var(--p3-bg); color: var(--p3-fg); }
.decision { background: #fff; color: var(--rust); border: 1px dashed var(--rust); }
.plain { background: var(--cream); color: var(--brown); }
```

Create `src/components/Badge.tsx`:
```tsx
import styles from "./Badge.module.css";
import type { Priority } from "../lib/types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cls = { P0: styles.p0, P1: styles.p1, P2: styles.p2, P3: styles.p3 }[priority];
  return <span className={`${styles.badge} ${cls}`}>{priority}</span>;
}
export function DecisionBadge() {
  return <span className={`${styles.badge} ${styles.decision}`}>Decision</span>;
}
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className={`${styles.badge} ${styles.plain}`}>{children}</span>;
}
```

- [ ] **Step 2: ProgressBar component**

Create `src/components/ProgressBar.module.css`:
```css
.wrap { height: 9px; background: #efe7d6; border-radius: 999px; overflow: hidden; }
.fill { height: 100%; background: linear-gradient(90deg, var(--mustard), var(--rust)); transition: width .3s; }
```

Create `src/components/ProgressBar.tsx`:
```tsx
import styles from "./ProgressBar.module.css";

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components
git commit -m "feat: add Badge and ProgressBar components"
```

---

## Task 9: Auth — login and route guard

**Files:**
- Create: `src/store/useAuth.ts`, `src/components/RequireAuth.tsx`, `src/routes/auth/Login.tsx` + `Login.module.css`

Prerequisite: in Supabase dashboard → Authentication → Users, create one or more team accounts (email + password). Disable public sign-ups (Authentication → Providers → Email → turn off "Enable sign-ups") so only invited team members exist.

- [ ] **Step 1: Auth hook**

Create `src/store/useAuth.ts`:
```ts
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();

  return { session, ready, signIn, signOut };
}
```

- [ ] **Step 2: Route guard**

Create `src/components/RequireAuth.tsx`:
```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const { session, ready } = useAuth();
  if (!ready) return null;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}
```

- [ ] **Step 3: Login page**

Create `src/routes/auth/Login.module.css`:
```css
.wrap { min-height: 100vh; display: grid; place-items: center; background: var(--cream-soft); }
.card { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 28px; width: 320px; }
.card h1 { font-family: var(--font-display); color: var(--brown); margin: 0 0 4px; }
.card input { width: 100%; padding: 10px 12px; margin-top: 10px; border: 1px solid var(--line); border-radius: 8px; font: inherit; }
.card button { width: 100%; margin-top: 14px; padding: 10px; background: var(--rust); color: #fff; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; }
.err { color: var(--rust); font-size: 13px; margin-top: 10px; }
```

Create `src/routes/auth/Login.tsx`:
```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import styles from "./Login.module.css";

export function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) setErr(error.message); else nav("/build");
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={submit}>
        <h1>Warm Wheelers</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>Team sign-in</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Enter the workshop</button>
        {err && <div className={styles.err}>{err}</div>}
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/store/useAuth.ts src/components/RequireAuth.tsx src/routes/auth
git commit -m "feat: add team auth, login page, and route guard"
```

---

## Task 10: Routing and app shell

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`
- Create: `src/routes/cockpit/CockpitLayout.tsx` + `CockpitLayout.module.css`

- [ ] **Step 1: Router entry**

Replace `src/main.tsx` body with:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./theme/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 2: Route definitions**

Replace `src/App.tsx` with:
```tsx
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
      <Route path="/build" element={<RequireAuth><CockpitLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TaskTracker />} />
        <Route path="decisions" element={<DecisionsLog />} />
        <Route path="notes" element={<Notes />} />
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 3: Cockpit layout with nav**

Create `src/routes/cockpit/CockpitLayout.module.css`:
```css
.shell { min-height: 100vh; background: var(--cream-soft); }
.top { display: flex; align-items: center; gap: 18px; padding: 12px 18px; background: var(--paper); border-bottom: 1px solid var(--line); }
.brand { font-family: var(--font-display); font-weight: 700; }
.brand b { color: var(--rust); }
.nav { display: flex; gap: 14px; }
.nav a { text-decoration: none; color: var(--muted); font-size: 14px; font-weight: 600; }
.nav a.active { color: var(--rust); }
.spacer { margin-left: auto; }
.signout { background: none; border: 1px solid var(--line); border-radius: 8px; padding: 6px 12px; cursor: pointer; color: var(--ink); }
.body { padding: 18px; max-width: 1100px; margin: 0 auto; }
```

Create `src/routes/cockpit/CockpitLayout.tsx`:
```tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import styles from "./CockpitLayout.module.css";

export function CockpitLayout() {
  const { signOut } = useAuth();
  const nav = useNavigate();
  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : "");
  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <span className={styles.brand}>Warm <b>Wheelers</b></span>
        <nav className={styles.nav}>
          <NavLink to="/build" end className={cls}>Dashboard</NavLink>
          <NavLink to="/build/tasks" className={cls}>Tasks</NavLink>
          <NavLink to="/build/decisions" className={cls}>Decisions</NavLink>
          <NavLink to="/build/notes" className={cls}>Notes</NavLink>
        </nav>
        <div className={styles.spacer} />
        <button className={styles.signout} onClick={async () => { await signOut(); nav("/"); }}>Sign out</button>
      </header>
      <main className={styles.body}><Outlet /></main>
    </div>
  );
}
```

- [ ] **Step 4: Verify (with temporary stubs)**

Create minimal stub exports so it compiles; these are fully implemented in later tasks. Temporarily create each of `Dashboard.tsx`, `TaskTracker.tsx`, `DecisionsLog.tsx`, `Notes.tsx`, `PublicPage.tsx` exporting a placeholder, e.g.:
```tsx
export function Dashboard() { return <div>Dashboard</div>; }
```
Run: `npm run dev`, visit `/login`, sign in with a team account, confirm redirect to `/build` and the nav renders.
Expected: cockpit shell renders; unauthenticated visit to `/build` redirects to `/login`.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx src/routes/cockpit/CockpitLayout.tsx src/routes/cockpit/CockpitLayout.module.css
git commit -m "feat: add routing and cockpit layout shell"
```

---

## Task 11: Cockpit dashboard (metrics + settings)

**Files:**
- Replace stub: `src/routes/cockpit/Dashboard.tsx` + create `Dashboard.module.css`

- [ ] **Step 1: Implement the dashboard**

Create `src/routes/cockpit/Dashboard.module.css`:
```css
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.met { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
.met .l { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
.met .v { font-size: 26px; font-weight: 800; }
.met .v.accent { color: var(--rust); }
.setting { margin-top: 18px; background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 14px; }
.setting input { font: inherit; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; }
.setting button { margin-left: 8px; padding: 8px 12px; background: var(--rust); color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
@media (max-width: 720px) { .metrics { grid-template-columns: 1fr 1fr; } }
```

Create `src/routes/cockpit/Dashboard.tsx`:
```tsx
import { useState } from "react";
import { useTasks } from "../../store/useTasks";
import { useSettings } from "../../store/useSettings";
import { deriveMetrics } from "../../domain/progress";
import { ProgressBar } from "../../components/ProgressBar";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const { tasks } = useTasks();
  const { settings, update } = useSettings();
  const m = deriveMetrics(tasks);
  const [date, setDate] = useState("");

  return (
    <div>
      <div className={styles.metrics}>
        <div className={styles.met}><div className="l">Total tasks</div><div className={styles.v}>{m.total}</div></div>
        <div className={styles.met}><div className="l">Completed</div><div className={styles.v}>{m.completed}</div></div>
        <div className={styles.met}><div className="l">Open decisions</div><div className={`${styles.v} ${styles.accent}`}>{m.openDecisions}</div></div>
        <div className={styles.met}><div className="l">Progress</div><div className={styles.v}>{m.percent}%</div><ProgressBar percent={m.percent} /></div>
      </div>
      <div className={styles.setting}>
        <strong>Event date (countdown target):</strong>{" "}
        {settings?.event_date ? new Date(settings.event_date).toLocaleString() : "not set (TBD)"}
        <div style={{ marginTop: 8 }}>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={() => date && update({ event_date: new Date(date).toISOString() })}>Save</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, sign in, view `/build`.
Expected: metrics reflect seeded data (Total 179), progress bar renders, event date editable.

- [ ] **Step 3: Commit**

```bash
git add src/routes/cockpit/Dashboard.tsx src/routes/cockpit/Dashboard.module.css
git commit -m "feat: cockpit dashboard with live metrics and event-date setting"
```

---

## Task 12: Task tracker (TaskRow + filters + today)

**Files:**
- Create: `src/components/TaskRow.tsx` + `TaskRow.module.css`
- Replace stub: `src/routes/cockpit/TaskTracker.tsx` + create `TaskTracker.module.css`

- [ ] **Step 1: TaskRow component**

Create `src/components/TaskRow.module.css`:
```css
.row { display: grid; grid-template-columns: 22px 1fr auto; gap: 12px; align-items: start; padding: 11px 14px; border-top: 1px solid var(--line); }
.cb { width: 18px; height: 18px; border: 2px solid #cbbfa8; border-radius: 5px; margin-top: 2px; cursor: pointer; background: none; }
.cb.on { background: var(--rust); border-color: var(--rust); }
.title { font-weight: 500; line-height: 1.35; font-size: 14px; }
.title.done { color: var(--muted); text-decoration: line-through; }
.owner { font-size: 11px; color: var(--muted); text-align: right; white-space: nowrap; }
.status { font: inherit; font-size: 12px; border: 1px solid var(--line); border-radius: 6px; padding: 2px 6px; margin-top: 6px; }
```

Create `src/components/TaskRow.tsx`:
```tsx
import { PriorityBadge, DecisionBadge } from "./Badge";
import type { Task, Status } from "../lib/types";
import styles from "./TaskRow.module.css";

export function TaskRow({ task, onStatus }: { task: Task; onStatus: (id: string, s: Status) => void }) {
  const done = task.status === "done";
  return (
    <div className={styles.row}>
      <button
        className={`${styles.cb} ${done ? styles.on : ""}`}
        aria-label={`Toggle ${task.id} done`}
        onClick={() => onStatus(task.id, done ? "not_started" : "done")}
      />
      <div>
        <div className={`${styles.title} ${done ? styles.done : ""}`}>{task.id} · {task.description}</div>
        <PriorityBadge priority={task.priority} />
        {task.is_decision && <DecisionBadge />}
        <div>
          <select className={styles.status} value={task.status} onChange={(e) => onStatus(task.id, e.target.value as Status)}>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div className={styles.owner}>{task.owner}</div>
    </div>
  );
}
```

- [ ] **Step 2: Task tracker with filters and day grouping**

Create `src/routes/cockpit/TaskTracker.module.css`:
```css
.controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.controls input, .controls select { font: inherit; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; }
.controls input { flex: 1; min-width: 200px; }
.day { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 14px; }
.dh { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-left: 3px solid var(--rust); }
.phase { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--rust); font-weight: 700; }
.focus { font-weight: 600; font-size: 14px; }
.prog { margin-left: auto; font-size: 12px; color: var(--muted); }
```

Create `src/routes/cockpit/TaskTracker.tsx`:
```tsx
import { useMemo, useState } from "react";
import { useTasks } from "../../store/useTasks";
import { supabase } from "../../lib/supabase";
import { useEffect } from "react";
import { TaskRow } from "../../components/TaskRow";
import type { Day, Phase } from "../../lib/types";
import styles from "./TaskTracker.module.css";

export function TaskTracker() {
  const { tasks, setStatus } = useTasks();
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("");
  const [phase, setPhase] = useState("");
  const [decisionsOnly, setDecisionsOnly] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    supabase.from("days").select("*").order("date").then(({ data }) => setDays((data as Day[]) ?? []));
    supabase.from("phases").select("*").order("order_index").then(({ data }) => setPhases((data as Phase[]) ?? []));
  }, []);

  const visibleByDay = useMemo(() => {
    return days.map((d) => {
      const dayTasks = tasks.filter((t) => t.day_date === d.date).filter((t) => {
        if (priority && t.priority !== priority) return false;
        if (phase && d.phase_id !== phase) return false;
        if (decisionsOnly && !t.is_decision) return false;
        if (todayOnly && d.date !== today) return false;
        if (q) {
          const hay = `${t.id} ${t.description} ${t.output} ${d.focus}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      });
      return { day: d, dayTasks };
    }).filter((x) => x.dayTasks.length > 0);
  }, [days, tasks, q, priority, phase, decisionsOnly, todayOnly, today]);

  return (
    <div>
      <div className={styles.controls}>
        <input placeholder="Search tasks…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={phase} onChange={(e) => setPhase(e.target.value)}>
          <option value="">All phases</option>
          {phases.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option>P0</option><option>P1</option><option>P2</option><option>P3</option>
        </select>
        <label><input type="checkbox" checked={decisionsOnly} onChange={(e) => setDecisionsOnly(e.target.checked)} /> Decisions</label>
        <label><input type="checkbox" checked={todayOnly} onChange={(e) => setTodayOnly(e.target.checked)} /> Today</label>
      </div>
      {visibleByDay.map(({ day, dayTasks }) => {
        const doneCount = dayTasks.filter((t) => t.status === "done").length;
        const ph = phases.find((p) => p.id === day.phase_id);
        return (
          <section key={day.date} className={styles.day}>
            <div className={styles.dh}>
              <div style={{ fontWeight: 700, color: "var(--muted)" }}>{day.day_of_week} {day.date.slice(8)}</div>
              <div><div className={styles.phase}>{ph?.name}</div><div className={styles.focus}>{day.focus}</div></div>
              <div className={styles.prog}>{doneCount}/{dayTasks.length} done</div>
            </div>
            {dayTasks.map((t) => <TaskRow key={t.id} task={t} onStatus={setStatus} />)}
          </section>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, go to `/build/tasks`.
Expected: day cards render with seeded tasks; checkbox toggles status and persists (refresh to confirm); filters and search narrow the list; open the same page in a second browser/tab and confirm a status change in one reflects in the other (realtime).

- [ ] **Step 3: Commit**

```bash
git add src/components/TaskRow.tsx src/components/TaskRow.module.css src/routes/cockpit/TaskTracker.tsx src/routes/cockpit/TaskTracker.module.css
git commit -m "feat: task tracker with filters, day grouping, realtime status"
```

---

## Task 13: Decisions log

**Files:**
- Replace stub: `src/routes/cockpit/DecisionsLog.tsx` + create `DecisionsLog.module.css`

- [ ] **Step 1: Implement decisions log**

Create `src/routes/cockpit/DecisionsLog.module.css`:
```css
.item { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin-bottom: 12px; }
.item.open { border-left: 3px solid var(--rust); }
.item.resolved { opacity: .75; }
.q { font-weight: 600; }
.meta { font-size: 12px; color: var(--muted); margin-top: 4px; }
.answer { width: 100%; margin-top: 8px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; font: inherit; min-height: 54px; }
.btn { margin-top: 8px; padding: 8px 12px; background: var(--rust); color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
.btn.ghost { background: none; color: var(--ink); border: 1px solid var(--line); margin-left: 8px; }
```

Create `src/routes/cockpit/DecisionsLog.tsx`:
```tsx
import { useState } from "react";
import { useDecisions } from "../../store/useDecisions";
import { useAuth } from "../../store/useAuth";
import styles from "./DecisionsLog.module.css";

export function DecisionsLog() {
  const { decisions, resolve, reopen } = useDecisions();
  const { session } = useAuth();
  const author = session?.user.email ?? "team";
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div>
      {decisions.map((d) => (
        <div key={d.id} className={`${styles.item} ${d.status === "open" ? styles.open : styles.resolved}`}>
          <div className={styles.q}>{d.task_id} · {d.question}</div>
          <div className={styles.meta}>
            {d.status === "resolved"
              ? `Resolved by ${d.decided_by ?? "team"}${d.decided_at ? " · " + new Date(d.decided_at).toLocaleDateString() : ""}`
              : "Open"}
          </div>
          {d.status === "resolved" && d.answer && <div className={styles.meta}>Answer: {d.answer}</div>}
          {d.status === "open" ? (
            <>
              <textarea className={styles.answer} placeholder="Record the decision…"
                value={drafts[d.id] ?? ""} onChange={(e) => setDrafts({ ...drafts, [d.id]: e.target.value })} />
              <button className={styles.btn} onClick={() => resolve(d.id, drafts[d.id] ?? "", author)}>Resolve</button>
            </>
          ) : (
            <button className={`${styles.btn} ${styles.ghost}`} onClick={() => reopen(d.id)}>Reopen</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, go to `/build/decisions`.
Expected: decision-flagged items listed; resolving one records answer + author and moves it to resolved; reopen works; changes persist on refresh.

- [ ] **Step 3: Commit**

```bash
git add src/routes/cockpit/DecisionsLog.tsx src/routes/cockpit/DecisionsLog.module.css
git commit -m "feat: decisions log with resolve/reopen"
```

---

## Task 14: Notes (general + per-task)

**Files:**
- Replace stub: `src/routes/cockpit/Notes.tsx` + create `Notes.module.css`

- [ ] **Step 1: Implement general notes**

Create `src/routes/cockpit/Notes.module.css`:
```css
.composer { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 14px; }
.composer textarea { width: 100%; min-height: 70px; border: 1px solid var(--line); border-radius: 8px; padding: 10px; font: inherit; }
.composer button { margin-top: 8px; padding: 8px 14px; background: var(--rust); color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
.note { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; margin-top: 10px; }
.note .meta { font-size: 12px; color: var(--muted); margin-top: 6px; }
```

Create `src/routes/cockpit/Notes.tsx`:
```tsx
import { useState } from "react";
import { useNotes } from "../../store/useNotes";
import { useAuth } from "../../store/useAuth";
import styles from "./Notes.module.css";

export function Notes() {
  const { notes, add } = useNotes(); // general notes (task_id null)
  const { session } = useAuth();
  const author = session?.user.email ?? "team";
  const [body, setBody] = useState("");

  return (
    <div>
      <div className={styles.composer}>
        <textarea placeholder="Team note, link, blocker, idea…" value={body} onChange={(e) => setBody(e.target.value)} />
        <button onClick={async () => { if (body.trim()) { await add(body.trim(), author); setBody(""); } }}>Post note</button>
      </div>
      {notes.map((n) => (
        <div key={n.id} className={styles.note}>
          <div>{n.body}</div>
          <div className={styles.meta}>{n.author ?? "team"} · {new Date(n.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
```

Note: the per-task notes UI reuses the same `useNotes(taskId)` hook and can be added to `TaskRow` in phase 2; v1 ships general notes.

- [ ] **Step 2: Verify**

Run: `npm run dev`, go to `/build/notes`, post a note.
Expected: note appears immediately, persists on refresh, and shows in a second tab (realtime).

- [ ] **Step 3: Commit**

```bash
git add src/routes/cockpit/Notes.tsx src/routes/cockpit/Notes.module.css
git commit -m "feat: general team notes with realtime"
```

---

## Task 15: Public — CartHero illustration

**Files:**
- Create: `src/routes/public/CartHero.tsx` + `CartHero.module.css`

- [ ] **Step 1: Build the CSS/SVG cart with flickering grille**

Create `src/routes/public/CartHero.module.css`:
```css
.cart { position: relative; width: 320px; height: 210px; }
.road { position: absolute; left: 0; right: 0; bottom: 36px; height: 6px; background: var(--brown); border-radius: 3px; opacity: .5; }
.body { position: absolute; left: 60px; bottom: 42px; width: 180px; height: 124px; transform: skewX(-8deg);
  background: linear-gradient(160deg, #8a7f6e, #6f6553); border: 3px solid #4a4a46; border-radius: 10px 24px 6px 6px; }
.grille { position: absolute; left: 76px; bottom: 60px; width: 42px; height: 74px; display: flex; flex-direction: column; gap: 6px; transform: skewX(-8deg); }
.gp { flex: 1; border-radius: 4px; background: linear-gradient(#ffd27a, #ff7a18); animation: ww-flick 2.2s ease-in-out infinite; }
.gp:nth-child(2) { animation-delay: .5s; } .gp:nth-child(3) { animation-delay: 1s; }
.w { position: absolute; bottom: 16px; width: 56px; height: 56px; border-radius: 50%; background: #5c5b55; border: 4px solid #3d3d3a; }
.w.f { left: 60px; } .w.r { right: 36px; }
.w i { position: absolute; inset: 18px; border-radius: 50%; background: #b4b2a9; display: block; }
```

Create `src/routes/public/CartHero.tsx`:
```tsx
import styles from "./CartHero.module.css";

export function CartHero() {
  return (
    <div className={styles.cart} aria-label="Gas-heater soapbox cart">
      <div className={styles.road} />
      <div className={styles.body} />
      <div className={styles.grille}>
        <div className={styles.gp} /><div className={styles.gp} /><div className={styles.gp} />
      </div>
      <div className={`${styles.w} ${styles.f}`}><i /></div>
      <div className={`${styles.w} ${styles.r}`}><i /></div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/public/CartHero.tsx src/routes/public/CartHero.module.css
git commit -m "feat: animated CSS gas-heater cart hero illustration"
```

---

## Task 16: Public — Countdown

**Files:**
- Create: `src/routes/public/Countdown.tsx` + `Countdown.module.css`

- [ ] **Step 1: Build the countdown component**

Create `src/routes/public/Countdown.module.css`:
```css
.label { font-family: var(--font-ui); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--rust); font-weight: 700; }
.units { display: flex; gap: 10px; margin-top: 6px; }
.u { background: var(--brown); color: #ffe8cf; border-radius: 10px; padding: 8px 12px; text-align: center; box-shadow: var(--shadow-sticker); }
.u b { display: block; font-family: var(--font-mono); font-size: 30px; line-height: 1; }
.u span { font-family: var(--font-ui); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; opacity: .85; }
.tbd { font-family: var(--font-ui); color: var(--brown); }
```

Create `src/routes/public/Countdown.tsx`:
```tsx
import { useEffect, useState } from "react";
import { timeLeft } from "../../domain/countdown";
import styles from "./Countdown.module.css";

export function Countdown({ targetIso }: { targetIso: string | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!targetIso) return <div className={styles.tbd}>Event date to be confirmed.</div>;
  const t = timeLeft(new Date(targetIso).getTime(), now);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      <div className={styles.label}>{t.done ? "We have ignition" : "Ignition in"}</div>
      <div className={styles.units}>
        <div className={styles.u}><b>{t.days}</b><span>days</span></div>
        <div className={styles.u}><b>{pad(t.hours)}</b><span>hrs</span></div>
        <div className={styles.u}><b>{pad(t.minutes)}</b><span>min</span></div>
        <div className={styles.u}><b>{pad(t.seconds)}</b><span>sec</span></div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/public/Countdown.tsx src/routes/public/Countdown.module.css
git commit -m "feat: public live countdown"
```

---

## Task 17: Public — Milestones rail

**Files:**
- Create: `src/routes/public/Milestones.tsx` + `Milestones.module.css`

- [ ] **Step 1: Build the marching milestones rail**

Create `src/routes/public/Milestones.module.css`:
```css
.rail { position: relative; background: #fff7e9; border: 1px solid #e6cf9f; border-radius: 12px; overflow: hidden; }
.track { display: flex; gap: 26px; padding: 10px 16px; white-space: nowrap; width: max-content; font-size: 13px; color: var(--brown); animation: ww-march 24s linear infinite; }
.track b { color: var(--rust); }
```

Create `src/routes/public/Milestones.tsx`:
```tsx
import styles from "./Milestones.module.css";

export function Milestones({ items }: { items: string[] }) {
  const doubled = [...items, ...items]; // seamless loop
  return (
    <div className={styles.rail}>
      <div className={styles.track}>
        {doubled.map((m, i) => <span key={i} dangerouslySetInnerHTML={{ __html: m }} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/public/Milestones.tsx src/routes/public/Milestones.module.css
git commit -m "feat: public milestones ticker rail"
```

---

## Task 18: Public — page assembly (hero + story teaser)

**Files:**
- Replace stub: `src/routes/public/PublicPage.tsx` + create `PublicPage.module.css`, `src/routes/public/StoryTeaser.tsx` + `StoryTeaser.module.css`

- [ ] **Step 1: Story teaser**

Create `src/routes/public/StoryTeaser.module.css`:
```css
.wrap { max-width: 1000px; margin: 26px auto; padding: 0 22px; }
.wrap h2 { font-family: var(--font-display); color: var(--brown); }
.card { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 18px; color: var(--muted); }
```

Create `src/routes/public/StoryTeaser.tsx`:
```tsx
import styles from "./StoryTeaser.module.css";

export function StoryTeaser({ phaseName }: { phaseName: string }) {
  return (
    <section className={styles.wrap}>
      <h2>The build, in the open</h2>
      <div className={styles.card}>
        Currently in <strong>{phaseName}</strong>. Full build-in-public story, photos and lessons land here soon —
        follow along as a domestic gas heater becomes a gravity racer.
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Assemble the public page**

Create `src/routes/public/PublicPage.module.css`:
```css
.hero { position: relative; overflow: hidden; min-height: 460px;
  background: radial-gradient(120% 120% at 70% 10%, #f7e3bd 0%, #efcf95 40%, #e3a85a 100%); color: var(--ink); }
.sun { position: absolute; left: 50%; top: -200px; width: 620px; height: 620px; margin-left: -310px; border-radius: 50%;
  background: repeating-conic-gradient(rgba(200,71,31,.16) 0 9deg, transparent 9deg 18deg); animation: ww-spin 90s linear infinite; }
.halftone { position: absolute; inset: 0; background-image: radial-gradient(rgba(122,42,18,.18) 1.1px, transparent 1.3px);
  background-size: 11px 11px; mix-blend-mode: multiply; opacity: .5; }
.inner { position: relative; max-width: 1000px; margin: 0 auto; padding: 30px 22px; display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center; }
.cap { font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: #9a3412; font-weight: 700; }
.title { font-family: var(--font-display); font-size: 62px; line-height: .92; font-weight: 800; color: var(--brown); margin: 2px 0 0; text-shadow: 2px 2px 0 rgba(255,255,255,.35); }
.sub { font-size: 14px; color: #6b3a1c; max-width: 430px; margin: 8px 0 18px; }
.railwrap { max-width: 1000px; margin: -10px auto 0; padding: 0 22px; position: relative; z-index: 2; }
.adminlink { position: absolute; top: 14px; right: 18px; font-size: 12px; color: #9a3412; text-decoration: none; }
@media (max-width: 720px) { .inner { grid-template-columns: 1fr; } .title { font-size: 44px; } }
```

Create `src/routes/public/PublicPage.tsx`:
```tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../store/useTasks";
import { useSettings } from "../../store/useSettings";
import { deriveMetrics } from "../../domain/progress";
import { Countdown } from "./Countdown";
import { Milestones } from "./Milestones";
import { CartHero } from "./CartHero";
import { StoryTeaser } from "./StoryTeaser";
import styles from "./PublicPage.module.css";

export function PublicPage() {
  const { tasks } = useTasks();
  const { settings } = useSettings();
  const m = deriveMetrics(tasks);

  const { railItems, currentPhase } = useMemo(() => {
    const done = tasks.filter((t) => t.status === "done");
    const lastDone = done[done.length - 1];
    const next = tasks.find((t) => t.status !== "done");
    return {
      currentPhase: next ? "the build" : "race readiness",
      railItems: [
        `<b>${m.percent}%</b> built`,
        lastDone ? `Latest: <b>${lastDone.id}</b> done` : "Build starting soon",
        next ? `Up next: <b>${next.id}</b>` : "Race ready",
        `<b>${m.completed}</b> of <b>${m.total}</b> tasks complete`,
      ],
    };
  }, [tasks, m]);

  return (
    <div>
      <header className={styles.hero}>
        <div className={styles.sun} />
        <div className={styles.halftone} />
        <Link to="/build" className={styles.adminlink}>Team →</Link>
        <div className={styles.inner}>
          <div>
            <div className={styles.cap}>{settings?.event_name ?? "Red Bull Soapbox"} · Build in public</div>
            <h1 className={styles.title}>WARM<br />WHEELERS</h1>
            <p className={styles.sub}>A domestic gas heater, raked low and let loose on gravity. Follow the build from blank floor to start line.</p>
            <Countdown targetIso={settings?.event_date ?? null} />
          </div>
          <CartHero />
        </div>
      </header>
      <div className={styles.railwrap}><Milestones items={railItems} /></div>
      <StoryTeaser phaseName={currentPhase} />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, visit `/`.
Expected: bold hero renders with rotating sunburst, flickering grille, live countdown (or "to be confirmed" if no event date), milestone rail reflects real task counts, "Team →" links to `/build`. Toggle a task in the cockpit and confirm the public percent updates (realtime).

- [ ] **Step 4: Commit**

```bash
git add src/routes/public
git commit -m "feat: public showcase page (hero, countdown, milestones, story teaser)"
```

---

## Task 19: Accessibility, responsive, and reduced-motion pass

**Files:**
- Modify: any component CSS as needed (verification task)

- [ ] **Step 1: Reduced-motion check**

In OS settings (or DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`), confirm the sunburst, flicker, and ticker stop animating (the global rule in Task 1 handles this). Expected: no motion.

- [ ] **Step 2: Responsive check**

In DevTools device toolbar at 375px width, verify: public hero stacks (title above cart), cockpit metrics become 2 columns, task controls wrap. Fix any overflow with the existing `@media` blocks.

- [ ] **Step 3: Contrast/keyboard check**

Tab through `/build/tasks`: checkboxes (buttons) and selects are focusable; confirm the rust-on-cream text passes basic readability. Adjust token usage if any text is too light.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "style: responsive and reduced-motion polish"
```

---

## Task 20: Deploy to Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: SPA rewrite config**

Create `vercel.json` (so client routes like `/build` resolve on refresh):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Push to GitHub**

```bash
git add vercel.json
git commit -m "chore: add Vercel SPA rewrite config"
# create a GitHub repo, then:
git remote add origin https://github.com/YOUR-ORG/warm-wheelers.git
git push -u origin main
```

- [ ] **Step 3: Import into Vercel**

In Vercel: New Project → import the repo → framework preset "Vite". Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Production + Preview). Deploy.

- [ ] **Step 4: Verify production**

Visit the Vercel URL. Expected: public page loads with live data; `/build` redirects to `/login`; signing in with a team account loads the cockpit; a status change persists and appears on the public page.

- [ ] **Step 5: Final commit (if any tweaks)**

```bash
git add -A
git commit -m "chore: production deployment config"
```

---

## Self-Review

**Spec coverage:**
- Two zones (public + internal) → Tasks 10, 11–14 (cockpit), 15–18 (public). ✓
- Central data store + realtime → Tasks 2, 5, 6. ✓
- Task tracker (migrate 179 tasks) → Tasks 3, 4, 12. ✓
- Decisions log → Task 13. ✓
- Notes → Task 14 (general; per-task hook ready, full UI is phase 2 per spec). ✓
- Auth (team login) → Task 9. ✓
- Countdown → Tasks 7, 16; event_date editable → Task 11. ✓
- Milestones + overall progress → Tasks 7, 17, 18. ✓
- Story teaser → Task 18. ✓
- Sunset Garage visual system + calm cockpit + reduced motion → Tasks 1, 11–18, 19. ✓
- Deploy on Vercel → Task 20. ✓
- Phase-2 items (docs hub, full timeline, cart build viz, story feed, gallery) intentionally excluded. ✓

**Placeholder scan:** No "TBD/TODO" in implementation steps; the only "TBD" is the event date, which is intentionally modeled as an editable setting. ✓

**Type consistency:** `Task`, `Decision`, `Note`, `Settings`, `Status`, `Priority` defined in Task 5 and used consistently. `deriveMetrics` (Task 7) and `timeLeft` (Task 7) match their callers (Tasks 11, 16, 18). Hooks `useTasks().setStatus`, `useDecisions().resolve/reopen`, `useNotes().add`, `useSettings().update` match component usage. ✓
