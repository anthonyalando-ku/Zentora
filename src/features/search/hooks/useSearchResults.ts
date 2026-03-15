import { useQuery } from "@tanstack/react-query";
import { discoverySearchApi } from "@/core/api/services/discoverySearch";
import { getDiscoverySessionId } from "@/features/search/utils/session";

export const searchResultsQueryKey = (query: string, limit: number) =>
  ["discovery", "search", query, limit] as const;

export const useSearchResults = (query: string, limit = 20) => {
  const trimmed = query.trim();
  const sessionId = getDiscoverySessionId();

  return useQuery({
    queryKey: searchResultsQueryKey(trimmed, limit),
    queryFn: async () => {
      const results = await discoverySearchApi.search({
        query: trimmed,
        limit,
        session_id: sessionId,
      });

      // Track search event AFTER results load
      const entries = results.items.map((it, idx) => ({
        product_id: it.product_id,
        position: idx + 1,
        score: Number(it.score ?? 0),
      }));

      const track = await discoverySearchApi.trackSearchEvent({
        query: trimmed,
        session_id: sessionId,
        result_count: results.items.length,
        results: entries,
      });

      const searchEventId = Number(track.search_event_id ?? track.id ?? 0) || undefined;

      return { results, searchEventId, sessionId };
    },
    enabled: trimmed.length > 0,
    staleTime: 10 * 1000,
  });
};