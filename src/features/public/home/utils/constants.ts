import type {  DiscoveryFeedType } from "@/core/api/services/discovery";

export const feedTitle: Record<DiscoveryFeedType, string> = {
  trending: "Trending",
  best_sellers: "Best Sellers",
  recommended: "Recommended",
  deals: "Deals",
  new_arrivals: "New Arrivals",
  highly_rated: "Highly Rated",
  most_wishlisted: "Most Wishlisted",
  also_viewed: "Also Viewed",
  featured: "Featured",
  editorial: "Editorial",
  category: "Category",
};