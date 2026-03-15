import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/core/api/services/profile";
import { useAuthStore } from "@/features/auth/store/authStore";

export const meProfileQueryKey = ["me", "profile"] as const;

export const useProfile = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: meProfileQueryKey,
    queryFn: profileApi.getMe,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
};