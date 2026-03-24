import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Combobox } from "@/shared/components/ui/Combobox";
import { useBrands } from "@/features/admin/catalog/brands/hooks/useBrands";
import { useCreateBrand } from "@/features/admin/catalog/brands/hooks/useBrands";
import { slugify } from "@/features/admin/products/utils/slugify";
import type { ProductStatus } from "@/features/admin/products/store/productWizardStore";

type Values = {
  name: string;
  description: string;
  short_description: string;
  brand_id: number | "";
  base_price: number | "";
  status: ProductStatus;
  is_featured: boolean;
  is_digital: boolean;
};

export const ProductWizardStepBasic = ({
  defaultValues,
  onNext,
}: {
  defaultValues: {
    name: string;
    description: string;
    short_description: string;
    brand_id: number | null;
    base_price: number | null;
    status: ProductStatus;
    is_featured: boolean;
    is_digital: boolean;
  };
  onNext: (v: {
    name: string;
    description: string;
    short_description: string;
    brand_id: number;
    base_price: number;
    status: ProductStatus;
    is_featured: boolean;
    is_digital: boolean;
  }) => void;
}) => {
  const brandsQuery = useBrands();
  const createBrand = useCreateBrand();

  const brands = useMemo(() => brandsQuery.data ?? [], [brandsQuery.data]);
  const brandOptions = useMemo(
    () => brands.map((b: any) => ({ value: b.id, label: b.name })),
    [brands]
  );

  const { register, handleSubmit, watch, setError, formState, setValue } = useForm<Values>({
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description,
      short_description: defaultValues.short_description,
      brand_id: defaultValues.brand_id ?? "",
      base_price: defaultValues.base_price ?? "",
      status: defaultValues.status,
      is_featured: defaultValues.is_featured,
      is_digital: defaultValues.is_digital,
    },
  });

  const name = watch("name");
  const slugPreview = slugify(name || "");

  useEffect(() => {
    // no-op; just keeping preview reactive
  }, [slugPreview]);

  const submit = (v: Values) => {
    if (!v.name.trim()) {
      setError("name", { message: "Name is required" });
      return;
    }
    if (v.brand_id === "" || Number(v.brand_id) <= 0) {
      setError("brand_id", { message: "Brand is required" });
      return;
    }
    if (v.base_price === "" || Number(v.base_price) <= 0) {
      setError("base_price", { message: "Base price must be greater than 0" });
      return;
    }

    onNext({
      name: v.name.trim(),
      description: v.description,
      short_description: v.short_description,
      brand_id: Number(v.brand_id),
      base_price: Number(v.base_price),
      status: v.status,
      is_featured: Boolean(v.is_featured),
      is_digital: Boolean(v.is_digital),
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Basic product information</h2>
          <p className="text-sm text-foreground/60 mt-1">Set the core details that define your product.</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-foreground/50">Slug preview</div>
          <div className="text-sm font-medium text-foreground/80 mt-1">/{slugPreview || "your-product"}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground/60">Name *</label>
          <input
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("name")}
            placeholder="e.g. iPhone 15 Pro Max"
          />
          {formState.errors.name?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Combobox
            label="Brand"
            required
            placeholder="Select a brand…"
            value={watch("brand_id") === "" ? null : Number(watch("brand_id"))}
            onChange={(v) => setValue("brand_id", v == null ? "" : (Number(v) as any), { shouldValidate: true })}
            options={brandOptions}
            isLoading={brandsQuery.isLoading}
            error={formState.errors.brand_id?.message}
            createLabel={(q) => `Create brand "${q}"`}
            onCreate={async (q) => {
              const created = await createBrand.mutateAsync({ name: q } as any);
              const id = (created as any)?.id;
              if (id) setValue("brand_id", id as any, { shouldValidate: true });
            }}
          />

          <div>
            <label className="text-xs font-medium text-foreground/60">Base price *</label>
            <input
              type="number"
              step="0.01"
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("base_price", { valueAsNumber: true })}
              placeholder="e.g. 129999"
            />
            {formState.errors.base_price?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.base_price.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Short description</label>
          <textarea
            className="mt-1 w-full min-h-[88px] rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("short_description")}
            placeholder="Brief marketing copy shown in listings."
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Description</label>
          <textarea
            className="mt-1 w-full min-h-[120px] rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("description")}
            placeholder="Long description for product detail page."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div>
            <label className="text-xs font-medium text-foreground/60">Status</label>
            <select
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("status")}
            >
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input type="checkbox" className="accent-primary" {...register("is_featured")} />
              Featured (show on homepage)
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input type="checkbox" className="accent-primary" {...register("is_digital")} />
              Digital product (no shipping)
            </label>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button type="submit" className="inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};