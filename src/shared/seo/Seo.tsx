import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
};

export const Seo = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
  type = "website",
  noindex,
}: SeoProps) => {
  const desc = description?.trim();

  return (
    <Helmet>
      <title>{title}</title>

      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}

      {desc ? <meta name="description" content={desc} /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      {desc ? <meta property="og:description" content={desc} /> : null}
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:type" content={type} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      {/* Twitter */}
      <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      {desc ? <meta name="twitter:description" content={desc} /> : null}
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
    </Helmet>
  );
};