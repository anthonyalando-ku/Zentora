import { type ReactNode } from "react";
import { CenteredLayout } from "./CenteredLayout";
import { Card, /* Heading */} from "@/shared/components/ui";
import logo from "@/assets/zentora_logo_clear.png";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <CenteredLayout>
      <Card className="w-full max-w-md p-8">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="FoundationX Logo"
            className="h-16 w-16 object-contain"
            />
          <h1 className="mt-4 text-2xl font-semibold text-center">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-foreground/60 text-center">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </Card>
    </CenteredLayout>
  );
};