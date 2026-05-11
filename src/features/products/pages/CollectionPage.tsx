import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useBrands } from "@/features/catalog/hooks/useBrands";
import { useAttributes } from "@/features/catalog/hooks/useAttributes";
import { useCatalogProducts } from "@/features/products/hooks/useCatalogProducts";
import type { CatalogProductListItem } from "@/core/api/services/catalogProducts";

import type { DiscoveryFeedType, DiscoveryFeedItem } from "@/core/api/services/discovery";
import { useDiscoveryFeedPaged } from "@/features/discovery/hooks/useDiscoveryFeedPaged";

import type { Product } from "@/shared/types/product";
import { Seo } from "@/shared/seo/Seo";
import { useCollectionSeo } from "../utils/useCollectionseo";

import { FilterSidebar, type FilterSidebarProps } from "../components/products_page/FilterSidebar";
import { ActiveFilters } from "../components/products_page/ActiveFilters";
import { ProductsGridSkeleton, EmptyState } from "../components/products_page/ProductsGridSkeleton";
import { Pagination } from "../components/products_page/Pagination";
import { MobileFiltersDrawer } from "../components/products_page/MobileFiltersDrawer";
import { FilterIcon } from "../components/products_page/icons";
import {
  ProductGrid,
  SectionDivider,
  PageShell,
  FilterSidebarShell,
} from "../components/products_page/ProductPageShared";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 40;
// Below this many feed results we blend in catalog products
const BLEND_THRESHOLD = 8;

export const FEED_META: Record<string, { label: string; subtitle: string; accentClass: string }> = {
  trending:        { label: "Trending Now",   subtitle: "Popular items customers are buying",       accentClass: "bg-violet-500" },
  best_sellers:    { label: "Best Sellers",   subtitle: "Top-selling picks across the store",       accentClass: "bg-amber-500"  },
  new_arrivals:    { label: "New Arrivals",   subtitle: "Freshly added products you'll love",       accentClass: "bg-emerald-500"},
  deals:           { label: "Deals",          subtitle: "Limited-time discounts & hot offers",      accentClass: "bg-red-500"    },
  featured:        { label: "Featured",       subtitle: "Curated selection of standout products",   accentClass: "bg-blue-500"   },
  editorial:       { label: "Editorial",      subtitle: "Editor's picks and recommendations",       accentClass: "bg-indigo-500" },
  recommended:     { label: "Recommended",    subtitle: "Personalized for you",                     accentClass: "bg-pink-500"   },
  highly_rated:    { label: "Highly Rated",   subtitle: "Top-rated by our customers",               accentClass: "bg-yellow-500" },
  most_wishlisted: { label: "Most Wishlisted",subtitle: "Most saved items on wishlists",            accentClass: "bg-teal-500"   },
  also_viewed:     { label: "Also Viewed",    subtitle: "Customers also viewed",                    accentClass: "bg-cyan-500"   },
};

const getFeedMeta = (slug: string) =>
  FEED_META[slug] ?? {
    label: slug.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitle: "Curated products",
    accentClass: "bg-primary",
  };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toNum = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const inventoryToInStock = (s: string | undefined) => s === "in_stock" || s === "low_stock";

