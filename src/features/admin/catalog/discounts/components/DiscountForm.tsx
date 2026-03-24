import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Discount, DiscountType } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";

type Values = {
  name: string;
  code: string;
  discount_type: DiscountType;
  value: number;
  min_order_amount: number | "";
  max_redemptions: number | "";
  starts_at: string; // datetime-local
  ends_at: string;   // datetime-local
  is_active: boolean;
};

const toDatetimeLocal = (iso: string) => {
  // ISO -> yyyy-MM-ddTHH:mm for input[type=datetime-local]
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

export const DiscountForm = ({
  initial,
  isSubmitting,
  onSubmit,
}: {
  initial?: Discount | null;
  isSubmitting: boolean;
  onSubmit: (values: Values) => Promise<void> | void;
}) => {
  const defaults: Values = useMemo(() => {
    return {
      name: initial?.name ?? "",
      code: initial?.code?.Valid ? initial.code.String : "",
      discount_type: initial?.discount_type ?? "percentage",
      value: initial?.value ?? 0,
      min_order_amount: initial?.min_order_amount?.Valid ? Number(initial.min_order_amount.Float64) : "",
      max_redemptions: initial?.max_redemptions?.Valid ? Number(initial.max_redemptions.Int64) : "",
      starts_at: initial?.starts_at?.Valid ? toDatetimeLocal(initial.starts_at.Time) : "",
      ends_at: initial?.ends_at?.Valid ? toDatetimeLocal(initial.ends_at.Time) : "",
      is_active: initial?.is_active ?? true,
    };
  }, [initial]);

  const { register, handleSubmit, setError, watch, formState } = useForm<Values>({
    defaultValues: defaults,
  });

  const type = watch("discount_type");
  const value = watch("value");
  const starts = watch("starts_at");
  const ends = watch("ends_at");

  const submit = async (v: Values) => {
    // validation rules (UI-only, matches backend constraints)
    if (!v.name.trim()) {
      setError("name", { message: "Name is required" });
      return;
    }
    if (!(Number(v.value) > 0)) {
      setError("value", { message: "Value must be greater than 0" });
      return;
    }
    if (v.discount_type === "percentage" && Number(v.value) > 100) {
      setError("value", { message: "Percentage cannot exceed 100" });
      return;
    }
    if (v.starts_at && v.ends_at) {
      const s = new Date(v.starts_at).getTime();
      const e = new Date(v.ends_at).getTime();
      if (e < s) {
        setError("ends_at", { message: "End date cannot be before start date" });
        return;
      }
    }

    await onSubmit(v);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground/60">Name *</label>
          <input
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("name")}
            placeholder="e.g. Summer Sale 20%"
          />
          {formState.errors.name?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.name.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Code (optional)</label>
          <input
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("code")}
            placeholder="e.g. SUMMER20"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Type *</label>
          <select
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("discount_type")}
          >
            <option value="percentage">percentage</option>
            <option value="fixed">fixed</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">
            Value * {type === "percentage" ? "(0–100)" : ""}
          </label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("value", { valueAsNumber: true })}
          />
          {formState.errors.value?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.value.message}</p>}
          {type === "percentage" && Number.isFinite(value) && value > 100 && (
            <p className="mt-1 text-xs text-destructive">Percentage cannot exceed 100.</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Min order amount</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("min_order_amount", { valueAsNumber: true })}
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Max redemptions</label>
          <input
            type="number"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("max_redemptions", { valueAsNumber: true })}
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Starts at</label>
          <input
            type="datetime-local"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("starts_at")}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Ends at</label>
          <input
            type="datetime-local"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("ends_at")}
          />
          {formState.errors.ends_at?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.ends_at.message}</p>}
          {starts && ends && new Date(ends).getTime() < new Date(starts).getTime() && (
            <p className="mt-1 text-xs text-destructive">End date cannot be before start date.</p>
          )}
        </div>

        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-foreground/70">
          <input type="checkbox" className="accent-primary" {...register("is_active")} />
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : initial ? "Update Discount" : "Create Discount"}
      </button>
    </form>
  );
};