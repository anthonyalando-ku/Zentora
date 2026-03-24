import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/shared/queryKeys";
import { adminCatalogApi } from "@/features/admin/catalog/shared/adminCatalogApi";

export const useCategories = () => {
  return useQuery({
    queryKey: adminKeys.catalog.categories,
    queryFn: () => adminCatalogApi.listCategories(),
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; slug?: string; parent_id?: number }) => adminCatalogApi.createCategory(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminCatalogApi.deleteCategory(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.categories });
    },
  });
};