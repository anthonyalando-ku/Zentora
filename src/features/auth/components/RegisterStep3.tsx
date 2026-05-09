import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerProfileSchema } from "../validation/authSchemas";
import { z } from "zod";
import { Button, Input } from "@/shared/components/ui";
import { useCompleteRegistrationMutation } from "../hooks/useAuthMutations";
import { AppError } from "@/core/error/AppError";
import { useNavigate } from "react-router-dom";

type Props = {
  email: string;
  token: string;
  onNext: (data: { firstName: string; lastName: string; password: string }) => void;
  onBack: () => void;
  onComplete: () => void;
};

type FormValues = z.infer<typeof registerProfileSchema>;

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

const PasswordToggle = ({
  show,
  onToggle,
  label,
}: {
  show: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground/70 transition-colors p-1"
    aria-label={label}
  >
    <EyeIcon open={show} />
  </button>
);

export const RegisterStepProfile = ({ email, token, onNext, onBack, onComplete }: Props) => {
  const navigate = useNavigate();
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(registerProfileSchema),
  });

  const { mutateAsync, isPending, error } = useCompleteRegistrationMutation(() => {
    navigate("/", { replace: true });
  });

  const submit = async (values: FormValues) => {
    await mutateAsync({
      email,
      token,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    });
    onNext({ firstName: values.firstName, lastName: values.lastName, password: values.password });
    onComplete();
  };

  const errorMessage =
    error instanceof AppError
      ? `${error.message}${error.details ? ` — ${String(error.details)}` : ""}`
      : "Unable to complete registration. Please try again.";

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>

      {/* Verified email confirmation */}
      <div className="rounded-xl bg-green-500/8 border border-green-500/20 px-4 py-2.5 flex items-center gap-2.5">
        <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-foreground/70">
          Verified: <span className="font-semibold text-foreground">{email}</span>
        </p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="reg-first" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
            First name
          </label>
          <Input
            id="reg-first"
            placeholder="First name"
            {...register("firstName")}
            error={formState.errors.firstName?.message}
            className="h-11 rounded-xl"
            autoComplete="given-name"
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="reg-last" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
            Last name
          </label>
          <Input
            id="reg-last"
            placeholder="Last name"
            {...register("lastName")}
            error={formState.errors.lastName?.message}
            className="h-11 rounded-xl"
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-pw" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
          Password
        </label>
        <div className="relative">
          <Input
            id="reg-pw"
            type={showPw ? "text" : "password"}
            placeholder="Create a password"
            {...register("password")}
            error={formState.errors.password?.message}
            className="h-11 rounded-xl pr-11"
            autoComplete="new-password"
          />
          <PasswordToggle
            show={showPw}
            onToggle={() => setShowPw((v) => !v)}
            label={showPw ? "Hide password" : "Show password"}
          />
        </div>
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-cpw" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
          Confirm password
        </label>
        <div className="relative">
          <Input
            id="reg-cpw"
            type={showCpw ? "text" : "password"}
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            error={formState.errors.confirmPassword?.message}
            className="h-11 rounded-xl pr-11"
            autoComplete="new-password"
          />
          <PasswordToggle
            show={showCpw}
            onToggle={() => setShowCpw((v) => !v)}
            label={showCpw ? "Hide confirm password" : "Show confirm password"}
          />
        </div>
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
      <div className="flex gap-2.5 pt-1">
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
          {isPending ? "Creating account…" : "Create account"}
        </Button>
      </div>

    </form>
  );
};