import { useEffect, useMemo, useState } from "react";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { useAttributesWithValues } from "@/features/admin/products/hooks/useAttributesWithValues";
import { useVariantAttributeValues, useSetVariantAttributeValues } from "@/features/admin/products/hooks/useAdminProductHub";
import { cn } from "@/shared/utils/cn";

export const VariantAttributesModal = ({
  open,
  onClose,
  productId,
  slug,
  variantId,
}: {
  open: boolean;
  onClose: () => void;
  productId: number;
  slug: string;
  variantId: number | null;
}) => {
  const attrsWithValues = useAttributesWithValues();
  const variantLevelAttrs = useMemo(() => (attrsWithValues.data ?? []).filter((a) => a.is_variant_dimension === true), [attrsWithValues.data]);

  const linkedQuery = useVariantAttributeValues(productId, variantId ?? undefined);
  const setMutation = useSetVariantAttributeValues(slug, productId, variantId ?? 0);

  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (!open) return;
    setSelected((linkedQuery.data ?? []).map((x) => x.id));
  }, [open, linkedQuery.data]);

  return (
    <AdminModal open={open} title="Variant attributes" subtitle="Replace variant-level attribute values." onClose={onClose}>
      {variantId == null ? (
        <div className="text-sm text-foreground/60">No variant selected.</div>
      ) : attrsWithValues.isLoading ? (
        <div className="text-sm text-foreground/60">Loading attributes…</div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-80 overflow-auto pr-1 space-y-3">
            {variantLevelAttrs.map((a) => (
              <div key={a.id} className="rounded-2xl border border-border p-3">
                <div className="text-sm font-semibold">{a.name}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {a.values.map((v) => {
                    const checked = selected.includes(v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelected((prev) => (prev.includes(v.id) ? prev.filter((x) => x !== v.id) : [...prev, v.id]))}
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
            ))}
          </div>

          <button
            type="button"
            disabled={setMutation.isPending || linkedQuery.isLoading}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={async () => {
              await setMutation.mutateAsync(selected);
              onClose();
            }}
          >
            {setMutation.isPending ? "Saving…" : "Save variant attributes"}
          </button>
        </div>
      )}
    </AdminModal>
  );
};