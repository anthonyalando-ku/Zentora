import { RouteProgress } from "@/shared/components/ui/RouteProgress/RouteProgress";
import { ScrollToTop } from "@/shared/router/ScrollToTop";

export const RouteUX = () => {
  return (
    <>
      <RouteProgress />
      <ScrollToTop />
    </>
  );
};