const mapFeedItem = (item: DiscoveryFeedItem): Product => {
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

// ─── Sub-components ───────────────────────────────────────────────────────────

const FeedFallbackBanner = ({ label }: { label: string }) => (
  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10 px-4 py-3">
    <span className="text-amber-500 mt-0.5 shrink-0">ℹ️</span>
    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
      No current <span className="font-semibold">{label}</span> products — showing our full catalog instead.
    </p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const feedType = (slug ?? "trending") as DiscoveryFeedType;
  const meta = getFeedMeta(feedType);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // ── URL params (filters only — no sort on collection pages) ────────────────
  const page          = Math.max(1, toNum(searchParams.get("page")) ?? 1);
  const category_id   = searchParams.get("category_id") ?? undefined;
  const brand_id      = searchParams.get("brand_id") ?? undefined;
  const price_min     = toNum(searchParams.get("price_min"));
  const price_max     = toNum(searchParams.get("price_max"));
  const min_rating    = toNum(searchParams.get("min_rating"));
  const discount_only = searchParams.get("discount_only") === "true";
  const in_stock_only = searchParams.get("in_stock_only") === "true";

  const hasActiveFilters = Boolean(
    category_id || brand_id || price_min || price_max || min_rating || discount_only || in_stock_only
  );

  // ── Filter params object — passed to both feed and catalog ─────────────────
  // brand_ids is CSV string as the discovery API expects
  const filterParams = useMemo(() => ({
    category_id: category_id ? Number(category_id) : undefined,
    brand_ids:   brand_id ?? undefined,
    price_min,
    price_max,
    min_rating,
    discount_only: discount_only || undefined,
    in_stock_only: in_stock_only || undefined,
  }), [category_id, brand_id, price_min, price_max, min_rating, discount_only, in_stock_only]);

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const categoriesQuery = useCategories();
  const brandsQuery     = useBrands();
  useAttributes();

  // Feed — passes filters directly to the discovery API
  const feedQuery = useDiscoveryFeedPaged(feedType, PAGE_SIZE, filterParams);
  const feedItems: Product[] = useMemo(
    () => (feedQuery.data?.items ?? []).map(mapFeedItem),
    [feedQuery.data]
  );

  const feedLoaded   = !feedQuery.isLoading && !feedQuery.isFetching;
  const feedIsEmpty  = feedLoaded && feedItems.length === 0;
  const feedIsSparse = feedLoaded && feedItems.length < BLEND_THRESHOLD;

  // Blend catalog when feed is done loading AND (empty, sparse, or filters active).
  // hasActiveFilters alone triggers blend immediately so the catalog renders as
  // soon as the user applies a filter — even before feedLoaded is true, the
  // catalogQuery is already in-flight with those filter params.
  const shouldBlend = (feedLoaded && (feedIsEmpty || feedIsSparse)) || hasActiveFilters;

  // Feed product IDs for deduplication
  const feedIds = useMemo(() => new Set(feedItems.map((p) => p.id)), [feedItems]);

  // Catalog — only fetched when we need to blend
  const catalogQuery = useCatalogProducts(
    shouldBlend || feedIsEmpty
      ? {
          page,
          page_size: PAGE_SIZE,
          category_id,
          brand_id,
          price_min,
          price_max,
          min_rating,
          discount_only: discount_only || undefined,
          in_stock_only: in_stock_only || undefined,
        }
      : // When not blending, still fetch page 1 silently so it's warm in cache
        { page: 1, page_size: PAGE_SIZE }
  );

  const catalogProducts: Product[] = useMemo(
    () =>
      (catalogQuery.data?.items ?? [])
        .map(mapCatalogItem)
        .filter((p) => !feedIds.has(p.id)), // deduplicate
    [catalogQuery.data, feedIds]
  );

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isLoadingFeed    = feedQuery.isLoading || feedQuery.isFetching;
  const isLoadingCatalog = shouldBlend && (catalogQuery.isLoading || catalogQuery.isFetching);

  const totalCatalogPages = useMemo(() => {
    if (!catalogQuery.data) return 1;
    return Math.max(1, Math.ceil(catalogQuery.data.total / catalogQuery.data.size));
  }, [catalogQuery.data]);

  const totalCount = useMemo(() => {
    const feedCount  = feedItems.length;
    const catalogTotal = shouldBlend ? (catalogQuery.data?.total ?? 0) : 0;
    return feedCount + catalogTotal;
  }, [feedItems, shouldBlend, catalogQuery.data]);

  const categories = (categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }));
  const brands     = (brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }));

  const activeFilterCount = [
    category_id, brand_id, price_min, price_max, min_rating,
    discount_only || undefined, in_stock_only || undefined,
  ].filter(Boolean).length;

  // ── SEO ─────────────────────────────────────────────────────────────────────
  const { title: seoTitle, description: seoDesc, canonicalUrl, shareImage } = useCollectionSeo({
    feedType,
    feedLabel: meta.label,
    feedItems,
    selectedCategoryId: category_id ?? null,
    selectedBrandId: brand_id ?? null,
    categories,
    brands,
    totalCount,
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <Seo title={seoTitle} description={seoDesc} canonicalUrl={canonicalUrl} imageUrl={shareImage} type="website" />
      <PageShell
        header={
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-foreground/50 mb-2">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-foreground/25">/</span>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <span className="text-foreground/25">/</span>
              <span className="text-foreground/80 font-medium">{meta.label}</span>
            </nav>

            {/* Title row — stacks gracefully on small screens */}
            <div className="flex items-start justify-between gap-2 sm:items-center">
              <div className="flex-1 min-w-0">
                {/* Accent + title inline */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`w-1 h-5 rounded-full flex-shrink-0 ${meta.accentClass}`} />
                  <h1 className="text-base font-bold text-foreground leading-tight">{meta.label}</h1>
                  <span className={`
                    inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider
                    rounded-full px-2 py-0.5 border shrink-0
                    ${feedType === "deals"
                      ? "text-red-600 bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30"
                      : "text-primary bg-primary/10 border-primary/20"}
                  `}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {feedType === "deals" ? "HOT" : "LIVE"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <p className="text-xs text-foreground/50">
                    {isLoadingFeed && !hasActiveFilters ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-foreground/30 border-t-transparent animate-spin inline-block" />
                        Loading…
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> products
                      </>
                    )}
                  </p>
                  {/* Subtitle — hidden on mobile to save space */}
                  <span className="text-foreground/20 hidden md:inline">·</span>
                  <p className="text-xs text-foreground/40 hidden md:block">{meta.subtitle}</p>
                  {hasActiveFilters && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-0.5 shrink-0">
                      Filtered
                    </span>
                  )}
                </div>
              </div>

              {/* Filter button — no sort on collection pages */}
              <button
                className="lg:hidden inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition-colors relative shrink-0"
                onClick={() => setShowFilters(true)}
              >
                <FilterIcon /><span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
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
          <FilterSidebarShell
            activeFilterCount={activeFilterCount}
            onClearAll={clearAllFilters}
            hint={
              !hasActiveFilters ? (
                <div className="text-[11px] text-foreground/50 bg-muted rounded-lg px-3 py-2 text-center leading-relaxed">
                  Refine within <span className="font-medium text-foreground/70">{meta.label}</span>
                </div>
              ) : undefined
            }
          >
            <FilterSidebar
              disabled={false}
              categories={categories} brands={brands}
              selectedCategoryId={category_id ?? null} selectedBrandId={brand_id ?? null}
              priceMin={price_min ?? null} priceMax={price_max ?? null}
              minRating={min_rating ?? null} discountOnly={discount_only} inStockOnly={in_stock_only}
              onChange={handleFilterChange}
            />
          </FilterSidebarShell>
        }
      >
        {/* Feed loading — only show full skeleton when no filters active (filters show catalog immediately) */}
        {isLoadingFeed && !hasActiveFilters && <ProductsGridSkeleton count={20} />}

        {/* Feed loaded, OR filters are active (catalog renders in parallel) */}
        {(!isLoadingFeed || hasActiveFilters) && (
          <>
            {/* Empty feed fallback banner — only when no filters, purely empty feed */}
            {feedIsEmpty && !hasActiveFilters && <FeedFallbackBanner label={meta.label} />}

            {/* Feed products — only shown when loaded, has items, and no active filters overriding */}
            {feedLoaded && feedItems.length > 0 && (
              <ProductGrid products={feedItems} />
            )}

            {/* Catalog blend section */}
            {shouldBlend && (
              <>
                {/* Divider only when feed items are also shown above */}
                {feedLoaded && feedItems.length > 0 && !hasActiveFilters && (
                  <SectionDivider
                    title="More Products"
                    subtitle="Continue exploring our full catalog"
                    badge="Explore"
                  />
                )}

                {isLoadingCatalog ? (
                  <ProductsGridSkeleton count={feedItems.length > 0 ? 8 : 20} />
                ) : catalogProducts.length === 0 ? (
                  <EmptyState isSearchMode={false} onClearFilters={clearAllFilters} />
                ) : (
                  <>
                    <ProductGrid products={catalogProducts} />
                    <Pagination
                      page={page}
                      totalPages={totalCatalogPages}
                      canNext={page < totalCatalogPages}
                      onPrev={() => setPage(page - 1)}
                      onNext={() => setPage(page + 1)}
                      onSetPage={setPage}
                    />
                  </>
                )}
              </>
            )}

            {/* Healthy feed with no blend: end-of-feed CTA */}
            {feedLoaded && !shouldBlend && feedItems.length > 0 && (
              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-xs text-foreground/40">
                    You've seen all {feedItems.length} {meta.label} products
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-background text-sm font-medium hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
                  >
                    Browse all products →
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </PageShell>

      <MobileFiltersDrawer
        open={showFilters} onClose={() => setShowFilters(false)}
        activeFilterCount={activeFilterCount} disabled={false}
        categories={categories} brands={brands}
        selectedCategoryId={category_id ?? null} selectedBrandId={brand_id ?? null}
        priceMin={price_min ?? null} priceMax={price_max ?? null}
        minRating={min_rating ?? null} discountOnly={discount_only} inStockOnly={in_stock_only}
        onChange={handleFilterChange} onClearAll={clearAllFilters}
      />
    </MainLayout>
  );
};

export default CollectionPage;