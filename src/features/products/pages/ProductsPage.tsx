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

// Stage 7: search mode + analytics
import { useSearchResults } from "@/features/search/hooks/useSearchResults";
import { useTrackSearchClick } from "@/features/search/hooks/useTrackSearchClick";
import { getDiscoverySessionId } from "@/features/search/utils/session";
import type { DiscoverySearchItem } from "@/core/api/services/discoverySearch";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const PAGE_SIZE = 8;
const FEED_LIMIT = 20;

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
    id: String(item.product_id),
    name: item.name,
    slug: item.slug,
    description: "",
    price: item.price,
    originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined,
    category: "electronics",
    images: [],
    thumbnail: item.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0,
    reviewCount: item.review_count ?? 0,
    inStock: inventoryStatusToInStock(item.inventory_status),
    tags: [],
  };
};

const mapCatalogItemToProduct = (p: CatalogProductListItem): Product => {
  const discount = p.discount ?? 0;
  const originalPrice = discount > 0 ? p.price / (1 - discount / 100) : undefined;

  return {
    id: String(p.product_id),
    name: p.name,
    slug: p.slug,
    description: "",
    price: p.price,
    originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined,
    category: "electronics",
    images: [],
    thumbnail: p.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: p.rating ?? 0,
    reviewCount: p.review_count ?? 0,
    inStock: inventoryStatusToInStock(p.inventory_status),
    tags: [],
  };
};

