import React, { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
import { RouteError } from "@/core/error/RouteError";
const HomePage = React.lazy(() => import("@/features/public/home/pages/HomePage"));
const UnauthorizedPage = React.lazy(() => import("@/features/public/unauthorized/pages/UnauthorizedPage"));

export const publicRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoaderFallback />}>
        <HomePage />
      </Suspense>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<LoaderFallback />}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
];