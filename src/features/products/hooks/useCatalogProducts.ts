import { useQuery } from "@tanstack/react-query";
import { catalogProductsApi, type GetCatalogProductsParams } from "@/core/api/services/catalogProducts";

export const catalogProductsQueryKey = (params: GetCatalogProductsParams) =>
  ["catalog", "products", params] as const;

export const useCatalogProducts = (params: GetCatalogProductsParams) =>
  useQuery({
    queryKey: catalogProductsQueryKey(params),
    queryFn: () => catalogProductsApi.getProducts(params),
    staleTime: 30 * 1000,
  });