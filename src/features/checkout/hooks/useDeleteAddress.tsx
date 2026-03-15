import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesApi } from "@/core/api/services/addresses";
import { meAddressesQueryKey } from "@/features/checkout/hooks/useMeAddresses";

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.remove,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: meAddressesQueryKey });
    },
  });
};