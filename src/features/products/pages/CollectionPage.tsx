import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useBrands } from "@/features/catalog/hooks/useBrands";
import { useCatalogueFilters } from "@/features/products/hooks/useCatalogueFilters";

import type { DiscoveryFeedType, DiscoveryFeedFilters } from "@/core/api/services/discovery";
import { useDiscoveryFeedPaged } from "@/features/discovery/hooks/useDiscoveryFeedPaged";
import { mapDiscoveryItemToProduct } from "@/features/public/home/utils/mapDiscoveryItem";

import { Seo } from "@/shared/seo/Seo";
import { useCollectionSeo } from "../utils/useCollectionSeo";

import { ActiveFilters } from "../components/products_page/ActiveFilters";
import { EmptyState } from "../components/products_page/ProductsGridSkeleton";
import { Pagination } from "../components/products_page/Pagination";
import { MobileFiltersDrawer } from "../components/products_page/MobileFiltersDrawer";
import {
  CatalogueLayout, CatalogueFilters, CatalogueToolbar, CatalogueResults, MobileFilterButton,
} from "../components/products_page/ProductPageShared";
import { CollectionHeader } from "../components/collection/CollectionHeader";
import { getCollectionIdentity } from "../components/collection/collections";

// The discovery feed returns one ranked list (at most MaxFeedLimit = 100 items,
// no offset), so the whole collection is fetched once and paginated here.
const COLLECTION_LIMIT = 100;
const PAGE_SIZE = 40;
const NO_FILTERS: DiscoveryFeedFilters = {};

// ─── Page ─────────────────────────────────────────────────────────────────────
const CollectionPage = () => {
  const { slug = "trending" } = useParams<{ slug: string }>();
  const feedType = slug as DiscoveryFeedType;
  const identity = getCollectionIdentity(slug);
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const {
    page, category_id, brand_id, price_min, price_max, min_rating, discount_only, in_stock_only,
    activeFilterCount, selection, setPage, clearAllFilters, removeFilter,
  } = useCatalogueFilters();
  const hasActiveFilters = activeFilterCount > 0;

  // Filters go to the feed endpoint itself, so they narrow this collection
  // rather than the whole catalogue.
  const filters = useMemo<DiscoveryFeedFilters>(() => ({
    category_id: category_id ? Number(category_id) : undefined,
    brand_ids:   brand_id,
    price_min, price_max, min_rating,
    discount_only: discount_only || undefined,
    in_stock_only: in_stock_only || undefined,
  }), [category_id, brand_id, price_min, price_max, min_rating, discount_only, in_stock_only]);

  const categoriesQuery = useCategories();
  const brandsQuery     = useBrands();
  const feedQuery       = useDiscoveryFeedPaged(feedType, COLLECTION_LIMIT, filters);
  // Unfiltered size for the header; shares the cache entry above when no filters are set.
  const collectionQuery = useDiscoveryFeedPaged(feedType, COLLECTION_LIMIT, NO_FILTERS);

  const allProducts = useMemo(() => (feedQuery.data?.items ?? []).map(mapDiscoveryItemToProduct), [feedQuery.data]);
  const totalCount  = allProducts.length;
  const totalPages  = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const products    = useMemo(() => allProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [allProducts, page]);
  const collectionSize = collectionQuery.data?.items.length;

  const categories = (categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }));
  const brands     = (brandsQuery.data ?? []).map((b) => ({ id: b.id, name: b.name }));

  const { title: seoTitle, description: seoDesc, canonicalUrl, shareImage, itemListSchema } = useCollectionSeo({
    feedType,
    feedLabel: identity.label,
    feedItems: allProducts,
    selectedCategoryId: category_id ?? null,
    selectedBrandId: brand_id ?? null,
    categories,
    brands,
    totalCount,
  });

  const filterProps = { disabled: false, categories, brands, ...selection };
  const loading = feedQuery.isLoading;
  const onLastPage = !loading && totalCount > 0 && page === totalPages;

  return (
    <MainLayout>
      <Seo title={seoTitle} description={seoDesc} canonicalUrl={canonicalUrl} imageUrl={shareImage} type="website" />
      {itemListSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        </Helmet>
      )}
      <CatalogueLayout
        breadcrumb={[{ label: "Home", to: "/" }, { label: identity.label }]}
        resultsLabel={identity.label + " products"}
        sidebar={<CatalogueFilters {...filterProps} activeFilterCount={activeFilterCount} onClearAll={clearAllFilters}
          loadError={categoriesQuery.isError || brandsQuery.isError}
          onRetry={() => { void categoriesQuery.refetch(); void brandsQuery.refetch(); }}/>}
      >
        <CollectionHeader identity={identity} count={collectionSize} loading={collectionQuery.isLoading} />
        <CatalogueToolbar status={<>{loading ? "Loading products…" : feedQuery.isError && !totalCount ? "Products unavailable" : hasActiveFilters || totalCount <= PAGE_SIZE
          ? <><strong>{totalCount.toLocaleString()}</strong> {hasActiveFilters && "matching "}{totalCount === 1 ? "product" : "products"}</>
          : products.length ? <>Showing <strong>{(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + products.length}</strong> of {totalCount.toLocaleString()}</> : <><strong>{totalCount.toLocaleString()}</strong> products</>}{feedQuery.isFetching && !loading && <span className="catalogue-updating">Updating…</span>}</>}>
          <MobileFilterButton activeFilterCount={activeFilterCount} onClick={() => setShowFilters(true)}/>
        </CatalogueToolbar>
        {hasActiveFilters && <div className="catalogue-active-filters"><ActiveFilters {...filterProps} onClear={clearAllFilters} onRemove={removeFilter}/></div>}
        <CatalogueResults
          isError={feedQuery.isError} onRetry={() => void feedQuery.refetch()}
          loading={loading} products={products}
          empty={totalCount > 0
            ? <div className="collection-past-end"><h3>This page is past the end of {identity.label}</h3><button className="store-cta" onClick={() => setPage(1)}>Back to first page</button></div>
            : hasActiveFilters ? <EmptyState isSearchMode={false} onClearFilters={clearAllFilters}/>
            : <EmptyState isSearchMode={false} feedLabel={identity.label} onClearFilters={() => navigate("/products")}/>}
          footer={<>
            <Pagination page={page} totalPages={totalPages} canNext={page < totalPages} onPrev={() => setPage(Math.max(1, page - 1))} onNext={() => setPage(page + 1)} onSetPage={setPage}/>
            {onLastPage && !hasActiveFilters && <p className="collection-end">That's everything in {identity.label}. <Link to="/products">Browse all products</Link></p>}
          </>}
        />
      </CatalogueLayout>
      <MobileFiltersDrawer open={showFilters} onClose={() => setShowFilters(false)} activeFilterCount={activeFilterCount} {...filterProps} onClearAll={clearAllFilters}/>
    </MainLayout>
  );
};

export default CollectionPage;
