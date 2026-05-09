import { useEffect, useState } from "react";
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

const RESEND_COOLDOWN = 60; // seconds

export const RegisterStepOtp = ({ email, token, onNext, onBack }: Props) => {
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const { mutateAsync, isPending, error }               = useVerifyOtpMutation();
  const { mutateAsync: resendOtp, isPending: isResending } = useResendOtpMutation();

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const submit = async (values: FormValues) => {
    const result = await mutateAsync({ email, token, otp: values.otp });
    onNext({ otp: values.otp, verifyToken: result.token });
  };

  const handleResend = async () => {
    await resendOtp({ email, token });
    setCooldown(RESEND_COOLDOWN);
  };

  const errorMessage =
    error instanceof AppError
      ? `${error.message}${error.details ? ` — ${String(error.details)}` : ""}`
      : "Invalid or expired code. Please try again.";

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>

      {/* Email confirmation */}
      <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 flex items-center gap-3">
        <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        <p className="text-sm text-foreground/70 leading-snug">
          Code sent to{" "}
          <span className="font-semibold text-foreground">{email}</span>
        </p>
      </div>

      {/* OTP input */}
      <div className="space-y-1.5">
        <label htmlFor="otp-code" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
          Verification code
        </label>
        <Input
          id="otp-code"
          placeholder="• • • • • •"
          {...register("otp")}
          error={formState.errors.otp?.message}
          className="h-13 rounded-xl text-center tracking-[0.5em] text-xl font-bold"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          autoFocus
        />
        <p className="text-[11px] text-foreground/40">
          Enter the 6-digit code. Check your spam folder if it doesn't arrive.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3">
          <svg className="w-4 h-4 text-destructive shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-destructive leading-snug">{errorMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5">
        <Button
          type="button"
          variant="ghost"
          className="flex-1 h-11 rounded-xl"
          onClick={onBack}
          disabled={isPending}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-[2] h-11 rounded-xl font-semibold"
          loading={isPending}
        >
          {isPending ? "Verifying…" : "Verify code"}
        </Button>
      </div>

      {/* Resend with cooldown */}
      <div className="text-center">
        {cooldown > 0 ? (
          <p className="text-sm text-foreground/40">
            Resend code in{" "}
            <span className="font-semibold text-foreground/60 tabular-nums">
              {String(Math.floor(cooldown / 60)).padStart(2, "0")}:{String(cooldown % 60).padStart(2, "0")}
            </span>
          </p>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full h-10 rounded-xl text-sm"
            onClick={handleResend}
            loading={isResending}
          >
            Resend code
          </Button>
        )}
      </div>

    </form>
  );
};