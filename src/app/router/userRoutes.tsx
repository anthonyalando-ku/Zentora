import { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
import { ProtectedRoute } from "@/core/guards/ProtectedRoute";
import { RouteError } from "@/core/error/RouteError";
import { lazyWithRetry } from "@/shared/utils/lazyWithRetry";
const UserHomePage = lazyWithRetry(() => import("@/features/user/home/pages/UserHomePage"));
const OrderDetailsPage = lazyWithRetry(() => import("@/features/account/pages/OrderDetailsPage"));

export const userRoutes = [
  {
    path: "/user/home",
    errorElement: <RouteError returnTo="/user/home" />,
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoaderFallback />}>
          <UserHomePage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/account/orders/:id",
    errorElement: <RouteError returnTo="/account/orders/:id" />,
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoaderFallback />}>
          <OrderDetailsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
];