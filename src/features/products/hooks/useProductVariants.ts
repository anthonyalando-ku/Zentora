import { useQuery } from "@tanstack/react-query";
import { productDetailApi } from "@/core/api/services/productDetail";

export const productVariantsQueryKey = (productId: number) =>
  ["catalog", "product", productId, "variants"] as const;

export const useProductVariants = (productId: number | undefined) =>
  useQuery({
    queryKey: productId ? productVariantsQueryKey(productId) : ["catalog", "product", "variants", "missing"],
    queryFn: () => productDetailApi.getVariants(productId!, true),
    enabled: typeof productId === "number",
    staleTime: 60 * 1000,
  });