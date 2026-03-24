import { useQuery } from "@tanstack/react-query";
import { adminProductsApi, type ProductsListParams } from "@/features/admin/products/api/adminProductsApi";

export const useAdminProducts = (params: ProductsListParams) => {
  return useQuery({
    queryKey: ["admin", "products", "list", params] as const,
    queryFn: () => adminProductsApi.listProducts(params),
  });
};