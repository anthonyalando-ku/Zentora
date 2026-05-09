import { cn } from "@/shared/utils/cn";

const toneMap = {
  default: {
    card: "bg-background border-border",
    icon: "bg-secondary/10 text-foreground/60 border-border",
    bar: "",
  },
  success: {
    card: "bg-background border-border",
    icon: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    bar: "after:absolute after:inset-x-0 after:top-0 after:h-[3px] after:rounded-t-2xl after:bg-emerald-500",
  },
  warning: {
    card: "bg-background border-border",
    icon: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    bar: "after:absolute after:inset-x-0 after:top-0 after:h-[3px] after:rounded-t-2xl after:bg-amber-500",
  },
  info: {
    card: "bg-background border-border",
    icon: "bg-primary/10 text-primary border-primary/20",
    bar: "after:absolute after:inset-x-0 after:top-0 after:h-[3px] after:rounded-t-2xl after:bg-primary",
  },
};

const StatCard = ({
  label,
  value,
  helper,
  icon,
  tone = "default",
  trend,
}: {
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "info";
  trend?: { value: number };
}) => {
  const t = toneMap[tone];

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-5 overflow-hidden transition-all duration-150",
        "hover:shadow-md hover:-translate-y-[1px]",
        t.card,
        t.bar
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground/45 truncate">
            {label}
          </p>

          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-[28px] font-bold tracking-tight text-foreground leading-none tabular-nums">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "text-[11px] font-semibold px-1.5 py-0.5 rounded-md",
                  trend.value >= 0
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>

          {helper && (
            <p className="mt-1.5 text-[12px] text-foreground/45 truncate">{helper}</p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center",
              t.icon
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;