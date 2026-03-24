import { Link, useNavigate } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { ProductWizardStepper } from "@/features/admin/products/components/ProductWizardStepper";
import { ProductWizardStepBasic } from "@/features/admin/products/components/ProductWizardStepBasic";
import { ProductWizardStepCategoriesTags } from "@/features/admin/products/components/ProductWizardStepCategoriesTags";
import { ProductWizardStepProductAttributes } from "@/features/admin/products/components/ProductWizardStepProductAttributes";
import { ProductWizardStepVariantBuilder } from "@/features/admin/products/components/ProductWizardStepVariantBuilder";
import { ProductWizardStepImages } from "@/features/admin/products/components/ProductWizardStepImages";
import { ProductWizardStepDiscount } from "@/features/admin/products/components/ProductWizardStepDiscount";
import { useProductWizardStore } from "@/features/admin/products/store/productWizardStore";
import { useCreateProduct } from "@/features/admin/products/hooks/useCreateProduct";
import type { CreateProductPayload } from "@/features/admin/products/api/adminCreateProductApi";

const AdminProductNewPage = () => {
  const navigate = useNavigate();
  const create = useCreateProduct();

  const step = useProductWizardStore((s) => s.step);
  const draft = useProductWizardStore((s) => s.draft);
  const updateDraft = useProductWizardStore((s) => s.updateDraft);
  const nextStep = useProductWizardStore((s) => s.nextStep);
  const prevStep = useProductWizardStore((s) => s.prevStep);
  const resetDraft = useProductWizardStore((s) => s.resetDraft);

  const submitFinal = async () => {
    // Final validation (minimal but aligned with backend)
    if (!draft.name.trim()) return alert("Name is required");
    if (!draft.brand_id) return alert("Brand is required");
    if (!draft.base_price || draft.base_price <= 0) return alert("Base price must be > 0");
    if (!draft.category_ids || draft.category_ids.length === 0) return alert("Select at least one category");
    if (!draft.images || draft.images.length === 0) return alert("Upload at least one image");
    if (!draft.variants || draft.variants.length === 0) return alert("At least one variant is required");

    const badVar = draft.variants.find((v) => !v.sku.trim() || !(Number(v.price) > 0));
    if (badVar) return alert("Each variant must have SKU and price > 0");

    const payload: CreateProductPayload = {
      name: draft.name.trim(),
      description: draft.description ? draft.description : null,
      short_description: draft.short_description ? draft.short_description : null,
      brand_id: draft.brand_id,
      base_price: draft.base_price,
      status: draft.status,
      is_featured: draft.is_featured,
      is_digital: draft.is_digital,
      category_ids: draft.category_ids,
      tag_names: draft.tag_names?.length ? draft.tag_names : undefined,
      attribute_value_ids: draft.attribute_value_ids?.length ? draft.attribute_value_ids : undefined,
      variants: draft.variants.map((v) => ({
        sku: v.sku.trim(),
        price: Number(v.price),
        weight: v.weight ?? undefined,
        is_active: v.is_active,
        attribute_value_ids: v.attribute_value_ids?.length ? v.attribute_value_ids : undefined,
        quantity: Number(v.quantity ?? 0),
        location_id: v.location_id ?? undefined,
      })),
      discount: draft.discount_later || !draft.discount_id ? undefined : { discount_id: draft.discount_id },
    };

    const files = draft.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((x) => x.file);

    try {
      const created = await create.mutateAsync({ payload, images: files });

      // created should be full product detail; slug exists per spec
      const slug = (created as any).slug ?? (created as any)?.data?.slug;
      resetDraft();

      if (slug) navigate(`/admin/products/${slug}`);
      else navigate("/admin/products");
    } catch (e: any) {
      alert(e?.message ?? "Failed to create product");
    }
  };

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="New Product"
        subtitle="Create a product in steps. Submission happens only on the final step."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "New", href: "/admin/products/new" },
        ]}
        action={
          <div className="inline-flex items-center gap-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
            >
              Back to list
            </Link>
            <button
              type="button"
              onClick={() => {
                if (!confirm("Discard draft product data?")) return;
                resetDraft();
                navigate("/admin/products");
              }}
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Discard
            </button>
          </div>
        }
      />

      <ProductWizardStepper step={step} />

      {step === 1 && (
        <ProductWizardStepBasic
          defaultValues={draft}
          onNext={(v) => {
            updateDraft(v);
            nextStep();
          }}
        />
      )}

      {step === 2 && (
        <ProductWizardStepCategoriesTags
          defaultCategoryIds={draft.category_ids}
          defaultTags={draft.tag_names}
          onBack={prevStep}
          onNext={(v) => {
            updateDraft(v);
            nextStep();
          }}
        />
      )}

      {step === 3 && (
        <ProductWizardStepProductAttributes
          defaultSelectedValueIds={draft.attribute_value_ids}
          onBack={prevStep}
          onNext={(v) => {
            updateDraft(v);
            nextStep();
          }}
        />
      )}

      {step === 4 && (
        <ProductWizardStepVariantBuilder
          basePrice={draft.base_price}
          defaultDimensionAttributeIds={draft.variant_dimension_attribute_ids}
          defaultSelectedValueIdsByAttribute={draft.variant_dimension_value_ids}
          defaultVariants={draft.variants}
          onBack={prevStep}
          onNext={(v) => {
            const bad = v.variants.find((x) => !x.sku.trim() || !(Number(x.price) > 0));
            if (bad) {
              alert("Every variant must have a SKU and price > 0.");
              return;
            }
            updateDraft(v);
            nextStep();
          }}
        />
      )}

      {step === 5 && (
        <ProductWizardStepImages
          onBack={prevStep}
          onNext={() => nextStep()}
        />
      )}

      {step === 6 && (
        <ProductWizardStepDiscount
          discountLater={draft.discount_later}
          discountId={draft.discount_id}
          onBack={prevStep}
          isSubmitting={create.isPending}
          onChange={(v) => updateDraft(v)}
          onSubmit={submitFinal}
        />
      )}
    </div>
  );
};

export default AdminProductNewPage;