import { cn } from "@/shared/utils/cn";

const StatCard = ({
  label,
  value,
  helper,
  icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "info";
}) => {
  const toneCls =
    tone === "success"
      ? "bg-emerald-500/10 border-emerald-500/20"
      : tone === "warning"
        ? "bg-amber-500/10 border-amber-500/20"
        : tone === "info"
          ? "bg-blue-500/10 border-blue-500/20"
          : "bg-background border-border";

  return (
    <div
      className={cn(
        "rounded-2xl border shadow-sm p-4 sm:p-5",
        toneCls,
        "transition-all duration-150 hover:shadow-md hover:-translate-y-[1px]"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-background/70 border border-border flex items-center justify-center text-foreground/70">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-wide text-foreground/55">{label}</div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</div>
          {helper ? <div className="mt-1 text-xs text-foreground/55">{helper}</div> : null}
        </div>
      </div>
    </div>
  );
};


export default StatCard;