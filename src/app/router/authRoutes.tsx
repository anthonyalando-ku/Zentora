import React, { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/features/auth/pages/RegisterPage"));

export const authRoutes = [
  {
    path: "/auth/login",
    element: (
      <Suspense fallback={<LoaderFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <Suspense fallback={<LoaderFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
];