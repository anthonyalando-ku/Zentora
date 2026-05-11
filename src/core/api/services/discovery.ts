import { http } from "@/core/api";

export type DiscoveryFeedType =
  | "trending"
  | "best_sellers"
  | "recommended"
  | "deals"
  | "new_arrivals"
  | "highly_rated"
  | "most_wishlisted"
  | "also_viewed"
  | "featured"
  | "editorial"
  | "category";

export type DiscoveryFeedItem = {
  product_id: number;
  name: string;
  slug: string;
  primary_image?: string | null;
  price: number;
  discount?: number | null;
  rating?: number | null;
  review_count?: number | null;
  inventory_status?: "in_stock" | "out_of_stock" | "low_stock" | string;
  brand?: string | null;
  category?: string | null;
  [k: string]: unknown;
};

export type DiscoveryFeedResponse = {
  feed_type: string;
  items: DiscoveryFeedItem[];
  limit?: number;
};

// All filter params the discovery/feed endpoint accepts
export type DiscoveryFeedFilters = {
  category_id?: number | string;
  brand_ids?: string;         // comma-separated
  price_min?: number;
  price_max?: number;
  min_rating?: number;
  discount_only?: boolean;
  in_stock_only?: boolean;
};

export type GetFeedParams = {
  feed_type: DiscoveryFeedType;
  limit: number;
  session_id?: string;
} & DiscoveryFeedFilters;

export const discoveryApi = {
  getFeed: async (params: GetFeedParams) => {
    const { data } = await http.get<DiscoveryFeedResponse>("/discovery/feed", { params });
    return data;
  },
};