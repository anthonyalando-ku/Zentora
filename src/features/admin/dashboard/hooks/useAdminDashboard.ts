import { useQuery } from "@tanstack/react-query";
import { adminDashboardApi } from "@/features/admin/dashboard/api/adminDashboardApi";

const keys = {
  userStats: ["admin", "dashboard", "userStats"] as const,
  orderStats: ["admin", "dashboard", "orderStats"] as const,
  pendingOrders: (limit: number, offset: number) => ["admin", "dashboard", "pendingOrders", { limit, offset }] as const,
};

export const useAdminDashboardUserStats = () =>
  useQuery({
    queryKey: keys.userStats,
    queryFn: adminDashboardApi.userStats,
    staleTime: 30_000,
  });

export const useAdminDashboardOrderStats = () =>
  useQuery({
    queryKey: keys.orderStats,
    queryFn: adminDashboardApi.orderStats,
    staleTime: 15_000,
  });

export const useAdminDashboardPendingOrders = (limit: number, offset: number) =>
  useQuery({
    queryKey: keys.pendingOrders(limit, offset),
    queryFn: () => adminDashboardApi.pendingOrders({ limit, offset }),
    staleTime: 10_000,
  });