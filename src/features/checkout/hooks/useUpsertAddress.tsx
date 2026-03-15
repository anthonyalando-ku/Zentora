import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesApi } from "@/core/api/services/addresses";
import { meAddressesQueryKey } from "@/features/checkout/hooks/useMeAddresses";

export const useCreateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: meAddressesQueryKey });
    },
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof addressesApi.update>[1] }) =>
      addressesApi.update(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: meAddressesQueryKey });
    },
  });
};