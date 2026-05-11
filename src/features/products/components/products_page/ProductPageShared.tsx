import type { Product } from "@/shared/types/product";
import { ProductCard } from "@/features/products/components/ProductCard";

// ─── Product Grid ─────────────────────────────────────────────────────────────

type ProductGridProps = {
  products: Product[];
  /** When provided, wraps each card in a clickable div (e.g. search results) */
  onProductClick?: (product: Product, idx: number) => void;
};

export const ProductGrid = ({ products, onProductClick }: ProductGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
    {products.map((product, idx) => (
      <div
        key={product.slug}
        role={onProductClick ? "button" : undefined}
        tabIndex={onProductClick ? 0 : undefined}
        className="transition-transform hover:-translate-y-0.5 hover:shadow-md rounded-xl cursor-pointer"
        onClick={() => onProductClick?.(product, idx)}
        onKeyDown={(e) => { if (e.key === "Enter") onProductClick?.(product, idx); }}
      >
        <ProductCard product={product} hideAddToCart />
      </div>
    ))}
  </div>
);

// ─── Section Divider ──────────────────────────────────────────────────────────

type SectionDividerProps = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export const SectionDivider = ({ title, subtitle, badge }: SectionDividerProps) => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px bg-border" />
    <div className="flex items-center gap-2 shrink-0">
      {badge && (
        <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
          {badge}
        </span>
      )}
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        {subtitle && <p className="text-[11px] text-foreground/40 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="flex-1 h-px bg-border" />
  </div>
);

// ─── Page Shell (shared header + sidebar layout) ──────────────────────────────

type PageShellProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
};

export const PageShell = ({ sidebar, header, children }: PageShellProps) => (
  <div className="bg-background">
    {/* Header bar — py-3 on mobile gives the stacked layout breathing room */}
    <div className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        {header}
      </div>
    </div>
    {/* Body */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div className="flex gap-6">
        <aside className="hidden lg:block w-52 xl:w-56 shrink-0">
          <div className="sticky top-20">{sidebar}</div>
        </aside>
        <section className="flex-1 min-w-0">{children}</section>
      </div>
    </div>
  </div>
);

// ─── Filter Sidebar Shell (header + panel) ────────────────────────────────────

import { FilterIcon } from "./icons";

type FilterSidebarShellProps = {
  activeFilterCount: number;
  onClearAll: () => void;
  hint?: React.ReactNode;
  children: React.ReactNode;
};

export const FilterSidebarShell = ({
  activeFilterCount,
  onClearAll,
  hint,
  children,
}: FilterSidebarShellProps) => (
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
        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] text-destructive hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
    {hint && <div className="mb-3">{hint}</div>}
    <div className="rounded-xl border border-border bg-background p-3 overflow-hidden">
      {children}
    </div>
  </>
);