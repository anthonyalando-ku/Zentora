import { http } from "@/core/api";

export type OrderStatus = "pending" | "completed" | "cancelled" | "shipped" | "delivered";

export type OrderStats = {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;

  revenue_total: number;
  revenue_today: number;
  revenue_7_days: number;
  orders_today: number;
  orders_7_days: number;

  updated_at: string;
};



export type Shipping = {
  full_name: string;
  phone: string;
  country: string;
  county?: string;
  city: string;
  area?: string;
  postal_code?: string;
  address_line_1: string;
  address_line_2?: string;
};

export type OrderItem = {
  ID: number;
  OrderID: number;
  ProductID: number;
  VariantID: number;
  ProductName: string;
  ProductSlug: string;
  VariantSKU: string | null;
  VariantName: string | null;
  ImageURL: string | null;
  UnitPrice: number;
  Quantity: number;
  DiscountAmount: number;
  TaxRate: number;
  TotalPrice: number;
  Currency: string;
};

export type Order = {
  ID: number;
  UserID?: number | null;
  CartID: number | null;
  OrderNumber: string;
  Status: OrderStatus;
  Subtotal: number;
  DiscountAmount: number;
  TaxAmount: number;
  ShippingFee: number;
  TotalAmount: number;
  Currency: string;
  ShippingMethodID: number | null;
  Shipping: Shipping;
  CreatedAt: string;
  UpdatedAt: string;
  Items?: Array<OrderItem> | null;
};




// export type Order = {
//   id: number;
//   user_id?: number | null;
//   cart_id?: number | null;
//   order_number: string;
//   status: OrderStatus;

//   subtotal: number;
//   discount_amount: number;
//   tax_amount: number;
//   shipping_fee: number;
//   total_amount: number;
//   currency: string;

//   shipping: {
//     full_name: string;
//     phone: string;
//     country: string;
//     county?: string | null;
//     city: string;
//     area?: string | null;
//     postal_code?: string | null;
//     address_line_1: string;
//     address_line_2?: string | null;
//   };

//   created_at: string;
//   updated_at: string;

//   items?: Array<{
//     id: number;
//     order_id: number;
//     product_id: number;
//     variant_id?: number | null;
//     product_name: string;
//     product_slug?: string | null;
//     unit_price: number;
//     quantity: number;
//     total_price: number;
//     currency: string;
//   }>;
// };

export type ListOrdersParams = {
  order_id?: string;
  order_number?: string;
  user_id?: string;
  cart_id?: string;
  statuses?: string; // comma-separated
  created_from?: string; // RFC3339
  created_to?: string; // RFC3339
  limit?: number;
  offset?: number;
  sort_by?: "created_at" | "total_amount" | "id";
  sort_desc?: boolean;
};

export const adminOrdersApi = {
  stats: async (): Promise<OrderStats> => {
    const { data } = await http.get("/admin/orders/stats");
    return data;
  },

  list: async (params: ListOrdersParams): Promise<{ orders: Order[]; offset: number }> => {
    const qs = new URLSearchParams();

    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      qs.set(k, String(v));
    });
    const { data } = await http.get(`/admin/orders?${qs.toString()}`);
    return data;
  },

  getById: async (id: number): Promise<Order> => {
    const { data } = await http.get(`/orders/details?id=${id}`);
    return (data as any).order as Order;
  },

  getByNumber: async (orderNumber: string): Promise<Order> => {
    const { data } = await http.get(`/admin/orders/by-number?order_number=${encodeURIComponent(orderNumber)}`);
    return (data as any).order as Order;
  },

  updateStatus: async (id: number, status: OrderStatus, note?: string): Promise<Order> => {
    const { data } = await http.put(`/admin/orders/${id}/status`, { status, note: note ?? "" });
    return (data as any).order as Order;
  },
};