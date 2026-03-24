import { http } from "@/core/api";

export type SqlNullString = { String: string; Valid: boolean };
export type SqlNullInt64 = { Int64: number; Valid: boolean };
export type SqlNullFloat64 = { Float64: number; Valid: boolean };
export type SqlNullTime = { Time: string; Valid: boolean };

export type DiscountType = "percentage" | "fixed";

export type Discount = {
  id: number;
  name: string;
  code: SqlNullString;
  discount_type: DiscountType;
  value: number;
  min_order_amount: SqlNullFloat64;
  max_redemptions: SqlNullInt64;
  starts_at: SqlNullTime;
  ends_at: SqlNullTime;
  is_active: boolean;
  created_at: string;
};

export type DiscountTargetType = "product" | "category" | "brand";
export type DiscountTargetInput = { target_type: DiscountTargetType; target_id: number };

export const adminDiscountsApi = {
  listDiscounts: async (params?: { active_only?: boolean; code?: string }): Promise<Discount[]> => {
    const sp = new URLSearchParams();
    if (params?.active_only) sp.set("active_only", "true");
    if (params?.code && params.code.trim()) sp.set("code", params.code.trim());
    const qs = sp.toString();
    const { data } = await http.get(`/admin/catalog/discounts${qs ? `?${qs}` : ""}`);
    console.log("Fetched discounts with params", params, ":", data);
    return data;
  },

  getDiscount: async (id: number): Promise<Discount> => {
    const { data } = await http.get(`/admin/catalog/discounts/${id}`);
    return data;
  },

  createDiscount: async (body: {
    name: string;
    code?: string;
    discount_type: DiscountType;
    value: number;
    min_order_amount?: number;
    max_redemptions?: number;
    starts_at?: string;
    ends_at?: string;
    is_active: boolean;
  }): Promise<Discount> => {
    const { data } = await http.post("/admin/catalog/discounts", body);
    return data;
  },

  updateDiscount: async (
    id: number,
    body: {
      name?: string;
      code?: string;
      discount_type?: DiscountType;
      value?: number;
      min_order_amount?: number;
      max_redemptions?: number;
      starts_at?: string;
      ends_at?: string;
      is_active?: boolean;
    }
  ): Promise<Discount> => {
    const { data } = await http.put(`/admin/catalog/discounts/${id}`, body);
    return data;
  },

  deleteDiscount: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/discounts/${id}`);
    return data;
  },

  setTargets: async (id: number, body: { targets: DiscountTargetInput[] }): Promise<any> => {
    const { data } = await http.post(`/admin/catalog/discounts/${id}/targets`, body);
    return data;
  },

   setTargetsAdmin: async (id: number, body: { targets: Array<{ target_type: "product" | "category" | "brand"; target_id: number }> }) => {
    const { data } = await http.put(`/admin/catalog/discounts/${id}/targets`, body);
    return data;
    },
};