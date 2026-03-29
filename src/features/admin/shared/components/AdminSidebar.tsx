import React from "react";
import { NavLink, Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useAdminUiStore } from "@/features/admin/shared/store/adminUiStore";
import logo from "@/assets/zentora_logo_clear.png";

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  end?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const NavIcon = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
  <span
    className={cn(
      "w-10 h-10 inline-flex items-center justify-center rounded-xl transition-colors",
      active ? "bg-primary/10 text-primary" : "bg-secondary/10 text-foreground/70 group-hover:bg-secondary/20"
    )}
  >
    {children}
  </span>
);

/**
 * Polished tooltip for collapsed sidebar.
 * Uses title as fallback, but we render a custom tooltip for better UX.
 */
const CollapsedTooltip = ({ label }: { label: string }) => {
  return (
    <span
      className={cn(
        "pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
        "opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0",
        "transition-all duration-150",
        "z-50"
      )}
      aria-hidden="true"
    >
      <span className="rounded-lg bg-foreground text-background text-xs font-medium px-2.5 py-1 shadow-lg whitespace-nowrap">
        {label}
      </span>
    </span>
  );
};

export const AdminSidebar = () => {
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);

  const sections: NavSection[] = [
    {
      label: "Dashboard",
      items: [
        {
          label: "Dashboard",
          to: "/admin",
          end: true,
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM13 3h8v6h-8V3ZM3 17h8v4H3v-4Z" />
            </svg>
          ),
        },
      ],
    },
    {
      label: "Catalog",
      items: [
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
      ],
    },
    {
      label: "Inventory",
      items: [
        {
          label: "Inventory Locations",
          to: "/admin/inventory/locations",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17h18" />
            </svg>
          ),
        },
      ],
    },
    {
      label: "Sales",
      items: [
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
      ],
    },
    {
      label: "Marketing",
      items: [
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
      ],
    },
  ];

  return (
    <aside
  className={cn(
    "flex h-[calc(100vh-0px)] sticky top-0 border-r border-border bg-background",
    "transition-[width] duration-200 ease-out",
    sidebarCollapsed ? "w-[84px]" : "w-[288px]"
  )}
>
      <div className="flex flex-col w-full min-w-0">
        {/* Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <Link to="/admin" className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="Zentora" className="h-10 w-10 object-contain" />
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

        {/* Scrollable nav */}
        <nav className={cn("flex-1 overflow-y-auto p-3", sidebarCollapsed ? "space-y-2" : "space-y-5")}>
          {sidebarCollapsed && (
            <Link
              to="/"
              className="relative group mb-1 flex items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition h-11"
              title="View Storefront"
              aria-label="View Storefront"
            >
              <svg className="w-5 h-5 text-foreground/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12 12 3l9 9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V9h6v12" />
              </svg>
              <CollapsedTooltip label="View Storefront" />
            </Link>
          )}

          {sections.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <div className="px-2 pb-2 text-[11px] font-semibold tracking-widest text-foreground/40 uppercase">
                  {section.label}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "relative group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary/10 text-foreground/80"
                      )
                    }
                    aria-label={item.label}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        {/* left accent bar for active */}
                        <span
                          className={cn(
                            "absolute left-1 top-1.5 bottom-1.5 w-1 rounded-full transition-colors",
                            isActive ? "bg-primary" : "bg-transparent"
                          )}
                          aria-hidden="true"
                        />

                        <NavIcon active={isActive}>{item.icon}</NavIcon>

                        {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}

                        {sidebarCollapsed && <CollapsedTooltip label={item.label} />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className={cn("text-xs text-foreground/50", sidebarCollapsed && "text-center")}>
            {!sidebarCollapsed ? "Zentora Admin" : "ZA"}
          </div>
        </div>
      </div>
    </aside>
  );
};