import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useBrands } from "@/features/catalog/hooks/useBrands";
import { useAttributes } from "@/features/catalog/hooks/useAttributes";
import { useCatalogProducts } from "@/features/products/hooks/useCatalogProducts";
import type { CatalogProductListItem } from "@/core/api/services/catalogProducts";

import { useSearchResults } from "@/features/search/hooks/useSearchResults";
import { useTrackSearchClick } from "@/features/search/hooks/useTrackSearchClick";
import { getDiscoverySessionId } from "@/features/search/utils/session";
import type { DiscoverySearchItem } from "@/core/api/services/discoverySearch";

import type { Product } from "@/shared/types/product";
import { Seo } from "@/shared/seo/Seo";
import { useProductsSeo } from "../utils/useProductsSeo";

import { FilterSidebar, type FilterSidebarProps } from "../components/products_page/FilterSidebar";
import { ActiveFilters } from "../components/products_page/ActiveFilters";
import { ProductsGridSkeleton, EmptyState } from "../components/products_page/ProductsGridSkeleton";
import { Pagination } from "../components/products_page/Pagination";
import { MobileFiltersDrawer } from "../components/products_page/MobileFiltersDrawer";
import { FilterIcon, XIcon } from "../components/products_page/icons";
import { ProductGrid, PageShell, FilterSidebarShell } from "../components/products_page/ProductPageShared";

// ─── Types ────────────────────────────────────────────────────────────────────
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";
const PAGE_SIZE = 40;

const toNum = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const inventoryToInStock = (s: string | undefined) => s === "in_stock" || s === "low_stock";

const mapCatalogItem = (p: CatalogProductListItem): Product => {
  const discount = p.discount ?? 0;
  const originalPrice = discount > 0 ? p.price / (1 - discount / 100) : undefined;
  return {
    id: String(p.product_id), name: p.name, slug: p.slug, description: "",
    price: p.price, originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined, category: "electronics", images: [],
    thumbnail: p.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: p.rating ?? 0, reviewCount: p.review_count ?? 0,
    inStock: inventoryToInStock(p.inventory_status), tags: [],
  };
};

