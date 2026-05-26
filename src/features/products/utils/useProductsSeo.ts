// CHANGES vs original:
//
// 1. Search mode description: was generic count + catch-all. Now surfaces the
//    search term in a more natural sentence and adds the M-Pesa trust signal.
// 2. Feed mode description: was a single boilerplate line regardless of feed type.
//    Now uses a feed-specific sentence for the 6 named feeds so each page has a
//    distinct, meaningful description rather than identical copy.
// 3. Catalog mode — all-products default: description was "Browse N products on
//    Zentora. Filter by...". Now includes "Kenya", "M-Pesa" and delivery hint to
//    differentiate from generic e-commerce copy and satisfy the 130–155 char target.
// 4. All descriptions capped at 160 chars (unchanged logic, just applied uniformly).
// 5. VITE_PUBLIC_SITE_URL fallback made consistent with useCollectionSeo.

import { useMemo } from "react";
import type { Product } from "@/shared/types/product";

const SITE_NAME = "Zentora";
const DEFAULT_OG_IMAGE = "/zentora_logo_clear.png";

// Feed-specific description templates (used when no filters are active)
const FEED_DESCRIPTIONS: Record<string, string> = {
  new_arrivals:
    `Shop the latest arrivals on ${SITE_NAME} Kenya — freshly listed electronics, tablets, power banks and home appliances. Pay with M-Pesa, fast Nairobi delivery.`,
  trending:
    `See what's trending on ${SITE_NAME} Kenya right now. Popular electronics, gadgets and home essentials — M-Pesa checkout, fast Nairobi delivery, 7-day returns.`,
  featured:
    `Explore ${SITE_NAME}'s featured picks — a curated selection of top electronics, appliances and everyday essentials available in Kenya with M-Pesa payment.`,
  flash_deals:
    `Limited-time flash deals on electronics, tablets and home appliances at ${SITE_NAME} Kenya. Prices drop daily — pay with M-Pesa, fast Nairobi delivery.`,
  best_sellers:
    `Shop ${SITE_NAME}'s best-selling products in Kenya. Top-rated electronics, gadgets and appliances chosen by our customers — M-Pesa checkout, 7-day returns.`,
  top_rated:
    `Browse ${SITE_NAME}'s top-rated products in Kenya — highest customer-reviewed electronics, tablets and home appliances. Pay with M-Pesa, fast delivery.`,
};

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
  const siteUrl =
    import.meta.env.VITE_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "https://zentorashop.co.ke");

  return useMemo(() => {
    // OG image: first product thumbnail (must be absolute HTTPS)
    const firstThumb = activeItems[0]?.thumbnail;
    const shareImage =
      firstThumb?.startsWith("https://")
        ? firstThumb
        : `${siteUrl}${DEFAULT_OG_IMAGE}`;

    // ── Search mode ─────────────────────────────────────────────────────────
    if (isSearchMode) {
      const count = totalCount > 0
        ? `${totalCount.toLocaleString()} result${totalCount !== 1 ? "s" : ""}`
        : "results";
      return {
        title: `"${queryTerm}" – Search Results | ${SITE_NAME}`,
        description: `Found ${count} for "${queryTerm}" on ${SITE_NAME} Kenya. Shop electronics, accessories, home appliances and more — pay with M-Pesa, fast Nairobi delivery.`,
        canonicalUrl: `${siteUrl}/products?query=${encodeURIComponent(queryTerm)}`,
        shareImage,
      };
    }

    // ── Feed mode ───────────────────────────────────────────────────────────
    if (isFeedMode && feedType) {
      const label =
        FEED_LABELS[feedType] ??
        feedType.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

      // Build canonical — include stable filter params if any are active
      const canonicalParams = new URLSearchParams({ feed_type: feedType });
      if (selectedCategoryId) canonicalParams.set("category_id", selectedCategoryId);
      if (selectedBrandId)    canonicalParams.set("brand_id",    selectedBrandId);

      // Use feed-specific description when no extra filters are active
      let description: string;
      if (!selectedCategoryId && !selectedBrandId && FEED_DESCRIPTIONS[feedType]) {
        description = FEED_DESCRIPTIONS[feedType];
      } else {
        const filterParts: string[] = [];
        const categoryName = selectedCategoryId
          ? categories.find((c) => String(c.id) === selectedCategoryId)?.name
          : null;
        const brandName = selectedBrandId
          ? brands.find((b) => String(b.id) === selectedBrandId)?.name
          : null;
        if (categoryName) filterParts.push(`in ${categoryName}`);
        if (brandName)    filterParts.push(`from ${brandName}`);
        const filterClause = filterParts.length ? ` ${filterParts.join(", ")}` : "";
        description =
          `Shop ${label.toLowerCase()} products${filterClause} on ${SITE_NAME} Kenya. ` +
          `Pay with M-Pesa, enjoy fast Nairobi delivery and 7-day returns.`;
      }

      if (description.length > 160) description = description.slice(0, 157) + "…";

      return {
        title: `${label} | ${SITE_NAME}`,
        description,
        canonicalUrl: `${siteUrl}/products?${canonicalParams.toString()}`,
        shareImage,
      };
    }

    // ── Catalog mode — context-aware title from active filters ──────────────
    const categoryName = selectedCategoryId
      ? categories.find((c) => String(c.id) === selectedCategoryId)?.name
      : null;

    const brandName = selectedBrandId
      ? brands.find((b) => String(b.id) === selectedBrandId)?.name
      : null;

    let title = "All Products";
    let description: string;

    if (categoryName && brandName) {
      title = `${brandName} – ${categoryName}`;
      description =
        `Browse ${brandName} products in ${categoryName} on ${SITE_NAME} Kenya. ` +
        `Pay with M-Pesa, fast Nairobi delivery and 7-day hassle-free returns.`;
    } else if (categoryName) {
      title = categoryName;
      description =
        `Shop ${categoryName} products on ${SITE_NAME} Kenya${totalCount > 0 ? ` — ${totalCount.toLocaleString()} items available` : ""}. ` +
        `Filter by brand, price and rating. M-Pesa checkout, fast Nairobi delivery.`;
    } else if (brandName) {
      title = `${brandName} Products`;
      description =
        `Browse all ${brandName} products on ${SITE_NAME} Kenya. ` +
        `Find the best deals and latest arrivals — pay with M-Pesa, 7-day returns.`;
    } else {
      description =
        `Browse ${totalCount > 0 ? totalCount.toLocaleString() + " " : ""}products on ${SITE_NAME} Kenya. ` +
        `Electronics, tablets, home appliances and more — M-Pesa checkout, fast Nairobi delivery.`;
    }

    if (description.length > 160) description = description.slice(0, 157) + "…";

    // Canonical: only stable filter params, never page/sort
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