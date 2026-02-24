import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { type UserRole } from "@/features/auth/types";

type RoleRouteProps = {
  children: ReactNode;
  roles: UserRole[];
};

export const RoleRoute = ({ children, roles }: RoleRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const userRoles = user?.roles ?? [];

  if (!user || !roles.some((role) => userRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};