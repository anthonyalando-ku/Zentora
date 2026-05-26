// CHANGES vs original:
//
// 1. Added <Helmet> with noindex,nofollow robots tag — 404 pages must never be
//    indexed. Without this, Google may index the page and dilute crawl budget.
// 2. Added a meaningful <title> so browser tabs and any error-logging tools
//    show a recognisable label instead of inheriting the previous page title.
//
// UI is unchanged.

import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Page Not Found (404) | Zentora</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

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
    </>
  );
};