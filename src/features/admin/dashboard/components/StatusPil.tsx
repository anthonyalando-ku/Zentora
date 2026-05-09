import { cn } from "@/shared/utils/cn";

const STATUS_CONFIG: Record<
  string,
  { cls: string; dot: string; label: string }
> = {
  pending: {
    cls: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
    dot: "bg-amber-500",
    label: "Pending",
  },
  shipped: {
    cls: "bg-blue-500/10 text-blue-700 ring-blue-500/20",
    dot: "bg-blue-500",
    label: "Shipped",
  },
  delivered: {
    cls: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
    dot: "bg-emerald-500",
    label: "Delivered",
  },
  completed: {
    cls: "bg-primary/10 text-primary ring-primary/20",
    dot: "bg-primary",
    label: "Completed",
  },
  cancelled: {
    cls: "bg-destructive/10 text-destructive ring-destructive/20",
    dot: "bg-destructive",
    label: "Cancelled",
  },
  canceled: {
    cls: "bg-destructive/10 text-destructive ring-destructive/20",
    dot: "bg-destructive",
    label: "Cancelled",
  },
};

const DEFAULT_CONFIG = {
  cls: "bg-secondary/10 text-foreground/70 ring-border",
  dot: "bg-foreground/40",
};

const StatusPill = ({ status }: { status: string }) => {
  const key = String(status ?? "").toLowerCase();
  const cfg = STATUS_CONFIG[key] ?? { ...DEFAULT_CONFIG, label: status };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 text-[11px] font-semibold uppercase tracking-wide",
        cfg.cls
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} aria-hidden="true" />
      {cfg.label}
    </span>
  );
};

export default StatusPill;