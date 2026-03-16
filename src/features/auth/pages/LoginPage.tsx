import { AuthLayout } from "@/shared/layouts";
import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue shopping on Zentora">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;