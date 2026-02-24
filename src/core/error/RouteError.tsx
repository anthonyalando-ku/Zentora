import { useRouteError } from "react-router-dom";

export const RouteError = () => {
  const error = useRouteError();

  return (
    <div role="alert">
      <h1>Page Error</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};