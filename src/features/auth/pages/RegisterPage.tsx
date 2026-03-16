import { AuthLayout } from "@/shared/layouts";
import { RegisterFlow } from "../components/RegisterFlow";

const RegisterPage = () => {
  return (
    <AuthLayout title="Create your account" subtitle="Join Zentora to track orders, save addresses, and checkout faster">
      <RegisterFlow />
    </AuthLayout>
  );
};

export default RegisterPage;