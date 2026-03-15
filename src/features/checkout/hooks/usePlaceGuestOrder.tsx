import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "@/core/api/services/orders";

export const usePlaceGuestOrder = () =>
  useMutation({
    mutationFn: ordersApi.placeGuestOrder,
  });