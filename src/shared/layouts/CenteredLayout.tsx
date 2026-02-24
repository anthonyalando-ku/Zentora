import { type ReactNode } from "react";

export const CenteredLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-6">
      {children}
    </div>
  );
};