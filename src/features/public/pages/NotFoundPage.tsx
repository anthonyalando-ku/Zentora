// src/features/public/pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <button onClick={() => navigate("/")} className="mt-6 btn-primary">
        Back to Home
      </button>
    </div>
  );
};