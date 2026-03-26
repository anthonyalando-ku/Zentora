import { Helmet } from "react-helmet-async";

export const ProductJsonLd = ({
  name,
  description,
  image,
  sku,
  price,
  currency = "KES",
  availability,
  url,
  ratingValue,
  reviewCount,
}: {
  name: string;
  description?: string;
  image?: string;
  sku?: string;
  price: number;
  currency?: string;
  availability: "InStock" | "OutOfStock";
  url: string;
  ratingValue?: number;
  reviewCount?: number;
}) => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description,
    image: image ? [image] : undefined,
    sku,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: String(price),
      availability: `https://schema.org/${availability}`,
    },
    aggregateRating:
      typeof ratingValue === "number" && typeof reviewCount === "number" && reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: String(ratingValue),
            reviewCount: String(reviewCount),
          }
        : undefined,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};