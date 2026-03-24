import { useMemo, useState } from "react";
import { useAttributesWithValues } from "@/features/admin/products/hooks/useAttributesWithValues";
import { cn } from "@/shared/utils/cn";

export const ProductWizardStepProductAttributes = ({
  defaultSelectedValueIds,
  onBack,
  onNext,
}: {
  defaultSelectedValueIds: number[];
  onBack: () => void;
  onNext: (v: { attribute_value_ids: number[] }) => void;
}) => {
  const query = useAttributesWithValues();
  const [selected, setSelected] = useState<number[]>(defaultSelectedValueIds);
  const [search, setSearch] = useState("");

  const attrs = useMemo(() => {
    const all = query.data ?? [];
    const productAttrs = all.filter((a) => a.is_variant_dimension === false);
    const q = search.trim().toLowerCase();
    if (!q) return productAttrs;
    return productAttrs.filter((a) => a.name.toLowerCase().includes(q) || a.values.some((v) => v.value.toLowerCase().includes(q)));
  }, [query.data, search]);

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Product attributes</h2>
        <p className="text-sm text-foreground/60 mt-1">
          These describe the product itself (not variant dimensions). Example: Material, Fabric Type.
        </p>
      </div>

      <div className="mt-5">
        <label className="text-xs font-medium text-foreground/60">Search attributes/values</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Search…"
        />
      </div>

      <div className="mt-5 space-y-4">
        {query.isLoading ? (
          <div className="text-sm text-foreground/60">Loading attributes…</div>
        ) : attrs.length === 0 ? (
          <div className="text-sm text-foreground/60">No product-level attributes found.</div>
        ) : (
          attrs.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-sm">{a.name}</div>
                <div className="text-xs text-foreground/50">{a.values.length} values</div>
              </div>

              {a.values.length === 0 ? (
                <div className="mt-3 text-sm text-foreground/60">No values yet for this attribute.</div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.values.map((v) => {
                    const checked = selected.includes(v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => toggle(v.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-xs font-medium transition",
                          checked ? "border-primary/30 bg-primary/10 text-primary" : "border-border hover:bg-secondary/10 text-foreground/70"
                        )}
                      >
                        {v.value}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
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
          onClick={() => onNext({ attribute_value_ids: selected })}
          className="h-11 px-6 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};