import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { cn } from "@/shared/utils/cn";
import { ProductCard } from "../components/ProductCard";

import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useBrands } from "@/features/catalog/hooks/useBrands";
import { useAttributes } from "@/features/catalog/hooks/useAttributes";
import { useCatalogProducts } from "@/features/products/hooks/useCatalogProducts";

import type { Product } from "@/shared/types/product";
import type { DiscoveryFeedType, DiscoveryFeedItem } from "@/core/api/services/discovery";
import { useDiscoveryFeedPaged } from "@/features/discovery/hooks/useDiscoveryFeedPaged";
import type { CatalogProductListItem } from "@/core/api/services/catalogProducts";

import { useSearchResults } from "@/features/search/hooks/useSearchResults";
import { useTrackSearchClick } from "@/features/search/hooks/useTrackSearchClick";
import { getDiscoverySessionId } from "@/features/search/utils/session";
import type { DiscoverySearchItem } from "@/core/api/services/discoverySearch";
import { Seo } from "@/shared/seo/Seo";

// ─── Types ────────────────────────────────────────────────────────────────────
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const PAGE_SIZE = 40;
const FEED_LIMIT = PAGE_SIZE;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toNumberOrUndefined = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const inventoryStatusToInStock = (s: string | undefined) => s === "in_stock" || s === "low_stock";

const mapDiscoveryItemToProduct = (item: DiscoveryFeedItem): Product => {
  const discount = Number(item.discount ?? 0);
  const originalPrice = discount > 0 ? item.price / (1 - discount / 100) : undefined;
  return {
    id: String(item.product_id), name: item.name, slug: item.slug, description: "",
    price: item.price, originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined, category: "electronics", images: [],
    thumbnail: item.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0, reviewCount: item.review_count ?? 0,
    inStock: inventoryStatusToInStock(item.inventory_status), tags: [],
  };
};

const mapCatalogItemToProduct = (p: CatalogProductListItem): Product => {
  const discount = p.discount ?? 0;
  const originalPrice = discount > 0 ? p.price / (1 - discount / 100) : undefined;
  return {
    id: String(p.product_id), name: p.name, slug: p.slug, description: "",
    price: p.price, originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined, category: "electronics", images: [],
    thumbnail: p.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: p.rating ?? 0, reviewCount: p.review_count ?? 0,
    inStock: inventoryStatusToInStock(p.inventory_status), tags: [],
  };
};

const mapSearchItemToProduct = (item: DiscoverySearchItem): Product => {
  const discount = Number(item.discount ?? 0);
  const originalPrice = discount > 0 ? item.price / (1 - discount / 100) : undefined;
  return {
    id: String(item.product_id), name: item.name, slug: item.slug, description: "",
    price: item.price, originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined, category: "electronics", images: [],
    thumbnail: item.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0, reviewCount: item.review_count ?? 0,
    inStock: inventoryStatusToInStock(item.inventory_status), tags: [],
  };
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2M13 16h-2" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-3.5 h-3.5", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-3 h-3", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// ─── FilterSection — collapsible group ───────────────────────────────────────
const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        className="w-full flex items-center justify-between py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <ChevronDownIcon className={cn("transition-transform duration-200", open ? "rotate-180" : "")} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
};

// ─── FilterSidebar ────────────────────────────────────────────────────────────
type FilterSidebarProps = {
  disabled: boolean;
  categories: { id: string | number; name: string }[];
  brands: { id: string | number; name: string }[];
  selectedCategoryId: string | null;
  selectedBrandId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  minRating: number | null;
  discountOnly: boolean;
  inStockOnly: boolean;
  onChange: (patch: {
    category_id?: string | null;
    brand_id?: string | null;
    price_min?: string | null;
    price_max?: string | null;
    min_rating?: string | null;
    discount_only?: boolean;
    in_stock_only?: boolean;
  }) => void;
};

