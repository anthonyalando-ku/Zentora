import { http } from "@/core/api";

export type OrderShipping = {
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

export type OrderListRow = {
  ID: number;
  UserID: number;
  CartID: number | null;
  OrderNumber: string;
  Status: string;
  Subtotal: number;
  DiscountAmount: number;
  TaxAmount: number;
  ShippingFee: number;
  TotalAmount: number;
  Currency: string;
  ShippingMethodID: number | null;
  Shipping: OrderShipping;
  CreatedAt: string;
  UpdatedAt: string;
  Items: OrderItem[] | null;
};

export type OrdersListData = {
  offset: number;
  orders: OrderListRow[];
};

export type OrdersListEnvelope = {
  success: boolean;
  message: string;
  data: OrdersListData;
};

export type OrderDetailsData = {
  order: OrderListRow;
};

export type OrderDetailsEnvelope = {
  success: boolean;
  message: string;
  data: OrderDetailsData;
};

const unwrapOrdersList = (resp: any): OrdersListData => {
  // If interceptor returns already-unwrapped `{offset,orders}`
  if (resp && typeof resp === "object" && "orders" in resp && Array.isArray((resp as any).orders)) {
    return resp as OrdersListData;
  }

  // If interceptor returns envelope
  if (resp && typeof resp === "object" && "data" in resp) {
    const inner = (resp as any).data;
    if (inner && typeof inner === "object" && "orders" in inner && Array.isArray(inner.orders)) {
      return inner as OrdersListData;
    }
  }

  return { offset: 1, orders: [] };
};

const unwrapOrderDetails = (resp: any): OrderDetailsData | null => {
  // Unwrapped `{order:{...}}`
  if (resp && typeof resp === "object" && "order" in resp) return resp as OrderDetailsData;

  // Envelope
  if (resp && typeof resp === "object" && "data" in resp && (resp as any).data?.order) {
    return (resp as any).data as OrderDetailsData;
  }

  return null;
};

// ...keep existing types above...

export const ordersMeApi = {
  list: async (params?: {
    user_id?: number;
    limit?: number;
    offset?: number;
    sort_by?: string;
    sort_desc?: boolean;

    // optional filters supported by backend
    order_id?: number;
    order_number?: string;
    cart_id?: number;
    statuses?: string; // comma-separated
    created_from?: string; // RFC3339
    created_to?: string; // RFC3339
  }) => {
    const { data } = await http.get<unknown>("/orders", { params });
    return unwrapOrdersList(data); // keep your unwrap helper
  },

  details: async (id: number) => {
    const { data } = await http.get<unknown>("/orders/details", { params: { id } });
    const unwrapped = unwrapOrderDetails(data);
    if (!unwrapped) throw new Error("Invalid order details response");
    return unwrapped;
  },
};