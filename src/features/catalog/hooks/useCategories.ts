import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/core/api/services/catalog";

export const categoriesQueryKey = ["catalog", "categories"] as const;

export const useCategories = () =>
  useQuery({
    queryKey: categoriesQueryKey,
    queryFn: catalogApi.getCategories,
    staleTime: 5 * 60 * 1000,
  });