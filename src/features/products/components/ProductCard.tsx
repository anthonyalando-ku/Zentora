import { Link } from "react-router-dom";
import { Badge, Rating, Button } from "@/shared/components/ui";
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
  const phone = "254795974591"; // your WhatsApp business number

  const text = `Hi Zentora, I'm interested in: ${product.name} (KSh ${product.price}) - ${window.location.origin}/products/${product.slug}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-4 h-4", className)}
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
  >
    {/* Simple WhatsApp logo (inline SVG, no external deps) */}
    <path
      fill="currentColor"
      d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"
    />
    <path
      fill="currentColor"
      d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 0 0 6.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 0 1-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 0 1-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 0 1 3.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"
    />
  </svg>
);

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
            <Link to={`/products/${product.slug}`} className="flex-1">
              <Button
                className="w-full"
                size="sm"
                variant="primary"
                aria-label="View product details"
                title="Select a variant on the product page"
              >
                View
              </Button>
            </Link>
          )}

          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noreferrer"
            className={cn(hideAddToCart ? "w-full" : "shrink-0")}
          >
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/50"
              )}
              leftIcon={<WhatsAppIcon className="text-[#25D366]" />}
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
            >
              WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};