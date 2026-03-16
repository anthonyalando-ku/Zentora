import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerEmailSchema } from "../validation/authSchemas";
import { z } from "zod";
import { Button, Input } from "@/shared/components/ui";
import { useRegisterEmailMutation } from "../hooks/useAuthMutations";
import { AppError } from "@/core/error/AppError";
import { Link } from "react-router-dom";

type Props = {
  onNext: (data: { email: string; emailToken: string }) => void;
};

type FormValues = z.infer<typeof registerEmailSchema>;

export const RegisterStepEmail = ({ onNext }: Props) => {
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
      ? `${error.message}${error.details ? ` - ${String(error.details)}` : ""}`
      : "Unable to send email";

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <div>
        <label className="text-xs font-medium text-foreground/60">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={formState.errors.email?.message}
          className="mt-1 h-11 rounded-lg"
        />
      </div>

      <Button type="submit" className="w-full h-11 rounded-lg" loading={isPending}>
        Continue
      </Button>

      {error && <p className="text-sm text-destructive text-center">{errorMessage}</p>}

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-foreground/50 tracking-widest">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* OAuth buttons (UI only) */}
      <Button variant="outline" className="w-full h-11 rounded-lg justify-center gap-2">
        <span className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">
          G
        </span>
        Continue with Google
      </Button>

      <Button variant="outline" className="w-full h-11 rounded-lg justify-center gap-2">
        <span className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">
          f
        </span>
        Continue with Facebook
      </Button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};