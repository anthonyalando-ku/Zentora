import { http } from "@/core/api";

export type NullableString = { String: string; Valid: boolean };

export type Profile = {
  id: number;
  identity_id: number;

  full_name?: NullableString;
  avatar_url?: NullableString;
  bio?: NullableString;

  // backend will add these later; keep optional
  email?: string;
  phone?: string;

  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type UpdateProfilePayload = {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  metadata?: Record<string, unknown> | null;
};

export const profileApi = {
  getMe: async (): Promise<Profile> => {
    const { data } = await http.get<Profile>("/auth/me");
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await http.put("/auth/profile", payload);
    return data;
  },

  changePassword: async (payload: { current_password: string; new_password: string }) => {
    const { data } = await http.put("/auth/change-password", payload);
    return data;
  },

  logout: async () => {
    // NOTE: you said logout is POST /auth/logout (token only)
    // Your app intentionally removed  prefix for most endpoints,
    // but logout example still includes it. Keep it EXACTLY as provided:
    const { data } = await http.post("/auth/logout");
    return data;
  },
};