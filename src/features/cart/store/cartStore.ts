import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GuestCartItem = {
  product_id: number;
  variant_id: number;
  quantity: number;

  // UI fields (cached so CartPage can render without extra API calls)
  slug: string;
  name: string;
  thumbnail: string;
  price: number;

  // optional variant label/sku for display
  sku?: string;
};

type CartState = {
  items: GuestCartItem[];

  addVariantItem: (item: GuestCartItem) => void;
  removeVariantItem: (productId: number, variantId: number) => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
  clearCart: () => void;

  getItemCount: () => number;
  getSubtotal: () => number;

  getVariantQuantity: (productId: number, variantId: number) => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addVariantItem: (item) => {
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
          );

          if (idx >= 0) {
            const next = state.items.slice();
            next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
            return { items: next };
          }

          return { items: [...state.items, item] };
        });
      },

      removeVariantItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.product_id === productId && i.variant_id === variantId)),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeVariantItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId && i.variant_id === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      getVariantQuantity: (productId, variantId) => {
        const found = get().items.find((i) => i.product_id === productId && i.variant_id === variantId);
        return found?.quantity ?? 0;
      },
    }),
    { name: "zentora-cart" }
  )
);