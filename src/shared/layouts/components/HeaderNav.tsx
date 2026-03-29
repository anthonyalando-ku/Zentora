import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

type NavLink = {
  label: string;
  href: string;
};

type CatalogCategoryLink = {
  id: string | number;
  slug?: string;
  name: string;
};

type HeaderNavProps = {
  navLinks: NavLink[];
  pathname: string;
  catalogCategories?: CatalogCategoryLink[];
  isAdmin?: boolean; // add this
};

export const HeaderNav = ({ navLinks, pathname, catalogCategories, isAdmin }: HeaderNavProps) => (
  <nav className="hidden md:flex items-center gap-3">
    {/* All Categories dropdown (desktop) */}
    {catalogCategories && catalogCategories.length > 0 && (
      <div className="relative group">
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors",
            "hover:bg-secondary/10 hover:border-primary/20",
            pathname === "/products" ? "text-primary" : "text-foreground/80"
          )}
          aria-label="All Categories"
        >
          <svg className="w-4 h-4 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>All Categories</span>
          <svg className="w-4 h-4 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="absolute left-0 top-full pt-3 hidden group-hover:block">
          <div className="w-[300px] rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-background">
              <div className="text-sm font-semibold text-foreground">Shop by Category</div>
              <div className="text-xs text-foreground/60 mt-0.5">Browse departments</div>
            </div>

            <div className="p-2 max-h-96 overflow-auto">
              {catalogCategories.map((c) => (
                <Link
                  key={String(c.id)}
                  to={`/products?category_id=${c.id}`}
                  className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-sm text-foreground/80 hover:bg-secondary/10 hover:text-primary transition-colors"
                >
                  <span className="line-clamp-1">{c.name}</span>
                  <svg
                    className="w-4 h-4 text-foreground/30 group-hover/item:text-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Nav links */}
    <div className="flex items-center gap-5 ml-4">
      {navLinks.map((link) => (
        <Link
          key={`${link.href}::${link.label}`}
          to={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-foreground/70"
          )}
        >
          {link.label}
        </Link>
      ))}

            {/* Admin link (only for admins) */}
      {isAdmin && (
        <Link
          to="/admin"
          className={cn(
            "ml-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
            "border border-border bg-background hover:bg-secondary/10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            pathname.startsWith("/admin") ? "text-primary border-primary/25 bg-primary/5" : "text-foreground/80"
          )}
          aria-label="Open Admin Console"
          title="Admin Console"
        >
          <span
            className={cn(
              "w-8 h-8 rounded-lg inline-flex items-center justify-center",
              pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "bg-secondary/10 text-foreground/70"
            )}
            aria-hidden="true"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </span>

          <span className="hidden lg:inline">Admin Console</span>
          <span className="lg:hidden">Admin</span>

          <svg className="w-4 h-4 text-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  </nav>
);