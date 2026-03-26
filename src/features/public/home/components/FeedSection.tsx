import { Link } from "react-router-dom";
import { feedTitle } from "../utils/constants";
import { mapDiscoveryItemToProduct } from "../utils/mapDiscoveryItem";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Skeleton } from "@/shared/components/ui";

import type { DiscoveryFeedType, DiscoveryFeedItem } from "@/core/api/services/discovery";

interface FeedSectionProps {
  feedType: DiscoveryFeedType;
  items?: DiscoveryFeedItem[];
  isLoading?: boolean;
}

const feedStyles: Record<DiscoveryFeedType, string> = {
  deals: "bg-red-500 text-white",
  best_sellers: "bg-orange-500 text-white",
  trending: "bg-purple-500 text-white",
  new_arrivals: "bg-green-500 text-white",
  featured: "bg-blue-500 text-white",
  editorial: "bg-indigo-500 text-white",
  recommended: "bg-pink-500 text-white",
  highly_rated: "bg-yellow-500 text-white",
  most_wishlisted: "bg-teal-500 text-white",
  also_viewed: "bg-cyan-500 text-white",
  category: "bg-gray-500 text-white",
};

const subtitles: Record<DiscoveryFeedType, string> = {
  trending: "Popular items customers are buying",
  deals: "Limited-time discounts & hot offers",
  best_sellers: "Top-selling picks across the store",
  new_arrivals: "Freshly added products you’ll love",
  featured: "Curated selection of standout products",
  editorial: "Editor's picks and recommendations",
  recommended: "Personalized for you",
  highly_rated: "Top-rated products based on customer reviews",
  most_wishlisted: "Most wanted items on customer wishlists",
  also_viewed: "Customers also viewed",
  category: "Products in this category",
};

const FeedSection = ({ feedType, items, isLoading }: FeedSectionProps) => {
  // Loading skeleton (prevents blank UI)
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl overflow-hidden bg-muted/20">
          <div className={`px-4 sm:px-6 py-3 ${feedStyles[feedType]}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">{feedTitle[feedType]}</h2>
                <span className="text-xs opacity-80 whitespace-nowrap">Loading…</span>
              </div>

              <div className="text-sm font-medium opacity-90">See all</div>
            </div>

            <p className="text-xs opacity-90 mt-1">{subtitles[feedType]}</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[250px] rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Only hide if request completed and we truly have no items
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-xl overflow-hidden bg-muted/20">
        {/* Section Header */}
        <div className={`px-4 sm:px-6 py-3 ${feedStyles[feedType]}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-lg font-semibold tracking-tight">{feedTitle[feedType]}</h2>

              <span className="text-xs opacity-80 whitespace-nowrap">{items.length} items</span>

              {feedType === "deals" && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">HOT</span>
              )}
            </div>

            <Link
              to={`/products?feed_type=${feedType}`}
              className="text-sm font-medium flex items-center gap-1 opacity-90 hover:opacity-100 transition"
            >
              See all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <p className="text-xs opacity-90 mt-1">{subtitles[feedType]}</p>
        </div>

        {/* Products */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.slice(0, 12).map((item) => (
              <ProductCard hideAddToCart key={String(item.product_id)} product={mapDiscoveryItemToProduct(item)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedSection;