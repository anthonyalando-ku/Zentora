import { http } from "@/core/api";

export type MeCartProductInfo = {
  product_id: number;
  name: string;
  slug: string;
  primary_image: string | null;
  price: number;
  discount: number;
  rating: number;
  review_count: number;
  inventory_status: string;
  brand: string;
  category: string;
};

export type MeCartItem = {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  price_at_added: string;
  added_at: string;

  product_info?: MeCartProductInfo;
};

export type MeCart = {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: MeCartItem[];
};

type MeCartRawEnvelope = {
  cart: {
    ID: number;
    UserID: number;
    Status: string;
    CreatedAt: string;
    UpdatedAt: string;
    Items: Array<{
      ID: number;
      CartID: number;
      ProductID: number;
      VariantID: number;
      Quantity: number;
      PriceAtAdded: string;
      AddedAt: string;
      product_info?: MeCartProductInfo;
    }>;
  };
};

export const meCartApi = {
  getCart: async (): Promise<MeCart> => {
    const { data } = await http.get<MeCartRawEnvelope>("/me/cart");

    const c = data.cart;

    return {
      id: c.ID,
      user_id: c.UserID,
      status: c.Status,
      created_at: c.CreatedAt,
      updated_at: c.UpdatedAt,
      items: (c.Items ?? []).map((it) => ({
        id: it.ID,
        cart_id: it.CartID,
        product_id: it.ProductID,
        variant_id: it.VariantID,
        quantity: it.Quantity,
        price_at_added: it.PriceAtAdded,
        added_at: it.AddedAt,
        product_info: it.product_info,
      })),
    };
  },

  upsertItem: async (payload: {
    product_id: number;
    variant_id: number;
    quantity: number;
    price_at_added: string;
  }) => {
    const { data } = await http.post("/me/cart/items", payload);
    return data;
  },

  removeItem: async (item_id: number) => {
    const { data } = await http.delete(`/me/cart/items/${item_id}`);
    return data;
  },
};