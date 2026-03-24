import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import { VariantAttributesModal } from "@/features/admin/products/components/hub/VariantAttributesModal";
import { EditVariantModal } from "@/features/admin/products/components/hub/EditVariantModal";
import { useCreateVariant, useDeleteVariant, useProductVariants } from "@/features/admin/products/hooks/useAdminProductHub";
import type { Variant } from "@/features/admin/products/api/adminProductHubApi";

export const ProductVariantsSection = ({ productId, slug }: { productId: number; slug: string }) => {
  const variantsQuery = useProductVariants(productId);
  const createVar = useCreateVariant(slug, productId);
  const delVar = useDeleteVariant(slug, productId);

  const [openNewVar, setOpenNewVar] = useState(false);
  const [newVar, setNewVar] = useState({ sku: "", price: "", weight: "", is_active: true });

  const [openVarAttrs, setOpenVarAttrs] = useState(false);
  const [attrsVariantId, setAttrsVariantId] = useState<number | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editVariant, setEditVariant] = useState<Variant | null>(null);

  const variants = variantsQuery.data ?? [];

  return (
    <ProductHubSection
      title="Variants"
      description="Manage SKUs, pricing, attributes, and inventory per variant."
      action={
        <button
          type="button"
          onClick={() => setOpenNewVar(true)}
          className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
        >
          New variant
        </button>
      }
    >
      {variantsQuery.isLoading ? (
        <div className="text-sm text-foreground/60">Loading variants…</div>
      ) : variantsQuery.isError ? (
        <div className="text-sm text-destructive">Failed to load variants.</div>
      ) : variants.length === 0 ? (
        <div className="text-sm text-foreground/60">No variants.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1020px] w-full">
            <thead className="bg-secondary/5">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-semibold text-foreground/60">SKU</th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Price</th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Weight</th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Active</th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id} className="border-t border-border hover:bg-secondary/5 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{v.sku}</td>
                  <td className="px-4 py-3 text-sm">{v.price}</td>
                  <td className="px-4 py-3 text-sm">{v.weight?.Valid ? v.weight.Float64 : "—"}</td>
                  <td className="px-4 py-3 text-sm">{v.is_active ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/inventory/variant/${v.id}`}
                        className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-medium inline-flex items-center"
                      >
                        Inventory
                      </Link>

                      <button
                        type="button"
                        className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-medium"
                        onClick={() => {
                          setAttrsVariantId(v.id);
                          setOpenVarAttrs(true);
                        }}
                      >
                        Attributes
                      </button>

                      <button
                        type="button"
                        className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-medium"
                        onClick={() => {
                          setEditVariant(v);
                          setOpenEdit(true);
                        }}
                      >
                        Edit
                      </button>

                      <ConfirmDangerButton
                        disabled={delVar.isPending}
                        confirmText={`Delete variant "${v.sku}"?`}
                        onConfirm={() => delVar.mutateAsync(v.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={openNewVar} title="New variant" subtitle="Create a new SKU for this product." onClose={() => setOpenNewVar(false)}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground/60">SKU *</label>
            <input
              value={newVar.sku}
              onChange={(e) => setNewVar((s) => ({ ...s, sku: e.target.value }))}
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground/60">Price *</label>
              <input
                type="number"
                step="0.01"
                value={newVar.price}
                onChange={(e) => setNewVar((s) => ({ ...s, price: e.target.value }))}
                className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground/60">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={newVar.weight}
                onChange={(e) => setNewVar((s) => ({ ...s, weight: e.target.value }))}
                className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input type="checkbox" className="accent-primary" checked={newVar.is_active} onChange={(e) => setNewVar((s) => ({ ...s, is_active: e.target.checked }))} />
            Active
          </label>

          <button
            type="button"
            disabled={createVar.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={async () => {
              const price = Number(newVar.price);
              if (!newVar.sku.trim()) return alert("SKU is required");
              if (!(price > 0)) return alert("Price must be > 0");

              await createVar.mutateAsync({
                sku: newVar.sku.trim(),
                price,
                weight: newVar.weight ? Number(newVar.weight) : undefined,
                is_active: newVar.is_active,
              });

              setNewVar({ sku: "", price: "", weight: "", is_active: true });
              setOpenNewVar(false);
            }}
          >
            {createVar.isPending ? "Creating…" : "Create variant"}
          </button>
        </div>
      </AdminModal>

      <VariantAttributesModal
        open={openVarAttrs}
        onClose={() => setOpenVarAttrs(false)}
        productId={productId}
        slug={slug}
        variantId={attrsVariantId}
      />

      <EditVariantModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        productId={productId}
        slug={slug}
        variant={editVariant}
      />
    </ProductHubSection>
  );
};