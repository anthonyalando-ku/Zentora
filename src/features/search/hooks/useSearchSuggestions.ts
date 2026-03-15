import { useQuery } from "@tanstack/react-query";
import { discoverySearchApi } from "@/core/api/services/discoverySearch";

export const suggestionsQueryKey = (prefix: string, limit: number) =>
  ["discovery", "suggest", prefix, limit] as const;

export const useSearchSuggestions = (prefix: string, limit = 5) => {
  const trimmed = prefix.trim();

  return useQuery({
    queryKey: suggestionsQueryKey(trimmed, limit),
    queryFn: () => discoverySearchApi.suggest({ prefix: trimmed, limit }),
    enabled: trimmed.length > 0,
    staleTime: 15 * 1000,
  });
};