import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meCartApi, type MeCart } from "@/core/api/services/meCart";
import { meCartQueryKey } from "@/features/cart/hooks/useMeCart";

export const useRemoveMeCartItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: meCartApi.removeItem,

    onMutate: async (itemId) => {
      await qc.cancelQueries({ queryKey: meCartQueryKey });

      const prev = qc.getQueryData<MeCart>(meCartQueryKey);

      qc.setQueryData<MeCart>(meCartQueryKey, (old) => {
        if (!old) return old;
        return { ...old, items: old.items.filter((i) => i.id !== itemId) };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(meCartQueryKey, ctx.prev);
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: meCartQueryKey });
    },
  });
};