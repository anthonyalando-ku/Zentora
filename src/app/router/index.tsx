import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";

export const appRouter = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
]);