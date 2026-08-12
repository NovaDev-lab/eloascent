import { Minus, Plus, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  subtitle: string;
  piece: string;
  value: number;
  today: number;
  accent: "gold" | "emerald";
  formatValue?: (v: number) => string;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  children?: ReactNode;
};

export function CounterCard({
  title,
  subtitle,
  piece,
  value,
  today,
  accent,
  formatValue,
  onIncrement,
  onDecrement,
  onReset,
  children,
}: Props) {
  const accentText = accent === "gold" ? "text-gold" : "text-emerald";
  const ring = accent === "gold" ? "hover:border-gold/60" : "hover:border-emerald/60";

  return (
    <section
      className={`glass-panel group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 sm:p-8 ${ring}`}
    >
      <span className="pointer-events-none absolute -right-6 -top-8 select-none text-[9rem] leading-none text-foreground/5 transition-transform duration-700 group-hover:scale-110">
        {piece}
      </span>

      <header className="relative">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
          {subtitle}
        </p>
        <h2 className="font-display mt-1 text-2xl font-semibold text-foreground">{title}</h2>
      </header>

      <div className="relative mt-6 flex items-end gap-3">
        <span
          key={value}
          className={`animate-pop-in font-display text-6xl font-bold tabular-nums sm:text-7xl ${accentText}`}
        >
          {formatValue ? formatValue(value) : value}
        </span>
        <span className="mb-3 text-sm text-muted-foreground">
          today{" "}
          <strong className={`tabular-nums ${accentText}`}>
            {today > 0 ? `+${today}` : today}
          </strong>
        </span>
      </div>

      <div className="relative mt-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label={`Subtract 1 from ${title}`}
          onClick={onDecrement}
          className="h-14 w-14 rounded-2xl border-border bg-secondary/40 text-foreground transition-transform hover:scale-105 hover:bg-secondary active:scale-95"
        >
          <Minus className="size-6" />
        </Button>
        <Button
          size="icon"
          aria-label={`Add 1 to ${title}`}
          onClick={onIncrement}
          className="h-14 flex-1 rounded-2xl bg-primary text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90 active:scale-95"
        >
          <Plus className="size-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Reset ${title}`}
          onClick={onReset}
          className="h-14 w-14 rounded-2xl text-muted-foreground transition-transform hover:scale-105 hover:text-destructive active:scale-95"
        >
          <RotateCcw className="size-5" />
        </Button>
      </div>

      {children ? <div className="relative mt-6">{children}</div> : null}
    </section>
  );
}