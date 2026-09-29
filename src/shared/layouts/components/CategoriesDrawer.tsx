import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LayoutGrid, Search, X } from "lucide-react";
import { CategoryArtwork } from "@/features/public/home/components/CategoryGrid";
import { useDrawerBehavior } from "../hooks/useDrawerBehavior";

type CatalogCategoryLink = {
  id: string | number;
  slug?: string;
  name: string;
  image_url?: string | null;
};

type CategoriesDrawerProps = {
  open: boolean;
  onClose: () => void;
  catalogCategories?: CatalogCategoryLink[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

/**
 * Category browser opened from the mobile bottom nav. Rows use the same artwork
 * as the desktop category grid: backend image_url via CategoryImage, falling back
 * to the storefront's tinted initials when the URL is missing, invalid or fails.
 */
export const CategoriesDrawer = ({ open, onClose, catalogCategories = [], isLoading, isError, onRetry }: CategoriesDrawerProps) => {
  const panel = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  useDrawerBehavior(open, () => { setQuery(""); onClose(); }, panel);

  // Local filter over the already-loaded categories; no request per keystroke.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? catalogCategories.filter(c => c.name.toLowerCase().includes(q)) : catalogCategories;
  }, [catalogCategories, query]);

  if (!open) return null;
  const close = () => { setQuery(""); onClose(); };
  const showSearch = catalogCategories.length > 0;

  return (
    <div className="store-drawer-root" role="dialog" aria-modal="true" aria-labelledby="categories-drawer-title">
      <div aria-hidden="true" onClick={close} className="store-drawer-backdrop" />
      <aside ref={panel} className="store-drawer store-drawer-left store-categories-drawer">
        <div className="store-drawer-head">
          <div>
            <span className="store-drawer-eyebrow">Browse</span>
            <h2 id="categories-drawer-title">All Categories</h2>
          </div>
          <button type="button" onClick={close} aria-label="Close categories" className="store-drawer-close" data-autofocus><X aria-hidden="true" /></button>
        </div>

        {showSearch && (
          <div className="store-drawer-search">
            <Search aria-hidden="true" />
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search categories…" aria-label="Search categories" enterKeyHint="search" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear category search"><X aria-hidden="true" /></button>}
          </div>
        )}

        <div className="store-drawer-body store-categories-list">
          {isLoading && !catalogCategories.length ? (
            <ul aria-busy="true" aria-label="Loading categories">{Array.from({ length: 7 }, (_, i) => <li key={i} className="store-drawer-cat-skeleton"><span /><span /></li>)}</ul>
          ) : isError && !catalogCategories.length ? (
            <div className="store-drawer-state" role="alert"><strong>Categories couldn't load</strong><span>Check your connection and try again.</span>{onRetry && <button type="button" onClick={onRetry}>Try again</button>}</div>
          ) : !catalogCategories.length ? (
            <div className="store-drawer-state"><strong>No categories yet</strong><span>Browse everything in the store instead.</span></div>
          ) : !visible.length ? (
            <div className="store-drawer-state" role="status"><Search aria-hidden="true" /><strong>No categories found</strong><span>Try a different search.</span></div>
          ) : (
            <ul>
              {visible.map(c => (
                <li key={String(c.id)}>
                  <Link to={`/products?category_id=${c.id}`} onClick={close} className="store-drawer-cat">
                    <span className="store-drawer-cat-art" aria-hidden="true"><CategoryArtwork category={c} /></span>
                    <span className="store-drawer-cat-name">{c.name}</span>
                    <ChevronRight className="store-drawer-chevron" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="store-drawer-foot">
          <Link to="/products" onClick={close} className="store-drawer-cta"><LayoutGrid aria-hidden="true" />View all departments<ChevronRight aria-hidden="true" /></Link>
        </div>
      </aside>
    </div>
  );
};
