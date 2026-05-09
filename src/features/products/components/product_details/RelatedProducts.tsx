import { Link } from "react-router-dom";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { Product } from "@/shared/types/product";

type RelatedProductsProps = {
  products: Product[];
  categoryIdForLink: number | undefined;
};

export const RelatedProducts = ({ products, categoryIdForLink }: RelatedProductsProps) => {
  if (!products.length) return null;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Related products</h2>
          <p className="text-sm text-foreground/50 mt-0.5">You might also like these</p>
        </div>
        <Link
          to={`/products${categoryIdForLink ? `?category_id=${categoryIdForLink}` : ""}`}
          className="text-xs font-semibold text-primary hover:underline hidden sm:inline"
        >
          View all →
        </Link>
      </div>
      <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              hideAddToCart
              className="transition-all hover:-translate-y-1 hover:shadow-md"
            />
          ))}
        </div>
      </div>
    </section>
  );
};