const FilterSidebar = ({
  disabled,
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  priceMin,
  priceMax,
  minRating,
  discountOnly,
  inStockOnly,
  onChange,
}: FilterSidebarProps) => {
  return (
    <div className={cn("divide-y divide-border", disabled && "opacity-50 pointer-events-none select-none")}>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-0.5 max-h-52 overflow-y-auto pr-0.5 scrollbar-thin">
          <button
            className={cn(
              "w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors",
              !selectedCategoryId
                ? "bg-primary text-white font-medium"
                : "hover:bg-muted text-foreground/70 hover:text-foreground"
            )}
            onClick={() => onChange({ category_id: null })}
            disabled={disabled}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={String(cat.id)}
              className={cn(
                "w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors",
                String(selectedCategoryId) === String(cat.id)
                  ? "bg-primary text-white font-medium"
                  : "hover:bg-muted text-foreground/70 hover:text-foreground"
              )}
              onClick={() => onChange({ category_id: String(cat.id) })}
              disabled={disabled}
              title={cat.name}
            >
              <span className="line-clamp-1 text-xs">{cat.name}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      {brands.length > 0 && (
        <FilterSection title="Brand" defaultOpen={false}>
          <div className="space-y-0.5 max-h-52 overflow-y-auto pr-0.5 scrollbar-thin">
            <button
              className={cn(
                "w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors",
                !selectedBrandId
                  ? "bg-primary text-white font-medium"
                  : "hover:bg-muted text-foreground/70 hover:text-foreground"
              )}
              onClick={() => onChange({ brand_id: null })}
              disabled={disabled}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={String(b.id)}
                className={cn(
                  "w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors",
                  String(selectedBrandId) === String(b.id)
                    ? "bg-primary text-white font-medium"
                    : "hover:bg-muted text-foreground/70 hover:text-foreground"
                )}
                onClick={() => onChange({ brand_id: String(b.id) })}
                disabled={disabled}
                title={b.name}
              >
                <span className="line-clamp-1 text-xs">{b.name}</span>
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price (KSh)">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={priceMin ?? ""}
            onChange={(e) => onChange({ price_min: e.target.value || null })}
            className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/30"
            placeholder="Min"
            disabled={disabled}
          />
          <span className="text-foreground/30 text-xs flex-shrink-0">–</span>
          <input
            type="number"
            value={priceMax ?? ""}
            onChange={(e) => onChange({ price_max: e.target.value || null })}
            className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/30"
            placeholder="Max"
            disabled={disabled}
          />
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Min Rating">
        <div className="space-y-0.5">
          {([null, 4.5, 4, 3.5, 3] as (number | null)[]).map((rating) => (
            <button
              key={String(rating)}
              className={cn(
                "w-full flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg transition-colors",
                (minRating ?? null) === rating
                  ? "bg-primary text-white font-medium"
                  : "hover:bg-muted text-foreground/70 hover:text-foreground"
              )}
              onClick={() => onChange({ min_rating: rating === null ? null : String(rating) })}
              disabled={disabled}
            >
              {rating === null ? (
                "Any Rating"
              ) : (
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">{"★".repeat(Math.floor(rating))}</span>
                  {rating % 1 !== 0 && <span className="text-amber-400/50">½</span>}
                  <span className="text-current opacity-60">& up</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Toggles */}
      <FilterSection title="Availability">
        <div className="space-y-2 pt-0.5">
          {[
            { label: "Discount only", checked: discountOnly, key: "discount_only" as const },
            { label: "In stock only", checked: inStockOnly, key: "in_stock_only" as const },
          ].map(({ label, checked, key }) => (
            <label
              key={key}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={cn(
                  "w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0",
                  checked ? "bg-primary" : "bg-border"
                )}
                onClick={() => onChange({ [key]: !checked })}
              >
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                  checked ? "left-[18px]" : "left-0.5"
                )} />
              </div>
              <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

    </div>
  );
};

// ─── Active filter chips ──────────────────────────────────────────────────────
const ActiveFilters = ({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  priceMin,
  priceMax,
  minRating,
  discountOnly,
  inStockOnly,
  onClear,
  onRemove,
}: {
  categories: { id: string | number; name: string }[];
  brands: { id: string | number; name: string }[];
  selectedCategoryId: string | null;
  selectedBrandId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  minRating: number | null;
  discountOnly: boolean;
  inStockOnly: boolean;
  onClear: () => void;
  onRemove: (key: string) => void;
}) => {
  const chips: { key: string; label: string }[] = [];

  const cat = categories.find((c) => String(c.id) === selectedCategoryId);
  if (cat) chips.push({ key: "category_id", label: cat.name });

  const brand = brands.find((b) => String(b.id) === selectedBrandId);
  if (brand) chips.push({ key: "brand_id", label: brand.name });

  if (priceMin != null) chips.push({ key: "price_min", label: `From KSh ${priceMin.toLocaleString()}` });
  if (priceMax != null) chips.push({ key: "price_max", label: `Up to KSh ${priceMax.toLocaleString()}` });
  if (minRating != null) chips.push({ key: "min_rating", label: `${minRating}★ & up` });
  if (discountOnly) chips.push({ key: "discount_only", label: "On sale" });
  if (inStockOnly) chips.push({ key: "in_stock_only", label: "In stock" });

  if (!chips.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] text-foreground/40 font-medium uppercase tracking-wider shrink-0">Active:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-medium"
        >
          {chip.label}
          <XIcon />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-[11px] text-foreground/40 hover:text-destructive transition-colors underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ProductsGridSkeleton = ({ count = 20 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border bg-background overflow-hidden" aria-hidden="true">
        <div className="aspect-square bg-foreground/6 animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-3 w-4/5 bg-foreground/8 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-foreground/8 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-foreground/10 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ isSearchMode, onClearFilters }: { isSearchMode: boolean; onClearFilters: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-foreground/30">
      <SearchIcon />
    </div>
    <h3 className="text-base font-semibold text-foreground mb-1">No products found</h3>
    <p className="text-sm text-foreground/50 max-w-xs mb-5">
      {isSearchMode
        ? "Try a different search term or browse all products."
        : "Try removing some filters to see more results."}
    </p>
    {!isSearchMode && (
      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 transition-colors"
      >
        Clear all filters
      </button>
    )}
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({
  page,
  totalPages,
  canNext,
  onPrev,
  onNext,
  onSetPage,
}: {
  page: number;
  totalPages: number;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSetPage: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;

  // Build smart page window
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-5 border-t border-border">
      <button
        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-foreground/30">…</span>
        ) : (
          <button
            key={p}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-semibold transition-colors",
              page === p
                ? "bg-primary text-white shadow-sm"
                : "border border-border hover:bg-muted text-foreground/70 hover:text-foreground"
            )}
            onClick={() => onSetPage(p as number)}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

// ─── Mobile Filters Drawer ────────────────────────────────────────────────────
const MobileFiltersDrawer = ({
  open,
  onClose,
  activeFilterCount,
  disabled,
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  priceMin,
  priceMax,
  minRating,
  discountOnly,
  inStockOnly,
  onChange,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  activeFilterCount: number;
  disabled: boolean;
  categories: { id: string | number; name: string }[];
  brands: { id: string | number; name: string }[];
  selectedCategoryId: string | null;
  selectedBrandId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  minRating: number | null;
  discountOnly: boolean;
  inStockOnly: boolean;
  onChange: FilterSidebarProps["onChange"];
  onClearAll: () => void;
}) => {
  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="absolute left-0 top-0 h-full w-[85%] max-w-xs bg-background border-r border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <FilterIcon />
            <span className="text-sm font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="text-[10px] font-bold bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-destructive hover:underline"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
              onClick={onClose}
              aria-label="Close filters"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <FilterSidebar
            disabled={disabled}
            categories={categories}
            brands={brands}
            selectedCategoryId={selectedCategoryId}
            selectedBrandId={selectedBrandId}
            priceMin={priceMin}
            priceMax={priceMax}
            minRating={minRating}
            discountOnly={discountOnly}
            inStockOnly={inStockOnly}
            onChange={onChange}
          />
        </div>
        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            View results
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const queryTerm = (searchParams.get("query") ?? "").trim();
  const isSearchMode = queryTerm.length > 0;

  const feedType = (searchParams.get("feed_type") as DiscoveryFeedType | null) ?? null;
  const isFeedMode = !isSearchMode && Boolean(feedType);

  const page = Math.max(1, toNumberOrUndefined(searchParams.get("page")) ?? 1);
  const category_id = searchParams.get("category_id") ?? undefined;
  const brand_id = searchParams.get("brand_id") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const price_min = toNumberOrUndefined(searchParams.get("price_min"));
  const price_max = toNumberOrUndefined(searchParams.get("price_max"));
  const min_rating = toNumberOrUndefined(searchParams.get("min_rating"));
  const discount_only = searchParams.get("discount_only") === "true";
  const in_stock_only = searchParams.get("in_stock_only") === "true";
  const sortBy = (searchParams.get("sort") as SortOption | null) ?? "featured";

  // Data hooks
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();
  useAttributes();

  const searchQuery = useSearchResults(queryTerm, 20);
  const trackClick = useTrackSearchClick();
  const sessionId = useMemo(() => getDiscoverySessionId(), []);

  const searchItems = searchQuery.data?.results.items ?? [];
  const searchProducts = useMemo(() => searchItems.map(mapSearchItemToProduct), [searchItems]);

  const onSearchResultClick = async (item: DiscoverySearchItem, position: number) => {
    const searchEventId = searchQuery.data?.searchEventId;
    if (searchEventId) {
      try {
        await trackClick.mutateAsync({ search_event_id: searchEventId, product_id: item.product_id, position, session_id: sessionId });
      } catch { /* ignore */ }
    }
    navigate(`/products/${item.slug}`);
  };

  const feedLimit = FEED_LIMIT + (page - 1) * FEED_LIMIT;
  const feedQuery = useDiscoveryFeedPaged((feedType ?? "trending") as DiscoveryFeedType, feedLimit);
  const feedProductsAll = useMemo(() => {
    if (!isFeedMode) return [];
    return (feedQuery.data?.items ?? []).map(mapDiscoveryItemToProduct);
  }, [isFeedMode, feedQuery.data]);

  const feedPageItems = useMemo(() => {
    if (!isFeedMode) return [];
    const start = (page - 1) * PAGE_SIZE;
    return feedProductsAll.slice(start, start + PAGE_SIZE);
  }, [isFeedMode, feedProductsAll, page]);

  const feedHasMore = isFeedMode ? feedProductsAll.length >= page * PAGE_SIZE : false;

  const catalogParams = useMemo(() => {
    if (isFeedMode || isSearchMode) return null;
    const sort = sortBy === "price-asc" ? "price_asc" : sortBy === "price-desc" ? "price_desc" : sortBy === "rating" ? "rating_desc" : sortBy === "newest" ? "new_arrivals" : undefined;
    return { page, page_size: PAGE_SIZE, sort, category_id, brand_id, q, price_min, price_max, min_rating, discount_only: discount_only || undefined, in_stock_only: in_stock_only || undefined };
  }, [isFeedMode, isSearchMode, page, category_id, brand_id, q, price_min, price_max, min_rating, discount_only, in_stock_only, sortBy]);

  const catalogQuery = useCatalogProducts(catalogParams ?? { page: 1, page_size: PAGE_SIZE });
  const catalogProducts = useMemo(() => {
    if (isFeedMode || isSearchMode) return [];
    return (catalogQuery.data?.items ?? []).map(mapCatalogItemToProduct);
  }, [isFeedMode, isSearchMode, catalogQuery.data]);

  const activeItems = isSearchMode ? searchProducts : isFeedMode ? feedPageItems : catalogProducts;

  const totalPages = useMemo(() => {
    if (isSearchMode) return 1;
    if (isFeedMode) return Math.max(1, Math.ceil(feedProductsAll.length / PAGE_SIZE));
    if (!catalogQuery.data) return 1;
    return Math.max(1, Math.ceil(catalogQuery.data.total / catalogQuery.data.size));
  }, [isSearchMode, isFeedMode, feedProductsAll.length, catalogQuery.data]);

  const isLoading = isSearchMode
    ? searchQuery.isLoading || searchQuery.isFetching
    : isFeedMode
    ? feedQuery.isLoading || feedQuery.isFetching
    : catalogQuery.isLoading || catalogQuery.isFetching;

  const isEmpty = !isLoading && activeItems.length === 0;
  const totalCount = isSearchMode ? searchItems.length : isFeedMode ? feedProductsAll.length : (catalogQuery.data?.total ?? 0);

  // Filter helpers
  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === "") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  };

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange: FilterSidebarProps["onChange"] = (patch) => {
    const next = new URLSearchParams(searchParams);
    const apply = (key: string, val: string | null | undefined) => {
      if (val === undefined) return;
      if (!val) next.delete(key);
      else next.set(key, val);
    };
    apply("category_id", patch.category_id);
    apply("brand_id", patch.brand_id);
    apply("price_min", patch.price_min);
    apply("price_max", patch.price_max);
    apply("min_rating", patch.min_rating);
    if (patch.discount_only !== undefined) patch.discount_only ? next.set("discount_only", "true") : next.delete("discount_only");
    if (patch.in_stock_only !== undefined) patch.in_stock_only ? next.set("in_stock_only", "true") : next.delete("in_stock_only");
    next.set("page", "1");
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    next.set("page", "1");
    setSearchParams(next);
  };

  const removeFilter = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const activeFilterCount = [
    category_id, brand_id, price_min, price_max, min_rating,
    discount_only || undefined, in_stock_only || undefined,
  ].filter(Boolean).length;

  useEffect(() => {
    if (!searchParams.get("page")) {
      const next = new URLSearchParams(searchParams);
      next.set("page", "1");
      setSearchParams(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SEO
  const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL ?? window.location.origin;
  const canonicalUrl = `${siteUrl}/products${window.location.search}`;
  const seoTitle = isSearchMode ? `Search: ${queryTerm} | Zentora` : isFeedMode && feedType ? `${feedType.replaceAll("_", " ")} Products | Zentora` : "Products | Zentora";
  const seoDescription = isSearchMode ? `Browse search results for "${queryTerm}" on Zentora.` : isFeedMode && feedType ? `Browse ${feedType.replaceAll("_", " ")} products on Zentora.` : "Browse products on Zentora. Filter by category, brand, price and rating.";
  const shareImage = (activeItems[0]?.thumbnail?.startsWith("http") ? activeItems[0].thumbnail : undefined) ?? `${siteUrl}/public/zentora_logo_clear.png`;

  const categories = (categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }));
  const brands = (brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <Seo title={seoTitle} description={seoDescription} canonicalUrl={canonicalUrl} imageUrl={shareImage} type="website" />

      <div className="bg-background">

        {/* ── Compact page header ─────────────────────────────────────────── */}
        <div className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-foreground/50 mb-2">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-foreground/25">/</span>
              <span className="text-foreground/80 font-medium">Products</span>
            </nav>

            {/* Title row + controls */}
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-foreground leading-tight truncate">
                  {isSearchMode
                    ? <>Results for <span className="text-primary">"{queryTerm}"</span></>
                    : isFeedMode
                    ? <span className="capitalize">{feedType?.replaceAll("_", " ")} Products</span>
                    : "All Products"}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-foreground/50">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-foreground/30 border-t-transparent animate-spin inline-block" />
                        Loading…
                      </span>
                    ) : (
                      <><span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> {isSearchMode ? "results" : "products"}</>
                    )}
                  </p>
                  {isSearchMode && (
                    <button
                      onClick={() => { const n = new URLSearchParams(searchParams); n.delete("query"); n.set("page","1"); setSearchParams(n); }}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      <XIcon /> Clear search
                    </button>
                  )}
                </div>
              </div>

              {/* Sort (desktop inline) + Filter button (mobile) */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile filter trigger */}
                <button
                  className="lg:hidden inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-background text-sm font-medium hover:bg-muted transition-colors relative"
                  onClick={() => setShowFilters(true)}
                >
                  <FilterIcon />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort dropdown — always visible */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-foreground/50 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => { const n = new URLSearchParams(searchParams); n.set("sort", e.target.value); n.set("page","1"); setSearchParams(n); }}
                    className="h-9 text-xs border border-border rounded-xl px-2.5 pr-7 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    disabled={isFeedMode || isSearchMode}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && !isFeedMode && !isSearchMode && (
              <div className="mt-3 pt-3 border-t border-border">
                <ActiveFilters
                  categories={categories}
                  brands={brands}
                  selectedCategoryId={category_id ?? null}
                  selectedBrandId={brand_id ?? null}
                  priceMin={price_min ?? null}
                  priceMax={price_max ?? null}
                  minRating={min_rating ?? null}
                  discountOnly={discount_only}
                  inStockOnly={in_stock_only}
                  onClear={clearAllFilters}
                  onRemove={removeFilter}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Body: [Sidebar] [Grid] ───────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex gap-6">

            {/* ── Filter sidebar (desktop, sticky) ─────────────────────────── */}
            <aside className="hidden lg:block w-52 xl:w-56 shrink-0">
              <div className="sticky top-20">
                {/* Sidebar header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <FilterIcon />
                    <span className="text-sm font-semibold text-foreground">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="text-[10px] font-bold bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-[11px] text-destructive hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Disabled overlay for feed/search mode */}
                {(isFeedMode || isSearchMode) && (
                  <div className="mb-3 text-[11px] text-foreground/50 bg-muted rounded-lg px-3 py-2 text-center">
                    Filters unavailable in {isSearchMode ? "search" : "feed"} mode
                  </div>
                )}

                <div className="rounded-xl border border-border bg-background p-3 overflow-hidden">
                  <FilterSidebar
                    disabled={isFeedMode || isSearchMode}
                    categories={categories}
                    brands={brands}
                    selectedCategoryId={category_id ?? null}
                    selectedBrandId={brand_id ?? null}
                    priceMin={price_min ?? null}
                    priceMax={price_max ?? null}
                    minRating={min_rating ?? null}
                    discountOnly={discount_only}
                    inStockOnly={in_stock_only}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </aside>

            {/* ── Product grid ─────────────────────────────────────────────── */}
            <section className="flex-1 min-w-0">
              {isLoading ? (
                <ProductsGridSkeleton count={20} />
              ) : isEmpty ? (
                <EmptyState isSearchMode={isSearchMode} onClearFilters={clearAllFilters} />
              ) : isSearchMode ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {searchItems.map((item, idx) => {
                    const product = mapSearchItemToProduct(item);
                    return (
                      <div
                        key={product.slug}
                        role="button"
                        tabIndex={0}
                        className="transition-transform hover:-translate-y-0.5 hover:shadow-md rounded-xl cursor-pointer"
                        onClick={() => onSearchResultClick(item, idx + 1)}
                        onKeyDown={(e) => { if (e.key === "Enter") onSearchResultClick(item, idx + 1); }}
                      >
                        <ProductCard product={product} hideAddToCart />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {activeItems.map((product) => (
                    <div key={product.slug} className="transition-transform hover:-translate-y-0.5 hover:shadow-md rounded-xl">
                      <ProductCard product={product} hideAddToCart />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isSearchMode && !isEmpty && !isLoading && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  canNext={isFeedMode ? feedHasMore : page < totalPages}
                  onPrev={() => setPage(page - 1)}
                  onNext={() => setPage(page + 1)}
                  onSetPage={setPage}
                />
              )}
            </section>

          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <MobileFiltersDrawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        activeFilterCount={activeFilterCount}
        disabled={isFeedMode || isSearchMode}
        categories={categories}
        brands={brands}
        selectedCategoryId={category_id ?? null}
        selectedBrandId={brand_id ?? null}
        priceMin={price_min ?? null}
        priceMax={price_max ?? null}
        minRating={min_rating ?? null}
        discountOnly={discount_only}
        inStockOnly={in_stock_only}
        onChange={handleFilterChange}
        onClearAll={clearAllFilters}
      />
    </MainLayout>
  );
};

export default ProductsPage;