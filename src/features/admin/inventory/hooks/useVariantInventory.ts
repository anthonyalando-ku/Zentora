import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminInventoryApi } from "@/features/admin/inventory/api/adminInventoryApi";
import { inventoryKeys } from "@/features/admin/inventory/hooks/useInventoryLocations";

export const useInventoryByVariant = (variantId: number | undefined) => {
  return useQuery({
    queryKey: typeof variantId === "number" ? inventoryKeys.inventoryByVariant(variantId) : ["admin", "inventory", "variant", "disabled"],
    queryFn: () => adminInventoryApi.listInventoryByVariant(variantId as number),
    enabled: typeof variantId === "number" && Number.isFinite(variantId),
  });
};

export const useStockSummary = (variantId: number | undefined) => {
  return useQuery({
    queryKey: typeof variantId === "number" ? inventoryKeys.stockSummary(variantId) : ["admin", "inventory", "stock", "disabled"],
    queryFn: () => adminInventoryApi.getStockSummary(variantId as number),
    enabled: typeof variantId === "number" && Number.isFinite(variantId),
  });
};

export const useUpsertInventoryItem = (variantId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      location_id: number;
      available_qty: number;
      reserved_qty: number;
      incoming_qty: number;
    }) =>
      adminInventoryApi.upsertInventoryItem({
        variant_id: variantId,
        location_id: body.location_id,
        available_qty: body.available_qty,
        reserved_qty: body.reserved_qty,
        incoming_qty: body.incoming_qty,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inventoryKeys.inventoryByVariant(variantId) });
      await qc.invalidateQueries({ queryKey: inventoryKeys.stockSummary(variantId) });
    },
  });
};

export const useAdjustStock = (variantId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { location_id: number; delta: number }) => adminInventoryApi.adjustStock(variantId, args.location_id, { delta: args.delta }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inventoryKeys.inventoryByVariant(variantId) });
      await qc.invalidateQueries({ queryKey: inventoryKeys.stockSummary(variantId) });
    },
  });
};

export const useReserveStock = (variantId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { location_id: number; qty: number }) => adminInventoryApi.reserveStock(variantId, args.location_id, args.qty),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inventoryKeys.inventoryByVariant(variantId) });
      await qc.invalidateQueries({ queryKey: inventoryKeys.stockSummary(variantId) });
    },
  });
};

export const useReleaseStock = (variantId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { location_id: number; qty: number }) => adminInventoryApi.releaseStock(variantId, args.location_id, args.qty),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inventoryKeys.inventoryByVariant(variantId) });
      await qc.invalidateQueries({ queryKey: inventoryKeys.stockSummary(variantId) });
    },
  });
};

export const useDeleteInventoryItem = (variantId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { location_id: number }) => adminInventoryApi.deleteInventoryItem(variantId, args.location_id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inventoryKeys.inventoryByVariant(variantId) });
      await qc.invalidateQueries({ queryKey: inventoryKeys.stockSummary(variantId) });
    },
  });
};