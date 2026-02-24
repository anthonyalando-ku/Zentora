import { AuthLayout } from "@/shared/layouts";
import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Sign in to your account">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;