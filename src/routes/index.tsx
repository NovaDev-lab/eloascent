import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ComparisonBar } from "@/components/chess/ComparisonBar";
import { FluidBackground } from "@/components/chess/FluidBackground";
import { CounterCard } from "@/components/chess/CounterCard";
import { GrowthBars } from "@/components/chess/GrowthBars";
import {
  emptyState,
  lastDays,
  loadState,
  saveState,
  todayKey,
  type TrackerState,
} from "@/lib/tracker-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elo Tracker — Chess Rating & Puzzle Streak Log" },
      {
        name: "description",
        content:
          "Track Elo gained and puzzles solved per day with one-tap plus and minus counters, growth bars and daily comparison.",
      },
      { property: "og:title", content: "Elo Tracker — Chess Rating & Puzzle Streak Log" },
      {
        property: "og:description",
        content:
          "Count every Elo point and puzzle you solve, then watch your 7-day growth and daily comparison bars move.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [state, setState] = useState<TrackerState>(emptyState);
  const [ready, setReady] = useState(false);
  const day = todayKey();

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const bump = useCallback(
    (field: "elo" | "puzzles", delta: number) => {
      setState((prev) => {
        const current = prev.history[day] ?? { elo: 0, puzzles: 0 };
        return {
          history: {
            ...prev.history,
            [day]: { ...current, [field]: current[field] + delta },
          },
        };
      });
    },
    [day],
  );

  const reset = useCallback((field: "elo" | "puzzles") => {
    setState((prev) => {
      const history: TrackerState["history"] = {};
      for (const [k, v] of Object.entries(prev.history)) {
        history[k] = { ...v, [field]: 0 };
      }
      return { history };
    });
  }, []);

  const week = useMemo(() => lastDays(7), []);
  const eloDays = week.map((k) => ({ key: k, value: state.history[k]?.elo ?? 0 }));
  const puzzleDays = week.map((k) => ({ key: k, value: state.history[k]?.puzzles ?? 0 }));

  const totals = useMemo(() => {
    let elo = 0;
    let puzzles = 0;
    for (const v of Object.values(state.history)) {
      elo += v.elo;
      puzzles += v.puzzles;
    }
    return { elo, puzzles };
  }, [state]);

  const todayElo = state.history[day]?.elo ?? 0;
  const todayPuzzles = state.history[day]?.puzzles ?? 0;

  const prevSix = week.slice(0, 6);
  const avg = (vals: number[]) =>
    vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const eloAvg = avg(prevSix.map((k) => state.history[k]?.elo ?? 0));
  const puzzleAvg = avg(prevSix.map((k) => state.history[k]?.puzzles ?? 0));
  const bestElo = Math.max(0, ...week.map((k) => state.history[k]?.elo ?? 0));
  const bestPuzzles = Math.max(0, ...week.map((k) => state.history[k]?.puzzles ?? 0));

  return (
    <>
      <FluidBackground />
      <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <header className="text-center">
          <p className="font-display text-xs uppercase tracking-[0.45em] text-muted-foreground">
            ♔ Openings · Tactics · Endgames
          </p>
          <h1 className="font-display text-gradient-gold mt-4 text-4xl font-bold sm:text-6xl">
            Elo &amp; Puzzle Tracker
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Tap once per rating point and once per puzzle. Your board keeps score — day by day.
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <CounterCard
            title="Elo Gained"
            subtitle="Rating ladder"
            piece="♚"
            accent="gold"
            value={totals.elo}
            today={todayElo}
            formatValue={(v) => (v > 0 ? `+${v}` : `${v}`)}
            onIncrement={() => bump("elo", 1)}
            onDecrement={() => bump("elo", -1)}
            onReset={() => reset("elo")}
          />
          <CounterCard
            title="Puzzles Solved"
            subtitle="Today's tactics"
            piece="♘"
            accent="emerald"
            value={todayPuzzles}
            today={todayPuzzles}
            onIncrement={() => bump("puzzles", 1)}
            onDecrement={() => bump("puzzles", -1)}
            onReset={() => reset("puzzles")}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <GrowthBars title="Elo Growth" days={eloDays} accent="gold" unit="rating points per day" />
          <GrowthBars
            title="Puzzle Growth"
            days={puzzleDays}
            accent="emerald"
            unit="puzzles solved per day"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ComparisonBar
            title="Elo — today vs form"
            note="Today measured against your 6-day average and your best day this week."
            rows={[
              { label: "Today", value: todayElo, accent: "gold" },
              { label: "6-day average", value: eloAvg, accent: "muted" },
              { label: "Best day", value: bestElo, accent: "gold" },
            ]}
          />
          <ComparisonBar
            title="Puzzles — today vs form"
            note="Keep today's bar above the average bar to stay on a climbing streak."
            rows={[
              { label: "Today", value: todayPuzzles, accent: "emerald" },
              { label: "6-day average", value: puzzleAvg, accent: "muted" },
              { label: "Best day", value: bestPuzzles, accent: "emerald" },
            ]}
          />
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          {totals.puzzles} puzzles solved all-time · saved on this device
        </footer>
      </main>
    </>
  );
}
