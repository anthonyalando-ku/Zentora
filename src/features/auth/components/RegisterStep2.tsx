import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema } from "../validation/authSchemas";
import { z } from "zod";
import { Button, Input } from "@/shared/components/ui";
import { useVerifyOtpMutation, useResendOtpMutation } from "../hooks/useAuthMutations";
import { AppError } from "@/core/error/AppError";

type Props = {
  email: string;
  token: string;
  onNext: (data: { otp: string; verifyToken: string }) => void;
  onBack: () => void;
};

type FormValues = z.infer<typeof verifyOtpSchema>;

export const RegisterStepOtp = ({ email, token, onNext, onBack }: Props) => {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const { mutateAsync, isPending, error } = useVerifyOtpMutation();
  const {
    mutateAsync: resendOtp,
    isPending: isResending,
    error: resendError,
  } = useResendOtpMutation();

  const submit = async (values: FormValues) => {
    const result = await mutateAsync({
      email,
      token,
      otp: values.otp,
    });
    onNext({ otp: values.otp, verifyToken: result.token });
  };

  const handleResend = async () => {
    await resendOtp({ email, token });
  };

  const errorMessage =
    error instanceof AppError
      ? `${error.message}${error.details ? ` - ${String(error.details)}` : ""}`
      : "Unable to verify OTP";

  const resendErrorMessage =
    resendError instanceof AppError
      ? `${resendError.message}${resendError.details ? ` - ${String(resendError.details)}` : ""}`
      : "Unable to resend OTP";

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <p className="text-sm text-foreground/60 text-center">
        We sent a code to <span className="font-medium">{email}</span>
      </p>

      <Input
        placeholder="Enter OTP"
        {...register("otp")}
        error={formState.errors.otp?.message}
      />

      <div className="flex gap-2">
        <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="w-full" loading={isPending}>
          Verify OTP
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">
          {errorMessage}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleResend}
        loading={isResending}
      >
        Resend OTP
      </Button>

      {resendError && (
        <p className="text-sm text-destructive text-center">
          {resendErrorMessage}
        </p>
      )}
    </form>
  );
};