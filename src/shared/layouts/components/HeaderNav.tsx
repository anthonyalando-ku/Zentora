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
          to="/admin/products"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors",
            "hover:bg-secondary/10 hover:border-primary/20",
            pathname.startsWith("/admin") ? "text-primary" : "text-foreground/80"
          )}
        >
          <svg className="w-4 h-4 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 3H6a2 2 0 00-2 2v4m6-6h8a2 2 0 012 2v4m-10 8H6a2 2 0 01-2-2v-4m6 6h8a2 2 0 002-2v-4M4 12h16"
            />
          </svg>
          <span>Admin</span>
        </Link>
      )}
    </div>
  </nav>
);