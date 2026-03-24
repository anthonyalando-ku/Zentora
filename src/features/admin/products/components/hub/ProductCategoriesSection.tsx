import { useMemo, useState } from "react";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { cn } from "@/shared/utils/cn";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import { useCategories } from "@/features/admin/catalog/categories/hooks/useCategories";
import { useAddProductCategories, useProductCategories, useRemoveProductCategory } from "@/features/admin/products/hooks/useAdminProductHub";

export const ProductCategoriesSection = ({ productId, slug }: { productId: number; slug: string }) => {
  const linkedQuery = useProductCategories(productId);
  const catalogQuery = useCategories();

  const addCats = useAddProductCategories(slug, productId);
  const rmCat = useRemoveProductCategory(slug, productId);

  const [open, setOpen] = useState(false);
  const [catIds, setCatIds] = useState<number[]>([]);

  const linked = linkedQuery.data ?? [];
  const all = catalogQuery.data ?? [];

  const openModal = () => {
    setCatIds(linked.map((c) => c.id));
    setOpen(true);
  };

  const selectedLabel = useMemo(() => new Map(all.map((c: any) => [c.id, c.name])), [all]);

  return (
    <ProductHubSection
      title="Categories"
      description="A product may belong to multiple categories."
      action={
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
        >
          Manage
        </button>
      }
    >
      {linkedQuery.isLoading ? (
        <div className="text-sm text-foreground/60">Loading categories…</div>
      ) : linkedQuery.isError ? (
        <div className="text-sm text-destructive">Failed to load categories.</div>
      ) : linked.length === 0 ? (
        <div className="text-sm text-foreground/60">No categories linked.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {linked.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/5 px-3 py-1 text-xs">
              <span className="font-medium">{c.name}</span>
              <button
                type="button"
                className="w-5 h-5 rounded-full hover:bg-secondary/10 disabled:opacity-50"
                aria-label="Remove category"
                onClick={() => rmCat.mutateAsync(c.id)}
                disabled={rmCat.isPending}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <AdminModal open={open} title="Manage categories" subtitle="Select categories to link to this product." onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="max-h-80 overflow-auto pr-1 space-y-2">
            {all.map((c: any) => {
              const checked = catIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCatIds((prev) => (prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]))}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition",
                    checked ? "border-primary/30 bg-primary/10" : "border-border hover:bg-secondary/10"
                  )}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className={cn("text-xs", checked ? "text-primary font-semibold" : "text-foreground/50")}>
                    {checked ? "Selected" : "Select"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-foreground/50">
            Selected: {catIds.length} {catIds.length ? `(${catIds.map((id) => selectedLabel.get(id) ?? id).join(", ")})` : ""}
          </div>

          <button
            type="button"
            disabled={addCats.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={async () => {
              await addCats.mutateAsync(catIds);
              setOpen(false);
            }}
          >
            {addCats.isPending ? "Saving…" : "Save categories"}
          </button>
        </div>
      </AdminModal>
    </ProductHubSection>
  );
};