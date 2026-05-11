import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { RouteError } from "@/core/error/RouteError"; // ← import it
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";
import { NotFoundPage } from "@/features/public/pages/NotFoundPage";

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      ...publicRoutes,
      ...authRoutes,
      ...userRoutes,
      ...adminRoutes,
      { path: "*", element: <NotFoundPage /> }, // ← catch-all 404
    ],
  },
]);