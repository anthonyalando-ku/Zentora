import { useQuery } from "@tanstack/react-query";
import { discoveryApi, type DiscoveryFeedType } from "@/core/api/services/discovery";
import { getOrCreateZentoraSessionId } from "@/core/session/sessionId";

export const discoveryFeedPagedQueryKey = (feedType: DiscoveryFeedType, limit: number) =>
  ["discovery", "feed", "paged", { feedType, limit }] as const;

/**
 * For ProductsPage "Show More" feed landing pages.
 * We increase limit with page to simulate pagination without backend offset/cursor yet.
 */
export const useDiscoveryFeedPaged = (feedType: DiscoveryFeedType, limit: number) =>
  useQuery({
    queryKey: discoveryFeedPagedQueryKey(feedType, limit),
    queryFn: async () => {
      const session_id = getOrCreateZentoraSessionId();
      return discoveryApi.getFeed({ feed_type: feedType, limit, session_id });
    },
    staleTime: 60 * 1000,
    enabled: Boolean(feedType),
  });