import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/authSchemas";
import { z } from "zod";
import { Button, Input } from "@/shared/components/ui";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { AppError } from "@/core/error/AppError";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync, isPending, error } = useLoginMutation(() => {
    console.log("Login successful!");
    navigate("/user/home", { replace: true });
  });

  const onSubmit = async (values: LoginFormValues) => {
    await mutateAsync(values);
  };

  // const errorMessage =
  //   error instanceof AppError ? error.message : "Unable to login";
  const errorMessage =
  error instanceof AppError
    ? `${error.message}${error.details ? ` - ${String(error.details)}` : ""}`
    : "Login failed";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Email or Phone */}
      <Input
        type="text"
        placeholder="Email or phone"
        {...register("email")}
        error={errors.email?.message}
      />

      {/* Password */}
      <Input
        type="password"
        placeholder="Password"
        {...register("password")}
        error={errors.password?.message}
      />

      {/* Forgot + Remember */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
          />
          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <Button type="submit" loading={isPending} className="w-full">
        Login
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

      {/* Social Logins */}
      <Button variant="outline" className="w-full">
        Continue with Google
      </Button>

      <Button variant="outline" className="w-full">
        Continue with Facebook
      </Button>

      {/* Create Account */}
      <p className="text-sm text-center mt-2">
        Don’t have an account?{" "}
        <Link
          to="/auth/register"
          className="text-primary font-medium hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  );
};