import { useQuery } from "@tanstack/react-query";
import { productDetailApi } from "@/core/api/services/productDetail";

export const variantStockQueryKey = (variantId: number) =>
  ["catalog", "variant", variantId, "stock"] as const;

export const useVariantStock = (variantId: number | undefined) =>
  useQuery({
    queryKey: variantId ? variantStockQueryKey(variantId) : ["catalog", "variant", "stock", "missing"],
    queryFn: () => productDetailApi.getVariantStock(variantId!),
    enabled: typeof variantId === "number",
    staleTime: 15 * 1000,
  });