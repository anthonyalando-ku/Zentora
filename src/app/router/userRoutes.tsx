import React, { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
import { ProtectedRoute } from "@/core/guards/ProtectedRoute";
const UserHomePage = React.lazy(() => import("@/features/user/home/pages/UserHomePage"));
const OrderDetailsPage = React.lazy(() => import("@/features/account/pages/OrderDetailsPage"));

export const userRoutes = [
  {
    path: "/user/home",
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
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoaderFallback />}>
          <OrderDetailsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
];