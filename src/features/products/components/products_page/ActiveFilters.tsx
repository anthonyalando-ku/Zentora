import { XIcon } from "./icons";

type ActiveFiltersProps = {
  categories: { id: string | number; name: string }[];
  brands: { id: string | number; name: string }[];
  selectedCategoryId: string | null;
  selectedBrandId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  minRating: number | null;
  discountOnly: boolean;
  inStockOnly: boolean;
  onClear: () => void;
  onRemove: (key: string) => void;
};

export const ActiveFilters = ({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  priceMin,
  priceMax,
  minRating,
  discountOnly,
  inStockOnly,
  onClear,
  onRemove,
}: ActiveFiltersProps) => {
  const chips: { key: string; label: string }[] = [];

  const cat = categories.find((c) => String(c.id) === selectedCategoryId);
  if (cat) chips.push({ key: "category_id", label: cat.name });

  const brand = brands.find((b) => String(b.id) === selectedBrandId);
  if (brand) chips.push({ key: "brand_id", label: brand.name });

  if (priceMin != null) chips.push({ key: "price_min", label: `From KSh ${priceMin.toLocaleString()}` });
  if (priceMax != null) chips.push({ key: "price_max", label: `Up to KSh ${priceMax.toLocaleString()}` });
  if (minRating != null) chips.push({ key: "min_rating", label: `${minRating}★ & up` });
  if (discountOnly) chips.push({ key: "discount_only", label: "On sale" });
  if (inStockOnly) chips.push({ key: "in_stock_only", label: "In stock" });

  if (!chips.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] text-foreground/40 font-medium uppercase tracking-wider shrink-0">Active:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-medium"
        >
          {chip.label}
          <XIcon />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-[11px] text-foreground/40 hover:text-destructive transition-colors underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
};