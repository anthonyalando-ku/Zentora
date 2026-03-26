import { cn } from "@/shared/utils/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-foreground/10", className)} aria-hidden="true" />
);