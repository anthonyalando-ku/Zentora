import { useQuery } from "@tanstack/react-query";
import { productDetailApi } from "@/core/api/services/productDetail";

export const productDetailQueryKey = (slug: string) => ["catalog", "product", "slug", slug] as const;

export const useProductDetail = (slug: string | undefined) =>
  useQuery({
    queryKey: slug ? productDetailQueryKey(slug) : ["catalog", "product", "slug", "missing"],
    queryFn: () => productDetailApi.getBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  });