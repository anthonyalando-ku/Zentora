import { useQuery } from "@tanstack/react-query";
import { ordersMeApi } from "@/core/api/services/ordersMe";
import { useAuthStore } from "@/features/auth/store/authStore";

export const orderDetailsQueryKey = (id: number) => ["me", "orders", "details", id] as const;

export const useOrderDetails = (id: number | undefined) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: id ? orderDetailsQueryKey(id) : ["me", "orders", "details", "none"],
    queryFn: () => ordersMeApi.details(Number(id)),
    enabled: isAuthenticated && typeof id === "number" && !Number.isNaN(id),
    staleTime: 15 * 1000,
  });
};