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
  isError?: boolean;
}

// Thin accent line color per feed type — avoids painting full header background
const feedAccents: Record<DiscoveryFeedType, string> = {
  deals: "bg-red-500",
  best_sellers: "bg-amber-500",
  trending: "bg-violet-500",
  new_arrivals: "bg-emerald-500",
  featured: "bg-blue-500",
  editorial: "bg-indigo-500",
  recommended: "bg-pink-500",
  highly_rated: "bg-yellow-500",
  most_wishlisted: "bg-teal-500",
  also_viewed: "bg-cyan-500",
  category: "bg-gray-400",
};

const feedBadgeColors: Record<DiscoveryFeedType, string> = {
  deals: "bg-red-50 text-red-600 border-red-100",
  best_sellers: "bg-amber-50 text-amber-600 border-amber-100",
  trending: "bg-violet-50 text-violet-600 border-violet-100",
  new_arrivals: "bg-emerald-50 text-emerald-600 border-emerald-100",
  featured: "bg-blue-50 text-blue-600 border-blue-100",
  editorial: "bg-indigo-50 text-indigo-600 border-indigo-100",
  recommended: "bg-pink-50 text-pink-600 border-pink-100",
  highly_rated: "bg-yellow-50 text-yellow-600 border-yellow-100",
  most_wishlisted: "bg-teal-50 text-teal-600 border-teal-100",
  also_viewed: "bg-cyan-50 text-cyan-600 border-cyan-100",
  category: "bg-gray-50 text-gray-600 border-gray-100",
};

const subtitles: Record<DiscoveryFeedType, string> = {
  trending: "Popular items customers are buying",
  deals: "Limited-time discounts & hot offers",
  best_sellers: "Top-selling picks across the store",
  new_arrivals: "Freshly added products you'll love",
  featured: "Curated selection of standout products",
  editorial: "Editor's picks and recommendations",
  recommended: "Personalized for you",
  highly_rated: "Top-rated by our customers",
  most_wishlisted: "Most saved items on customer wishlists",
  also_viewed: "Customers also viewed",
  category: "Products in this category",
};

const FeedSection = ({ feedType, items, isLoading, isError }: FeedSectionProps) => {
  if (isError) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/20">
            <div className={`w-1 h-5 rounded-full flex-shrink-0 ${feedAccents[feedType]}`} />
            <h2 className="text-sm font-semibold text-foreground">{feedTitle[feedType]}</h2>
            <span className="text-xs text-muted-foreground ml-auto">Failed to load</span>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-background">
            <div className={`w-1 h-5 rounded-full flex-shrink-0 ${feedAccents[feedType]}`} />
            <h2 className="text-sm font-semibold text-foreground">{feedTitle[feedType]}</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">{subtitles[feedType]}</p>
            <div className="ml-auto text-xs font-medium text-primary/50">See all</div>
          </div>
          <div className="p-4 sm:p-5 bg-background">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[240px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  const badgeColor = feedBadgeColors[feedType];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        {/* Section Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <div className={`w-1 h-5 rounded-full flex-shrink-0 ${feedAccents[feedType]}`} />

          <h2 className="text-sm font-semibold text-foreground">{feedTitle[feedType]}</h2>

          {feedType === "deals" && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
              HOT
            </span>
          )}

          <span className="text-xs text-muted-foreground hidden sm:inline">{subtitles[feedType]}</span>

          <div className="ml-auto flex items-center gap-1">
            <span className="text-xs text-muted-foreground hidden sm:inline">{items.length} items</span>
            <Link
              to={`/products?feed_type=${feedType}`}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition flex items-center gap-0.5 ml-3"
            >
              See all
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Products */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.slice(0, 12).map((item) => (
              <ProductCard
                hideAddToCart
                key={String(item.product_id)}
                product={mapDiscoveryItemToProduct(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedSection;