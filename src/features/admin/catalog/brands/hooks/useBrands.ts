import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/shared/queryKeys";
import { adminCatalogApi } from "@/features/admin/catalog/shared/adminCatalogApi";

export const useBrands = () => {
  return useQuery({
    queryKey: adminKeys.catalog.brands,
    queryFn: () => adminCatalogApi.listBrands(),
  });
};

export const useCreateBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; slug?: string; logo_url?: string }) => adminCatalogApi.createBrand(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.brands });
    },
  });
};

export const useDeleteBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminCatalogApi.deleteBrand(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.brands });
    },
  });
};