import React, { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
import { ProtectedRoute } from "@/core/guards/ProtectedRoute";
const UserHomePage = React.lazy(() => import("@/features/user/home/pages/UserHomePage"));

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
];