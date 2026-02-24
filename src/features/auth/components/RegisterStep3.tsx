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
  onNext: (data: {
    firstName: string;
    lastName: string;
    password: string;
  }) => void;
  onBack: () => void;
  onComplete: () => void;
};

type FormValues = z.infer<typeof registerProfileSchema>;

export const RegisterStepProfile = ({
  email,
  token,
  onNext,
  onBack,
  onComplete,
}: Props) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(registerProfileSchema),
  });

  const { mutateAsync, isPending, error } = useCompleteRegistrationMutation(() => {
    console.log("Registration complete!");
    navigate("/user/home", { replace: true });
  });

  const submit = async (values: FormValues) => {
    await mutateAsync({
      email,
      token,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    });

    onNext({
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    });

    onComplete();
  };

  const errorMessage =
  error instanceof AppError
    ? `${error.message}${error.details ? ` - ${String(error.details)}` : ""}`
    : "Unable to complete registration";

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <p className="text-sm text-foreground/60 text-center">
        Verified: <span className="font-medium">{email}</span>
      </p>

      <div className="flex gap-4">
        <Input
          placeholder="First name"
          {...register("firstName")}
          error={formState.errors.firstName?.message}
        />
        <Input
          placeholder="Last name"
          {...register("lastName")}
          error={formState.errors.lastName?.message}
        />
      </div>

      <Input
        type="password"
        placeholder="Create password"
        {...register("password")}
        error={formState.errors.password?.message}
      />

      <Input
        type="password"
        placeholder="Confirm password"
        {...register("confirmPassword")}
        error={formState.errors.confirmPassword?.message}
      />

      <div className="flex gap-2">
        <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="w-full" loading={isPending}>
          Create Account
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">
          {errorMessage}
        </p>
      )}
    </form>
  );
};