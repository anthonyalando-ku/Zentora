import { type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn("rounded-lg border border-border bg-background p-4", className)}>
      {children}
    </div>
  );
};