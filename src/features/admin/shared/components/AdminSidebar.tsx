import { NavLink, Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useAdminUiStore } from "@/features/admin/shared/store/adminUiStore";

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-secondary/10 text-foreground/70">
    {children}
  </span>
);

export const AdminSidebar = () => {
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);

  const items: NavItem[] = [
    {
      label: "Dashboard",
      to: "/admin",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM13 3h8v6h-8V3ZM3 17h8v4H3v-4Z" />
        </svg>
      ),
    },
    {
      label: "Products",
      to: "/admin/products",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7 12 3 4 7v10l8 4 8-4V7Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m20 7-8 5-8-5" />
        </svg>
      ),
    },
    {
      label: "Inventory",
      to: "/admin/inventory/locations",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 17h18" />
        </svg>
      ),
    },
    {
      label: "Orders",
      to: "/admin/orders",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h11" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h11" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h11" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h.01" />
        </svg>
      ),
    },
    {
      label: "Categories",
      to: "/admin/catalog/categories",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />
        </svg>
      ),
    },
    {
      label: "Brands",
      to: "/admin/catalog/brands",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 2 7l10 5 10-5-10-5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      label: "Attributes",
      to: "/admin/catalog/attributes",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v6H4V4Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h10v6H4v-6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 14h2v6h-2v-6Z" />
        </svg>
      ),
    },
    {
      label: "Discounts",
      to: "/admin/catalog/discounts",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12V7a2 2 0 0 0-2-2h-5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10a2 2 0 0 0 2 2h5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7 9 17" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 7.5h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 16.5h.01" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={cn(
        "hidden lg:flex h-[calc(100vh-0px)] sticky top-0 border-r border-border bg-background",
        sidebarCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <div className="flex flex-col w-full">
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <Link to="/admin" className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              Z
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">Zentora</div>
                <div className="text-xs text-foreground/50 -mt-0.5">Admin</div>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <Link to="/" className="text-xs text-primary hover:underline">
              View Storefront
            </Link>
          )}
        </div>

        <nav className="p-3 space-y-1">
          {sidebarCollapsed && (
            <Link
              to="/"
              className="mb-2 flex items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition h-11"
              title="View Storefront"
              aria-label="View Storefront"
            >
              <svg className="w-5 h-5 text-foreground/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12 12 3l9 9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V9h6v12" />
              </svg>
            </Link>
          )}

          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary/10 text-foreground/80"
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
              aria-label={item.label}
            >
              <Icon>{item.icon}</Icon>
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3 border-t border-border">
          <div className={cn("text-xs text-foreground/50", sidebarCollapsed && "text-center")}>
            {!sidebarCollapsed ? "Zentora Admin" : "ZA"}
          </div>
        </div>
      </div>
    </aside>
  );
};