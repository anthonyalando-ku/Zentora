export default async (request: Request) => {
  const ua = request.headers.get("user-agent") || "";
  const isBot =
    /(facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|bot|crawl|spider)/i.test(ua);

  const url = new URL(request.url);

  // Only match EXACT /products (not /products/:slug)
  if (url.pathname !== "/products") return fetch(request);

  // Humans -> SPA shell
  if (!isBot) {
    const spaUrl = new URL("/index.html", url.origin);
    return fetch(spaUrl.toString(), { method: "GET", headers: request.headers, redirect: "follow" });
  }

  // Bots -> OG HTML
  const feedType = (url.searchParams.get("feed_type") ?? "").trim();
  const query = (url.searchParams.get("query") ?? "").trim();
  const categoryId = (url.searchParams.get("category_id") ?? "").trim();
  const brandId = (url.searchParams.get("brand_id") ?? "").trim();

  const title = buildTitle({ feedType, query, categoryId, brandId });
  const description = buildDescription({ feedType, query, categoryId, brandId });

  // Use a stable image for listing pages (recommended)
  const image = `${url.origin}/public/zentora_logo_clear.png}`;

  return new Response(
    ogHtml({
      title,
      description,
      image,
      url: url.href,
    }),
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    }
  );
};

function buildTitle({
  feedType,
  query,
  categoryId,
  brandId,
}: {
  feedType: string;
  query: string;
  categoryId: string;
  brandId: string;
}) {
  if (query) return `Search: ${query} | Zentora`;
  if (feedType) return `${feedType.replaceAll("_", " ")} Products | Zentora`;
  if (categoryId) return `Category Products | Zentora`;
  if (brandId) return `Brand Products | Zentora`;
  return "Products | Zentora";
}

function buildDescription({
  feedType,
  query,
  categoryId,
  brandId,
}: {
  feedType: string;
  query: string;
  categoryId: string;
  brandId: string;
}) {
  if (query) return `Browse search results for "${query}" on Zentora.`;
  if (feedType) return `Browse ${feedType.replaceAll("_", " ")} products on Zentora.`;
  if (categoryId) return "Browse products in this category on Zentora.";
  if (brandId) return "Browse products from this brand on Zentora.";
  return "Browse products on Zentora. Filter by category, brand, price and rating.";
}

function ogHtml({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
  </head>
  <body>
    <p>${escapeHtml(title)}</p>
  </body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}