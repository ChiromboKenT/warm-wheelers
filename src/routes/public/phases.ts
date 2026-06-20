/** The fixed 20-phase build structure, shared by the hero telemetry and the journey track. */
export interface PhaseInfo {
  name: string;
  desc: string;
}

export type PhaseState = "done" | "active" | "upcoming";

/**
 * The single phase currently in active development (0-based index into PHASES).
 *
 * This is the one knob the team turns as the build advances:
 *   - every phase *before* it reads as complete ("done"),
 *   - this phase is highlighted as "in development" ("active"),
 *   - every phase *after* it is deactivated / locked ("upcoming").
 *
 * Bump this number when a phase wraps up and the next one begins.
 */
export const ACTIVE_PHASE = 0;

/** Resolve a phase's lifecycle state relative to the active phase. */
export function phaseStateAt(index: number): PhaseState {
  if (index < ACTIVE_PHASE) return "done";
  if (index === ACTIVE_PHASE) return "active";
  return "upcoming";
}

export const PHASES: PhaseInfo[] = [
  { name: "Control Room", desc: "Rules, limits and getting the project organised." },
  { name: "Concept Geometry", desc: "First shapes, working out where the wheels and weight sit." },
  { name: "CAD Setup", desc: "Building the whole cart inside the computer." },
  { name: "Mass & Risk", desc: "Weighing each part and spotting the risks." },
  { name: "Application Package", desc: "The paperwork that gets us on the start list." },
  { name: "Simulation Prep", desc: "Setting up the virtual wind tunnel." },
  { name: "FEA Iteration", desc: "Stress-testing the frame on screen until it holds." },
  { name: "CFD Iteration", desc: "Chasing cleaner airflow, a bit at a time." },
  { name: "Effects & Reliability", desc: "Getting the glow working, and keeping it working." },
  { name: "Integrated Review", desc: "Stepping back to look at the whole cart." },
  { name: "Build Drawings", desc: "Turning the model into parts we can actually cut." },
  { name: "Procurement", desc: "Wheels, steel and foam, getting it all in the door." },
  { name: "Validation Pack", desc: "Checking the design before we cut anything." },
  { name: "Design Freeze", desc: "Pencils down. This is the cart we build." },
  { name: "Build Prep", desc: "Workspace, jigs and tools, laid out and ready." },
  { name: "Rolling Chassis", desc: "Frame, axles and wheels. It rolls for the first time." },
  { name: "Body & Effects", desc: "The heater shell and the glow go on." },
  { name: "Finish & Livery", desc: "Paint, decals and the Warm Wheelers look." },
  { name: "Testing & Tuning", desc: "Shakedown runs for the brakes, the steering and the nerves." },
  { name: "Race Readiness", desc: "Scrutineering, kit check and the start line." },
];
