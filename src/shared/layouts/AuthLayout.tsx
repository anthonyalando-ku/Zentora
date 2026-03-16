import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CenteredLayout } from "./CenteredLayout";
import { Card } from "@/shared/components/ui";
import logo from "@/assets/zentora_logo_clear.png";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <CenteredLayout>
      <div className="w-full px-4 py-10 bg-gradient-to-b from-background to-secondary/5">
        <div className="mx-auto w-full max-w-[460px]">
          <Card className="w-full rounded-2xl shadow-lg border border-border bg-background p-6 sm:p-10">
            {/* LOGO + TITLE */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center">
                <img src={logo} alt="Zentora Logo" className="h-16 w-16 object-contain" />
              </Link>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground">{title}</h1>

              {subtitle && (
                <p className="mt-2 text-sm text-foreground/60 max-w-sm">
                  {subtitle}
                </p>
              )}
            </div>

            {/* CONTENT */}
            <div className="space-y-6">{children}</div>

            {/* Footer note */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-foreground/50">
                By continuing, you agree to our{" "}
                <span className="text-primary font-medium">Terms</span> and{" "}
                <span className="text-primary font-medium">Privacy Policy</span>.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </CenteredLayout>
  );
};