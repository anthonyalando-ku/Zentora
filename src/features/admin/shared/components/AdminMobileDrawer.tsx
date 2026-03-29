import React, { useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/shared/utils/cn";

export const AdminMobileDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    // prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* drawer */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-[92%] max-w-[320px]",
          "bg-background border-r border-border shadow-xl",
          "animate-[drawerIn_180ms_ease-out]"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        {/* Close button row */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <div className="text-sm font-semibold">Menu</div>
          <button
            type="button"
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border hover:bg-secondary/10"
            onClick={onClose}
            aria-label="Close admin menu"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        {/* Sidebar content scroll */}
        <div className="h-[calc(100%-64px)] overflow-y-auto">
          <AdminSidebar />
        </div>

        <style>
          {`
            @keyframes drawerIn {
              from { transform: translateX(-14px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}
        </style>
      </div>
    </div>
  );
};