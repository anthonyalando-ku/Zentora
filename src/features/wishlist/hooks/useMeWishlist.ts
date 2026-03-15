import { useQuery } from "@tanstack/react-query";
import { meWishlistApi } from "@/core/api/services/meWishlist";
import { useAuthStore } from "@/features/auth/store/authStore";

export const meWishlistQueryKey = ["me", "wishlist"] as const;

export const useMeWishlist = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: meWishlistQueryKey,
    queryFn: meWishlistApi.getWishlist,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
};