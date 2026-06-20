export type Priority = "P0" | "P1" | "P2" | "P3";
export type Status = "not_started" | "in_progress" | "done";

export interface Phase {
  id: string;
  order_index: number;
  name: string;
}

export interface Day {
  date: string;
  day_of_week: string;
  phase_id: string;
  focus: string;
  outcome: string;
}

export interface Task {
  id: string;
  day_date: string;
  description: string;
  output: string;
  est_hours: number;
  deadline: string;
  priority: Priority;
  owner: string;
  dependencies: string;
  source: string;
  is_decision: boolean;
  decision_question: string | null;
  status: Status;
  done_at: string | null;
}

export interface Decision {
  id: string;
  task_id: string;
  question: string;
  answer: string | null;
  status: "open" | "resolved";
  decided_by: string | null;
  decided_at: string | null;
}

export interface Note {
  id: string;
  task_id: string | null;
  body: string;
  author: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  label: string;
  target_date: string | null;
  achieved: boolean;
  order_index: number;
}

export interface Settings {
  id: number;
  event_name: string;
  event_date: string | null;
  freeze_date: string | null;
}

export interface Message {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
}
