import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to top on navigation.
 * - Uses pathname + search to catch query-based navigations (filters/search/etc).
 */
export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
};