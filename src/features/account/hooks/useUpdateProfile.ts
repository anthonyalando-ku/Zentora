import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type UpdateProfilePayload } from "@/core/api/services/profile";
import { meProfileQueryKey } from "@/features/account/hooks/useProfile";

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: meProfileQueryKey });
    },
  });
};