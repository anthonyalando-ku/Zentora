import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AuthUser } from "../types";
import { tokenStorage } from "@/core/api/token";

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: Boolean(tokenStorage.getToken()),
      user: null,
      accessToken: tokenStorage.getToken(),
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        tokenStorage.setToken(accessToken);
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
        });
      },
      clearAuth: () => {
        tokenStorage.clearToken();
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);