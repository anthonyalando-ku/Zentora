import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      ...authRoutes,
      ...userRoutes,
      ...adminRoutes,
    ],
  },
]);