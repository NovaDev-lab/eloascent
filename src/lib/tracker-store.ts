export type DayStat = { elo: number; puzzles: number };
export type TrackerState = { history: Record<string, DayStat> };

const KEY = "chess-elo-tracker-v1";

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const emptyState = (): TrackerState => ({ history: {} });

export function loadState(): TrackerState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as TrackerState;
    if (!parsed || typeof parsed !== "object" || !parsed.history) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

export function saveState(state: TrackerState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

export function lastDays(count: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function dayLabel(key: string) {
  return new Date(key + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });
}