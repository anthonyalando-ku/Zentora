import { useQuery } from "@tanstack/react-query";
import { addressesApi } from "@/core/api/services/addresses";
import { useAuthStore } from "@/features/auth/store/authStore";

export const meAddressesQueryKey = ["me", "addresses"] as const;

export const useMeAddresses = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: meAddressesQueryKey,
    queryFn: addressesApi.list,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
};