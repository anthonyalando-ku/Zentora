import { useQuery } from "@tanstack/react-query";
import { discoveryApi, type DiscoveryFeedType, type DiscoveryFeedFilters } from "@/core/api/services/discovery";
import { getOrCreateZentoraSessionId } from "@/core/session/sessionId";

export const discoveryFeedPagedQueryKey = (
  feedType: DiscoveryFeedType,
  limit: number,
  filters?: DiscoveryFeedFilters
) => ["discovery", "feed", "paged", { feedType, limit, filters }] as const;

/**
 * CollectionPage feed — supports filters passed directly to the discovery API.
 *
 * Filters are applied by the backend within the feed, so results always stay
 * inside the collection. There is no fallback to the general catalogue.
 */
export const useDiscoveryFeedPaged = (
  feedType: DiscoveryFeedType,
  limit: number,
  filters?: DiscoveryFeedFilters
) =>
  useQuery({
    queryKey: discoveryFeedPagedQueryKey(feedType, limit, filters),
    queryFn: async () => {
      const session_id = getOrCreateZentoraSessionId();
      return discoveryApi.getFeed({ feed_type: feedType, limit, session_id, ...filters });
    },
    staleTime: 60 * 1000,
    enabled: Boolean(feedType),
  });