import { Helmet } from "react-helmet-async";
import { AuthLayout } from "@/shared/layouts";
import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Sign In | Zentora Kenya</title>
        <meta
          name="description"
          content="Sign in to your Zentora account to track orders, manage returns and checkout faster."
        />
        <link rel="canonical" href="https://zentorashop.co.ke/auth/login" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to continue shopping on Zentora"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default LoginPage;