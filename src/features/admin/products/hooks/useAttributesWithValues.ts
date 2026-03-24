import { useQuery } from "@tanstack/react-query";
import { adminAttributesWithValuesApi } from "@/features/admin/products/api/adminAttributesWithValuesApi";

export const useAttributesWithValues = () => {
  return useQuery({
    queryKey: ["admin", "catalog", "attributes", "with_values"] as const,
    queryFn: () => adminAttributesWithValuesApi.list(),
  });
};