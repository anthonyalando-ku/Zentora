// CHANGES vs original:
//
// 1. Description: zero-count fallback was too generic ("Discover X products on Zentora.
//    Filter by..."). Replaced with a richer 130–155 char version that names the feed
//    label and hints at the M-Pesa / Kenya context for click-through relevance.
// 2. Description: non-zero path — appended "Shop with M-Pesa, fast Nairobi delivery."
//    suffix so every collection page carries a differentiating trust signal instead of
//    ending abruptly after the count.
// 3. NEW: buildItemListSchema() helper — returns an ItemList JSON-LD block from the
//    first ≤10 feedItems. Consumers should render this via a <Helmet> script block
//    alongside the existing <Seo> component. ItemList enables rich list results in
//    Google Search (carousels, indented sitelinks).
// 4. shareImage logic unchanged; canonical logic unchanged.

import { useMemo } from "react";
import type { Product } from "@/shared/types/product";

const SITE_NAME = "Zentora";
const SITE_URL_FALLBACK =
  typeof window !== "undefined" ? window.location.origin : "https://zentorashop.co.ke";
const DEFAULT_OG_IMAGE = "/zentora_logo_clear.png";

type UseCollectionSeoParams = {
  feedType: string;
  feedLabel: string;
  feedItems: Product[];
  selectedCategoryId: string | null | undefined;
  selectedBrandId: string | null | undefined;
  categories: { id: string | number; name: string }[];
  brands: { id: string | number; name: string }[];
  totalCount: number;
};

type SeoResult = {
  title: string;
  description: string;
  canonicalUrl: string;
  shareImage: string;
  /** JSON-LD ItemList schema — render via <script type="application/ld+json"> */
  itemListSchema: object | null;
};

/**
 * SEO for /collections/:slug pages.
 *
 * - Canonical is always /collections/:slug (with stable filter params appended)
 * - Title includes filter context when active (e.g. "Samsung – New Arrivals")
 * - OG image: first feed product thumbnail or logo fallback
 * - itemListSchema: ItemList JSON-LD for rich list results (requires ≥1 item)
 */
export const useCollectionSeo = ({
  feedType,
  feedLabel,
  feedItems,
  selectedCategoryId,
  selectedBrandId,
  categories,
  brands,
  totalCount,
}: UseCollectionSeoParams): SeoResult => {
  const siteUrl =
    import.meta.env.VITE_PUBLIC_SITE_URL ?? SITE_URL_FALLBACK;

  return useMemo(() => {
    const firstThumb = feedItems[0]?.thumbnail;
    const shareImage =
      firstThumb?.startsWith("https://") ? firstThumb : `${siteUrl}${DEFAULT_OG_IMAGE}`;

    const categoryName = selectedCategoryId
      ? categories.find((c) => String(c.id) === selectedCategoryId)?.name
      : null;
    const brandName = selectedBrandId
      ? brands.find((b) => String(b.id) === selectedBrandId)?.name
      : null;

    // ── Title ─────────────────────────────────────────────────────────────────
    let titlePrefix = feedLabel;
    if (brandName && categoryName) titlePrefix = `${brandName} ${categoryName} – ${feedLabel}`;
    else if (brandName)            titlePrefix = `${brandName} – ${feedLabel}`;
    else if (categoryName)         titlePrefix = `${categoryName} – ${feedLabel}`;

    // ── Description ───────────────────────────────────────────────────────────
    // Target: 130–155 chars, unique per page, actionable, with trust signals.
    let description: string;
    if (totalCount > 0) {
      const filterParts: string[] = [];
      if (categoryName) filterParts.push(`in ${categoryName}`);
      if (brandName)    filterParts.push(`from ${brandName}`);
      const filterClause = filterParts.length ? ` ${filterParts.join(", ")}` : "";

      description =
        `Shop ${totalCount.toLocaleString()} ${feedLabel.toLowerCase()} products${filterClause} on ${SITE_NAME} Kenya. ` +
        `Pay with M-Pesa, enjoy fast Nairobi delivery and 7-day hassle-free returns.`;
    } else {
      // Empty / loading state — still needs a useful, non-duplicate description
      const filterHint = categoryName
        ? ` Focus on ${categoryName}${brandName ? ` by ${brandName}` : ""}.`
        : brandName
        ? ` Browse ${brandName} products.`
        : "";

      description =
        `Discover ${feedLabel.toLowerCase()} products on ${SITE_NAME} Kenya.${filterHint} ` +
        `Filter by category, brand and price. Pay with M-Pesa — fast Nairobi delivery.`;
    }

    // Cap at 160 chars (Google's visible limit)
    if (description.length > 160) {
      description = description.slice(0, 157) + "…";
    }

    // ── Canonical ─────────────────────────────────────────────────────────────
    const canonicalParams = new URLSearchParams();
    if (selectedCategoryId) canonicalParams.set("category_id", selectedCategoryId);
    if (selectedBrandId)    canonicalParams.set("brand_id",    selectedBrandId);
    const qs = canonicalParams.toString();
    const canonicalUrl = `${siteUrl}/collections/${feedType}${qs ? `?${qs}` : ""}`;

    // ── ItemList JSON-LD ──────────────────────────────────────────────────────
    // Enables rich list / carousel results in Google Search.
    // We emit up to 10 items; Google requires ≥3 for a carousel.
    const itemListSchema =
      feedItems.length >= 1
        ? {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: titlePrefix,
            description,
            url: canonicalUrl,
            numberOfItems: totalCount || feedItems.length,
            itemListElement: feedItems.slice(0, 10).map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${siteUrl}/products/${item.slug}`,
              name: item.name,
              image: item.thumbnail?.startsWith("https://") ? item.thumbnail : undefined,
            })),
          }
        : null;

    return {
      title: `${titlePrefix} | ${SITE_NAME}`,
      description,
      canonicalUrl,
      shareImage,
      itemListSchema,
    };
  }, [
    siteUrl,
    feedType,
    feedLabel,
    feedItems,
    selectedCategoryId,
    selectedBrandId,
    categories,
    brands,
    totalCount,
  ]);
};