const mapSearchItem = (item: DiscoverySearchItem): Product => {
  const discount = Number(item.discount ?? 0);
  const originalPrice = discount > 0 ? item.price / (1 - discount / 100) : undefined;
  return {
    id: String(item.product_id), name: item.name, slug: item.slug, description: "",
    price: item.price, originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined, category: "electronics", images: [],
    thumbnail: item.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0, reviewCount: item.review_count ?? 0,
    inStock: inventoryToInStock(item.inventory_status), tags: [],
  };
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const queryTerm     = (searchParams.get("query") ?? "").trim();
  const isSearchMode  = queryTerm.length > 0;
  const page          = Math.max(1, toNum(searchParams.get("page")) ?? 1);
  const category_id   = searchParams.get("category_id") ?? undefined;
  const brand_id      = searchParams.get("brand_id") ?? undefined;
  const q             = searchParams.get("q") ?? undefined;
  const price_min     = toNum(searchParams.get("price_min"));
  const price_max     = toNum(searchParams.get("price_max"));
  const min_rating    = toNum(searchParams.get("min_rating"));
  const discount_only = searchParams.get("discount_only") === "true";
  const in_stock_only = searchParams.get("in_stock_only") === "true";
  const sortBy        = (searchParams.get("sort") as SortOption | null) ?? "featured";

  const categoriesQuery = useCategories();
  const brandsQuery     = useBrands();
  useAttributes();

  const searchQuery   = useSearchResults(queryTerm, 20);
  const trackClick    = useTrackSearchClick();
  const sessionId     = useMemo(() => getDiscoverySessionId(), []);
  const searchItems   = searchQuery.data?.results.items ?? [];
  const searchProducts = useMemo(() => searchItems.map(mapSearchItem), [searchItems]);

  const onSearchResultClick = async (item: DiscoverySearchItem, position: number) => {
    const searchEventId = searchQuery.data?.searchEventId;
    if (searchEventId) {
      try {
        await trackClick.mutateAsync({ search_event_id: searchEventId, product_id: item.product_id, position, session_id: sessionId });
      } catch { /* ignore */ }
    }
    navigate(`/products/${item.slug}`);
  };

  const sortParam =
    sortBy === "price-asc"  ? "price_asc"
    : sortBy === "price-desc" ? "price_desc"
    : sortBy === "rating"     ? "rating_desc"
    : sortBy === "newest"     ? "new_arrivals"
    : undefined;

  const catalogQuery = useCatalogProducts({
    page, page_size: PAGE_SIZE, sort: sortParam,
    category_id, brand_id, q,
    price_min, price_max, min_rating,
    discount_only: discount_only || undefined,
    in_stock_only: in_stock_only || undefined,
  });

  const catalogProducts = useMemo(
    () => (catalogQuery.data?.items ?? []).map(mapCatalogItem),
    [catalogQuery.data]
  );

  const isLoadingSearch  = isSearchMode && (searchQuery.isLoading || searchQuery.isFetching);
  const isLoadingCatalog = !isSearchMode && (catalogQuery.isLoading || catalogQuery.isFetching);

  const totalPages = useMemo(() => {
    if (isSearchMode || !catalogQuery.data) return 1;
    return Math.max(1, Math.ceil(catalogQuery.data.total / catalogQuery.data.size));
  }, [isSearchMode, catalogQuery.data]);

  const totalCount = isSearchMode ? searchItems.length : (catalogQuery.data?.total ?? 0);
  const categories = (categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }));
  const brands     = (brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }));

  const activeFilterCount = [
    category_id, brand_id, price_min, price_max, min_rating,
    discount_only || undefined, in_stock_only || undefined,
  ].filter(Boolean).length;

  const { title: seoTitle, description: seoDesc, canonicalUrl, shareImage } = useProductsSeo({
    isSearchMode, isFeedMode: false, queryTerm, feedType: null,
    activeItems: isSearchMode ? searchProducts : catalogProducts,
    categories, selectedCategoryId: category_id ?? null,
    brands, selectedBrandId: brand_id ?? null,
    totalCount,
  });

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange: FilterSidebarProps["onChange"] = (patch) => {
    const next = new URLSearchParams(searchParams);
    const apply = (key: string, val: string | null | undefined) => {
      if (val === undefined) return;
      if (!val) next.delete(key); else next.set(key, val);
    };
    apply("category_id", patch.category_id);
    apply("brand_id",    patch.brand_id);
    apply("price_min",   patch.price_min);
    apply("price_max",   patch.price_max);
    apply("min_rating",  patch.min_rating);
    if (patch.discount_only !== undefined)
      patch.discount_only ? next.set("discount_only", "true") : next.delete("discount_only");
    if (patch.in_stock_only !== undefined)
      patch.in_stock_only ? next.set("in_stock_only", "true") : next.delete("in_stock_only");
    next.set("page", "1");
    setSearchParams(next);
  };

  const clearAllFilters = () => { setSearchParams(new URLSearchParams({ page: "1" })); };
  const removeFilter = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  useEffect(() => {
    if (!searchParams.get("page")) {
      const next = new URLSearchParams(searchParams);
      next.set("page", "1");
      setSearchParams(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
      <Seo title={seoTitle} description={seoDesc} canonicalUrl={canonicalUrl} imageUrl={shareImage} type="website" />
      <PageShell
        header={
          <>
            <nav className="flex items-center gap-1.5 text-xs text-foreground/50 mb-2">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-foreground/25">/</span>
              <span className="text-foreground/80 font-medium">Products</span>
            </nav>
            {/* ── Title + meta row ─────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-2 sm:items-center">
              <div className="flex-1 min-w-0">
                {isSearchMode ? (
                  <>
                    {/* Search: label on its own line, query truncated on next */}
                    <p className="text-xs font-medium text-foreground/50 mb-0.5">Results for</p>
                    <h1 className="text-base font-bold text-primary leading-snug truncate">
                      "{queryTerm}"
                    </h1>
                  </>
                ) : (
                  <h1 className="text-lg font-bold text-foreground leading-tight">All Products</h1>
                )}

                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <p className="text-xs text-foreground/50">
                    {isLoadingSearch || isLoadingCatalog ? (
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
                      onClick={() => { const n = new URLSearchParams(searchParams); n.delete("query"); n.set("page", "1"); setSearchParams(n); }}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-0.5 shrink-0"
                    >
                      <XIcon /> Clear search
                    </button>
                  )}
                </div>
              </div>

              {/* Controls — always shrink-0 so they never push the title */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  className="lg:hidden inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition-colors relative"
                  onClick={() => setShowFilters(true)}
                >
                  <FilterIcon /><span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {/* Sort — hidden on mobile when in search mode (irrelevant), shown otherwise */}
                <select
                  value={sortBy}
                  onChange={(e) => { const n = new URLSearchParams(searchParams); n.set("sort", e.target.value); n.set("page", "1"); setSearchParams(n); }}
                  disabled={isSearchMode}
                  className={`h-8 text-xs border border-border rounded-lg px-2 pr-6 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer disabled:opacity-40 ${isSearchMode ? "hidden sm:block" : ""}`}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Low → High</option>
                  <option value="price-desc">High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
            {activeFilterCount > 0 && !isSearchMode && (
              <div className="mt-3 pt-3 border-t border-border">
                <ActiveFilters
                  categories={categories} brands={brands}
                  selectedCategoryId={category_id ?? null} selectedBrandId={brand_id ?? null}
                  priceMin={price_min ?? null} priceMax={price_max ?? null}
                  minRating={min_rating ?? null} discountOnly={discount_only} inStockOnly={in_stock_only}
                  onClear={clearAllFilters} onRemove={removeFilter}
                />
              </div>
            )}
          </>
        }
        sidebar={
          <FilterSidebarShell activeFilterCount={activeFilterCount} onClearAll={clearAllFilters}>
            <FilterSidebar
              disabled={isSearchMode}
              categories={categories} brands={brands}
              selectedCategoryId={category_id ?? null} selectedBrandId={brand_id ?? null}
              priceMin={price_min ?? null} priceMax={price_max ?? null}
              minRating={min_rating ?? null} discountOnly={discount_only} inStockOnly={in_stock_only}
              onChange={handleFilterChange}
            />
          </FilterSidebarShell>
        }
      >
        {isSearchMode ? (
          isLoadingSearch ? <ProductsGridSkeleton count={20} />
          : searchProducts.length === 0 ? <EmptyState isSearchMode onClearFilters={clearAllFilters} />
          : <ProductGrid products={searchProducts} onProductClick={(_, idx) => onSearchResultClick(searchItems[idx], idx + 1)} />
        ) : (
          isLoadingCatalog ? <ProductsGridSkeleton count={20} />
          : catalogProducts.length === 0 ? <EmptyState isSearchMode={false} onClearFilters={clearAllFilters} />
          : <>
              <ProductGrid products={catalogProducts} />
              <Pagination page={page} totalPages={totalPages} canNext={page < totalPages}
                onPrev={() => setPage(page - 1)} onNext={() => setPage(page + 1)} onSetPage={setPage} />
            </>
        )}
      </PageShell>

      <MobileFiltersDrawer
        open={showFilters} onClose={() => setShowFilters(false)}
        activeFilterCount={activeFilterCount} disabled={isSearchMode}
        categories={categories} brands={brands}
        selectedCategoryId={category_id ?? null} selectedBrandId={brand_id ?? null}
        priceMin={price_min ?? null} priceMax={price_max ?? null}
        minRating={min_rating ?? null} discountOnly={discount_only} inStockOnly={in_stock_only}
        onChange={handleFilterChange} onClearAll={clearAllFilters}
      />
    </MainLayout>
  );
};

export default ProductsPage;