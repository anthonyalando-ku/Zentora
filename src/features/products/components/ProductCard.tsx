import { Link } from "react-router-dom";
import { Badge, Rating } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import type { Product } from "@/shared/types/product";

type ProductCardProps = {
  product: Product;
  className?: string;
  hideAddToCart?: boolean;
  /** Visual-only wishlist button (no API calls yet) */
  showWishlist?: boolean;
};

const buildWhatsAppUrl = (product: Product) => {
  const text = `Hi Zentora, I'm interested in: ${product.name} (${product.price}) - ${window.location.origin}/products/${product.slug}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export const ProductCard = ({
  product,
  className,
  hideAddToCart = false,
  showWishlist = false,
}: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-background rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={product.badge}>{product.badge}</Badge>
        </div>
      )}

      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="sale">-{discount}%</Badge>
        </div>
      )}

      {showWishlist && (
        <button
          type="button"
          aria-label="Add to wishlist"
          title="Wishlist (coming soon)"
          className="absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background/95 backdrop-blur hover:bg-secondary/10 transition"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <svg
            className="w-4 h-4 text-foreground/70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        </button>
      )}

      <Link to={`/products/${product.slug}`} className="block overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        <Rating value={product.rating} showCount reviewCount={product.reviewCount} className="mb-2" />

        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-base text-primary">KSh {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-foreground/40 line-through">KSh {product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* CTA Row */}
        <div className="flex gap-2">
          {!hideAddToCart && (
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-9 px-3 text-xs bg-primary text-white hover:opacity-90"
              aria-label="View product details"
              title="Select a variant on the product page"
            >
              View
            </Link>
          )}

          <a
            className={cn(
              "inline-flex items-center justify-center rounded-md font-medium transition h-9 px-3 text-xs border border-border bg-transparent text-foreground hover:bg-secondary/10",
              hideAddToCart ? "w-full" : "shrink-0"
            )}
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};