import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

/**
 * Global route transition progress indicator.
 * - Uses React Router data router navigation state (createBrowserRouter).
 * - Adds small delay to avoid flicker on fast transitions.
 */
export const RouteProgress = ({ className }: { className?: string }) => {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t: number | undefined;

    if (isNavigating) {
      // delay show to avoid flicker
      t = window.setTimeout(() => setVisible(true), 180);
    } else {
      setVisible(false);
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [isNavigating]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[9999] h-0.5 w-full overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {visible ? (
        <div className="h-full w-full bg-primary/15">
          <div className="h-full w-[40%] bg-primary animate-[routeprogress_1.1s_ease-in-out_infinite]" />
        </div>
      ) : null}

      <style>
        {`
          @keyframes routeprogress {
            0% { transform: translateX(-110%); }
            60% { transform: translateX(140%); }
            100% { transform: translateX(240%); }
          }
        `}
      </style>
    </div>
  );
};