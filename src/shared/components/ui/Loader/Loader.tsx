import { cn } from "@/shared/utils/cn";

type LoaderProps = {
  className?: string;
};

export const Loader = ({ className }: LoaderProps) => {
  return (
    <span
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};