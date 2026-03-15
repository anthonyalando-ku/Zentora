import { useQuery } from "@tanstack/react-query";
import { meCartApi } from "@/core/api/services/meCart";
import { useAuthStore } from "@/features/auth/store/authStore";

export const meCartQueryKey = ["me", "cart"] as const;

export const useMeCart = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: meCartQueryKey,
    queryFn: meCartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 15 * 1000,
  });
};