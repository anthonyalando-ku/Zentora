import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminOrdersApi, type ListOrdersParams, type OrderStatus } from "@/features/admin/orders/api/adminOrdersApi";

const keys = {
  stats: ["admin", "orders", "stats"] as const,
  list: (params: ListOrdersParams) => ["admin", "orders", "list", params] as const,
  detail: (id: number) => ["admin", "orders", "detail", id] as const,
};

export const useAdminOrderStats = () =>
  useQuery({
    queryKey: keys.stats,
    queryFn: adminOrdersApi.stats,
  });

export const useAdminOrdersList = (params: ListOrdersParams) =>
  useQuery({
    queryKey: keys.list(params),
    queryFn: () => adminOrdersApi.list(params),
    staleTime: 10_000,
  });

export const useAdminOrder = (id: number) =>
  useQuery({
    queryKey: keys.detail(id),
    queryFn: () => adminOrdersApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });

export const useUpdateAdminOrderStatus = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ status, note }: { status: OrderStatus; note?: string }) => adminOrdersApi.updateStatus(id, status, note),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};