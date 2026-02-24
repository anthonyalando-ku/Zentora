// src/shared/components/ui/LoaderFallback.tsx
import { Loader } from "./Loader";

export const LoaderFallback = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader className="h-10 w-10 border-4 border-t-primary" />
    </div>
  );
};