import { useSearchParams } from "react-router-dom";
import type { FilterSidebarProps } from "../components/products_page/FilterSidebar";

const FILTER_KEYS = ["category_id", "brand_id", "price_min", "price_max", "min_rating", "discount_only", "in_stock_only"] as const;

const toNum = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

/**
 * URL-driven catalogue filters and pagination, shared by /products and
 * /collections/:slug. Every change stays on the current route, so a collection
 * keeps its context while filtering or paginating.
 */
export const useCatalogueFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page          = Math.max(1, Math.floor(toNum(searchParams.get("page")) ?? 1));
  const category_id   = searchParams.get("category_id") ?? undefined;
  const brand_id      = searchParams.get("brand_id") ?? undefined;
  const price_min     = toNum(searchParams.get("price_min"));
  const price_max     = toNum(searchParams.get("price_max"));
  const min_rating    = toNum(searchParams.get("min_rating"));
  const discount_only = searchParams.get("discount_only") === "true";
  const in_stock_only = searchParams.get("in_stock_only") === "true";

  const activeFilterCount = [
    category_id, brand_id, price_min, price_max, min_rating,
    discount_only || undefined, in_stock_only || undefined,
  ].filter(value => value !== undefined && value !== null && value !== "").length;

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onChange: FilterSidebarProps["onChange"] = (patch) => {
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
    if (patch.discount_only !== undefined) {
      if (patch.discount_only) next.set("discount_only", "true");
      else next.delete("discount_only");
    }
    if (patch.in_stock_only !== undefined) {
      if (patch.in_stock_only) next.set("in_stock_only", "true");
      else next.delete("in_stock_only");
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  /** Clears filters only; sort, search and other params are kept. */
  const clearAllFilters = () => {
    const next = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach(key => next.delete(key));
    next.set("page", "1");
    setSearchParams(next);
  };

  const removeFilter = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  /** Selection props for FilterSidebar, MobileFiltersDrawer and ActiveFilters. */
  const selection = {
    selectedCategoryId: category_id ?? null, selectedBrandId: brand_id ?? null,
    priceMin: price_min ?? null, priceMax: price_max ?? null, minRating: min_rating ?? null,
    discountOnly: discount_only, inStockOnly: in_stock_only, onChange,
  };

  return {
    searchParams, setSearchParams,
    page, category_id, brand_id, price_min, price_max, min_rating, discount_only, in_stock_only,
    activeFilterCount, selection,
    setPage, clearAllFilters, removeFilter,
  };
};
