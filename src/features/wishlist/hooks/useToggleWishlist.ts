import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meWishlistApi } from "@/core/api/services/meWishlist";
import { meWishlistQueryKey } from "@/features/wishlist/hooks/useMeWishlist";

export const useToggleWishlist = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { isWished: boolean; product_id: number; variant_id: number }) => {
      if (payload.isWished) {
        return meWishlistApi.removeItem({ product_id: payload.product_id, variant_id: payload.variant_id });
      }
      return meWishlistApi.addItem({ product_id: payload.product_id, variant_id: payload.variant_id });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: meWishlistQueryKey });
    },
  });
};