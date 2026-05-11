import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

/**
 * Global route-transition progress bar.
 *
 * Why two signals?
 * ─────────────────────────────────────────────────────────────────────────────
 * React Router's `useNavigation().state` only goes "loading" when a route has
 * a loader function. Since every route here uses React.lazy + <Suspense>, the
 * chunk fetch happens *inside* React's render cycle — the navigation is already
 * "idle" from the router's perspective while the bundle is still downloading.
 *
 * So we combine two signals:
 *   1. navigation.state !== "idle"  → covers loader-based navigations
 *   2. location key change          → fires on every navigation; we stay "active"
 *      until the *next* render after the key settles (i.e. Suspense resolved)
 *
 * A short leading delay (120 ms) avoids flicker on cached/fast transitions.
 * A short trailing delay (180 ms) keeps the bar visible long enough to be seen.
 */
export const RouteProgress = ({ className }: { className?: string }) => {
  const navigation = useNavigation();
  const location   = useLocation();

  const [active, setActive] = useState(false);

  // Track previous location key to detect navigations
  const prevKeyRef    = useRef(location.key);
  const showTimerRef  = useRef<number | undefined>(undefined);
  const hideTimerRef  = useRef<number | undefined>(undefined);

  useEffect(() => {
    const routerNavigating = navigation.state !== "idle";
    const locationChanged  = location.key !== prevKeyRef.current;

    if (routerNavigating || locationChanged) {
      // Clear any pending hide
      window.clearTimeout(hideTimerRef.current);

      // Small leading delay — skip bar for instant navigations
      showTimerRef.current = window.setTimeout(() => {
        setActive(true);
      }, 120);
    }

    if (!routerNavigating && locationChanged) {
      // Location settled — hide after a short hold so the bar is visible
      prevKeyRef.current = location.key;
      window.clearTimeout(showTimerRef.current);

      hideTimerRef.current = window.setTimeout(() => {
        setActive(false);
      }, 350);
    }

    return () => {
      window.clearTimeout(showTimerRef.current);
      window.clearTimeout(hideTimerRef.current);
    };
  }, [navigation.state, location.key]);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9999] h-0.5 w-full",
          className
        )}
        aria-hidden="true"
      >
        {/* Track */}
        <div className="h-full w-full bg-primary/15" />

        {/* Animated indicator */}
        <div
          className={cn(
            "absolute inset-0 h-full bg-primary transition-opacity duration-200",
            active ? "opacity-100" : "opacity-0"
          )}
          style={{
            width: "40%",
            animation: active
              ? "zentora-progress 1.1s ease-in-out infinite"
              : "none",
          }}
        />
      </div>

      <style>{`
        @keyframes zentora-progress {
          0%   { transform: translateX(-110%); }
          60%  { transform: translateX(160%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </>
  );
};