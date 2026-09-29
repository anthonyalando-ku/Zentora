import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useBrands } from "@/features/catalog/hooks/useBrands";

import { useCatalogProducts } from "@/features/products/hooks/useCatalogProducts";
import { useCatalogueFilters } from "@/features/products/hooks/useCatalogueFilters";
import type { CatalogProductListItem } from "@/core/api/services/catalogProducts";

import { useSearchResults } from "@/features/search/hooks/useSearchResults";
import { useTrackSearchClick } from "@/features/search/hooks/useTrackSearchClick";
import { getDiscoverySessionId } from "@/features/search/utils/session";
import type { DiscoverySearchItem } from "@/core/api/services/discoverySearch";

import type { Product } from "@/shared/types/product";
import { Seo } from "@/shared/seo/Seo";
import { useProductsSeo } from "../utils/useProductsSeo";

import { ActiveFilters } from "../components/products_page/ActiveFilters";
import { EmptyState } from "../components/products_page/ProductsGridSkeleton";
import { Pagination } from "../components/products_page/Pagination";
import { MobileFiltersDrawer } from "../components/products_page/MobileFiltersDrawer";
import { CatalogueIntro } from "../components/products_page/CatalogueIntro";
import { XIcon } from "../components/products_page/icons";
import {
  CatalogueLayout, CatalogueFilters, CatalogueToolbar, CatalogueResults, MobileFilterButton,
} from "../components/products_page/ProductPageShared";

// ─── Types ────────────────────────────────────────────────────────────────────
type SortOption = "price-asc" | "price-desc" | "rating" | "newest";
const PAGE_SIZE = 40;

const inventoryToInStock = (s: string | undefined) => s === "in_stock" || s === "low_stock";

const mapCatalogItem = (p: CatalogProductListItem): Product => {
  const discount = p.discount ?? 0;
  const originalPrice = discount > 0 && discount < 100 ? p.price / (1 - discount / 100) : undefined;
  return {
    id: String(p.product_id), name: p.name, slug: p.slug, description: "",
    price: p.price, originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined, category: "", images: [],
    thumbnail: p.primary_image ?? "",
    rating: p.rating ?? 0, reviewCount: p.review_count ?? 0,
    inStock: inventoryToInStock(p.inventory_status), tags: [],
  };
};

