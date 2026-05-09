import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerEmailSchema } from "../validation/authSchemas";
import { z } from "zod";
import { Button, Input } from "@/shared/components/ui";
import { useRegisterEmailMutation } from "../hooks/useAuthMutations";
import { AppError } from "@/core/error/AppError";
import { Link } from "react-router-dom";
import { AuthSocialButtons } from "@/features/auth/components/AuthSocialButtons";

type Props = {
  onNext: (data: { email: string; emailToken: string }) => void;
  showSocials?: boolean;
};

type FormValues = z.infer<typeof registerEmailSchema>;

export const RegisterStepEmail = ({ onNext, showSocials = false }: Props) => {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(registerEmailSchema),
  });

  const { mutateAsync, isPending, error } = useRegisterEmailMutation();

  const submit = async (values: FormValues) => {
    const result = await mutateAsync(values);
    onNext({ email: values.email, emailToken: result.token });
  };

  const errorMessage =
    error instanceof AppError
      ? `${error.message}${error.details ? ` — ${String(error.details)}` : ""}`
      : "Unable to send verification email. Please try again.";

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>

      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
          Email address
        </label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@email.com"
          {...register("email")}
          error={formState.errors.email?.message}
          className="h-11 rounded-xl"
          autoComplete="email"
          autoFocus
        />
        <p className="text-[11px] text-foreground/40 mt-1">
          We'll send a verification code to this address.
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

      <Button
        type="submit"
        className="w-full h-11 rounded-xl font-semibold text-sm"
        loading={isPending}
      >
        {isPending ? "Sending code…" : "Continue"}
      </Button>

      <AuthSocialButtons
        show={showSocials}
        verb="Continue with"
        onClick={(provider) => {
          console.log("social register clicked:", provider);
        }}
      />

      <p className="text-sm text-center text-foreground/55">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary font-semibold hover:underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  );
};