import type { Decision, Status, Task } from "../lib/types";

export type TaskStatusLookup = ReadonlyMap<string, Pick<Task, "id" | "status">>;

export interface TaskTransitionContext {
  tasksById?: TaskStatusLookup;
  decisionStatus?: Decision["status"] | null;
}

export interface TaskTransitionResult {
  allowed: boolean;
  reason: string | null;
}

const TASK_ID_PATTERN = /\bT\d{3,}\b/g;

export function dependencyTaskIds(dependencies: string): string[] {
  return Array.from(new Set(dependencies.match(TASK_ID_PATTERN) ?? []));
}

export function validateTaskStatusTransition(
  task: Task,
  nextStatus: Status,
  context: TaskTransitionContext = {},
): TaskTransitionResult {
  if (task.status === nextStatus) {
    return { allowed: true, reason: null };
  }

  if (task.status === "done" && nextStatus === "not_started") {
    return {
      allowed: false,
      reason: "Reopen to in progress before moving back to not started.",
    };
  }

  if (nextStatus !== "done") {
    return { allowed: true, reason: null };
  }

  if (task.status === "not_started") {
    return {
      allowed: false,
      reason: "Move this task to in progress before marking it done.",
    };
  }

  if (task.is_decision && context.decisionStatus !== "resolved") {
    return {
      allowed: false,
      reason: "Resolve the linked decision before marking this task done.",
    };
  }

  const directDependencies = dependencyTaskIds(task.dependencies);
  const incompleteDependencies = directDependencies.filter((id) => {
    const dependency = context.tasksById?.get(id);
    return dependency ? dependency.status !== "done" : true;
  });

  if (incompleteDependencies.length > 0) {
    return {
      allowed: false,
      reason: `Complete dependencies first: ${incompleteDependencies.join(", ")}.`,
    };
  }

  return { allowed: true, reason: null };
}

export function nextQuickStatus(status: Status): Status {
  if (status === "done") return "in_progress";
  if (status === "in_progress") return "done";
  return "in_progress";
}
