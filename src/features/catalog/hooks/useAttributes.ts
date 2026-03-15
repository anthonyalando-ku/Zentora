import { useQuery } from "@tanstack/react-query";
import { catalogProductsApi } from "@/core/api/services/catalogProducts";

export const attributesQueryKey = ["catalog", "attributes"] as const;

export const useAttributes = () =>
  useQuery({
    queryKey: attributesQueryKey,
    queryFn: catalogProductsApi.getAttributes,
    staleTime: 10 * 60 * 1000,
  });