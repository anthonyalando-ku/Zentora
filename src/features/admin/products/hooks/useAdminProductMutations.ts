import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "@/features/admin/products/api/adminProductsApi";

export const useDeleteAdminProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminProductsApi.deleteProduct(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
};