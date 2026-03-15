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

export const discoveryApi = {
  getFeed: async (params: {
    feed_type: DiscoveryFeedType;
    limit: number;
    session_id?: string;
    category_id?: number | string;
  }) => {
    const { data } = await http.get<DiscoveryFeedResponse>("/discovery/feed", { params });
    return data;
  },
};