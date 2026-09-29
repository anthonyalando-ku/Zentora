import { useQuery } from "@tanstack/react-query";
import { catalogProductsApi, type GetCatalogProductsParams } from "@/core/api/services/catalogProducts";

export const catalogProductsQueryKey = (params: GetCatalogProductsParams) =>
  ["catalog", "products", params] as const;

export const useCatalogProducts = (params: GetCatalogProductsParams, enabled = true) =>
  useQuery({
    queryKey: catalogProductsQueryKey(params),
    queryFn: () => catalogProductsApi.getProducts(params),
    enabled,
    staleTime: 30 * 1000,
  });
