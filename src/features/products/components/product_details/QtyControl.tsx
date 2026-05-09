const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

// ─── QtyControl ──────────────────────────────────────────────────────────────
export const QtyControl = ({
  value,
  onDecrement,
  onIncrement,
  size = "md",
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  size?: "sm" | "md";
}) => {
  const isSmall = size === "sm";
  return (
    <div className={cn(
      "flex items-center rounded-xl overflow-hidden border border-border bg-background",
      isSmall ? "h-10" : "h-11"
    )}>
      <button
        className={cn(
          "flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-secondary/10 transition-colors disabled:opacity-30",
          isSmall ? "w-9 h-full" : "w-11 h-full"
        )}
        onClick={onDecrement}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <svg className={cn(isSmall ? "w-3 h-3" : "w-3.5 h-3.5")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
      <span className={cn(
        "font-semibold text-foreground text-center tabular-nums",
        isSmall ? "w-8 text-sm" : "w-10 text-sm"
      )}>
        {value}
      </span>
      <button
        className={cn(
          "flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-secondary/10 transition-colors disabled:opacity-30",
          isSmall ? "w-9 h-full" : "w-11 h-full"
        )}
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <svg className={cn(isSmall ? "w-3 h-3" : "w-3.5 h-3.5")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

// ─── StockPill ────────────────────────────────────────────────────────────────
export const StockPill = ({
  isLoading,
  inStock,
  qty,
}: {
  isLoading: boolean;
  inStock: boolean;
  qty: number;
}) => {
  if (isLoading) return <span className="text-xs text-foreground/50">Checking…</span>;
  if (!inStock) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
      <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
      Out of stock
    </span>
  );
  if (qty <= 5) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
      Only {qty} left
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      In stock ({qty} available)
    </span>
  );
};