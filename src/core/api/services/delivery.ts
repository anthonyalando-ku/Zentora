import { http } from "@/core/api";

export const deliveryPolicyKey = ["delivery-policy"];

export type DeliveryPolicy = {
  method_id: number;
  version: number;
  pricing_mode: "informational";
  currency: "KES";
  nairobi_indicative_fee: number;
  additional_information: string;
  message: string;
  coverage: string;
  included_in_order_total: false;
  updated_at: string;
};

export type DeliverySnapshot = {
  policy_version: number | null;
  method_id: number | null;
  pricing_status: "pending_confirmation";
  included_in_order_total: boolean;
  confirmed_fee: number | null;
  currency: string;
  notice: string;
};

export type DeliveryUpdate = {
  expected_version: number;
  nairobi_indicative_fee: number;
  additional_information: string;
};

export const deliveryApi = {
  get: async () => (await http.get<DeliveryPolicy>("/delivery-policy")).data,
  getAdmin: async () => (await http.get<DeliveryPolicy>("/admin/delivery-policy")).data,
  update: async (payload: DeliveryUpdate) =>
    (await http.put<DeliveryPolicy>("/admin/delivery-policy", payload)).data,
};