const mapSearchItemToProduct = (item: DiscoverySearchItem): Product => {
  const discount = Number(item.discount ?? 0);
  const originalPrice = discount > 0 ? item.price / (1 - discount / 100) : undefined;

  return {
    id: String(item.product_id),
    name: item.name,
    slug: item.slug,
    description: "",
    price: item.price,
    originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined,
    category: item.category ?? "electronics",
    images: [],
    thumbnail: item.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0,
    reviewCount: item.review_count ?? 0,
    inStock: inventoryStatusToInStock(item.inventory_status),
    tags: [],
  };
};

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
    <div className={cn("space-y-6", disabled && "opacity-60 pointer-events-none")}>
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2">
          <button
            className={cn(
              "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
              !selectedCategoryId
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-secondary/10 text-foreground/70"
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
                "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                String(selectedCategoryId) === String(cat.id)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-secondary/10 text-foreground/70"
              )}
              onClick={() => onChange({ category_id: String(cat.id) })}
              disabled={disabled}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Brand</h3>
        <div className="space-y-2">
          <button
            className={cn(
              "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
              !selectedBrandId
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-secondary/10 text-foreground/70"
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
                "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                String(selectedBrandId) === String(b.id)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-secondary/10 text-foreground/70"
              )}
              onClick={() => onChange({ brand_id: String(b.id) })}
              disabled={disabled}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={priceMin ?? ""}
              onChange={(e) => onChange({ price_min: e.target.value ? String(e.target.value) : null })}
              className="w-full text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Min"
              disabled={disabled}
            />
            <input
              type="number"
              value={priceMax ?? ""}
              onChange={(e) => onChange({ price_max: e.target.value ? String(e.target.value) : null })}
              className="w-full text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Max"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[null, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={String(rating)}
              className={cn(
                "w-full flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors",
                (minRating ?? null) === rating
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-secondary/10 text-foreground/70"
              )}
              onClick={() => onChange({ min_rating: rating === null ? null : String(rating) })}
              disabled={disabled}
            >
              {rating === null ? (
                "Any Rating"
              ) : (
                <>
                  <span className="text-yellow-400">{"★".repeat(Math.floor(rating))}</span>
                  <span>& up</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => onChange({ discount_only: e.target.checked })}
            className="accent-primary"
            disabled={disabled}
          />
          Discount only
        </label>

        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onChange({ in_stock_only: e.target.checked })}
            className="accent-primary"
            disabled={disabled}
          />
          In stock only
        </label>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // Stage 7: Search mode selection (query param)
  const queryTerm = (searchParams.get("query") ?? "").trim();
  const isSearchMode = queryTerm.length > 0;

  // Feed mode selection (disabled when search mode)
  const feedType = (searchParams.get("feed_type") as DiscoveryFeedType | null) ?? null;
  const isFeedMode = !isSearchMode && Boolean(feedType);

  // URL-synced params
  const page = Math.max(1, toNumberOrUndefined(searchParams.get("page")) ?? 1);

  const category_id = searchParams.get("category_id") ?? undefined;
  const brand_id = searchParams.get("brand_id") ?? undefined;

  // Existing catalog query param (keep it)
  const q = searchParams.get("q") ?? undefined;

  const price_min = toNumberOrUndefined(searchParams.get("price_min"));
  const price_max = toNumberOrUndefined(searchParams.get("price_max"));
  const min_rating = toNumberOrUndefined(searchParams.get("min_rating"));

  const discount_only = searchParams.get("discount_only") === "true";
  const in_stock_only = searchParams.get("in_stock_only") === "true";

  const sortBy = (searchParams.get("sort") as SortOption | null) ?? "featured";

  // Metadata for filters
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();
  useAttributes(); // fetched to comply with Stage 2 requirement; UI expansion later

  // Stage 7: Search results + analytics + click tracking
  const searchQuery = useSearchResults(queryTerm, 20);
  const trackClick = useTrackSearchClick();
  const sessionId = useMemo(() => getDiscoverySessionId(), []);

  const searchItems = searchQuery.data?.results.items ?? [];
  const searchProducts = useMemo(() => searchItems.map(mapSearchItemToProduct), [searchItems]);

  const onSearchResultClick = async (item: DiscoverySearchItem, position: number) => {
    const searchEventId = searchQuery.data?.searchEventId;
    if (searchEventId) {
      try {
        await trackClick.mutateAsync({
          search_event_id: searchEventId,
          product_id: item.product_id,
          position,
          session_id: sessionId,
        });
      } catch {
        // ignore tracking failures
      }
    }

    navigate(`/products/${item.slug}`);
  };

  // Feed mode query: simulate pagination by increasing limit
  const feedLimit = FEED_LIMIT + (page - 1) * FEED_LIMIT;
  const feedQuery = useDiscoveryFeedPaged((feedType ?? "trending") as DiscoveryFeedType, feedLimit);

  const feedProductsAll = useMemo(() => {
    if (!isFeedMode) return [];
    const items = feedQuery.data?.items ?? [];
    return items.map(mapDiscoveryItemToProduct);
  }, [isFeedMode, feedQuery.data]);

  const feedPageItems = useMemo(() => {
    if (!isFeedMode) return [];
    const start = (page - 1) * PAGE_SIZE;
    const end = page * PAGE_SIZE;
    return feedProductsAll.slice(start, end);
  }, [isFeedMode, feedProductsAll, page]);

  const feedHasMore = isFeedMode ? feedProductsAll.length >= page * PAGE_SIZE : false;

  // Catalog mode query
  const catalogParams = useMemo(() => {
    if (isFeedMode || isSearchMode) return null;

    const sort =
      sortBy === "price-asc"
        ? "price_asc"
        : sortBy === "price-desc"
          ? "price_desc"
          : sortBy === "rating"
            ? "rating_desc"
            : sortBy === "newest"
              ? "new_arrivals"
              : undefined;

    return {
      page,
      page_size: PAGE_SIZE,
      sort,
      category_id,
      brand_id,
      q,
      price_min,
      price_max,
      min_rating,
      discount_only: discount_only || undefined,
      in_stock_only: in_stock_only || undefined,
    };
  }, [
    isFeedMode,
    isSearchMode,
    page,
    category_id,
    brand_id,
    q,
    price_min,
    price_max,
    min_rating,
    discount_only,
    in_stock_only,
    sortBy,
  ]);

  const catalogQuery = useCatalogProducts(catalogParams ?? { page: 1, page_size: PAGE_SIZE });

  const catalogProducts = useMemo(() => {
    if (isFeedMode || isSearchMode) return [];
    const items = catalogQuery.data?.items ?? [];
    return items.map(mapCatalogItemToProduct);
  }, [isFeedMode, isSearchMode, catalogQuery.data]);

  const activeItems = isSearchMode ? searchProducts : isFeedMode ? feedPageItems : catalogProducts;

  const totalPages = useMemo(() => {
    if (isSearchMode) return 1;

    if (isFeedMode) {
      return Math.max(1, Math.ceil(feedProductsAll.length / PAGE_SIZE));
    }
    if (!catalogQuery.data) return 1;
    return Math.max(1, Math.ceil(catalogQuery.data.total / catalogQuery.data.size));
  }, [isSearchMode, isFeedMode, feedProductsAll.length, catalogQuery.data]);

  const isLoading = isSearchMode ? searchQuery.isLoading : isFeedMode ? feedQuery.isLoading : catalogQuery.isLoading;

  // URL helpers
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
  };

  // Ensure page exists
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
      {/* Page header */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-2">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Products</span>
          </nav>

          <h1 className="text-2xl font-bold text-foreground">
            {isSearchMode ? "Search results" : isFeedMode ? `${feedType?.replaceAll("_", " ")} products` : "All Products"}
          </h1>

          <p className="text-foreground/50 text-sm mt-1">
            {isLoading
              ? "Loading..."
              : isSearchMode
                ? `${searchItems.length} results for "${queryTerm}"`
                : isFeedMode
                  ? `${feedProductsAll.length} products loaded`
                  : `${catalogQuery.data?.total ?? 0} products found`}
          </p>

          {isSearchMode && (
            <button
              className="mt-2 text-sm text-primary hover:underline"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete("query");
                next.set("page", "1");
                setSearchParams(next);
              }}
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              disabled={isFeedMode || isSearchMode}
              categories={(categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }))}
              brands={(brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }))}
              selectedCategoryId={category_id ?? null}
              selectedBrandId={brand_id ?? null}
              priceMin={price_min ?? null}
              priceMax={price_max ?? null}
              minRating={min_rating ?? null}
              discountOnly={discount_only}
              inStockOnly={in_stock_only}
              onChange={(patch) => {
                if (patch.category_id !== undefined) setParam("category_id", patch.category_id ?? undefined);
                if (patch.brand_id !== undefined) setParam("brand_id", patch.brand_id ?? undefined);
                if (patch.price_min !== undefined) setParam("price_min", patch.price_min ?? undefined);
                if (patch.price_max !== undefined) setParam("price_max", patch.price_max ?? undefined);
                if (patch.min_rating !== undefined) setParam("min_rating", patch.min_rating ?? undefined);
                if (patch.discount_only !== undefined)
                  setParam("discount_only", patch.discount_only ? "true" : undefined);
                if (patch.in_stock_only !== undefined)
                  setParam("in_stock_only", patch.in_stock_only ? "true" : undefined);
              }}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary/10 transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 4a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z"
                  />
                </svg>
                Filters
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-foreground/50 hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const next = new URLSearchParams(searchParams);
                    next.set("sort", e.target.value);
                    next.set("page", "1");
                    setSearchParams(next);
                  }}
                  className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  disabled={isFeedMode || isSearchMode}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 border border-border rounded-2xl">
                <FilterSidebar
                  disabled={isFeedMode || isSearchMode}
                  categories={(categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }))}
                  brands={(brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }))}
                  selectedCategoryId={category_id ?? null}
                  selectedBrandId={brand_id ?? null}
                  priceMin={price_min ?? null}
                  priceMax={price_max ?? null}
                  minRating={min_rating ?? null}
                  discountOnly={discount_only}
                  inStockOnly={in_stock_only}
                  onChange={(patch) => {
                    if (patch.category_id !== undefined) setParam("category_id", patch.category_id ?? undefined);
                    if (patch.brand_id !== undefined) setParam("brand_id", patch.brand_id ?? undefined);
                    if (patch.price_min !== undefined) setParam("price_min", patch.price_min ?? undefined);
                    if (patch.price_max !== undefined) setParam("price_max", patch.price_max ?? undefined);
                    if (patch.min_rating !== undefined) setParam("min_rating", patch.min_rating ?? undefined);
                    if (patch.discount_only !== undefined)
                      setParam("discount_only", patch.discount_only ? "true" : undefined);
                    if (patch.in_stock_only !== undefined)
                      setParam("in_stock_only", patch.in_stock_only ? "true" : undefined);
                  }}
                />
              </div>
            )}

            {/* Product Grid */}
            {activeItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-foreground/50 text-sm mb-6">
                  {isSearchMode
                    ? "Try a different search term."
                    : isFeedMode
                      ? "This feed returned no products."
                      : "Try adjusting your filters"}
                </p>
                {!isFeedMode && !isSearchMode && (
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
                    onClick={() => setSearchParams(new URLSearchParams({ page: "1" }))}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : isSearchMode ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {searchItems.map((item, idx) => {
                  const product = mapSearchItemToProduct(item);
                  return (
                    <div
                      key={product.slug}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSearchResultClick(item, idx + 1)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onSearchResultClick(item, idx + 1);
                      }}
                    >
                      <ProductCard product={product} hideAddToCart />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {activeItems.map((product) => (
                  <ProductCard key={product.slug} product={product} hideAddToCart />
                ))}
              </div>
            )}

            {/* Pagination (disabled for search mode) */}
            {!isSearchMode && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  className="p-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }).slice(0, 20).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                      page === i + 1 ? "bg-primary text-white" : "border border-border hover:bg-secondary/10"
                    )}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="p-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => setPage(page + 1)}
                  disabled={isFeedMode ? !feedHasMore : page === totalPages}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;