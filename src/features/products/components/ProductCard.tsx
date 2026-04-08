import { Link } from "react-router-dom";
import { Badge, Rating, Button } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import type { Product } from "@/shared/types/product";

type ProductCardProps = {
  product: Product;
  className?: string;
  hideAddToCart?: boolean;
  showWishlist?: boolean;
};

const buildWhatsAppUrl = (product: Product) => {
  const phone = "254795974591";
  const text = `Hi Zentora, I'm interested in: ${product.name} (KSh ${product.price}) - ${window.location.origin}/products/${product.slug}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-4 h-4", className)} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"/>
    <path fill="currentColor" d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 0 0 6.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 0 1-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 0 1-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 0 1 3.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
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
    // ─── Orange gradient border wrapper ───────────────────────────────────────
    <div
      className={cn("p-[2px] rounded-[18px]", className)}
      style={{
        background: "linear-gradient(135deg, #df7412 0%, #f5a94e 50%, #df7412 100%)",
      }}
    >
      <div className="group relative bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">

        {/* ─── Badges ─────────────────────────────────────────────────────── */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant={product.badge}>{product.badge}</Badge>
          </div>
        )}

        {discount > 0 && (
          <div className={cn("absolute top-2.5 z-10", showWishlist ? "right-10" : "right-2.5")}>
            <Badge variant="sale">-{discount}%</Badge>
          </div>
        )}

        {/* ─── Wishlist — bottom-right corner of image ─────────────────────── */}
        {showWishlist && (
          <button
            type="button"
            aria-label="Add to wishlist"
            title="Wishlist (coming soon)"
            className="absolute bottom-[calc(100%-theme(spacing.9)-8px)] right-2 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background/95 backdrop-blur hover:bg-secondary/10 transition"
            style={{ bottom: "auto", top: "auto" }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <HeartIcon />
          </button>
        )}

        {/* ─── Product image ───────────────────────────────────────────────── */}
        <Link
          to={`/products/${product.slug}`}
          className="block overflow-hidden aspect-square bg-gray-50 relative"
        >
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Wishlist pinned to bottom-right of image */}
          {showWishlist && (
            <button
              type="button"
              aria-label="Add to wishlist"
              title="Wishlist (coming soon)"
              className="absolute bottom-2 right-2 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background/95 backdrop-blur hover:bg-secondary/10 transition"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <HeartIcon />
            </button>
          )}
        </Link>

        {/* ─── Card body ───────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors mb-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          <Rating value={product.rating} showCount reviewCount={product.reviewCount} className="mb-1.5" />

          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-bold text-sm sm:text-base text-primary">
              KSh {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-foreground/40 line-through">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* ─── CTA row — always 2 columns, stacks to 1 on very small screens ─ */}
          <div className="mt-auto grid grid-cols-2 gap-2 min-[360px]:grid-cols-2 max-[359px]:grid-cols-1">
            {!hideAddToCart && (
              <Link to={`/products/${product.slug}`} className="contents">
                <Button
                  className="w-full"
                  size="sm"
                  variant="primary"
                  aria-label="View product details"
                >
                  View
                </Button>
              </Link>
            )}

            <a
              href={buildWhatsAppUrl(product)}
              target="_blank"
              rel="noreferrer"
              className={cn(hideAddToCart ? "col-span-2" : "")}
            >
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/50"
                leftIcon={<WhatsAppIcon className="text-[#25D366]" />}
                aria-label="Chat on WhatsApp"
              >
                <span className="hidden xs:inline">WhatsApp</span>
                <span className="xs:hidden">Chat</span>
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};