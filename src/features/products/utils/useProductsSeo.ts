import { useMemo } from "react";
import type { Product } from "@/shared/types/product";

const SITE_NAME = "Zentora";
const DEFAULT_OG_IMAGE = "/zentora_logo_clear.png";

const FEED_LABELS: Record<string, string> = {
  new_arrivals: "New Arrivals",
  trending: "Trending Now",
  featured: "Featured",
  flash_deals: "Flash Deals",
  best_sellers: "Best Sellers",
  top_rated: "Top Rated",
};

type UseProductsSeoParams = {
  isSearchMode: boolean;
  isFeedMode: boolean;
  queryTerm: string;
  feedType: string | null;
  activeItems: Product[];
  categories: { id: string | number; name: string }[];
  selectedCategoryId: string | null | undefined;
  brands: { id: string | number; name: string }[];
  selectedBrandId: string | null | undefined;
  totalCount: number;
};

type SeoResult = {
  title: string;
  description: string;
  canonicalUrl: string;
  shareImage: string;
};

/**
 * Derives all SEO values for the products listing page.
 *
 * Rules:
 * - Search mode: "Results for X | Zentora" + concise description
 * - Feed mode: named feed label in title; canonical uses feed_type param
 * - Category filter: category name in title for indexability
 * - Brand filter: brand name in title
 * - Default catalog: generic title + description with product count
 * - Canonical URL always strips transient params (page, sort) to avoid
 *   duplicate content across paginated views.
 * - OG image: first product thumbnail when available, fallback to logo.
 */
export const useProductsSeo = ({
  isSearchMode,
  isFeedMode,
  queryTerm,
  feedType,
  activeItems,
  categories,
  selectedCategoryId,
  brands,
  selectedBrandId,
  totalCount,
}: UseProductsSeoParams): SeoResult => {
  const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL ?? (typeof window !== "undefined" ? window.location.origin : "");

  return useMemo(() => {
    // OG image: first product thumbnail (must be absolute HTTPS)
    const firstThumb = activeItems[0]?.thumbnail;
    const shareImage =
      firstThumb?.startsWith("https://")
        ? firstThumb
        : `${siteUrl}${DEFAULT_OG_IMAGE}`;

    // ── Search mode ─────────────────────────────────────────────────────────
    if (isSearchMode) {
      return {
        title: `"${queryTerm}" – Search Results | ${SITE_NAME}`,
        description: `Found ${totalCount} result${totalCount !== 1 ? "s" : ""} for "${queryTerm}" on ${SITE_NAME}. Shop electronics, accessories, home goods and more.`,
        canonicalUrl: `${siteUrl}/products?query=${encodeURIComponent(queryTerm)}`,
        shareImage,
      };
    }

    // ── Feed mode ───────────────────────────────────────────────────────────
    if (isFeedMode && feedType) {
      const label = FEED_LABELS[feedType] ?? feedType.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

      // Build canonical — include stable filter params if any are active
      const canonicalParams = new URLSearchParams({ feed_type: feedType });
      if (selectedCategoryId) canonicalParams.set("category_id", selectedCategoryId);
      if (selectedBrandId)    canonicalParams.set("brand_id",    selectedBrandId);

      return {
        title: `${label} | ${SITE_NAME}`,
        description: `Shop ${label.toLowerCase()} on ${SITE_NAME}. Discover the best deals in electronics, accessories, home and more.`,
        canonicalUrl: `${siteUrl}/products?${canonicalParams.toString()}`,
        shareImage,
      };
    }

    // ── Catalog mode — build context-aware title from active filters ────────
    const categoryName = selectedCategoryId
      ? categories.find((c) => String(c.id) === selectedCategoryId)?.name
      : null;

    const brandName = selectedBrandId
      ? brands.find((b) => String(b.id) === selectedBrandId)?.name
      : null;

    let title = "All Products";
    let description = `Shop ${totalCount.toLocaleString()} products on ${SITE_NAME}.`;

    if (categoryName && brandName) {
      title = `${brandName} – ${categoryName}`;
      description = `Browse ${brandName} products in ${categoryName} on ${SITE_NAME}.`;
    } else if (categoryName) {
      title = categoryName;
      description = `Shop ${categoryName} products on ${SITE_NAME}. Filter by brand, price, rating and more.`;
    } else if (brandName) {
      title = `${brandName} Products`;
      description = `Browse all ${brandName} products on ${SITE_NAME}. Find the best deals and latest arrivals.`;
    } else {
      description = `Browse ${totalCount > 0 ? totalCount.toLocaleString() + " " : ""}products on ${SITE_NAME}. Filter by category, brand, price and rating.`;
    }

    // Canonical: only stable filter params, never page/sort (avoids
    // duplicate content signals across paginated views).
    const canonicalParams = new URLSearchParams();
    if (selectedCategoryId) canonicalParams.set("category_id", selectedCategoryId);
    if (selectedBrandId)    canonicalParams.set("brand_id",    selectedBrandId);
    const qs = canonicalParams.toString();

    return {
      title: `${title} | ${SITE_NAME}`,
      description,
      canonicalUrl: `${siteUrl}/products${qs ? `?${qs}` : ""}`,
      shareImage,
    };
  }, [
    siteUrl,
    isSearchMode,
    isFeedMode,
    queryTerm,
    feedType,
    activeItems,
    categories,
    selectedCategoryId,
    brands,
    selectedBrandId,
    totalCount,
  ]);
};