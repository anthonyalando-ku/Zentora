import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

type NavLink = {
  label: string;
  href: string;
};

type CatalogCategoryLink = {
  id: string | number;
  name: string;
};

type HeaderNavProps = {
  navLinks: NavLink[];
  pathname: string;
  catalogCategories?: CatalogCategoryLink[];
};

export const HeaderNav = ({ navLinks, pathname, catalogCategories }: HeaderNavProps) => (
  <nav className="hidden md:flex items-center gap-6">
    {/* Catalog dropdown (desktop) */}
    {catalogCategories && catalogCategories.length > 0 && (
      <div className="relative group">
        <button
          type="button"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/products" ? "text-primary" : "text-foreground/70"
          )}
        >
          Catalog
        </button>

        <div className="absolute left-0 top-full pt-3 hidden group-hover:block">
          <div className="w-64 rounded-2xl border border-border bg-background shadow-lg overflow-hidden">
            <div className="p-2 max-h-80 overflow-auto">
              {catalogCategories.map((c) => (
                <Link
                  key={String(c.id)}
                  to={`/products?category_id=${c.id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-secondary/10 hover:text-primary transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Existing flat links */}
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
  </nav>
);