const mapSearchItem = (item: DiscoverySearchItem): Product => {
  const discount = Number(item.discount ?? 0);
  const originalPrice = discount > 0 && discount < 100 ? item.price / (1 - discount / 100) : undefined;
  return {
    id: String(item.product_id), name: item.name, slug: item.slug, description: "",
    price: item.price, originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined, category: "", images: [],
    thumbnail: item.primary_image ?? "",
    rating: item.rating ?? 0, reviewCount: item.review_count ?? 0,
    inStock: inventoryToInStock(item.inventory_status), tags: [],
  };
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const {
    searchParams, setSearchParams,
    page, category_id, brand_id, price_min, price_max, min_rating, discount_only, in_stock_only,
    activeFilterCount, selection, setPage, clearAllFilters, removeFilter,
  } = useCatalogueFilters();

  const queryTerm     = (searchParams.get("query") ?? "").trim();
  const isSearchMode  = queryTerm.length > 0;
  const q             = searchParams.get("q") ?? undefined;
  const requestedSort = searchParams.get("sort");
  const sortBy: SortOption = ["price-asc", "price-desc", "rating", "newest"].includes(requestedSort ?? "") ? requestedSort as SortOption : "newest";

  const categoriesQuery = useCategories();
  const brandsQuery     = useBrands();

  const searchQuery   = useSearchResults(queryTerm, 20);
  const trackClick    = useTrackSearchClick();
  const sessionId     = useMemo(() => getDiscoverySessionId(), []);
  const searchItems = useMemo(() => searchQuery.data?.results.items ?? [], [searchQuery.data]);
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
    : sortBy === "rating"     ? "rating"
    : sortBy === "newest"     ? "new_arrivals"
    : undefined;

  const catalogQuery = useCatalogProducts({
    page, page_size: PAGE_SIZE, sort: sortParam,
    category_id, brand_id, q,
    price_min, price_max, min_rating,
    discount_only: discount_only || undefined,
    in_stock_only: in_stock_only || undefined,
  }, !isSearchMode);

  const catalogProducts = useMemo(
    () => (catalogQuery.data?.items ?? []).map(mapCatalogItem),
    [catalogQuery.data]
  );

  const isLoadingSearch  = isSearchMode && searchQuery.isLoading;
  const isLoadingCatalog = !isSearchMode && catalogQuery.isLoading;

  const totalPages = useMemo(() => {
    if (isSearchMode || !catalogQuery.data) return 1;
    return Math.max(1, Math.ceil(catalogQuery.data.total / (catalogQuery.data.size || PAGE_SIZE)));
  }, [isSearchMode, catalogQuery.data]);

  const totalCount = isSearchMode ? searchItems.length : (catalogQuery.data?.total ?? 0);
  const categories = (categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }));
  const brands     = (brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }));

  const { title: seoTitle, description: seoDesc, canonicalUrl, shareImage } = useProductsSeo({
    isSearchMode, isFeedMode: false, queryTerm, feedType: null,
    activeItems: isSearchMode ? searchProducts : catalogProducts,
    categories, selectedCategoryId: category_id ?? null,
    brands, selectedBrandId: brand_id ?? null,
    totalCount,
  });

  const clearSearch = () => { const next = new URLSearchParams(searchParams); next.delete("query"); next.set("page", "1"); setSearchParams(next); };

  const filterProps = { disabled: isSearchMode, categories, brands, ...selection };
  const activeQuery = isSearchMode ? searchQuery : catalogQuery;
  const loading = isLoadingSearch || isLoadingCatalog;
  const products = isSearchMode ? searchProducts : catalogProducts;
  return <MainLayout>
    <Seo title={seoTitle} description={seoDesc} canonicalUrl={canonicalUrl} imageUrl={shareImage} type="website" />
    <CatalogueLayout
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Products" }]}
      resultsLabel="Product catalogue"
      sidebar={!isSearchMode && <CatalogueFilters {...filterProps} activeFilterCount={activeFilterCount} onClearAll={clearAllFilters}
        loadError={categoriesQuery.isError || brandsQuery.isError}
        onRetry={() => { void categoriesQuery.refetch(); void brandsQuery.refetch(); }}/>}
    >
      <CatalogueIntro query={isSearchMode ? queryTerm : undefined} category={categoriesQuery.data?.find(c => String(c.id) === category_id)} />
      <CatalogueToolbar status={<>{loading ? "Loading products…" : activeQuery.isError && !products.length ? "Products unavailable" : <><strong>{totalCount.toLocaleString()}</strong> {isSearchMode ? "search results" : "products"}</>}{activeQuery.isFetching && !loading && <span className="catalogue-updating">Updating…</span>}</>}>
        {!isSearchMode ? <><MobileFilterButton activeFilterCount={activeFilterCount} onClick={() => setShowFilters(true)}/><label className="catalogue-sort"><span>Sort by:</span><select aria-label="Sort products" value={sortBy} onChange={e => { const next = new URLSearchParams(searchParams); next.set("sort",e.target.value); next.set("page","1"); setSearchParams(next); }}><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option></select></label></> : <button className="catalogue-clear-search" onClick={clearSearch}><XIcon/>Clear search</button>}
      </CatalogueToolbar>
      {isSearchMode && <p className="catalogue-search-note">Showing up to 20 relevance-ranked matches. <Link to="/products">Browse all products with filters</Link></p>}
      {!isSearchMode && activeFilterCount > 0 && <div className="catalogue-active-filters"><ActiveFilters {...filterProps} onClear={clearAllFilters} onRemove={removeFilter}/></div>}
      <CatalogueResults
        isError={activeQuery.isError} onRetry={() => void activeQuery.refetch()}
        loading={loading} products={products}
        onProductClick={isSearchMode ? (_, idx) => { void onSearchResultClick(searchItems[idx], idx + 1); } : undefined}
        empty={<><EmptyState isSearchMode={isSearchMode} onClearFilters={clearAllFilters}/>{!isSearchMode && page > totalPages && <button className="store-cta" onClick={() => setPage(1)}>Back to first page</button>}{isSearchMode && <button className="store-cta" onClick={clearSearch}>Browse products</button>}</>}
        footer={!isSearchMode && <Pagination page={page} totalPages={totalPages} canNext={page < totalPages} onPrev={() => setPage(Math.max(1,page-1))} onNext={() => setPage(page+1)} onSetPage={setPage}/>}
      />
    </CatalogueLayout>
    <MobileFiltersDrawer open={showFilters && !isSearchMode} onClose={() => setShowFilters(false)} activeFilterCount={activeFilterCount} {...filterProps} onClearAll={clearAllFilters}/>
  </MainLayout>;
};
export default ProductsPage;
