import { http } from "@/core/api";

export type DiscoverySuggestion = {
  Text: string;
  Type: "product" | "category" | "brand" | "query";
  ReferenceID: number | null;
  PopularityScore: number;
};

export type DiscoverySuggestResponse = {
  suggestions: DiscoverySuggestion[];
  count: number;
};

export const adminDiscoveryApi = {
  suggest: async (prefix: string, limit = 10): Promise<DiscoverySuggestResponse> => {
    const sp = new URLSearchParams();
    sp.set("prefix", prefix);
    sp.set("limit", String(limit));
    const { data } = await http.get(`/discovery/suggest?${sp.toString()}`);
    return data;
  },
};