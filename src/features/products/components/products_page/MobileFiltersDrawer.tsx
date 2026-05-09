import { FilterSidebar, type FilterSidebarProps } from "./FilterSidebar";
import { FilterIcon, XIcon } from "./icons";

type MobileFiltersDrawerProps = {
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
};

export const MobileFiltersDrawer = ({
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
}: MobileFiltersDrawerProps) => {
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
              <button type="button" onClick={onClearAll} className="text-xs text-destructive hover:underline">
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