import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/shared/queryKeys";
import { categoriesQueryKey } from "@/features/catalog/hooks/useCategories";
import { adminCatalogApi, type CategoryInput } from "@/features/admin/catalog/shared/adminCatalogApi";

export const useCategories = () => {
  return useQuery({
    queryKey: adminKeys.catalog.categories,
    queryFn: () => adminCatalogApi.listCategories(),
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CategoryInput) => adminCatalogApi.createCategory(body),
    onSuccess: async () => {
      await Promise.all([qc.invalidateQueries({ queryKey: adminKeys.catalog.categories }), qc.invalidateQueries({ queryKey: categoriesQueryKey })]);
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminCatalogApi.deleteCategory(id),
    onSuccess: async () => {
      await Promise.all([qc.invalidateQueries({ queryKey: adminKeys.catalog.categories }), qc.invalidateQueries({ queryKey: categoriesQueryKey })]);
    },
  });
};
export const useUpdateCategory = () => {
 const qc = useQueryClient();
 return useMutation({ mutationFn: ({id, input}: {id:number; input:CategoryInput}) => adminCatalogApi.updateCategory(id,input), onSuccess: async () => {
 await Promise.all([qc.invalidateQueries({queryKey:adminKeys.catalog.categories}),qc.invalidateQueries({queryKey:categoriesQueryKey})]);
 }});
};
