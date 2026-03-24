import { useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useAttributesWithValues } from "@/features/admin/products/hooks/useAttributesWithValues";
import { useInventoryLocations } from "@/features/admin/inventory/hooks/useInventoryLocations";
import { buildVariantDrafts } from "@/features/admin/products/utils/variantCombinations";
import type { VariantDraft } from "@/features/admin/products/store/productWizardStore";

const MAX_VARIANTS = 10;

export const ProductWizardStepVariantBuilder = ({
  basePrice,
  defaultDimensionAttributeIds,
  defaultSelectedValueIdsByAttribute,
  defaultVariants,
  onBack,
  onNext,
}: {
  basePrice: number | null;
  defaultDimensionAttributeIds: number[];
  defaultSelectedValueIdsByAttribute: Record<number, number[]>;
  defaultVariants: VariantDraft[];
  onBack: () => void;
  onNext: (v: {
    variant_dimension_attribute_ids: number[];
    variant_dimension_value_ids: Record<number, number[]>;
    variants: VariantDraft[];
  }) => void;
}) => {
  const attrsQuery = useAttributesWithValues();
  const locationsQuery = useInventoryLocations();

  const allAttrs = attrsQuery.data ?? [];
  const dimensionAttrs = useMemo(() => allAttrs.filter((a) => a.is_variant_dimension === true), [allAttrs]);

  const [dimAttrIds, setDimAttrIds] = useState<number[]>(defaultDimensionAttributeIds);
  const [valueIdsByAttr, setValueIdsByAttr] = useState<Record<number, number[]>>(defaultSelectedValueIdsByAttribute);
  const [variants, setVariants] = useState<VariantDraft[]>(defaultVariants);

  const activeLocations = useMemo(() => (locationsQuery.data ?? []).filter((l) => l.is_active), [locationsQuery.data]);
  const defaultLocationId = activeLocations[0]?.id ?? null;

  const valueIdToLabel = useMemo(() => {
    const map: Record<number, string> = {};
    for (const a of dimensionAttrs) for (const v of a.values) map[v.id] = v.value;
    return map;
  }, [dimensionAttrs]);

  const toggleDimAttr = (attrId: number) => {
    setDimAttrIds((prev) => {
      const next = prev.includes(attrId) ? prev.filter((x) => x !== attrId) : [...prev, attrId];

      // If a dimension is removed, also remove its selected values to avoid stale combos
      if (prev.includes(attrId)) {
        setValueIdsByAttr((p) => {
          const copy = { ...p };
          delete copy[attrId];
          return copy;
        });
      } else {
        setValueIdsByAttr((p) => ({ ...p, [attrId]: p[attrId] ?? [] }));
      }

      return next;
    });
  };

  const toggleValue = (attrId: number, valueId: number) => {
    setValueIdsByAttr((prev) => {
      const existing = prev[attrId] ?? [];
      const next = existing.includes(valueId) ? existing.filter((x) => x !== valueId) : [...existing, valueId];
      return { ...prev, [attrId]: next };
    });
  };

  const computeWouldGenerateCount = () => {
    if (dimAttrIds.length === 0) return 0;
    let count = 1;
    for (const attrId of dimAttrIds) {
      const n = (valueIdsByAttr[attrId] ?? []).length;
      if (n === 0) return 0;
      count *= n;
      if (count > MAX_VARIANTS) return count; // early exit
    }
    return count;
  };

  // ✅ Generate variants without overwriting existing edits, and enforce <= 10 variants
  const generate = () => {
    const count = computeWouldGenerateCount();

    if (count === 0) {
      alert("Select at least one value for each selected dimension before generating variants.");
      return;
    }

    if (count > MAX_VARIANTS) {
      alert(
        `This selection would generate ${count} variants, but the limit is ${MAX_VARIANTS}.\n\nReduce the selected values or dimensions.`
      );
      return;
    }

    const next = buildVariantDrafts({
      dimensionAttributeIds: dimAttrIds,
      selectedValueIdsByAttribute: valueIdsByAttr,
      valueIdToLabel,
      basePrice,
      defaultLocationId,
    });

    // Preserve edits for existing combinations (match by temp_id)
    setVariants((prev) => {
      const prevById = new Map(prev.map((v) => [v.temp_id, v]));

      return next.map((n) => {
        const existing = prevById.get(n.temp_id);
        if (!existing) return n;

        return {
          ...n,
          sku: existing.sku,
          price: existing.price ?? n.price,
          weight: existing.weight,
          is_active: existing.is_active,
          quantity: existing.quantity,
          location_id: existing.location_id,
        };
      });
    });
  };

  const updateVariant = (temp_id: string, patch: Partial<VariantDraft>) => {
    setVariants((prev) => prev.map((v) => (v.temp_id === temp_id ? { ...v, ...patch } : v)));
  };

  const removeVariant = (temp_id: string) => setVariants((prev) => prev.filter((v) => v.temp_id !== temp_id));

  const canContinue = variants.length > 0;

  const generateCount = computeWouldGenerateCount();

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Variant builder</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Select variant dimensions (e.g. Color, Size), pick values, generate combinations (max {MAX_VARIANTS}), then edit SKUs and pricing.
        </p>
      </div>

      {attrsQuery.isLoading ? (
        <div className="mt-6 text-sm text-foreground/60">Loading attributes…</div>
      ) : dimensionAttrs.length === 0 ? (
        <div className="mt-6 text-sm text-foreground/60">
          No variant-dimension attributes found. Mark attributes as <code>is_variant_dimension=true</code> in the backend.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Choose dimensions */}
          <div className="rounded-2xl border border-border p-4">
            <div className="text-sm font-semibold">1) Choose dimensions</div>
            <div className="text-xs text-foreground/50 mt-0.5">Pick attributes like Color, Size</div>

            <div className="mt-3 space-y-2">
              {dimensionAttrs.map((a) => {
                const checked = dimAttrIds.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleDimAttr(a.id)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition text-sm",
                      checked ? "border-primary/30 bg-primary/10" : "border-border hover:bg-secondary/10"
                    )}
                  >
                    <span className="font-medium">{a.name}</span>
                    <span className={cn("text-xs", checked ? "text-primary font-semibold" : "text-foreground/50")}>
                      {checked ? "Selected" : "Select"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose values per dimension */}
          <div className="rounded-2xl border border-border p-4">
            <div className="text-sm font-semibold">2) Choose values</div>
            <div className="text-xs text-foreground/50 mt-0.5">Pick which values participate in combinations</div>

            {dimAttrIds.length === 0 ? (
              <div className="mt-4 text-sm text-foreground/60">Select at least one dimension on the left.</div>
            ) : (
              <div className="mt-3 space-y-4">
                {dimAttrIds.map((attrId) => {
                  const attr = dimensionAttrs.find((x) => x.id === attrId);
                  if (!attr) return null;
                  const selectedIds = valueIdsByAttr[attrId] ?? [];
                  return (
                    <div key={attrId} className="rounded-2xl border border-border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">{attr.name}</div>
                        <div className="text-xs text-foreground/50">{selectedIds.length} selected</div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {attr.values.map((v) => {
                          const checked = selectedIds.includes(v.id);
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => toggleValue(attrId, v.id)}
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
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
              <div className={cn("text-xs", generateCount > MAX_VARIANTS ? "text-destructive" : "text-foreground/50")}>
                {generateCount === 0
                  ? "Select values to see how many variants will be generated."
                  : `Will generate ${generateCount} variant${generateCount === 1 ? "" : "s"} (max ${MAX_VARIANTS}).`}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={generate}
                  className="h-10 px-4 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold disabled:opacity-50"
                  disabled={dimAttrIds.length === 0 || generateCount === 0 || generateCount > MAX_VARIANTS}
                  title={generateCount > MAX_VARIANTS ? `Reduce selections to <= ${MAX_VARIANTS} variants` : undefined}
                >
                  Generate variants
                </button>

                <button
                  type="button"
                  onClick={() => setVariants([])}
                  className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variants table */}
      <div className="mt-6 rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/5 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Generated variants</div>
            <div className="text-xs text-foreground/50 mt-0.5">
              {variants.length} variant{variants.length === 1 ? "" : "s"} • regenerating preserves edits for existing combinations
            </div>
          </div>

          <div className="text-xs text-foreground/50">
            Default location:{" "}
            <span className="font-semibold text-foreground/70">
              {defaultLocationId ? `#${defaultLocationId}` : "None"}
            </span>
          </div>
        </div>

        {variants.length === 0 ? (
          <div className="p-6 text-sm text-foreground/60">No variants generated yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="bg-background">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Variant</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">SKU</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Weight</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Active</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Qty</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Location</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {variants.map((v) => (
                  <tr key={v.temp_id} className="border-t border-border hover:bg-secondary/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{v.name}</div>
                      <div className="text-xs text-foreground/50">
                        {v.attribute_value_ids.map((id) => valueIdToLabel[id] ?? `#${id}`).join(", ")}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <input
                        value={v.sku}
                        onChange={(e) => updateVariant(v.temp_id, { sku: e.target.value })}
                        className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={v.price ?? ""}
                        onChange={(e) => updateVariant(v.temp_id, { price: e.target.value === "" ? null : Number(e.target.value) })}
                        className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={v.weight ?? ""}
                        onChange={(e) => updateVariant(v.temp_id, { weight: e.target.value === "" ? null : Number(e.target.value) })}
                        className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="kg"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 text-sm text-foreground/70">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={v.is_active}
                          onChange={(e) => updateVariant(v.temp_id, { is_active: e.target.checked })}
                        />
                        Active
                      </label>
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={v.quantity ?? ""}
                        onChange={(e) => updateVariant(v.temp_id, { quantity: e.target.value === "" ? null : Number(e.target.value) })}
                        className="w-28 h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={v.location_id ?? ""}
                        onChange={(e) => updateVariant(v.temp_id, { location_id: e.target.value === "" ? null : Number(e.target.value) })}
                        className="w-56 h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select…</option>
                        {activeLocations.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} {l.location_code?.Valid ? `(${l.location_code.String})` : ""}
                          </option>
                        ))}
                      </select>
                      {locationsQuery.isLoading && <div className="text-xs text-foreground/50 mt-1">Loading locations…</div>}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="h-9 px-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition text-xs font-medium"
                        onClick={() => removeVariant(v.temp_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-4 py-3 border-t border-border text-xs text-foreground/50">
              Limit: at most {MAX_VARIANTS} variants can be generated in the wizard.
            </div>
          </div>
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
          disabled={!canContinue}
          onClick={() =>
            onNext({
              variant_dimension_attribute_ids: dimAttrIds,
              variant_dimension_value_ids: valueIdsByAttr,
              variants,
            })
          }
          className="h-11 px-6 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};