import { useMemo } from "react";
import type { Product } from "@/shared/types/product";

const SITE_NAME = "Zentora";
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
};

/**
 * SEO for /collections/:slug pages.
 *
 * - Canonical is always /collections/:slug (with stable filter params appended)
 * - Title includes filter context when active (e.g. "Samsung – New Arrivals")
 * - OG image: first feed product thumbnail or logo fallback
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
    import.meta.env.VITE_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");

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

    // Title: "Samsung – New Arrivals | Zentora" or "New Arrivals | Zentora"
    let titlePrefix = feedLabel;
    if (brandName && categoryName) titlePrefix = `${brandName} ${categoryName} – ${feedLabel}`;
    else if (brandName)            titlePrefix = `${brandName} – ${feedLabel}`;
    else if (categoryName)         titlePrefix = `${categoryName} – ${feedLabel}`;

    const description =
      totalCount > 0
        ? `Shop ${totalCount.toLocaleString()} ${feedLabel.toLowerCase()} products on ${SITE_NAME}.${categoryName ? ` Browsing ${categoryName}.` : ""}${brandName ? ` Brand: ${brandName}.` : ""}`
        : `Discover ${feedLabel.toLowerCase()} products on ${SITE_NAME}. Filter by category, brand, price and more.`;

    // Canonical: /collections/:slug + stable filter params only (no page)
    const canonicalParams = new URLSearchParams();
    if (selectedCategoryId) canonicalParams.set("category_id", selectedCategoryId);
    if (selectedBrandId)    canonicalParams.set("brand_id",    selectedBrandId);
    const qs = canonicalParams.toString();

    return {
      title: `${titlePrefix} | ${SITE_NAME}`,
      description,
      canonicalUrl: `${siteUrl}/collections/${feedType}${qs ? `?${qs}` : ""}`,
      shareImage,
    };
  }, [siteUrl, feedType, feedLabel, feedItems, selectedCategoryId, selectedBrandId, categories, brands, totalCount]);
};