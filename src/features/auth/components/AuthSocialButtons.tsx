//import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui";
import { LucideFacebook } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type Provider = "google" | "facebook";

type Props = {
  /** Hide the whole section (used by login/register pages to toggle socials on/off) */
  show?: boolean;
  /** Optional label override (e.g. "Continue with" / "Sign in with") */
  verb?: string;
  /** Optional divider label */
  dividerText?: string;
  /** Called when user clicks a provider button (UI only for now) */
  onClick?: (provider: Provider) => void;
  className?: string;
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-5 h-5", className)}
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.59 32.657 29.14 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.532 6.053 29.53 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.532 6.053 29.53 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.424 0 10.323-2.007 14.036-5.272l-6.48-5.487C29.53 34.934 26.898 36 24 36c-5.118 0-9.555-3.318-11.292-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a11.94 11.94 0 0 1-3.747 5.241l.003-.002 6.48 5.487C37.638 39.1 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z"
    />
  </svg>
);

export function AuthSocialButtons({
  show = true,
  verb = "Continue with",
  dividerText = "OR",
  onClick,
  className,
}: Props) {
  if (!show) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-foreground/50 tracking-widest">{dividerText}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        className="w-full h-11 rounded-lg justify-center"
        leftIcon={<GoogleIcon />}
        onClick={(e) => {
          e.preventDefault();
          onClick?.("google");
        }}
      >
        {verb} Google
      </Button>

      <Button
        variant="outline"
        className="w-full h-11 rounded-lg justify-center"
        leftIcon={<LucideFacebook className="w-5 h-5" />}
        onClick={(e) => {
          e.preventDefault();
          onClick?.("facebook");
        }}
      >
        {verb} Facebook
      </Button>
    </div>
  );
}