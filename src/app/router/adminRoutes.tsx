import React, { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
import { RoleRoute } from "@/core/guards/RoleRoute";
const AdminHomePage = React.lazy(() => import("@/features/admin/home/pages/AdminHomePage"));

export const adminRoutes = [
  {
    path: "/admin/home",
    element: (
      <RoleRoute roles={["admin"]}>
        <Suspense fallback={<LoaderFallback />}>
          <AdminHomePage />
        </Suspense>
      </RoleRoute>
    ),
  },
];