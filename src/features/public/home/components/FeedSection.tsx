import { Link } from "react-router-dom";
import { mapDiscoveryItemToProduct } from "../utils/mapDiscoveryItem";
import { feedTitle } from "../utils/constants";
import { ProductCard } from "@/features/products/components/ProductCard";

import type { DiscoveryFeedType, DiscoveryFeedItem } from "@/core/api/services/discovery";
const FeedSection = ({ feedType, items }: { feedType: DiscoveryFeedType; items: DiscoveryFeedItem[] | undefined }) => {
  if (!items || items.length === 0) return null;

  const subtitle =
    feedType === "trending"
      ? "Popular items customers are buying"
      : feedType === "deals"
        ? "Limited-time discounts & hot offers"
        : feedType === "best_sellers"
          ? "Top-selling picks across the store"
          : feedType === "new_arrivals"
            ? "Freshly added products you’ll love"
            : "Handpicked products just for you";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl border border-border bg-background shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">{feedTitle[feedType]}</h2>
              <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>
            </div>

            <Link
              to={`/products?feed_type=${feedType}`}
              className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
            >
              Show More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => {
              const product = mapDiscoveryItemToProduct(item);
              return (
                <div key={product.slug} className="transform transition-all hover:-translate-y-1 hover:shadow-lg rounded-2xl">
                  <ProductCard product={product} hideAddToCart showWishlist />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedSection;