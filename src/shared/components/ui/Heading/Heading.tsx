import { type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type HeadingSize = "xl" | "lg" | "md";

type HeadingProps = {
  children: ReactNode;
  size?: HeadingSize;
  className?: string;
};

const sizeStyles: Record<HeadingSize, string> = {
  xl: "text-2xl font-semibold",
  lg: "text-xl font-semibold",
  md: "text-lg font-semibold",
};

export const Heading = ({ children, size = "xl", className }: HeadingProps) => {
  return <h1 className={cn(sizeStyles[size], className)}>{children}</h1>;
};