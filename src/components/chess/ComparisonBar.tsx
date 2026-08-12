type Row = { label: string; value: number; accent: "gold" | "emerald" | "muted" };

export function ComparisonBar({ title, rows, note }: { title: string; rows: Row[]; note: string }) {
  const max = Math.max(1, ...rows.map((r) => Math.abs(r.value)));

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8">
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <div className="mt-6 space-y-5">
        {rows.map((r, i) => {
          const pct = (Math.abs(r.value) / max) * 100;
          const color =
            r.value < 0
              ? "bg-destructive"
              : r.accent === "gold"
                ? "bg-gold"
                : r.accent === "emerald"
                  ? "bg-emerald"
                  : "bg-muted-foreground/50";
          return (
            <div key={r.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-display tabular-nums text-foreground">
                  {Math.round(r.value * 10) / 10}
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary/60">
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ease-out ${color}`}
                  style={{ width: `${Math.max(pct, 2)}%`, transitionDelay: `${i * 60}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}