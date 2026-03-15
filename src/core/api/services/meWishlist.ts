import { http } from "@/core/api";

export type WishlistItem = {
  product_id: number;
  variant_id: number;
  [k: string]: unknown;
};

export type Wishlist = {
  items: WishlistItem[];
  [k: string]: unknown;
};

export const meWishlistApi = {
  getWishlist: async () => {
    const { data } = await http.get<Wishlist>("/me/wishlist");
    return data;
  },

  addItem: async (payload: { product_id: number; variant_id: number }) => {
    const { data } = await http.post("/me/wishlist/items", payload);
    return data;
  },

  removeItem: async (payload: { product_id: number; variant_id: number }) => {
    const { data } = await http.delete("/me/wishlist/items", { params: payload });
    return data;
  },
};