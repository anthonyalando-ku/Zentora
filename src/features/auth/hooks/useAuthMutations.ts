import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";

type AuthSuccessCallback = () => void;

export const useLoginMutation = (onSuccessRedirect?: AuthSuccessCallback) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      onSuccessRedirect?.();
    },
  });
};

export const useRegisterEmailMutation = () => {
  return useMutation({
    mutationFn: authApi.sendRegisterEmail,
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: authApi.resendRegisterOtp,
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: authApi.verifyRegisterOtp,
  });
};

export const useCompleteRegistrationMutation = (onSuccessRedirect?: AuthSuccessCallback) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.completeRegistration,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      onSuccessRedirect?.();
    },
  });
};