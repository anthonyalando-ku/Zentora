import { useQuery } from "@tanstack/react-query";
import { adminDiscoveryApi } from "@/features/admin/products/api/adminDiscoveryApi";

export const useProductSuggestions = (prefix: string) => {
  const q = prefix.trim();
  return useQuery({
    queryKey: ["admin", "discovery", "suggest", q] as const,
    queryFn: () => adminDiscoveryApi.suggest(q, 10),
    enabled: q.length > 0,
  });
};