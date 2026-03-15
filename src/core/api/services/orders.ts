import { http } from "@/core/api";

export type OrderItemInput = {
  product_id: number;
  variant_id: number;
  quantity: number;
};

export type GuestShippingInput = {
  full_name: string;
  phone: string;
  country: string;
  county: string | undefined;
  city: string;
  area: string | undefined;
  postal_code: string | undefined;
  address_line_1: string;
  address_line_2?: string;
};

export type PaymentMethod = "pay_on_delivery" | "mpesa";

export const ordersApi = {
  placeGuestOrder: async (payload: {
    items: OrderItemInput[];
    shipping: GuestShippingInput;
    payment_method: PaymentMethod;
    delivery_method?: string;
  }) => {
    const { data } = await http.post("/orders/guest", payload);
    return data;
  },

  placeMeOrder: async (payload: {
    address_id: number;
    items: OrderItemInput[];
    payment_method: PaymentMethod;
    delivery_method?: string;
  }) => {
    const { data } = await http.post("/orders", payload);
    return data;
  },
};