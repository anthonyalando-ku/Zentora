import { Link } from "react-router-dom";
import { useAdminUiStore } from "@/features/admin/shared/store/adminUiStore";
import { cn } from "@/shared/utils/cn";

export const AdminTopbar = () => {
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAdminUiStore((s) => s.toggleSidebar);

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
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

          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">Admin Console</div>
            <div className="text-xs text-foreground/50 -mt-0.5">Manage products, inventory, and orders</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={cn(
              "inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm",
              "border border-border hover:bg-secondary/10"
            )}
          >
            View Storefront
          </Link>
        </div>
      </div>
    </header>
  );
};