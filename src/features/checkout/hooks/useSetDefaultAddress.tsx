import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesApi } from "@/core/api/services/addresses";
import { meAddressesQueryKey } from "@/features/checkout/hooks/useMeAddresses";

export const useSetDefaultAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.setDefault,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: meAddressesQueryKey });
    },
  });
};