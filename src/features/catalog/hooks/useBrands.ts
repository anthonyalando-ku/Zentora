import { useQuery } from "@tanstack/react-query";
import { catalogProductsApi } from "@/core/api/services/catalogProducts";

export const brandsQueryKey = ["catalog", "brands"] as const;

export const useBrands = () =>
  useQuery({
    queryKey: brandsQueryKey,
    queryFn: catalogProductsApi.getBrands,
    staleTime: 10 * 60 * 1000,
  });