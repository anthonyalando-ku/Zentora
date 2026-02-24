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
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Input
        type="email"
        placeholder="Enter your email"
        {...register("email")}
        error={formState.errors.email?.message}
      />

      <Button type="submit" className="w-full" loading={isPending}>
        Continue
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">
          {errorMessage}
        </p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4 my-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-foreground/50">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="w-full">
        Continue with Google
      </Button>

      <Button variant="outline" className="w-full">
        Continue with Facebook
      </Button>

      <p className="text-sm text-center mt-2">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>

    </form>
  );
};