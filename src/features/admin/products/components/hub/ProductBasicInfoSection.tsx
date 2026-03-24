import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import { useBrands } from "@/features/admin/catalog/brands/hooks/useBrands";
import { useUpdateAdminProduct } from "@/features/admin/products/hooks/useAdminProductHub";
import type { ProductDetail } from "@/features/admin/products/api/adminProductHubApi";

const sqlStr = (v: any) => (v?.Valid ? v.String : "");

type Values = {
  name: string;
  description: string;
  short_description: string;
  brand_id: number | "";
  base_price: number;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  is_digital: boolean;
};

export const ProductBasicInfoSection = ({ product }: { product: ProductDetail }) => {
  const [open, setOpen] = useState(false);

  const brands = useBrands();
  const update = useUpdateAdminProduct(product.slug);

  const defaults: Values = useMemo(
    () => ({
      name: product.name,
      description: sqlStr(product.description),
      short_description: sqlStr(product.short_description),
      brand_id: product.brand_id?.Valid ? product.brand_id.Int64 : "",
      base_price: product.base_price,
      status: product.status,
      is_featured: product.is_featured,
      is_digital: product.is_digital,
    }),
    [product]
  );

  const { register, handleSubmit, reset, formState } = useForm<Values>({ defaultValues: defaults });

  const openModal = () => {
    reset(defaults);
    setOpen(true);
  };

  const submit = async (v: Values) => {
    if (!v.name.trim()) return;
    if (!(Number(v.base_price) > 0)) return;

    await update.mutateAsync({
      id: product.id,
      body: {
        name: v.name.trim(),
        description: v.description ? v.description : null,
        short_description: v.short_description ? v.short_description : null,
        brand_id: v.brand_id === "" ? undefined : Number(v.brand_id),
        base_price: Number(v.base_price),
        status: v.status,
        is_featured: Boolean(v.is_featured),
        is_digital: Boolean(v.is_digital),
      },
    });

    setOpen(false);
  };

  return (
    <ProductHubSection
      title="Basic info"
      description="Core product details."
      action={
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
        >
          Edit
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border p-4">
          <div className="text-xs text-foreground/60">Status</div>
          <div className="text-sm font-semibold mt-1">{product.status}</div>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <div className="text-xs text-foreground/60">Base price</div>
          <div className="text-sm font-semibold mt-1">{product.base_price}</div>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <div className="text-xs text-foreground/60">Flags</div>
          <div className="text-sm font-semibold mt-1">
            {product.is_featured ? "Featured" : "Not featured"} • {product.is_digital ? "Digital" : "Physical"}
          </div>
        </div>
      </div>

      <AdminModal open={open} title="Edit basic info" subtitle="Update product details." onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground/60">Name *</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
              {...register("name", { required: "Name is required" })}
            />
            {formState.errors.name?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground/60">Brand</label>
              <select className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm" {...register("brand_id")}>
                <option value="">None</option>
                {(brands.data ?? []).map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {brands.isLoading && <p className="mt-1 text-xs text-foreground/50">Loading brands…</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-foreground/60">Base price *</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
                {...register("base_price", { valueAsNumber: true, min: 0.01 })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">Short description</label>
            <textarea className="mt-1 w-full min-h-[90px] rounded-xl border border-border bg-background px-3 py-2 text-sm" {...register("short_description")} />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">Description</label>
            <textarea className="mt-1 w-full min-h-[120px] rounded-xl border border-border bg-background px-3 py-2 text-sm" {...register("description")} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="text-xs font-medium text-foreground/60">Status</label>
              <select className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm" {...register("status")}>
                <option value="active">active</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-sm text-foreground/70">
                <input type="checkbox" className="accent-primary" {...register("is_featured")} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground/70">
                <input type="checkbox" className="accent-primary" {...register("is_digital")} />
                Digital
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={update.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {update.isPending ? "Saving…" : "Save changes"}
          </button>
        </form>
      </AdminModal>
    </ProductHubSection>
  );
};