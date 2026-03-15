import { http } from "@/core/api";

export type DiscoverySuggestItem = {
  Text: string;
  Type: "brand" | "product" | "category" | string;
  ReferenceID: number;
  PopularityScore: number;
};

export type DiscoverySuggestResponse = {
  count: number;
  suggestions: DiscoverySuggestItem[];
};

export type DiscoverySearchItem = {
  product_id: number;
  name: string;
  slug: string;
  primary_image: string | null;
  price: number;
  discount: number;
  rating: number;
  review_count: number;
  inventory_status: string;
  brand: string;
  category: string;

  // score may exist depending on your ranking implementation
  score?: number;
};

export type DiscoverySearchResponse = {
  items: DiscoverySearchItem[];
  limit: number;
  query: string;
};

export type TrackSearchResultEntry = {
  product_id: number;
  position: number;
  score: number;
};

export type TrackSearchRequest = {
  query: string;
  session_id?: string;
  result_count: number;
  results: TrackSearchResultEntry[];
};

export type TrackSearchResponse = {
  // backend should return an id; keep flexible
  search_event_id?: number;
  id?: number;
};

export type TrackClickRequest = {
  search_event_id: number;
  product_id: number;
  position: number;
  session_id?: string;
};

export const discoverySearchApi = {
  suggest: async (params: { prefix: string; limit?: number }) => {
    const { data } = await http.get<DiscoverySuggestResponse>("/discovery/suggest", { params });
    return data;
  },

  search: async (params: {
    query: string;
    limit?: number;
    price_min?: number;
    price_max?: number;
    min_rating?: number;
    discount_only?: boolean;
    in_stock_only?: boolean;
    session_id?: string;
  }) => {
    const { data } = await http.get<DiscoverySearchResponse>("/discovery/search", { params });
    return data;
  },

  trackSearchEvent: async (payload: TrackSearchRequest) => {
    const { data } = await http.post<TrackSearchResponse>("/discovery/search/events", payload);
    return data;
  },

  trackSearchClick: async (payload: TrackClickRequest) => {
    const { data } = await http.post("/discovery/search/clicks", payload);
    return data;
  },
};