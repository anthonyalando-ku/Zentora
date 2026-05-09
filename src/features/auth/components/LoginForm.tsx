import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/authSchemas";
import { z } from "zod";
import { Button, Input } from "@/shared/components/ui";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { AppError } from "@/core/error/AppError";
import { Link, useNavigate } from "react-router-dom";
import { AuthSocialButtons } from "@/features/auth/components/AuthSocialButtons";

type LoginFormValues = z.infer<typeof loginSchema>;

type Props = {
  showSocials?: boolean;
};

export const LoginForm = ({ showSocials = false }: Props) => {
  const navigate  = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync, isPending, error } = useLoginMutation(() => {
    navigate("/", { replace: true });
  });

  const onSubmit = async (values: LoginFormValues) => {
    await mutateAsync(values);
  };

  const errorMessage =
    error instanceof AppError
      ? `${error.message}${error.details ? ` — ${String(error.details)}` : ""}`
      : "Login failed. Please check your credentials.";

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>

      {/* Email / phone */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
          Email or phone
        </label>
        <Input
          id="login-email"
          type="text"
          placeholder="you@email.com"
          {...register("email")}
          error={errors.email?.message}
          className="h-11 rounded-xl"
          autoComplete="email"
          autoFocus
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
            Password
          </label>

          {/* ── Forgot password — disabled until implemented ── */}
          <span
            className="relative group"
            aria-label="Password reset coming soon"
          >
            <span
              className="text-xs text-foreground/30 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              Forgot password?
            </span>
            {/* Tooltip */}
            <span className="
              absolute bottom-full right-0 mb-1.5 px-2.5 py-1.5 rounded-lg
              bg-foreground text-background text-[10px] font-medium whitespace-nowrap
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-10
              shadow-lg
            ">
              Coming soon
              <span className="absolute top-full right-3 border-4 border-transparent border-t-foreground" />
            </span>
          </span>
        </div>

        <div className="relative">
          <Input
            id="login-password"
            type={showPw ? "text" : "password"}
            placeholder="Your password"
            {...register("password")}
            error={errors.password?.message}
            className="h-11 rounded-xl pr-11"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground/70 transition-colors p-1"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
        />
        <span className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
          Remember me
        </span>
      </label>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3">
          <svg className="w-4 h-4 text-destructive shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-destructive leading-snug">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        loading={isPending}
        className="w-full h-11 rounded-xl font-semibold text-sm mt-1"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <AuthSocialButtons
        show={showSocials}
        verb="Continue with"
        onClick={(provider) => {
          console.log("social login clicked:", provider);
        }}
      />

      <p className="text-sm text-center text-foreground/55">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="text-primary font-semibold hover:underline underline-offset-2"
        >
          Create account
        </Link>
      </p>
    </form>
  );
};