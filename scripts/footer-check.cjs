// Read-only check of the shared storefront footer. Live public catalogue data is
// proxied; other API calls get a guest 401; writes and external hosts are blocked.
// Screenshots go to FOOTER_SHOTS (optional).
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const shots = process.env.FOOTER_SHOTS;
const EXPECTED_LINKS = ['/products', '/collections/deals', '/collections/new_arrivals', '/collections/best_sellers', '/account', '/account#orders', '/cart', '/checkout', '/help', '/contact', '/about', '/returns', '/terms', '/privacy'];
const EXPECTED_SOCIAL = ['https://www.tiktok.com/@zentorashopkenya', 'https://www.facebook.com/zentorashop', 'https://www.instagram.com/zentorashopkenya1'];
(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5195 } });
  await server.listen();
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  const requestAbort = new AbortController();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await context.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (url.origin !== origin) return route.abort();
      if (!url.pathname.startsWith('/api/')) return route.continue();
      if (request.method() !== 'GET') return route.fulfill({ json: {} });
      if (!/^\/api\/(catalog|discovery)\//.test(url.pathname)) return route.fulfill({ status: 401, json: { message: 'Test guest session' } });
      const response = await fetch('https://zentora-api.onrender.com/api/v1/' + url.pathname.slice(5) + url.search, { signal: AbortSignal.any([requestAbort.signal, AbortSignal.timeout(45000)]) });
      await route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
    });
    const footer = page.locator('footer.store-footer');

    // Shared footer on every storefront layout page
    for (const p of ['/', '/products', '/collections/trending', '/about', '/help']) {
      await page.goto(origin + p); await footer.waitFor();
      assert.equal(await footer.count(), 1, 'one footer on ' + p);
    }

    // Content: real links, socials, payment; nothing invented
    const hrefs = await footer.locator('nav a').evaluateAll(as => as.map(a => a.getAttribute('href')));
    assert.deepEqual(hrefs, EXPECTED_LINKS);
    assert.equal(await footer.locator('nav').count(), 3);
    assert.deepEqual(await footer.getByRole('heading', { level: 2 }).allInnerTexts(), ['Shop', 'Account', 'Support']);
    const social = footer.locator('.store-footer-social a');
    assert.deepEqual(await social.evaluateAll(as => as.map(a => a.href)), EXPECTED_SOCIAL);
    for (const a of await social.all()) { assert.equal(await a.getAttribute('target'), '_blank'); assert.equal(await a.getAttribute('rel'), 'noreferrer'); assert.ok(await a.getAttribute('aria-label')); }
    const wa = footer.getByRole('link', { name: 'Chat with us on WhatsApp' });
    assert.equal(await wa.getAttribute('href'), 'https://wa.me/254795974591?text=' + encodeURIComponent('Hi Zentora, I need help with my order.'));
    const text = await footer.innerText();
    assert.ok(text.includes('Pay on Delivery'));
    for (const banned of [/m-?pesa/i, /visa/i, /mastercard/i, /paypal/i, /newsletter/i, /subscribe/i, /wishlist/i, /categor/i]) assert.ok(!banned.test(text), 'footer must not mention ' + banned);
    assert.equal(await footer.locator('input, form').count(), 0);
    assert.ok(text.includes('© ' + new Date().getFullYear() + ' Zentora'));
    assert.equal(await footer.locator('svg:not([aria-hidden="true"])').count(), 0, 'decorative icons hidden from screen readers');

    // Every internal link resolves to a real route
    for (const href of EXPECTED_LINKS) {
      await page.goto(origin + '/'); await footer.waitFor();
      await footer.locator(`nav a[href="${href}"]`).click();
      await page.waitForURL(u => u.pathname + u.hash === href || u.pathname !== '/');
      await page.waitForLoadState('domcontentloaded');
      assert.equal(await page.getByRole('heading', { name: '404', exact: true }).count(), 0, href + ' is not a 404');
    }

    // Desktop is compact and always expanded; no accordion buttons
    await page.goto(origin + '/about'); await footer.waitFor();
    const mainBox = await page.locator('.store-footer-main').boundingBox();
    assert.ok(mainBox.height <= 350, 'desktop footer content height ' + mainBox.height);
    assert.equal(await footer.locator('nav button').count(), 0);
    assert.equal(await footer.locator('nav ul[hidden]').count(), 0);
    if (shots) await footer.screenshot({ path: path.join(shots, 'footer-1440.png') });

    for (const width of [1024, 820]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await footer.locator('nav button').count(), 0);
      if (shots) await footer.screenshot({ path: path.join(shots, 'footer-' + width + '.png') });
    }

    // Mobile accordions: real buttons, collapsed by default, keyboard operable
    await page.setViewportSize({ width: 375, height: 900 });
    const buttons = footer.locator('nav h2 button');
    await buttons.first().waitFor();
    assert.equal(await buttons.count(), 3);
    assert.equal(await footer.locator('nav ul[hidden]').count(), 3);
    if (shots) await footer.screenshot({ path: path.join(shots, 'footer-375-collapsed.png') });
    const shop = footer.getByRole('button', { name: 'Shop' });
    assert.equal(await shop.getAttribute('aria-expanded'), 'false');
    await shop.focus(); await page.keyboard.press('Enter');
    assert.equal(await shop.getAttribute('aria-expanded'), 'true');
    const shopList = page.locator('#' + (await shop.getAttribute('aria-controls')).replace(/:/g, '\\:'));
    assert.equal(await shopList.isVisible(), true);
    await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '/products');
    await footer.getByRole('button', { name: 'Support' }).press('Space');
    assert.equal(await footer.getByRole('button', { name: 'Support' }).getAttribute('aria-expanded'), 'true');
    if (shots) await footer.screenshot({ path: path.join(shots, 'footer-375-open.png') });
    await shop.click(); assert.equal(await shopList.isVisible(), false);

    for (const width of [1440, 1024, 820, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No body overflow at ' + width);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: footer on home/products/collection/about/help; 14 links resolve to real routes; WhatsApp URL preserved; 3 configured socials only; Pay on Delivery only; no newsletter/forms/categories; compact desktop (' + Math.round(mainBox.height) + 'px); tablet grid; mobile accordions with keyboard; no overflow 320-1440.');
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
