import { Helmet } from "react-helmet-async";
import { AuthLayout } from "@/shared/layouts";
import { RegisterFlow } from "../components/RegisterFlow";

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Create Account | Zentora Kenya</title>
        <meta
          name="description"
          content="Create a free Zentora account to track orders, save delivery addresses and checkout faster."
        />
        <link rel="canonical" href="https://zentorashop.co.ke/auth/register" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <AuthLayout
        title="Create your account"
        subtitle="Join Zentora to track orders, save addresses, and checkout faster"
      >
        <RegisterFlow />
      </AuthLayout>
    </>
  );
};

export default RegisterPage;