// Read-only integration check for /collections/:slug. Live public feed data is
// used where possible; paginated/empty/error feeds are test-only browser overrides.
// Analytics writes are intercepted locally. Screenshots go to COLLECTION_SHOTS (optional).
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const shots = process.env.COLLECTION_SHOTS;
const fakeItems = n => Array.from({ length: n }, (_, i) => ({ product_id: 900000 + i, name: 'Test product ' + (i + 1), slug: 'test-product-' + (i + 1), primary_image: null, price: 1000 + i, discount: 0, rating: 0, review_count: 0, inventory_status: 'in_stock' }));
(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5194 } });
  await server.listen();
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  const requestAbort = new AbortController();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = []; const requests = []; let mode = 'live';
    page.on('pageerror', e => errors.push(e.message));
    await context.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (url.origin !== origin) return route.abort();
      if (!url.pathname.startsWith('/api/')) return route.continue();
      requests.push(url);
      if (request.method() !== 'GET') return route.fulfill({ json: {} });
      if (url.pathname === '/api/discovery/feed' && mode !== 'live') {
        if (mode === 'error') return route.fulfill({ status: 503, json: { message: 'Test-only service unavailable' } });
        const items = mode === 'empty' ? [] : fakeItems(90);
        return route.fulfill({ json: { success: true, data: { feed_type: url.searchParams.get('feed_type'), limit: 100, items } } });
      }
      if (!/^\/api\/(catalog|discovery)\//.test(url.pathname)) return route.fulfill({ status: 401, json: { message: 'Test guest session' } });
      const response = await fetch('https://zentora-api.onrender.com/api/v1/' + url.pathname.slice(5) + url.search, { signal: AbortSignal.any([requestAbort.signal, AbortSignal.timeout(45000)]) });
      await route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
    });
    const feedRequests = () => requests.filter(u => u.pathname === '/api/discovery/feed');
    const lastFeed = () => feedRequests().at(-1)?.searchParams;
    const waitFeedParam = async (key, value) => { for (let i = 0; i < 100 && lastFeed()?.get(key) !== value; i++) await page.waitForTimeout(100); assert.equal(lastFeed()?.get(key), value, key); };
    const onCollection = slug => assert.equal(new URL(page.url()).pathname, '/collections/' + slug);
    const slots = page.locator('.catalogue-product-slot');

    // Live trending collection
    await page.goto(origin + '/collections/trending?page=1');
    await slots.first().waitFor({ timeout: 60000 });
    assert.equal(await page.locator('.collection-header h1').innerText(), 'Trending Now');
    assert.equal(await page.locator('.collection-tone-trending').count(), 1);
    assert.equal(await page.locator('.catalogue-breadcrumb').innerText().then(t => t.replace(/\s+/g, ' ').trim()), 'Home / Trending Now');
    assert.equal(await page.getByText('LIVE', { exact: true }).count(), 0, 'decorative LIVE badge removed');
    assert.equal(await page.getByText(/Refine within/).count(), 0);
    assert.equal(await page.getByLabel('Sort products').count(), 0, 'feed endpoint has no sort');
    assert.equal(lastFeed().get('feed_type'), 'trending'); assert.equal(lastFeed().get('limit'), '100');
    const liveFeed = await page.evaluate(async u => (await (await fetch(u)).json()).data.items.length, origin + '/api/discovery/feed?feed_type=trending&limit=100');
    await page.locator('.collection-header-count strong').waitFor();
    assert.equal(await page.locator('.collection-header-count strong').innerText(), String(liveFeed), 'header count from feed result');
    assert.ok((await page.locator('.catalogue-toolbar p').innerText()).includes(String(liveFeed)), 'toolbar reflects feed size');
    assert.equal(await slots.count(), Math.min(40, liveFeed));
    await page.locator('.catalogue-product-slot .store-product-card').first().waitFor();

    // Filters stay on the collection route and go to the feed endpoint
    const category = page.locator('.catalogue-sidebar [role="group"][aria-label="Category"] label').nth(1);
    await category.click(); await page.waitForURL(u => u.searchParams.has('category_id')); onCollection('trending');
    await waitFeedParam('category_id', new URL(page.url()).searchParams.get('category_id')); assert.equal(lastFeed().get('feed_type'), 'trending');
    await page.locator('.catalogue-sidebar [role="group"][aria-label="Brand"] label').nth(1).click(); await page.waitForURL(u => u.searchParams.has('brand_id'));
    await waitFeedParam('brand_ids', new URL(page.url()).searchParams.get('brand_id'));
    await page.getByLabel('Minimum', { exact: true }).fill('100'); await page.getByLabel('Maximum', { exact: true }).fill('500000'); await page.getByRole('button', { name: 'Apply price' }).click();
    await waitFeedParam('price_min', '100'); await waitFeedParam('price_max', '500000');
    await page.getByLabel('In stock only', { exact: true }).click(); await waitFeedParam('in_stock_only', 'true');
    await page.getByLabel('Discount only', { exact: true }).click(); await waitFeedParam('discount_only', 'true');
    onCollection('trending'); assert.equal(await page.locator('.catalogue-active-filters').count(), 1);
    assert.equal(requests.filter(u => u.pathname === '/api/catalog/products').length, 0, 'collection never falls back to the whole-store catalogue');
    const filtered = page.url(); await page.reload(); await page.getByLabel('In stock only', { exact: true }).waitFor(); assert.equal(await page.getByLabel('In stock only', { exact: true }).isChecked(), true);
    await page.locator('.catalogue-sidebar').getByRole('button', { name: 'Clear all', exact: true }).click(); await page.waitForURL(u => !u.searchParams.has('category_id')); onCollection('trending');
    await page.goBack(); assert.equal(page.url(), filtered); await page.goForward();

    // Client-side pagination over the full ranked feed keeps the collection route
    mode = 'mock'; await page.goto(origin + '/collections/trending'); await slots.first().waitFor();
    assert.equal(await slots.count(), 40); assert.equal(await page.locator('.collection-header-count strong').innerText(), '90');
    await page.getByRole('button', { name: 'Page 2', exact: true }).click(); await page.waitForURL(u => u.searchParams.get('page') === '2'); onCollection('trending');
    await slots.first().getByText('Test product 41', { exact: true }).waitFor({ timeout: 5000 });
    await page.getByRole('button', { name: 'Page 3', exact: true }).click(); await page.waitForURL(u => u.searchParams.get('page') === '3');
    await page.getByText("That's everything in Trending Now.").waitFor(); assert.equal(await slots.count(), 10);
    await page.goto(origin + '/collections/trending?page=9'); await page.getByText('This page is past the end of Trending Now').waitFor(); await page.getByRole('button', { name: 'Back to first page' }).click(); await page.waitForURL(u => u.searchParams.get('page') === '1'); onCollection('trending');

    // Responsive layout + shared mobile drawer
    await slots.first().getByText('Test product 1', { exact: true }).waitFor();
    assert.equal((await page.locator('.catalogue-toolbar p').innerText()).replace(/\s+/g, ' ').trim(), 'Showing 1–40 of 90');
    for (const width of [1440, 1024, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No body overflow at ' + width);
      if (shots) await page.screenshot({ path: path.join(shots, 'trending-' + width + '.png') });
    }
    await page.setViewportSize({ width: 375, height: 900 });
    const headerBox = await page.locator('.collection-header').boundingBox(); assert.ok(headerBox.height < 260, 'mobile header stays compact: ' + headerBox.height);
    await page.getByRole('button', { name: 'Filters', exact: true }).click(); const drawer = page.getByRole('dialog'); await drawer.waitFor({ state: 'visible' });
    await drawer.getByLabel('In stock only', { exact: true }).click(); await page.waitForURL(u => u.searchParams.get('in_stock_only') === 'true'); onCollection('trending');
    await drawer.getByRole('button', { name: 'View results' }).click(); assert.equal(await drawer.isVisible(), false);
    await page.setViewportSize({ width: 1440, height: 1000 });

    // Other collections share the component with their own identity
    mode = 'live';
    for (const [slug, title, tone] of [['best_sellers', 'Best Sellers', 'gold'], ['new_arrivals', 'New Arrivals', 'fresh'], ['deals', 'Deals', 'deal']]) {
      await page.goto(origin + '/collections/' + slug); await page.locator('.collection-header-count strong').waitFor({ timeout: 60000 });
      const size = Number(await page.locator('.collection-header-count strong').innerText());
      if (size) { await slots.first().waitFor(); assert.equal(await slots.count(), Math.min(40, size)); }
      else await page.getByText('No ' + title + ' right now').waitFor(); // honest empty state, no catalogue fallback
      assert.equal(await page.locator('.collection-header h1').innerText(), title); assert.equal(await page.locator('.collection-tone-' + tone).count(), 1);
      assert.equal(lastFeed().get('feed_type'), slug);
      if (shots) await page.screenshot({ path: path.join(shots, slug + '-1440.png') });
    }
    await page.goto(origin + '/collections/trending'); await slots.first().waitFor({ timeout: 60000 });
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 900 });
      if (shots) await page.screenshot({ path: path.join(shots, 'trending-live-' + width + '.png') });
    }

    // Empty and error states
    mode = 'empty'; await page.goto(origin + '/collections/trending?in_stock_only=true'); await page.getByText('No products found', { exact: true }).waitFor();
    await page.goto(origin + '/collections/trending'); await page.getByText('No Trending Now right now').waitFor();
    await page.getByRole('button', { name: /Explore all products/ }).click(); await page.waitForURL(u => u.pathname === '/products');
    mode = 'error'; await page.goto(origin + '/collections/trending'); await page.getByRole('heading', { name: "We couldn't load the products" }).waitFor({ timeout: 45000 });
    mode = 'live'; await page.getByRole('button', { name: 'Try again', exact: true }).click(); await slots.first().waitFor({ timeout: 45000 });

    assert.deepEqual(errors, []);
    console.log('PASS: live trending collection, header identity + real count, no LIVE badge/sort, filters routed to the feed endpoint on the collection URL, no catalogue fallback, pagination on /collections/trending, refresh/back/forward, widths 320-1440, shared mobile drawer, best sellers/new arrivals/deals identities, empty/error/retry.');
  } catch (error) { console.error(error); throw error; }
  finally {
    await Promise.race([(async () => {
      for (const context of browser.contexts()) await context.unrouteAll({ behavior: 'ignoreErrors' });
      requestAbort.abort();
      await browser.close();
      server.httpServer.closeAllConnections();
      await server.close();
    })(), new Promise(resolve => setTimeout(resolve, 5000))]);
  }
})().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
