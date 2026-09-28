import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "@/core/api/services/orders";
import { reportPurchaseConversion } from "@/core/analytics/purchaseConversion";

export const usePlaceGuestOrder = () =>
  useMutation({
    mutationFn: ordersApi.placeGuestOrder,
    onSuccess: ({ order }) => reportPurchaseConversion(order),
  });
