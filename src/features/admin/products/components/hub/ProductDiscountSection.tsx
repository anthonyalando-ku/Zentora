import { useState } from "react";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
//import { useDiscounts } from "@/features/admin/catalog/discounts/hooks/useDiscounts";
import { useDiscounts } from "@/features/admin/products/hooks/useDiscountsList";
import { useSetDiscountTargetsAdmin } from "@/features/admin/catalog/discounts/hooks/useSetDiscountTargetsAdmin";

export const ProductDiscountSection = ({ productId }: { productId: number }) => {
  const discounts = useDiscounts({ active_only: true });
  const setTargets = useSetDiscountTargetsAdmin();

  const [open, setOpen] = useState(false);
  const [discountId, setDiscountId] = useState<number | "">("");

  return (
    <ProductHubSection
      title="Discount targeting"
      description="Link this product to an existing discount."
      action={
        <button
          type="button"
          onClick={() => {
            setDiscountId("");
            setOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
        >
          Link discount
        </button>
      }
    >
      <div className="text-sm text-foreground/60">
        Discounts can target products, categories, and brands. Linking here adds a <code>product</code> target.
      </div>

      <AdminModal open={open} title="Link discount" subtitle="Apply an existing discount to this product." onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <label className="text-xs font-medium text-foreground/60">Discount</label>
          <select
            className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
            value={discountId}
            onChange={(e) => setDiscountId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Select discount…</option>
            {(discounts.data ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.code?.Valid ? `(${d.code.String})` : ""}
              </option>
            ))}
          </select>

          {discounts.isLoading && <div className="text-xs text-foreground/50">Loading discounts…</div>}

          <button
            type="button"
            disabled={discountId === "" || setTargets.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={async () => {
              if (discountId === "") return;
              await setTargets.mutateAsync({
                id: Number(discountId),
                targets: [{ target_type: "product", target_id: productId }],
              });
              setOpen(false);
            }}
          >
            {setTargets.isPending ? "Saving…" : "Link discount"}
          </button>
        </div>
      </AdminModal>
    </ProductHubSection>
  );
};