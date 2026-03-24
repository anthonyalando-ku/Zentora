import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/features/admin/shared/queryKeys";
import { adminCatalogApi } from "@/features/admin/catalog/shared/adminCatalogApi";

export const useAttributeValues = (attributeId: number | undefined) => {
  return useQuery({
    queryKey: attributeId ? adminKeys.catalog.attributeValues(attributeId) : ["admin", "catalog", "attributes", "values", "disabled"],
    queryFn: () => adminCatalogApi.listAttributeValues(attributeId as number),
    enabled: typeof attributeId === "number" && Number.isFinite(attributeId),
  });
};

export const useCreateAttributeValue = (attributeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { value: string; slug?: string; sort_order?: number }) =>
      adminCatalogApi.createAttributeValue(attributeId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.attributeValues(attributeId) });
    },
  });
};

export const useDeleteAttributeValue = (attributeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminCatalogApi.deleteAttributeValue(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.catalog.attributeValues(attributeId) });
    },
  });
};