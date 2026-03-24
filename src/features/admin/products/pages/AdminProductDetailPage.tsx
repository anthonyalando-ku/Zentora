import { Link, useParams } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { useAdminProductBySlug } from "@/features/admin/products/hooks/useAdminProductHub";

import { ProductBasicInfoSection } from "@/features/admin/products/components/hub/ProductBasicInfoSection";
import { ProductImagesSection } from "@/features/admin/products/components/hub/ProductImagesSection";
import { ProductCategoriesSection } from "@/features/admin/products/components/hub/ProductCategoriesSection";
import { ProductTagsSection } from "@/features/admin/products/components/hub/ProductTagsSection";
import { ProductAttributesSection } from "@/features/admin/products/components/hub/ProductAttributesSection";
import { ProductVariantsSection } from "@/features/admin/products/components/hub/ProductVariantsSection";
import { ProductDiscountSection } from "@/features/admin/products/components/hub/ProductDiscountSection";

const AdminProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const productQuery = useAdminProductBySlug(slug);

  if (productQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
        Loading product…
      </div>
    );
  }

  const product = productQuery.data;

  if (!product) {
    return (
      <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={product.name}
        subtitle={`/${product.slug}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Detail", href: `/admin/products/${product.slug}` },
        ]}
        action={
          <div className="inline-flex items-center gap-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
            >
              Back
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4">
        <ProductBasicInfoSection product={product} />

        <ProductImagesSection productId={product.id} slug={product.slug} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProductCategoriesSection productId={product.id} slug={product.slug} />
          <ProductTagsSection productId={product.id} slug={product.slug} />
        </div>

        <ProductAttributesSection productId={product.id} slug={product.slug} />

        <ProductVariantsSection productId={product.id} slug={product.slug} />

        <ProductDiscountSection productId={product.id} />
      </div>
    </div>
  );
};

export default AdminProductDetailPage;