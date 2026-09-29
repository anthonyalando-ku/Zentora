import { Fragment } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/shared/types/product";
import { ProductCard } from "@/features/products/components/ProductCard";
import { FilterSidebar, type FilterSidebarProps } from "./FilterSidebar";
import { ProductsGridSkeleton } from "./ProductsGridSkeleton";
import { FilterIcon } from "./icons";

// Shared catalogue building blocks for /products and /collections/:slug.
// Pages differ only in their header and data source; layout, filters, grid,
// loading/error/empty states and pagination stay identical.

// ─── Product Grid ─────────────────────────────────────────────────────────────

type ProductGridProps = {
  products: Product[];
  /** Track plain product-link activation; keep chat and modified clicks independent. */
  onProductClick?: (product: Product, idx: number) => void;
};

export const ProductGrid = ({ products, onProductClick }: ProductGridProps) => (
  <div className="catalogue-product-grid grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
    {products.map((product, idx) => <div key={product.slug} className="catalogue-product-slot"
      onClickCapture={e => {
        const link = (e.target as HTMLElement).closest("a");
        if (!onProductClick || !link || link.getAttribute("href") !== "/products/" + product.slug || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onProductClick(product, idx);
      }}>
      <ProductCard product={product} hideAddToCart variant="storefront" />
    </div>)}
  </div>
);

// ─── Catalogue Layout (breadcrumb + sidebar + results column) ─────────────────

export type Crumb = { label: string; to?: string };

type CatalogueLayoutProps = {
  breadcrumb: Crumb[];
  /** Omit to use the full-width layout (search results). */
  sidebar?: React.ReactNode;
  resultsLabel: string;
  children: React.ReactNode;
};

export const CatalogueLayout = ({ breadcrumb, sidebar, resultsLabel, children }: CatalogueLayoutProps) => (
  <div className="catalogue-page"><div className="store-shell">
    <nav className="catalogue-breadcrumb" aria-label="Breadcrumb">
      {breadcrumb.map((crumb, i) => <Fragment key={crumb.label}>
        {i > 0 && <span aria-hidden="true">/</span>}
        {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
      </Fragment>)}
    </nav>
    <div className={"catalogue-layout " + (sidebar ? "" : "catalogue-search-layout")}>
      {sidebar && <aside className="catalogue-sidebar" aria-label="Catalogue filters">{sidebar}</aside>}
      <section className="catalogue-results" aria-label={resultsLabel}>{children}</section>
    </div>
  </div></div>
);

// ─── Filter Sidebar Shell (header + panel) ────────────────────────────────────

type FilterSidebarShellProps = {
  activeFilterCount: number;
  onClearAll: () => void;
  children: React.ReactNode;
};

export const FilterSidebarShell = ({ activeFilterCount, onClearAll, children }: FilterSidebarShellProps) => (
  <>
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
        <button type="button" onClick={onClearAll} className="text-[11px] text-destructive hover:underline">
          Clear all
        </button>
      )}
    </div>
    <div className="rounded-xl border border-border bg-background p-3 overflow-hidden">
      {children}
    </div>
  </>
);

/** Desktop filter sidebar content: shell, load-error note and the shared filter controls. */
export const CatalogueFilters = ({ activeFilterCount, onClearAll, loadError, onRetry, ...filterProps }: FilterSidebarProps & {
  activeFilterCount: number;
  onClearAll: () => void;
  loadError?: boolean;
  onRetry?: () => void;
}) => (
  <FilterSidebarShell activeFilterCount={activeFilterCount} onClearAll={onClearAll}>
    {loadError && <div className="catalogue-filter-note" role="status">Some filters couldn't load. <button onClick={onRetry}>Retry</button></div>}
    <FilterSidebar {...filterProps}/>
  </FilterSidebarShell>
);

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export const CatalogueToolbar = ({ status, children }: { status: React.ReactNode; children?: React.ReactNode }) => (
  <div className="catalogue-toolbar">
    <p role="status" aria-live="polite">{status}</p>
    <div className="catalogue-toolbar-actions">{children}</div>
  </div>
);

/** Opens the shared MobileFiltersDrawer; hidden on desktop via CSS. */
export const MobileFilterButton = ({ activeFilterCount, onClick }: { activeFilterCount: number; onClick: () => void }) => (
  <button className="catalogue-mobile-filter" onClick={onClick}>
    <FilterIcon/>Filters{activeFilterCount > 0 && <span>{activeFilterCount}</span>}
  </button>
);

// ─── Results (error / loading / empty / grid + pagination) ────────────────────

type CatalogueResultsProps = {
  isError: boolean;
  onRetry: () => void;
  loading: boolean;
  products: Product[];
  onProductClick?: ProductGridProps["onProductClick"];
  /** Rendered when there are no products. */
  empty: React.ReactNode;
  /** Rendered below the grid, e.g. pagination. */
  footer?: React.ReactNode;
};

export const CatalogueResults = ({ isError, onRetry, loading, products, onProductClick, empty, footer }: CatalogueResultsProps) =>
  isError ? <div className="catalogue-error" role="alert"><h2>We couldn't load the products</h2><p>Please try again. Your filters have been kept.</p><button onClick={onRetry}>Try again</button></div>
  : loading ? <div aria-busy="true" aria-label="Loading products"><ProductsGridSkeleton count={12}/></div>
  : !products.length ? <div className="catalogue-empty">{empty}</div>
  : <><ProductGrid products={products} onProductClick={onProductClick}/>{footer}</>;
