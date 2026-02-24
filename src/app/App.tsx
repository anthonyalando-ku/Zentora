import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router/index";

export const App = () => {
  return <RouterProvider router={appRouter} />;
};