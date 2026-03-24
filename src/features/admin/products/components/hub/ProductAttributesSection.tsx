import { useMemo, useState } from "react";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import { useAttributesWithValues } from "@/features/admin/products/hooks/useAttributesWithValues";
import { useProductAttributeValues, useSetProductAttributeValues } from "@/features/admin/products/hooks/useAdminProductHub";
import { cn } from "@/shared/utils/cn";

export const ProductAttributesSection = ({ productId, slug }: { productId: number; slug: string }) => {
  const attrsWithValues = useAttributesWithValues();
  const linkedQuery = useProductAttributeValues(productId);
  const setAttrs = useSetProductAttributeValues(slug, productId);

  const productLevelAttrs = useMemo(
    () => (attrsWithValues.data ?? []).filter((a) => a.is_variant_dimension === false),
    [attrsWithValues.data]
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const linked = linkedQuery.data ?? [];

  const openModal = () => {
    setSelected(linked.map((x) => x.id));
    setOpen(true);
  };

  const linkedLabel = linked.length === 0 ? "None" : `${linked.length} selected`;

  return (
    <ProductHubSection
      title="Attributes"
      description="Product-level attribute value selections (not variant dimensions)."
      action={
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
        >
          Manage attributes
        </button>
      }
    >
      {linkedQuery.isLoading ? (
        <div className="text-sm text-foreground/60">Loading attributes…</div>
      ) : linkedQuery.isError ? (
        <div className="text-sm text-destructive">Failed to load product attributes.</div>
      ) : (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-foreground/60">
            Current: <span className="font-semibold text-foreground/80">{linkedLabel}</span>
          </div>

          {linked.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {linked.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center rounded-full border border-border bg-secondary/5 px-3 py-1 text-xs font-medium"
                >
                  {a.value ? `${a.value}` : a.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      )}

      <AdminModal
        open={open}
        title="Manage attributes"
        subtitle="Replace product-level attribute values."
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4">
          {attrsWithValues.isLoading ? (
            <div className="text-sm text-foreground/60">Loading attribute definitions…</div>
          ) : attrsWithValues.isError ? (
            <div className="text-sm text-destructive">Failed to load attribute definitions.</div>
          ) : productLevelAttrs.length === 0 ? (
            <div className="text-sm text-foreground/60">No product-level attributes available.</div>
          ) : (
            <div className="max-h-80 overflow-auto pr-1 space-y-3">
              {productLevelAttrs.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{a.name}</div>
                    <div className="text-xs text-foreground/50">{a.values.length} values</div>
                  </div>

                  {a.values.length === 0 ? (
                    <div className="mt-2 text-sm text-foreground/60">No values for this attribute.</div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {a.values.map((v) => {
                        const checked = selected.includes(v.id);
                        const text = (v.value ?? "").toString().trim();

                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() =>
                              setSelected((prev) => (prev.includes(v.id) ? prev.filter((x) => x !== v.id) : [...prev, v.id]))
                            }
                            className={cn(
                              "px-3 py-1.5 rounded-full border text-xs font-medium transition min-w-[44px] text-center",
                              checked
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border hover:bg-secondary/10 text-foreground/70"
                            )}
                            title={text || `Value #${v.id}`}
                          >
                            {text || `#${v.id}`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={setAttrs.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={async () => {
              await setAttrs.mutateAsync(selected);
              setOpen(false);
            }}
          >
            {setAttrs.isPending ? "Saving…" : "Save attributes"}
          </button>
        </div>
      </AdminModal>
    </ProductHubSection>
  );
};