import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
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
import { useProductsSeo } from "../utils/useProductsSeo";

// ─── Extracted components ─────────────────────────────────────────────────────
import { FilterSidebar, type FilterSidebarProps } from "../components/products_page/FilterSidebar";
import { ActiveFilters } from "../components/products_page/ActiveFilters";
import { ProductsGridSkeleton, EmptyState } from "../components/products_page/ProductsGridSkeleton";
import { Pagination } from "../components/products_page/Pagination";
import { MobileFiltersDrawer } from "../components/products_page/MobileFiltersDrawer";
import { FilterIcon, XIcon } from "../components/products_page/icons";

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

  const categories = (categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }));
  const brands = (brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }));

  // ── SEO — delegated to hook ──────────────────────────────────────────────
  const { title: seoTitle, description: seoDescription, canonicalUrl, shareImage } = useProductsSeo({
    isSearchMode,
    isFeedMode,
    queryTerm,
    feedType,
    activeItems,
    categories,
    selectedCategoryId: category_id ?? null,
    brands,
    selectedBrandId: brand_id ?? null,
    totalCount,
  });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        imageUrl={shareImage}
        type="website"
      />

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