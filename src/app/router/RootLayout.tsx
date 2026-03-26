import { Outlet } from "react-router-dom";
import { RouteUX } from "@/shared/router/RouteUX";

export const RootLayout = () => {
  return (
    <>
      <RouteUX />
      <Outlet />
    </>
  );
};