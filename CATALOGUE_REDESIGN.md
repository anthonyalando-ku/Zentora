# Catalogue redesign

## Components and presentation

- `ProductsPage.tsx`: sidebar beside the introduction and results, clear count/sort toolbar, active filter chips, request retry, and empty-result recovery.
- `CatalogueIntro.tsx`: genuine store messaging and optional API category artwork. No hardcoded campaign or product imagery.
- `FilterSidebar.tsx` / `FilterSection.tsx`: locally searchable category and brand lists, native radio/checkbox controls, collapsible groups, labelled min/max price inputs with validation and an explicit Apply price action.
- `MobileFiltersDrawer.tsx`: native modal dialog, focus containment/restoration, Escape dismissal, body scroll locking, and View results. Filters update the URL immediately; price changes require Apply price.
- `ProductPageShared.tsx`, `ProductCard.tsx`, `Pagination.tsx`, `ProductsGridSkeleton.tsx`: neutral cards, independent product and WhatsApp links, accessible pagination, matching loading surfaces. Shared improvements also reach collection pages.
- `catalogue.css`: responsive catalogue styles using the homepage's existing palette, borders and image treatment.

The shared MainLayout/header/footer, storefront ProductCard variant, StorefrontImage fallback, CategoryImage, SEO helper, query hooks, and existing cart/auth flows are reused.

## Data and behavior

The existing `/catalog/products` API powers totals and 40-item server pagination. Category, brand, price, minimum rating, stock, and discount filters remain URL-driven. Applying a filter or sort resets the page. Clearing filters preserves the selected sort and unrelated query state.

Sorting uses supported `new_arrivals`, `price_asc`, `price_desc`, and `rating` values. The old Top Rated control sent unsupported `rating_desc`; this is corrected. The old Featured label used the backend's newest default, so the label now honestly reads Newest. Legacy `sort=featured` links still resolve to that behavior.

Search keeps the existing relevance-ranked `/discovery/search` journey, including click tracking. The current search hook returns up to 20 matches, without catalogue pagination or category/brand filters, so search presents that limitation rather than inactive controls. Product tracking only handles normal product-link clicks; WhatsApp and modified/new-tab clicks remain independent.

Ratings display only when real reviews exist. Discounts use actual API values. There are no invented category/brand counts, wishlist hearts, countdowns, arbitrary price-slider bounds, grid/list controls, or unsupported payment claims. Missing images use neutral fallbacks instead of random stock photos.

## Responsive and performance

Desktop uses a sidebar and four to six product columns; tablets hide filters in the drawer; phones use two columns and full touch-sized filter/sort controls. Category/brand search operates on already-fetched data. Price typing no longer triggers an API request per keystroke. The unused attributes query and the unused catalogue request during search are removed. Images remain lazy, contained, and aspect-ratio constrained. Cached data does not disappear merely because a background refresh starts.

## Checks

- `npm run build` checks TypeScript and the production Vite bundle.
- Targeted ESLint covers the modified products page, components, and query hook.
- `node --test scripts/category-images.test.mjs` covers the reused category fallback.
- `scripts/catalogue-check.cjs` runs a local Vite server and Chromium against read-only public API data. Analytics writes are intercepted locally, as are test-only empty/error responses. It checks filters, sorts, pagination, URL persistence, mobile drawer, image fallback, search/WhatsApp isolation, retry, and horizontal overflow at 320/375/768/1440 pixels.

The browser script requires Playwright externally; no package dependency was added. Set `PLAYWRIGHT_MODULE` to its installed module path and `CHROME_PATH` to an existing Chrome executable if needed. Run it with `node scripts/catalogue-check.cjs`.

No backend changes, production writes, checkout submissions, deployment, or push are part of this task. Final visual acceptance and authenticated purchase-flow checks remain with the owner. The existing Browserslist database age warning is unrelated to this change.

## Collections (`/collections/:slug`)

Collections reuse the catalogue system: `useCatalogueFilters` (URL filter/page state), `CatalogueLayout`, `CatalogueFilters`, `CatalogueToolbar`, `CatalogueResults`, `ProductGrid`/`ProductCard`, `Pagination`, `ActiveFilters` and `MobileFiltersDrawer` are shared with `/products`. Only the header and data source differ.

- `components/collection/CollectionHeader.tsx`: compact banner (icon, title, lead, ranking description, real product count). One component; tone and icon vary per collection via `collections.ts`.
- Copy in `collections.ts` describes what each discovery feed actually ranks by. No viewer counts, timestamps or popularity claims. The old decorative LIVE/HOT badge is removed.
- Data: `/discovery/feed?feed_type=<slug>&limit=100` with the shared filters. The endpoint has no offset or sort, so the whole ranked list (max 100) is fetched once and paginated client-side at 40 per page on the collection URL. No sort control is shown.
- Filters narrow the collection itself. The old whole-store `/catalog/products` blend (which mixed store-wide results into filtered or sparse collections and inflated the count) is removed; empty collections link to `/products` instead.
- Backend: `category_id` is now applied to ranked feeds in `buildEligibleProductsCTE` (exact match, like the catalogue). Before this, the feed ignored it.
- Check: `node scripts/collection-check.cjs` (same Playwright setup as the catalogue check; set `COLLECTION_SHOTS` to save screenshots).
