import { http } from "@/core/api";

export type Address = {
  id: number;
  user_id?: number;

  full_name: string;
  phone_number: string;

  country?: string;
  county?: string;
  city?: string;
  area?: string;
  postal_code?: string;

  address_line_1: string;
  address_line_2?: string | null;

  is_default: boolean;

  created_at?: string;
  updated_at?: string;
};

type AddressesListResponse = Address[];

/**
 * Backend returns:
 * {
 *   success: true,
 *   message: "...",
 *   data: Address[]
 * }
 *
 * Your axios interceptor likely unwraps to just `data` already.
 * So `http.get<AddressesListResponse>()` should return Address[] directly.
 */
export const addressesApi = {
  list: async (): Promise<Address[]> => {
    const { data } = await http.get<AddressesListResponse>("/me/addresses");
    return Array.isArray(data) ? data : [];
  },

  create: async (payload: Omit<Address, "id" | "created_at" | "updated_at">) => {
    const { data } = await http.post("/me/addresses", payload);
    return data;
  },

  update: async (id: number, payload: Partial<Omit<Address, "id" | "created_at" | "updated_at">>) => {
    const { data } = await http.put(`/me/addresses/${id}`, payload);
    return data;
  },

  remove: async (id: number) => {
    const { data } = await http.delete(`/me/addresses/${id}`);
    return data;
  },

  setDefault: async (id: number) => {
    const { data } = await http.put(`/me/addresses/${id}/default`);
    return data;
  },
};