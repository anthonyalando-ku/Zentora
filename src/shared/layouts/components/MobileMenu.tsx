import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useDebouncedValue } from "@/features/search/hooks/useDebouncedValue";
import { useSearchSuggestions } from "@/features/search/hooks/useSearchSuggestions";

type NavLink = {
  label: string;
  href: string;
};

type CatalogCategoryLink = {
  id: string | number;
  name: string;
};

type MobileMenuProps = {
  open: boolean;
  navLinks: NavLink[];
  pathname: string;
  onClose: () => void;
  catalogCategories?: CatalogCategoryLink[];
  showSearch?: boolean;
};

export const MobileMenu = ({ open, navLinks, pathname, onClose, catalogCategories, showSearch = false }: MobileMenuProps) => {
  const navigate = useNavigate();

  const [catalogOpen, setCatalogOpen] = useState(false);

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounced = useDebouncedValue(searchValue, 300);
  const suggestionsQuery = useSearchSuggestions(debounced, 6);
  const suggestions = suggestionsQuery.data?.suggestions ?? [];
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  //const hasCatalog = (catalogCategories?.length ?? 0) > 0;

  const visibleCategories = useMemo(() => {
    // Prevent super long menus; keep it safe for now.
    const MAX = 12;
    return (catalogCategories ?? []).slice(0, MAX);
  }, [catalogCategories]);

  // Reset menu-local state when closed
  useEffect(() => {
    if (!open) {
      setCatalogOpen(false);
      setSearchOpen(false);
      setActiveIndex(-1);
      setSearchValue("");
    }
  }, [open]);

  // Close suggestion panel if input cleared
  useEffect(() => {
    const trimmed = searchValue.trim();
    setSearchOpen(trimmed.length > 0);
  }, [searchValue]);

  // Click-outside to close suggestions (within mobile menu)
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;

    navigate({
      pathname: "/products",
      search: `?${createSearchParams({ query: q }).toString()}`,
    });

    onClose();
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch(searchValue);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        goToSearch(searchValue);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = activeIndex >= 0 ? suggestions[activeIndex] : undefined;
      goToSearch(picked?.Text ?? searchValue);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
      {/* Search (with suggestions) */}
      { showSearch && (
        <div ref={searchBoxRef} className="relative">
        <form onSubmit={onSearchSubmit} className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="search"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setActiveIndex(-1);
            }}
            onFocus={() => searchValue.trim() && setSearchOpen(true)}
            onKeyDown={onSearchKeyDown}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-full border border-border bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>

        {searchOpen && searchValue.trim() !== "" && (
          <div className="absolute mt-2 w-full rounded-2xl border border-border bg-background shadow-xl overflow-hidden z-50">
            {suggestionsQuery.isLoading ? (
              <div className="p-4 text-sm text-foreground/60">Searching…</div>
            ) : suggestions.length === 0 ? (
              <div className="p-4 text-sm text-foreground/60">No suggestions</div>
            ) : (
              <ul className="max-h-72 overflow-auto p-2">
                {suggestions.map((s, idx) => (
                  <li key={`${s.Type}:${s.ReferenceID}:${s.Text}`}>
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl text-sm hover:bg-secondary/10",
                        idx === activeIndex && "bg-secondary/10"
                      )}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => goToSearch(s.Text)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{s.Text}</span>
                        <span className="text-xs text-foreground/50">{s.Type}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      )}
      

      {/* Primary links */}
      {navLinks.map((link) => (
        <Link
          key={`${link.href}::${link.label}`}
          to={link.href}
          className={cn(
            "block text-sm font-medium py-2 rounded-xl px-2 transition-colors hover:bg-secondary/10 hover:text-primary",
            pathname === link.href ? "text-primary bg-primary/5" : "text-foreground/80"
          )}
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}

      {/* Catalog expandable */}
      {(catalogCategories?.length ?? 0) > 0 && (
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            className="w-full flex items-center justify-between text-sm font-semibold py-2 rounded-xl px-2 transition-colors hover:bg-secondary/10 text-foreground/80"
            onClick={() => setCatalogOpen((v) => !v)}
          >
            <span>All Categories</span>
            <svg
              className={cn("w-4 h-4 transition-transform", catalogOpen && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {catalogOpen && (
            <div className="mt-2 space-y-1">
              {visibleCategories.map((c) => (
                <Link
                  key={String(c.id)}
                  to={`/products?category_id=${c.id}`}
                  className="block text-sm py-2 pl-3 pr-2 rounded-xl text-foreground/80 hover:bg-secondary/10 hover:text-primary transition-colors"
                  onClick={onClose}
                >
                  {c.name}
                </Link>
              ))}

              {(catalogCategories?.length ?? 0) > visibleCategories.length && (
                <Link
                  to="/products"
                  className="block text-sm py-2 pl-3 pr-2 rounded-xl text-primary hover:bg-primary/5 transition-colors"
                  onClick={onClose}
                >
                  View all categories
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};