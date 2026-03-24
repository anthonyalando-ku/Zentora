import { useQuery } from "@tanstack/react-query";
import { adminDiscountsApi } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";

export const useDiscounts = (filter?: { active_only?: boolean; code?: string }) => {
  return useQuery({
    queryKey: ["admin", "catalog", "discounts", "list", filter ?? {}] as const,
    queryFn: () => adminDiscountsApi.listDiscounts(filter),
  });
};