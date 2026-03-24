import { http } from "@/core/api";

export type AdminUserStats = {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_verification_users: number;
  admin_users: number;
  super_admin_users: number;
};

export type AdminOrderStats = {
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

export type AdminOrderStatus = "pending" | "completed" | "cancelled" | "shipped" | "delivered";

export type AdminOrder = {
  id: number;
  user_id?: number | null;
  order_number: string;
  status: AdminOrderStatus;
  total_amount: number;
  currency: string;
  created_at: string;
  shipping: {
    full_name: string;
    phone: string;
    country: string;
    city: string;
    address_line_1: string;
  };
};

export const adminDashboardApi = {
  userStats: async (): Promise<AdminUserStats> => {
    const { data } = await http.get("/admin/auth/users/stats");
    return data;
  },

  orderStats: async (): Promise<AdminOrderStats> => {
    const { data } = await http.get("/admin/orders/stats");
    return data;
  },

  pendingOrders: async (params: { limit?: number; offset?: number }): Promise<{ orders: AdminOrder[]; offset: number }> => {
    const qs = new URLSearchParams();
    qs.set("statuses", "pending");
    qs.set("sort_by", "created_at");
    qs.set("sort_desc", "true");
    qs.set("limit", String(params.limit ?? 10));
    qs.set("offset", String(params.offset ?? 0));
    const { data } =  await http.get(`/admin/orders?${qs.toString()}`);
    return data;
  },
};