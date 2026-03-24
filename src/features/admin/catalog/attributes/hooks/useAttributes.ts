import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/shared/queryKeys";
import { adminCatalogApi } from "@/features/admin/catalog/shared/adminCatalogApi";

export const useAttributes = () => {
  return useQuery({
    queryKey: adminKeys.catalog.attributes,
    queryFn: () => adminCatalogApi.listAttributes(),
  });
};

export const useCreateAttribute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; slug?: string }) => adminCatalogApi.createAttribute(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.attributes });
    },
  });
};

export const useDeleteAttribute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminCatalogApi.deleteAttribute(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.attributes });
    },
  });
};