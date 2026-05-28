import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

type NavLink = { label: string; href: string };

type MobileMenuProps = {
  open: boolean;
  navLinks: NavLink[];
  pathname: string;
  onClose: () => void;
  isAdmin?: boolean;
  isLogin?: boolean;
};

/**
 * Hamburger drawer for mobile.
 *
 * Search was moved out of this menu into a dedicated top-sheet overlay
 * (SearchOverlay) triggered by the header search icon. Categories were
 * moved into a dedicated side drawer (CategoriesDrawer) triggered by the
 * bottom-nav Categories tab. As a result this drawer is now focused on
 * primary navigation + account/admin shortcuts.
 */
export const MobileMenu = ({
  open,
  navLinks,
  pathname,
  onClose,
  isLogin = false,
  isAdmin = false,
}: MobileMenuProps) => {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[55]" role="dialog" aria-modal="true" aria-label="Menu">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] animate-in fade-in duration-150"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[86%] max-w-[320px]",
          "bg-background shadow-2xl flex flex-col",
          "animate-in slide-in-from-left-12 duration-200",
        )}
      >
        {/* Account card */}
<div className="px-4 pt-4 pb-3 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground">
  <div className="flex items-center justify-between mb-3">
    <span className="text-[15px] font-bold tracking-tight">Zentora</span>

    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-white/20 text-white"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  </div>

  {isLogin ? (
    <Link to="/account" onClick={onClose} className="flex items-center gap-3">
      <span className="h-11 w-11 rounded-full bg-white/25 grid place-items-center flex-shrink-0">
        <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="8" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      </span>

      <span>
        <span className="block text-sm font-semibold leading-tight">My Account</span>
        <span className="block text-xs opacity-85 mt-0.5">View orders, wallet & settings</span>
      </span>
    </Link>
  ) : (
    <Link to="/login" onClick={onClose} className="flex items-center gap-3">
      <span className="h-11 w-11 rounded-full bg-white/25 grid place-items-center flex-shrink-0">
        <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m12 0l-4-4m4 4l-4 4" />
        </svg>
      </span>

      <span>
        <span className="block text-sm font-semibold leading-tight">Welcome</span>
        <span className="block text-xs opacity-85 mt-0.5">Sign in to continue</span>
      </span>
    </Link>
  )}
</div>
        {/* Primary nav */}
        <div className="flex-1 overflow-y-auto py-2">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={`${link.href}::${link.label}`}
                to={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between h-11 px-4 text-sm transition-colors",
                  active
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-foreground/80 hover:bg-muted/60 font-medium"
                )}
              >
                <span>{link.label}</span>
                <svg className="w-3.5 h-3.5 text-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="h-px bg-border my-2 mx-4" />
              <Link
                to="/admin"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 h-11 px-4 text-sm font-semibold transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/75 hover:bg-muted/60"
                )}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Admin Console
              </Link>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};
