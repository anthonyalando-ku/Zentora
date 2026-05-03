import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

type NavLink = { label: string; href: string };
type CatalogCategoryLink = { id: string | number; slug?: string; name: string };

type HeaderNavProps = {
  navLinks: NavLink[];
  pathname: string;
  catalogCategories?: CatalogCategoryLink[];
  isAdmin?: boolean;
};

export const HeaderNav = ({ navLinks, pathname, catalogCategories, isAdmin }: HeaderNavProps) => (
  <nav className="flex items-center gap-0 w-full">

    {/* All Categories — styled as a solid pill to stand out from plain text links */}
    {catalogCategories && catalogCategories.length > 0 && (
      <div className="relative group mr-4">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          All Categories
          <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
          <div className="w-64 rounded-xl border border-border bg-background shadow-xl overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-border">
              <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Departments</div>
            </div>
            <div className="py-1 max-h-80 overflow-y-auto">
              {catalogCategories.map((c) => (
                <Link
                  key={String(c.id)}
                  to={`/products?category_id=${c.id}`}
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-foreground/70 hover:bg-muted/60 hover:text-primary transition-colors group/item"
                >
                  <span className="truncate">{c.name}</span>
                  <svg className="w-3 h-3 text-foreground/20 group-hover/item:text-primary/50 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
              <div className="px-3.5 py-2 border-t border-border mt-1">
                <Link to="/products" className="text-xs font-semibold text-primary hover:underline">
                  Browse all categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Nav links — flat, text-only */}
    <div className="flex items-center gap-1">
      {navLinks.map((link) => (
        <Link
          key={`${link.href}::${link.label}`}
          to={link.href}
          className={cn(
            "px-3 h-7 inline-flex items-center text-xs font-medium rounded-md transition-colors",
            pathname === link.href
              ? "text-primary bg-primary/8"
              : "text-foreground/65 hover:text-foreground hover:bg-muted/60"
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>

    {/* Admin — pushed to far right */}
    {isAdmin && (
      <Link
        to="/admin"
        className={cn(
          "ml-auto inline-flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-semibold transition-colors",
          pathname.startsWith("/admin")
            ? "bg-primary/10 text-primary"
            : "text-foreground/55 hover:text-foreground hover:bg-muted/60"
        )}
        aria-label="Admin Console"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
        Admin
      </Link>
    )}
  </nav>
);