export type UserRole = "admin" | "user" | "super_admin";

export type AuthUser = {
  identity_id: number;
  email: string;
  full_name: string;
  roles: UserRole[];
  permissions: string[] | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  expires_at: string;
  user: AuthUser;
};

export type RegisterEmailPayload = {
  email: string;
};

export type RegisterEmailResponse = {
  token: string;
};

export type VerifyOtpPayload = {
  email: string;
  token: string;
  otp: string;
};

export type VerifyOtpResponse = {
  token: string;
};

export type CompleteRegistrationPayload = {
  email: string;
  token: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type ResendOtpPayload = {
  email: string;
  token: string;
};

export type ResendOtpResponse = {
  token: string;
};