import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDiscountsApi } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";

export const useCreateDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof adminDiscountsApi.createDiscount>[0]) => adminDiscountsApi.createDiscount(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts"] });
    },
  });
};

export const useUpdateDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; body: Parameters<typeof adminDiscountsApi.updateDiscount>[1] }) =>
      adminDiscountsApi.updateDiscount(args.id, args.body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts"] });
    },
  });
};

export const useDeleteDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminDiscountsApi.deleteDiscount(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts"] });
    },
  });
};

export const useSetDiscountTargets = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; targets: any[] }) => adminDiscountsApi.setTargets(args.id, { targets: args.targets as any }),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts"] });
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts", "detail", vars.id] });
    },
  });
};