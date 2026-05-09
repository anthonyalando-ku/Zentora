import { cn } from "@/shared/utils/cn";
import { FilterSection } from "./FilterSection";

export type FilterSidebarProps = {
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

export const FilterSidebar = ({
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
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
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