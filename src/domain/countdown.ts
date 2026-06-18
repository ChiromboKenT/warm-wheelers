export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function timeLeft(targetMs: number, nowMs: number): TimeLeft {
  let delta = Math.floor((targetMs - nowMs) / 1000);
  if (delta <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600);
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60);
  delta -= minutes * 60;
  return { days, hours, minutes, seconds: delta, done: false };
}
