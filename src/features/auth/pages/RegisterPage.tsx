import { AuthLayout } from "@/shared/layouts";
//import { RegisterForm } from "../components/RegisterForm";
import { RegisterFlow } from "../components/RegisterFlow";

const RegisterPage = () => {
  return (
    <AuthLayout 
    title="Register"
    subtitle="Welcome to zentora. Sign up">
      <RegisterFlow />
    </AuthLayout>
  );
};

export default RegisterPage;