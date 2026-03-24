import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { useUpdateVariant } from "@/features/admin/products/hooks/useAdminProductHub";
import type { Variant } from "@/features/admin/products/api/adminProductHubApi";

type Values = {
  sku: string;
  price: number;
  weight: number | "";
  is_active: boolean;
};

export const EditVariantModal = ({
  open,
  onClose,
  productId,
  slug,
  variant,
}: {
  open: boolean;
  onClose: () => void;
  productId: number;
  slug: string;
  variant: Variant | null;
}) => {
  const update = useUpdateVariant(slug, productId);

  const { register, handleSubmit, reset, formState } = useForm<Values>({
    defaultValues: { sku: "", price: 0, weight: "", is_active: true },
  });

  useEffect(() => {
    if (!open) return;
    if (!variant) return;

    reset({
      sku: variant.sku,
      price: variant.price,
      weight: variant.weight?.Valid ? variant.weight.Float64 : "",
      is_active: variant.is_active,
    });
  }, [open, variant, reset]);

  const submit = async (v: Values) => {
    if (!variant) return;
    if (!v.sku.trim()) return;
    if (!(Number(v.price) > 0)) return;

    await update.mutateAsync({
      variant_id: variant.id,
      body: {
        sku: v.sku.trim(),
        price: Number(v.price),
        weight: v.weight === "" ? undefined : Number(v.weight),
        is_active: Boolean(v.is_active),
      },
    });

    onClose();
  };

  return (
    <AdminModal open={open} title="Edit variant" subtitle={variant ? `#${variant.id} • ${variant.sku}` : ""} onClose={onClose}>
      {!variant ? (
        <div className="text-sm text-foreground/60">No variant selected.</div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground/60">SKU *</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
              {...register("sku", { required: "SKU is required" })}
            />
            {formState.errors.sku?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.sku.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground/60">Price *</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
                {...register("price", { valueAsNumber: true, min: 0.01 })}
              />
              {formState.errors.price?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.price.message}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-foreground/60">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
                {...register("weight")}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input type="checkbox" className="accent-primary" {...register("is_active")} />
            Active
          </label>

          <button
            type="submit"
            disabled={update.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {update.isPending ? "Saving…" : "Save variant"}
          </button>
        </form>
      )}
    </AdminModal>
  );
};