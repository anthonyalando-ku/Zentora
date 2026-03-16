import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/authSchemas";
import { z } from "zod";
import { Button, Input } from "@/shared/components/ui";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { AppError } from "@/core/error/AppError";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { /*LucideGoogle,*/ LucideFacebook } from "lucide-react";

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

  const errorMessage =
    error instanceof AppError
      ? `${error.message}${error.details ? ` - ${String(error.details)}` : ""}`
      : "Login failed";

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-xs font-medium text-foreground/60">Email or phone</label>
        <Input
          type="text"
          placeholder="Email or phone"
          {...register("email")}
          error={errors.email?.message}
          className="mt-1 h-11 rounded-lg"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-foreground/60">Password</label>
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
          error={errors.password?.message}
          className="mt-1 h-11 rounded-lg"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-foreground/70">
          <input type="checkbox" className="h-4 w-4 rounded border-border" />
          Remember me
        </label>

        <Link to="/forgot-password" className="text-primary font-medium hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={isPending} className="w-full h-11 rounded-lg">
        Login
      </Button>

      {error && <p className="text-sm text-destructive text-center">{errorMessage}</p>}

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-foreground/50 tracking-widest">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="w-full h-11 rounded-lg justify-center gap-2">
        <span className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">
          G
        </span>
        Continue with Google
      </Button>

     <Button variant="outline" className="w-full h-11 rounded-lg justify-center gap-2">
      <LucideFacebook className="w-5 h-5" />
      Continue with Facebook
    </Button>

      <p className="text-sm text-center">
        Don’t have an account?{" "}
        <Link to="/auth/register" className="text-primary font-medium hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
};