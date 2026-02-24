import { http } from "@/core/api";
import { 
  type LoginPayload, 
  type AuthResponse,
  type CompleteRegistrationPayload,
  type RegisterEmailPayload,
  type RegisterEmailResponse,
  type VerifyOtpPayload,
  type ResendOtpPayload,
  type ResendOtpResponse,
  type VerifyOtpResponse, } from "../types";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await http.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  sendRegisterEmail: async (payload: RegisterEmailPayload) => {
    const { data } = await http.post<RegisterEmailResponse>(
      "/auth/verify-email/send-otp",
      payload
    );
    console.log("OTP sent to email:", data);
    return data;
  },

  verifyRegisterOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await http.post<VerifyOtpResponse>(
      "/auth/verify-email/verify-otp",
      payload
    );
    console.log("OTP verification response:", data);
    return data;
  },

  resendRegisterOtp: async (payload: ResendOtpPayload) => {
    const { data } = await http.post<ResendOtpResponse>(
      "/auth/verify-email/resend-otp",
      payload
    );
    return data;
  },


  completeRegistration: async (payload: CompleteRegistrationPayload) => {
    const { data } = await http.post<AuthResponse>(
      "/auth/register",
      payload
    );
    console.log("Registration complete response:", data);
    return data;
  },
};
