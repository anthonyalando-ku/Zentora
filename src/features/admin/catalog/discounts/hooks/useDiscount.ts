import { useQuery } from "@tanstack/react-query";
import { adminDiscountsApi } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";

export const useDiscount = (id: number | undefined) => {
  return useQuery({
    queryKey: ["admin", "catalog", "discounts", "detail", id] as const,
    queryFn: () => adminDiscountsApi.getDiscount(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
};