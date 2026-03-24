import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDiscountsApi } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";

export const useSetDiscountTargetsAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; targets: Array<{ target_type: "product" | "category" | "brand"; target_id: number }> }) =>
      adminDiscountsApi.setTargetsAdmin(args.id, { targets: args.targets }),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts"] });
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts", "detail", vars.id] });
    },
  });
};