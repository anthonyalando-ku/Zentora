import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meCartApi, type MeCart } from "@/core/api/services/meCart";
import { meCartQueryKey } from "@/features/cart/hooks/useMeCart";

export const useUpsertMeCartItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: meCartApi.upsertItem,

    // Immediate UI update (badge + cart page + PDP)
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: meCartQueryKey });

      const prev = qc.getQueryData<MeCart>(meCartQueryKey);

      qc.setQueryData<MeCart>(meCartQueryKey, (old) => {
        if (!old) return old;

        const idx = old.items.findIndex((i) => i.variant_id === vars.variant_id);
        if (idx >= 0) {
          const nextItems = old.items.slice();
          nextItems[idx] = { ...nextItems[idx], product_id: vars.product_id, quantity: vars.quantity };
          return { ...old, items: nextItems };
        }

        // if item wasn't in cart yet, add a temp row so badge updates instantly
        return {
          ...old,
          items: [
            ...old.items,
            {
              id: -Date.now(),
              cart_id: old.id,
              product_id: vars.product_id,
              variant_id: vars.variant_id,
              quantity: vars.quantity,
              price_at_added: vars.price_at_added,
              added_at: new Date().toISOString(),
            },
          ],
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(meCartQueryKey, ctx.prev);
    },

    onSettled: async () => {
      // Source of truth refresh
      await qc.invalidateQueries({ queryKey: meCartQueryKey });
    },
  });
};