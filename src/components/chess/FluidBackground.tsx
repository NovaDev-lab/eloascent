export function FluidBackground() {
  const pieces = ["♞", "♜", "♝", "♛", "♚", "♟"];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="bg-fluid-a absolute -left-1/4 -top-1/4 h-[80vh] w-[80vw] rounded-full" />
      <div className="bg-fluid-b absolute -bottom-1/4 -right-1/4 h-[85vh] w-[85vw] rounded-full" />
      <div className="bg-fluid-c absolute left-1/4 top-1/3 h-[70vh] w-[70vw] rounded-full" />
      <div className="bg-chessboard absolute inset-0 opacity-60" />
      {pieces.map((p, i) => (
        <span
          key={p}
          className="animate-float-piece absolute select-none text-primary/10"
          style={{
            left: `${8 + i * 16}%`,
            top: `${(i % 3) * 28 + 8}%`,
            fontSize: `${90 + (i % 3) * 50}px`,
            animationDelay: `${i * 1.4}s`,
            animationDuration: `${8 + i}s`,
          }}
        >
          {p}
        </span>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
    </div>
  );
}