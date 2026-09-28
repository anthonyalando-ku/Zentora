import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/core/api/services/orders";
import { reportPurchaseConversion } from "@/core/analytics/purchaseConversion";
import { meCartQueryKey } from "@/features/cart/hooks/useMeCart";

export const usePlaceMeOrder = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.placeMeOrder,
    onSuccess: async ({ order }) => {
      reportPurchaseConversion(order);
      // After order, cart should be refreshed (backend likely emptied/updated)
      await qc.invalidateQueries({ queryKey: meCartQueryKey });
    },
  });
};
