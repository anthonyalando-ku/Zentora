import { cn } from "@/shared/utils/cn";

const steps = [
  { n: 1, label: "Basic Info" },
  { n: 2, label: "Categories & Tags" },
  { n: 3, label: "Product Attributes" },
  { n: 4, label: "Variant Builder" },
  { n: 5, label: "Images" },
  { n: 6, label: "Discount" },
] as const;

export const ProductWizardStepper = ({ step }: { step: number }) => {
  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm font-semibold text-foreground">Create Product</div>
          <div className="text-xs text-foreground/60 mt-0.5">Step {step} of {steps.length}</div>
        </div>

        <div className="flex items-center gap-2">
          {steps.map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold",
                  s.n < step && "bg-primary text-white border-primary/30",
                  s.n === step && "bg-secondary/10 text-foreground border-border",
                  s.n > step && "bg-background text-foreground/50 border-border"
                )}
              >
                {s.n}
              </div>
              <div className={cn("hidden sm:block text-xs", s.n === step ? "text-foreground font-semibold" : "text-foreground/50")}>
                {s.label}
              </div>
              {s.n !== steps.length && <div className="hidden sm:block w-6 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-2">
        {steps.map((s) => (
          <div
            key={`bar-${s.n}`}
            className={cn(
              "h-2 rounded-full border border-border",
              s.n <= step ? "bg-primary/90 border-primary/20" : "bg-secondary/10"
            )}
          />
        ))}
      </div>
    </div>
  );
};