import { useQuery } from "@tanstack/react-query";
import { discoveryApi, type DiscoveryFeedType } from "@/core/api/services/discovery";
import { getOrCreateZentoraSessionId } from "@/core/session/sessionId";

export const discoveryFeedQueryKey = (feedType: DiscoveryFeedType, limit: number) =>
  ["discovery", "feed", { feedType, limit }] as const;

export const useDiscoveryFeed = (feedType: DiscoveryFeedType, limit = 8) =>
  useQuery({
    queryKey: discoveryFeedQueryKey(feedType, limit),
    queryFn: async () => {
      const session_id = getOrCreateZentoraSessionId();
      return discoveryApi.getFeed({ feed_type: feedType, limit, session_id });
    },
    staleTime: 60 * 1000,
  });