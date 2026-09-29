// Read-only responsive check of the storefront homepage. Live public catalogue data
// and product images; other external hosts are blocked and writes are intercepted.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5198 } });
  await server.listen();
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (url.hostname.endsWith('imagekit.io')) return route.continue();
      if (url.origin !== origin) return route.abort();
      if (!url.pathname.startsWith('/api/')) return route.continue();
      if (request.method() !== 'GET') return route.fulfill({ json: {} });
      if (!/^\/api\/(catalog|discovery)\//.test(url.pathname)) return route.fulfill({ status: 401, json: { message: 'Test guest session' } });
      for (let attempt = 0; ; attempt++) {
        try {
          const response = await fetch('https://zentora-api.onrender.com/api/v1/' + url.pathname.slice(5) + url.search, { signal: AbortSignal.timeout(45000) });
          return route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
        } catch (error) { if (attempt === 3) throw error; await new Promise(r => setTimeout(r, 1500)); }
      }
    });
    const box = sel => page.locator(sel).first().boundingBox();

    for (const width of [320, 360, 390, 430, 480, 519, 520, 600, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(origin + '/');
      await page.locator('.store-hero h1').waitFor({ timeout: 60000 });
      await page.locator('.store-hero-side a').first().waitFor({ timeout: 60000 });
      await page.locator('.store-product-card').first().waitFor({ timeout: 60000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no page overflow at ' + width);
      const hero = await box('.store-hero'); const image = await box('.store-hero-image');
      if (width < 520) {
        // Phone: stacked hero, image spans most of the card width below the copy.
        const copy = await box('.store-hero-copy');
        assert.ok(image.width >= hero.width * 0.85, `hero image width ${image.width} at ${width}`);
        assert.ok(image.y >= copy.y + copy.height - 1, 'image sits below copy at ' + width);
        assert.ok(hero.height >= 430 && hero.height <= 560, `hero height ${hero.height} at ${width}`);
        // Promo rail: ~84vw cards, starts at the first card, next card peeks in.
        const rail = page.locator('.store-hero-side');
        assert.equal(await rail.evaluate(r => r.scrollLeft), 0);
        const card = await box('.store-hero-side > a');
        assert.ok(Math.abs(card.width - Math.min(width * 0.84, 360)) < 2, 'promo card width at ' + width);
        assert.ok(await rail.evaluate(r => r.scrollWidth > r.clientWidth), 'promo rail scrolls at ' + width);
        assert.ok((await box('.store-mini-promo .store-image')).height >= 130, 'promo image keeps presence at ' + width);
      } else if (width < 768) {
        assert.ok(image.x > hero.x + hero.width * 0.4, 'balanced text | image hero at ' + width);
      }
      if (width < 768) {
        for (const sel of ['.store-category-grid', '.store-product-grid']) assert.ok(await page.locator(sel).first().evaluate(r => r.scrollWidth > r.clientWidth), sel + ' is a rail at ' + width);
        assert.ok((await box('.store-product-card')).width >= 150, 'product cards stay >= 150px at ' + width);
        // Carousel controls are not covered by anything (floating buttons included).
        for (const b of await page.locator('.store-carousel-controls button').all()) {
          const r = await b.boundingBox();
          assert.equal(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('.store-carousel-controls'), [r.x + r.width / 2, r.y + r.height / 2]), true, 'carousel control reachable at ' + width);
        }
        // Floating contact buttons sit above the fixed bottom navigation.
        const nav = await box('nav.fixed'); const fabs = await box('[aria-label="Quick contact"]');
        assert.ok(fabs.y + fabs.height <= nav.y - 4, 'floating actions clear the bottom nav at ' + width);
        assert.ok((await box('[aria-label="Quick contact"] a')).width <= 44, 'compact floating actions at ' + width);
      }
      if (width === 1440) {
        // Desktop composition unchanged from the approved baseline.
        assert.deepEqual([Math.round(hero.width), Math.round(hero.height)], [884, 386]);
        assert.equal(await page.locator('.store-hero-side').evaluate(r => getComputedStyle(r).display), 'grid');
        assert.equal(await page.locator('.store-product-grid').first().evaluate(r => getComputedStyle(r).gridTemplateColumns.split(' ').length), 6);
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: homepage at 320-1440: no overflow; stacked phone hero with full-width image (<520); balanced hero 520-767; promo/category/product rails; product cards >=150px; carousel controls reachable; compact floating actions clear bottom nav; desktop composition unchanged.');
  } finally {
    await Promise.race([(async () => { await browser.close(); server.httpServer.closeAllConnections(); await server.close(); })(), new Promise(r => setTimeout(r, 5000))]);
  }
})().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
