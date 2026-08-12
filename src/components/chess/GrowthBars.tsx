import { dayLabel } from "@/lib/tracker-store";

type Props = {
  title: string;
  days: { key: string; value: number }[];
  accent: "gold" | "emerald";
  unit: string;
};

export function GrowthBars({ title, days, accent, unit }: Props) {
  const max = Math.max(1, ...days.map((d) => Math.abs(d.value)));
  const barBg = accent === "gold" ? "bg-gold" : "bg-emerald";

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">last 7 days</p>
      </div>
      <div className="mt-6 flex h-44 items-end gap-2 sm:gap-4">
        {days.map((d, i) => {
          const height = (Math.abs(d.value) / max) * 100;
          const negative = d.value < 0;
          return (
            <div key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs tabular-nums text-muted-foreground">
                {d.value > 0 ? `+${d.value}` : d.value}
              </span>
              <div
                className={`w-full rounded-t-xl transition-[height] duration-700 ease-out ${
                  negative ? "bg-destructive" : barBg
                } ${d.value === 0 ? "opacity-25" : "opacity-90"}`}
                style={{
                  height: `${Math.max(height, 4)}%`,
                  transitionDelay: `${i * 45}ms`,
                }}
              />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {dayLabel(d.key)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Measured in {unit}</p>
    </div>
  );
}