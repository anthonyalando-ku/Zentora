import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminInventoryApi } from "@/features/admin/inventory/api/adminInventoryApi";

const keys = {
  locations: ["admin", "inventory", "locations"] as const,
  inventoryByVariant: (variantId: number) => ["admin", "inventory", "variant", variantId] as const,
  stockSummary: (variantId: number) => ["admin", "inventory", "variant", variantId, "stock"] as const,
};

export const inventoryKeys = keys;

export const useInventoryLocations = () => {
  return useQuery({
    queryKey: keys.locations,
    queryFn: () => adminInventoryApi.listLocations(),
  });
};

export const useCreateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; location_code?: string; is_active?: boolean }) => adminInventoryApi.createLocation(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.locations });
    },
  });
};

export const useUpdateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; body: { name?: string; location_code?: string; is_active?: boolean } }) =>
      adminInventoryApi.updateLocation(args.id, args.body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.locations });
    },
  });
};

export const useDeleteLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminInventoryApi.deleteLocation(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.locations });
    },
  });
};