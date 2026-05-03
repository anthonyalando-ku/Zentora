import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useDebouncedValue } from "@/features/search/hooks/useDebouncedValue";
import { useSearchSuggestions } from "@/features/search/hooks/useSearchSuggestions";

type NavLink = { label: string; href: string };
type CatalogCategoryLink = { id: string | number; name: string };

type MobileMenuProps = {
  open: boolean;
  navLinks: NavLink[];
  pathname: string;
  onClose: () => void;
  catalogCategories?: CatalogCategoryLink[];
  showSearch?: boolean;
  isAdmin?: boolean;
};

export const MobileMenu = ({
  open,
  navLinks,
  pathname,
  onClose,
  catalogCategories,
  showSearch = false,
  isAdmin = false,
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const [catalogOpen, setCatalogOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounced = useDebouncedValue(searchValue, 300);
  const suggestionsQuery = useSearchSuggestions(debounced, 6);
  const suggestions = suggestionsQuery.data?.suggestions ?? [];
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const visibleCategories = useMemo(() => (catalogCategories ?? []).slice(0, 12), [catalogCategories]);

  useEffect(() => {
    if (!open) {
      setCatalogOpen(false);
      setSearchOpen(false);
      setActiveIndex(-1);
      setSearchValue("");
    }
  }, [open]);

  useEffect(() => {
    setSearchOpen(searchValue.trim().length > 0);
  }, [searchValue]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!searchBoxRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const goToSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    navigate({ pathname: "/products", search: `?${createSearchParams({ query: q }).toString()}` });
    onClose();
  };

  const onSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); goToSearch(searchValue); };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen || suggestions.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); goToSearch(searchValue); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") { e.preventDefault(); goToSearch(activeIndex >= 0 ? suggestions[activeIndex].Text : searchValue); }
    else if (e.key === "Escape") { setSearchOpen(false); }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 top-[calc(var(--header-height,56px))] bg-black/40 z-40 animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="md:hidden fixed left-0 right-0 top-[calc(var(--header-height,56px))] z-50 bg-background border-t border-border shadow-xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
        <div className="px-4 py-3 space-y-1">

          {/* Search */}
          {showSearch && (
            <div ref={searchBoxRef} className="relative mb-3">
              <form onSubmit={onSearchSubmit} className="flex items-stretch h-9">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search products…"
                    value={searchValue}
                    onChange={(e) => { setSearchValue(e.target.value); setActiveIndex(-1); }}
                    onFocus={() => searchValue.trim() && setSearchOpen(true)}
                    onKeyDown={onSearchKeyDown}
                    className="h-full w-full pl-9 pr-3 text-sm border border-border border-r-0 rounded-l-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <button type="submit" className="h-full px-4 rounded-r-lg bg-primary text-white text-sm font-semibold border border-primary">
                  Search
                </button>
              </form>

              {searchOpen && searchValue.trim() !== "" && (
                <div className="absolute mt-1 w-full rounded-xl border border-border bg-background shadow-xl overflow-hidden z-50">
                  {suggestionsQuery.isLoading ? (
                    <div className="px-4 py-3 text-xs text-foreground/50">Searching…</div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-foreground/50">No suggestions</div>
                  ) : (
                    <ul className="max-h-56 overflow-auto py-1">
                      {suggestions.map((s, idx) => (
                        <li key={`${s.Type}:${s.ReferenceID}:${s.Text}`}>
                          <button
                            type="button"
                            className={cn("w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors", idx === activeIndex && "bg-muted/60")}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => goToSearch(s.Text)}
                          >
                            <svg className="w-3.5 h-3.5 text-foreground/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="font-medium truncate">{s.Text}</span>
                            <span className="ml-auto text-[11px] text-foreground/40 flex-shrink-0 capitalize">{s.Type}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Primary nav links */}
          {navLinks.map((link) => (
            <Link
              key={`${link.href}::${link.label}`}
              to={link.href}
              className={cn(
                "flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary bg-primary/8"
                  : "text-foreground/75 hover:text-foreground hover:bg-muted/60"
              )}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}

          {/* Categories accordion */}
          {(catalogCategories?.length ?? 0) > 0 && (
            <div className="pt-1 mt-1 border-t border-border">
              <button
                type="button"
                className="w-full flex items-center justify-between h-10 px-3 text-sm font-medium text-foreground/75 hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                onClick={() => setCatalogOpen((v) => !v)}
              >
                <span>All Categories</span>
                <svg className={cn("w-4 h-4 text-foreground/40 transition-transform duration-200", catalogOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {catalogOpen && (
                <div className="mt-1 ml-3 border-l border-border pl-3 space-y-0.5">
                  {visibleCategories.map((c) => (
                    <Link
                      key={String(c.id)}
                      to={`/products?category_id=${c.id}`}
                      className="flex items-center h-9 text-sm text-foreground/65 hover:text-primary transition-colors"
                      onClick={onClose}
                    >
                      {c.name}
                    </Link>
                  ))}
                  {(catalogCategories?.length ?? 0) > visibleCategories.length && (
                    <Link
                      to="/products"
                      className="flex items-center h-9 text-sm font-semibold text-primary"
                      onClick={onClose}
                    >
                      View all categories
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admin */}
          {isAdmin && (
            <div className="pt-1 mt-1 border-t border-border">
              <Link
                to="/admin"
                className={cn(
                  "flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-semibold transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                )}
                onClick={onClose}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Admin Console
              </Link>
            </div>
          )}

        </div>

        {/* Bottom safe area padding */}
        <div className="h-4" />
      </div>
    </>
  );
};