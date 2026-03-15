import { useQuery } from "@tanstack/react-query";
import { ordersMeApi } from "@/core/api/services/ordersMe";
import { useAuthStore } from "@/features/auth/store/authStore";

export const meOrdersQueryKey = (userId: number) => ["me", "orders", userId] as const;

export const useOrders = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.user?.identity_id); // assumes your auth store has user object

  return useQuery({
    queryKey: userId ? meOrdersQueryKey(userId) : ["me", "orders", "no-user"],
    queryFn: () =>
      ordersMeApi.list({
        user_id: Number(userId),
        limit: 20,
        offset: 0,
        sort_by: "created_at",
        sort_desc: true,
      }),
    enabled: isAuthenticated && typeof userId === "number" && !Number.isNaN(userId),
    staleTime: 15 * 1000,
  });
};