import { useMemo, useState } from "react";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import type { Discount, DiscountTargetInput, DiscountTargetType } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";
import { useCategories } from "@/features/admin/catalog/categories/hooks/useCategories";
import { useBrands } from "@/features/admin/catalog/brands/hooks/useBrands";

type DraftTarget = { target_type: DiscountTargetType; target_id: number; label: string };

const filterList = (q: string, items: Array<{ id: any; name: string }>) => {
  const t = q.trim().toLowerCase();
  if (!t) return items;
  return items.filter((x) => x.name.toLowerCase().includes(t) || String(x.id).includes(t));
};

export const DiscountTargetsModal = ({
  open,
  discount,
  onClose,
  isSaving,
  onSave,
}: {
  open: boolean;
  discount: Discount | null;
  onClose: () => void;
  isSaving: boolean;
  onSave: (targets: DiscountTargetInput[]) => Promise<void> | void;
}) => {
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();

  const [targetType, setTargetType] = useState<DiscountTargetType>("category");
  const [search, setSearch] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [draftTargets, setDraftTargets] = useState<DraftTarget[]>([]);

  const categories = useMemo(() => filterList(search, (categoriesQuery.data ?? []).map((c: any) => ({ id: c.id, name: c.name }))), [
    search,
    categoriesQuery.data,
  ]);

  const brands = useMemo(() => filterList(search, (brandsQuery.data ?? []).map((b: any) => ({ id: b.id, name: b.name }))), [
    search,
    brandsQuery.data,
  ]);

  const addTarget = (t: DraftTarget) => {
    setDraftTargets((prev) => {
      const exists = prev.some((x) => x.target_type === t.target_type && x.target_id === t.target_id);
      if (exists) return prev;
      return [...prev, t];
    });
  };

  const removeTarget = (t: DraftTarget) => {
    setDraftTargets((prev) => prev.filter((x) => !(x.target_type === t.target_type && x.target_id === t.target_id)));
  };

  return (
    <AdminModal
      open={open}
      title={`Discount Targets${discount ? ` — ${discount.name}` : ""}`}
      subtitle="Select where this discount applies. Category and brand targeting are supported. Product is placeholder for now."
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-xs font-medium text-foreground/60">Target type</label>
            <select
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={targetType}
              onChange={(e) => {
                setTargetType(e.target.value as DiscountTargetType);
                setSearch("");
                setProductId("");
              }}
            >
              <option value="product">product</option>
              <option value="category">category</option>
              <option value="brand">brand</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground/60">
              {targetType === "product" ? "Product ID (placeholder)" : "Search"}
            </label>

            {targetType === "product" ? (
              <div className="mt-1 flex gap-2">
                <input
                  className="flex-1 h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Enter product ID"
                />
                <button
                  type="button"
                  className="h-11 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
                  onClick={() => {
                    const n = Number(productId);
                    if (!Number.isFinite(n) || n <= 0) return;
                    addTarget({ target_type: "product", target_id: n, label: `Product #${n}` });
                    setProductId("");
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <input
                className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${targetType}s…`}
              />
            )}
          </div>
        </div>

        {/* Picker list */}
        {targetType !== "product" && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="max-h-60 overflow-auto p-2">
              {targetType === "category" ? (
                categoriesQuery.isLoading ? (
                  <div className="p-3 text-sm text-foreground/60">Loading categories…</div>
                ) : categories.length === 0 ? (
                  <div className="p-3 text-sm text-foreground/60">No categories found.</div>
                ) : (
                  categories.map((c) => (
                    <button
                      key={String(c.id)}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 transition flex items-center justify-between"
                      onClick={() => addTarget({ target_type: "category", target_id: Number(c.id), label: `${c.name} (Category)` })}
                    >
                      <span className="text-sm font-medium">{c.name}</span>
                      <span className="text-xs text-foreground/50">#{c.id}</span>
                    </button>
                  ))
                )
              ) : brandsQuery.isLoading ? (
                <div className="p-3 text-sm text-foreground/60">Loading brands…</div>
              ) : brands.length === 0 ? (
                <div className="p-3 text-sm text-foreground/60">No brands found.</div>
              ) : (
                brands.map((b) => (
                  <button
                    key={String(b.id)}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 transition flex items-center justify-between"
                    onClick={() => addTarget({ target_type: "brand", target_id: Number(b.id), label: `${b.name} (Brand)` })}
                  >
                    <span className="text-sm font-medium">{b.name}</span>
                    <span className="text-xs text-foreground/50">#{b.id}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Draft targets */}
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Selected targets</div>
              <div className="text-xs text-foreground/60 mt-0.5">You can add multiple targets before saving.</div>
            </div>
            <button
              type="button"
              className="text-xs text-destructive hover:underline disabled:opacity-60"
              disabled={draftTargets.length === 0}
              onClick={() => setDraftTargets([])}
            >
              Clear
            </button>
          </div>

          {draftTargets.length === 0 ? (
            <div className="mt-3 text-sm text-foreground/60">No targets selected.</div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {draftTargets.map((t) => (
                <span
                  key={`${t.target_type}:${t.target_id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/5 px-3 py-1 text-xs"
                >
                  <span className="font-medium">{t.label}</span>
                  <button
                    type="button"
                    className="w-5 h-5 rounded-full hover:bg-secondary/10"
                    aria-label="Remove target"
                    onClick={() => removeTarget(t)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={isSaving || !discount}
          className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
          onClick={async () => {
            if (!discount) return;
            const payload: DiscountTargetInput[] = draftTargets.map((t) => ({ target_type: t.target_type, target_id: t.target_id }));
            await onSave(payload);
            onClose();
          }}
        >
          {isSaving ? "Saving…" : "Save Targets"}
        </button>
      </div>
    </AdminModal>
  );
};