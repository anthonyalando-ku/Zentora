export default async (request: Request) => {
  const ua = request.headers.get("user-agent") || "";
  const isBot =
    /bot|crawl|spider|slackbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot/i.test(ua);

  const url = new URL(request.url);

  // Only intercept product pages like /products/:slug
  const m = url.pathname.match(/^\/products\/([^/]+)$/);
  if (!m) return fetch(request);

  // humans: always serve SPA shell so React Router can render the page
  if (!isBot) {
    const spaUrl = new URL("/index.html", url.origin);
    return fetch(spaUrl.toString(), requestInitFrom(request));
  }

  // Bots: return OG HTML
  const slug = decodeURIComponent(m[1]);

  const API_BASE = "https://zentora-api.onrender.com/api/v1";
  const apiUrl = `${API_BASE}/catalog/products/slug/${encodeURIComponent(slug)}`;

  try {
    const apiRes = await fetch(apiUrl, { headers: { Accept: "application/json" } });

    if (!apiRes.ok) {
      return htmlResponse(minimalOgHtml(url.href));
    }

    const payload = await apiRes.json();
    const product = payload?.data ?? payload;

    const name = product?.name ?? "Product";
    const descRaw =
      (product?.description?.Valid ? product.description.String : product?.description) ??
      `Buy ${name} on Zentora.`;
    const description = String(descRaw).trim().slice(0, 180);

    const image =
      product?.images?.find?.((i: any) => i?.is_primary)?.image_url ??
      product?.images?.[0]?.image_url ??
      "https://picsum.photos/seed/zentora/1200/630";

    const html = ogHtml({
      title: `${name} | Zentora`,
      description,
      image,
      url: url.href,
    });

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return htmlResponse(minimalOgHtml(url.href));
  }
};

function htmlResponse(html: string) {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/**
 * Copy only safe request properties for fetch('/index.html').
 * (Avoid passing through the original URL/method/body.)
 */
function requestInitFrom(req: Request): RequestInit {
  return {
    method: "GET",
    headers: req.headers,
    redirect: "follow",
  };
}

const ogHtml = ({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
}) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="product" />
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

const minimalOgHtml = (url: string) =>
  ogHtml({
    title: "Zentora",
    description: "Shop on Zentora.",
    image: "https://picsum.photos/seed/zentora/1200/630",
    url,
  });

const escapeHtml = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");