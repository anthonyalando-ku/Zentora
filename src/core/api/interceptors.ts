import { AxiosError, type AxiosResponse } from "axios";
import { AppError } from "@/core/error/AppError";
import { http } from "./http";
import { tokenStorage } from "./token";
import { useAuthStore } from "@/features/auth/store/authStore";

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiError = {
  success: false;
  message: string;
  error?: string;
};

let isSetup = false;

export const setupInterceptors = () => {
  if (isSetup) return;
  isSetup = true;

  http.interceptors.request.use((config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (response: AxiosResponse) => {
      const payload = response.data as ApiSuccess<unknown> | unknown;

      if (
        payload &&
        typeof payload === "object" &&
        "success" in payload &&
        "data" in payload
      ) {
        const apiPayload = payload as ApiSuccess<unknown>;
        response.data = apiPayload.data;
      }

      return response;
    },
    (error: AxiosError) => {
      const status = error.response?.status;
      const apiError = error.response?.data as ApiError | undefined;

      if (status === 401) {
        useAuthStore.getState().clearAuth();
      }

      const message =
        apiError?.message ??
        error.message ??
        "Unexpected API error";

      const details = apiError?.error ?? error.response?.data;

      return Promise.reject(new AppError(message, status, details));
    }
  );
};