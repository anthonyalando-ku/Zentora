import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCreateProductApi, type CreateProductPayload } from "@/features/admin/products/api/adminCreateProductApi";

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { payload: CreateProductPayload; images: File[] }) => adminCreateProductApi.create(args.payload, args.images),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
      await qc.invalidateQueries({ queryKey: ["admin", "catalog", "discounts"] });
    },
  });
};