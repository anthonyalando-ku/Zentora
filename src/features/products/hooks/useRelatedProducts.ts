import { useQuery } from "@tanstack/react-query";
import type { DiscoveryFeedItem } from "@/core/api/services/discovery";
import { discoveryApi } from "@/core/api/services/discovery";
import { getOrCreateZentoraSessionId } from "@/core/session/sessionId";

export const relatedProductsQueryKey = (categoryId: number) =>
  ["discovery", "feed", "category", categoryId] as const;

export const useRelatedProducts = (categoryId: number | undefined) =>
  useQuery({
    queryKey: categoryId ? relatedProductsQueryKey(categoryId) : ["discovery", "feed", "category", "missing"],
    queryFn: async () => {
      const session_id = getOrCreateZentoraSessionId();
      const res = await discoveryApi.getFeed({
        feed_type: "category",
        limit: 4,
        session_id,
        // discovery API supports category_id per plan
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(categoryId ? ({ category_id: categoryId } as any) : {}),
      } as any);
      return res as { items: DiscoveryFeedItem[] };
    },
    enabled: typeof categoryId === "number",
    staleTime: 60 * 1000,
  });