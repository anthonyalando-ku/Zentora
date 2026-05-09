import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Zentora";
const SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL ?? "";

/**
 * Builds every SEO/meta tag needed for a product detail page.
 *
 * Covers:
 *  - <title> with brand + product name pattern
 *  - meta description with price, brand, category, availability
 *  - canonical URL (slug-based, no query params)
 *  - Open Graph (og:type=product, og:price:amount, og:availability)
 *  - Twitter Card (summary_large_image)
 *  - JSON-LD Product schema (full, with offers + aggregateRating)
 *  - BreadcrumbList JSON-LD for rich results
 *  - robots: index/follow for active products, noindex for unavailable
 */

type ProductSeoProps = {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: string | undefined;
  categories: { id: number; name: string }[];
  imageUrls: string[];
  price: number;
  basePrice: number;
  currency?: string;
  inStock: boolean;
  sku: string | undefined;
  rating: number;
  reviewCount: number;
  isActive: boolean;
};

export const useProductDetailSeo = ({
  name,
  slug,
  description,
  shortDescription,
  brand,
  categories,
  imageUrls,
  price,
  basePrice,
  currency = "KES",
  inStock,
  sku,
  rating,
  reviewCount,
  isActive,
}: ProductSeoProps) => {
  return useMemo(() => {
    const siteUrl = SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const canonicalUrl = `${siteUrl}/products/${slug}`;
    const primaryImage = imageUrls[0] ?? "";
    const categoryName = categories[0]?.name ?? "";
    const brandName = brand ?? SITE_NAME;

    // ── Title ──────────────────────────────────────────────────────────────
    // Pattern: "{Product Name} | {Brand} | {Category} – Zentora"
    // Falls back gracefully when brand/category are absent.
    const titleParts = [name];
    if (brandName && brandName !== SITE_NAME) titleParts.push(brandName);
    if (categoryName) titleParts.push(categoryName);
    titleParts.push(SITE_NAME);
    const title = titleParts.join(" | ");

    // ── Meta description ───────────────────────────────────────────────────
    // Google shows ~155 chars. We embed price + availability for rich snippets.
    const descBase = shortDescription || description;
    const availText = inStock ? "In stock" : "Out of stock";
    const priceText = `KSh ${price.toLocaleString()}`;
    let metaDescription = descBase
      ? `${descBase.slice(0, 100).trimEnd()}… ${priceText} — ${availText}. Buy on ${SITE_NAME}.`
      : `Buy ${name} for ${priceText}. ${availText}. Shop ${categoryName || "products"} at ${SITE_NAME}.`;
    // Cap at 160 chars
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.slice(0, 157) + "…";
    }

    // ── JSON-LD: Product ───────────────────────────────────────────────────
    const offers: Record<string, unknown> = {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: currency,
      price: String(price),
      availability: `https://schema.org/${inStock ? "InStock" : "OutOfStock"}`,
      seller: { "@type": "Organization", name: SITE_NAME },
    };
    if (basePrice > price) {
      offers.priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    }

    const productSchema: Record<string, unknown> = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name,
      url: canonicalUrl,
      offers,
    };
    if (descBase)        productSchema.description = descBase;
    if (primaryImage)    productSchema.image = imageUrls.slice(0, 5);
    if (sku)             productSchema.sku = sku;
    if (brandName)       productSchema.brand = { "@type": "Brand", name: brandName };
    if (categoryName)    productSchema.category = categoryName;
    if (reviewCount > 0 && rating > 0) {
      productSchema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: String(rating.toFixed(1)),
        reviewCount: String(reviewCount),
        bestRating: "5",
        worstRating: "1",
      };
    }

    // ── JSON-LD: BreadcrumbList ────────────────────────────────────────────
    const breadcrumbItems: object[] = [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
    ];
    if (categoryName && categories[0]) {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `${siteUrl}/products?category_id=${categories[0].id}`,
      });
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 4,
        name,
        item: canonicalUrl,
      });
    } else {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 3,
        name,
        item: canonicalUrl,
      });
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    };

    return {
      title,
      metaDescription,
      canonicalUrl,
      primaryImage,
      productSchema,
      breadcrumbSchema,
      noindex: !isActive,
    };
  }, [
    name, slug, description, shortDescription, brand, categories,
    imageUrls, price, basePrice, currency, inStock, sku,
    rating, reviewCount, isActive,
  ]);
};

// ─── ProductDetailSeo component ──────────────────────────────────────────────
// Drop this inside the page render — it handles all <Helmet> output.
export const ProductDetailSeo = (props: ProductSeoProps) => {
  const {
    title,
    metaDescription,
    canonicalUrl,
    primaryImage,
    productSchema,
    breadcrumbSchema,
    noindex,
  } = useProductDetailSeo(props);

  return (
    <Helmet>
      <title>{title}</title>

      {noindex
        ? <meta name="robots" content="noindex,follow" />
        : <meta name="robots" content="index,follow" />
      }

      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph — product type */}
      <meta property="og:type"                   content="og:product" />
      <meta property="og:title"                  content={title} />
      <meta property="og:description"            content={metaDescription} />
      <meta property="og:url"                    content={canonicalUrl} />
      {primaryImage && <meta property="og:image" content={primaryImage} />}
      <meta property="og:site_name"              content="Zentora" />
      <meta property="product:price:amount"      content={String(props.price)} />
      <meta property="product:price:currency"    content={props.currency ?? "KES"} />
      <meta property="product:availability"      content={props.inStock ? "in stock" : "out of stock"} />
      {props.brand && <meta property="product:brand" content={props.brand} />}
      {props.sku   && <meta property="product:retailer_item_id" content={props.sku} />}

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {primaryImage && <meta name="twitter:image" content={primaryImage} />}

      {/* JSON-LD — Product */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>

      {/* JSON-LD — BreadcrumbList */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};