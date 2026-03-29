import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminUiStore } from "@/features/admin/shared/store/adminUiStore";
import { cn } from "@/shared/utils/cn";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "A";
};

export const AdminTopbar = ({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu?: () => void;
}) => {
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAdminUiStore((s) => s.toggleSidebar);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // placeholder admin identity (wire to real user later)
  const adminName = "Admin User";
  const initials = useMemo(() => getInitials(adminName), [adminName]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3">
        {/* Left: desktop collapse toggle + mobile hamburger */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden inline-flex w-10 h-10 items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition"
            aria-label="Open admin menu"
            title="Menu"
          >
            <svg className="w-5 h-5 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:inline-flex w-10 h-10 items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-5 h-5 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="min-w-0 hidden sm:block">
            <div className="text-sm font-semibold text-foreground">Admin Console</div>
            <div className="text-xs text-foreground/50 -mt-0.5">Manage products, inventory, and orders</div>
          </div>
        </div>

        {/* Center: Global search (placeholder) */}
        <div className="flex-1 flex justify-center min-w-0">
          <div className="hidden md:flex w-full max-w-xl">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>

              <input
                type="search"
                placeholder="Search products, orders, customers… (coming soon)"
                className={cn(
                  "w-full h-10 rounded-xl border border-border bg-background pl-9 pr-3 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20"
                )}
                disabled
                aria-label="Admin global search"
              />
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Notifications placeholder */}
          <button
            type="button"
            className="inline-flex w-10 h-10 items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg className="w-5 h-5 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a3 3 0 0 0 6 0" />
            </svg>
          </button>

          {/* View storefront */}
          <Link
            to="/"
            className={cn(
              "hidden sm:inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm",
              "border border-border hover:bg-secondary/10"
            )}
          >
            View Storefront
          </Link>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border hover:bg-secondary/10 transition px-2.5 h-10"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                {initials}
              </span>
              <span className="hidden lg:block text-sm font-medium text-foreground/80">{adminName}</span>
              <svg className="w-4 h-4 text-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {profileOpen && (
              <div
                className={cn(
                  "absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background shadow-lg overflow-hidden",
                  "animate-[dropdown_120ms_ease-out]"
                )}
                role="menu"
              >
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-semibold">{adminName}</div>
                  <div className="text-xs text-foreground/50">Administrator</div>
                </div>

                <div className="p-2">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary/10 transition"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    Admin profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary/10 transition"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>

                  <div className="h-px bg-border my-2" />

                  <button
                    type="button"
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary/10 transition text-destructive"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      // hook into your existing logout flow when ready
                      // e.g. adminAuthStore.logout()
                    }}
                  >
                    Logout
                  </button>
                </div>

                <style>
                  {`
                    @keyframes dropdown {
                      from { opacity: 0; transform: translateY(-6px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}
                </style>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};