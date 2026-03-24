import { useMemo } from "react";
import { useDiscounts } from "@/features/admin/products/hooks/useDiscountsList";

export const ProductWizardStepDiscount = ({
  discountLater,
  discountId,
  onBack,
  onSubmit,
  onChange,
  isSubmitting,
}: {
  discountLater: boolean;
  discountId: number | null;
  onBack: () => void;
  onSubmit: () => void;
  onChange: (v: { discount_later: boolean; discount_id: number | null }) => void;
  isSubmitting: boolean;
}) => {
  // For dropdown show active only
  const query = useDiscounts({ active_only: true });
  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Discount linking</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Optionally link an existing discount during creation. You can also set it later.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input
            type="checkbox"
            className="accent-primary"
            checked={discountLater}
            onChange={(e) => onChange({ discount_later: e.target.checked, discount_id: e.target.checked ? null : discountId })}
          />
          Create discount later (skip linking now)
        </label>

        <div className="rounded-2xl border border-border p-4">
          <label className="text-xs font-medium text-foreground/60">Select existing discount</label>
          <select
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            disabled={discountLater}
            value={discountId ?? ""}
            onChange={(e) => onChange({ discount_later: false, discount_id: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">None</option>
            {rows.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.code?.Valid ? `(${d.code.String})` : ""}
              </option>
            ))}
          </select>

          {query.isLoading && <div className="mt-2 text-xs text-foreground/50">Loading discounts…</div>}
          {!query.isLoading && rows.length === 0 && (
            <div className="mt-2 text-xs text-foreground/50">No discounts found. You can create one later.</div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-11 px-6 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
        >
          Back
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="h-11 px-6 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold disabled:opacity-50"
        >
          {isSubmitting ? "Creating…" : "Create Product"}
        </button>
      </div>
    </div>
  );
};