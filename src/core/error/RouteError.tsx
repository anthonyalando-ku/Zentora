// src/core/error/RouteError.tsx
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";

type RouteErrorProps = {
  /** Shown in the "Go back" button — pass "/admin" for admin shell errors */
  returnTo?: string;
};

export const RouteError = ({ returnTo = "/" }: RouteErrorProps) => {
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound =
    isRouteErrorResponse(error) && error.status === 404;

  const isChunkError =
    error instanceof TypeError &&
    error.message.toLowerCase().includes("failed to fetch dynamically");

  if (isChunkError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <span className="text-5xl">🔄</span>
        <h2 className="text-2xl font-semibold mt-4">New Version Available</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          We've just shipped an update. Refresh to get the latest version.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 btn-primary"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          This page doesn't exist or may have been moved.
        </p>
        <button onClick={() => navigate(returnTo)} className="mt-6 btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <span className="text-5xl">⚠️</span>
      <h2 className="text-2xl font-semibold mt-4">Something Went Wrong</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        An unexpected error occurred. Try again or go back.
      </p>
      <div className="flex gap-3 mt-6">
        <button onClick={() => window.location.reload()} className="btn-outline">
          Try Again
        </button>
        <button onClick={() => navigate(returnTo)} className="btn-primary">
          Go Back
        </button>
      </div>
    </div>
  );
};