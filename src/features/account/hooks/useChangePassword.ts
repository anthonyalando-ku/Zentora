import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/core/api/services/profile";

export const useChangePassword = () =>
  useMutation({
    mutationFn: profileApi.changePassword,
  });