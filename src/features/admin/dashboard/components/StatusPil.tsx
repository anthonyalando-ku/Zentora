import { cn } from "@/shared/utils/cn";

const StatusPill = ({ status }: { status: string }) => {
  const s = String(status ?? "").toLowerCase();

  const cfg =
    s === "pending"
      ? { cls: "bg-amber-500/15 text-amber-700 border-amber-500/25", dot: "bg-amber-600", label: "Pending" }
      : s === "shipped"
        ? { cls: "bg-blue-500/15 text-blue-700 border-blue-500/25", dot: "bg-blue-600", label: "Shipped" }
        : s === "delivered"
          ? { cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25", dot: "bg-emerald-600", label: "Delivered" }
          : s === "completed"
            ? { cls: "bg-primary/15 text-primary border-primary/25", dot: "bg-primary", label: "Completed" }
            : s === "cancelled" || s === "canceled"
              ? { cls: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive", label: "Cancelled" }
              : { cls: "bg-secondary/10 text-foreground/70 border-border", dot: "bg-foreground/40", label: status };

  return (
    <span className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-semibold", cfg.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} aria-hidden="true" />
      {cfg.label}
    </span>
  );
};

export default StatusPill;