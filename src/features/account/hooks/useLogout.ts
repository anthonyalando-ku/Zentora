import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/core/api/services/profile";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/cart/store/cartStore";

export const useLogout = () => {
  const qc = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: profileApi.logout,
    onSettled: async () => {
      // Regardless of API result, clear local state
      clearAuth();

      // Optional: clear guest cart too (prevents stale items if user logs out and continues as guest)
      useCartStore.getState().clearCart();

      // Clear all cached server state
      await qc.clear();

      // Navigation will be done by the page (so hook stays reusable)
    },
  });
};