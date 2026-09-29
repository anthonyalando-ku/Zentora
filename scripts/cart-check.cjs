// Read-only check of the shopping cart using a guest cart seeded in localStorage
// with real products from the public discovery feed. External hosts other than the
// product image CDN are blocked; nothing is written to the backend.
// Screenshots go to CART_SHOTS (optional).
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const shots = process.env.CART_SHOTS;
const api = async p => {
  for (let a = 0; ; a++) {
    try { return (await (await fetch('https://zentora-api.onrender.com/api/v1/' + p, { signal: AbortSignal.timeout(45000) })).json()).data; }
    catch (e) { if (a === 3) throw e; await new Promise(r => setTimeout(r, 1500)); }
  }
};
(async () => {
  const feed = (await api('discovery/feed?feed_type=new_arrivals&limit=12')).items;
  const policy = await api('delivery-policy');
  const toItem = (p, i) => ({ product_id: p.product_id, variant_id: 90000 + i, quantity: 1, slug: p.slug, name: p.name, thumbnail: p.primary_image || '', price: p.price });
  const long = { ...toItem(feed[2], 2), name: 'Extra long product name for layout testing — ' + feed[2].name + ' with additional descriptive words that keep going and going' };
  const { createServer } = await import('vite');
  const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5199 } });
  await server.listen();
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await context.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (url.hostname.endsWith('imagekit.io')) return route.continue();
      if (url.origin !== origin) return route.abort();
      if (!url.pathname.startsWith('/api/')) return route.continue();
      if (request.method() !== 'GET') return route.fulfill({ json: {} });
      if (!/^\/api\/(catalog|discovery|delivery-policy)/.test(url.pathname)) return route.fulfill({ status: 401, json: { message: 'Test guest session' } });
      for (let a = 0; ; a++) {
        try {
          const r = await fetch('https://zentora-api.onrender.com/api/v1/' + url.pathname.slice(5) + url.search, { signal: AbortSignal.timeout(45000) });
          return route.fulfill({ status: r.status, contentType: 'application/json', body: await r.text() });
        } catch (e) { if (a === 3) return route.fulfill({ status: 503, json: {} }); await new Promise(r => setTimeout(r, 1500)); }
      }
    });
    const seed = async items => {
      await page.goto(origin + '/help');
      await page.evaluate(items => localStorage.setItem('zentora-cart', JSON.stringify({ state: { items }, version: 0 })), items);
      await page.goto(origin + '/cart');
    };
    const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('zentora-cart')).state.items);
    const ksh = n => 'KSh ' + n.toLocaleString();
    const h1 = page.getByRole('heading', { level: 1 });
    const summary = page.locator('.cart-summary');

    // One item: header, summary, delivery notice, recommendations
    const a = toItem(feed[0], 0);
    await seed([a]);
    await h1.waitFor();
    assert.equal((await h1.innerText()).replace(/\s+/g, ' '), 'Shopping Cart (1 item)');
    assert.ok((await summary.innerText()).includes(ksh(a.price)));
    const toggle = page.locator('.cart-delivery-toggle');
    await page.locator('.cart-delivery-message').filter({ hasText: policy.message.slice(0, 30) }).waitFor();
    assert.equal(await page.locator('.cart-delivery-message').innerText(), policy.message, 'full backend delivery text in the notice');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    const clamped = await page.locator('.cart-delivery-message').evaluate(e => e.scrollHeight > e.clientHeight + 1);
    await toggle.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('.cart-delivery-message').evaluate(e => e.scrollHeight <= e.clientHeight + 1), true, 'expanded notice shows everything');
    await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal((await page.getByText(policy.message).count()), 1, 'backend delivery text rendered once');
    for (const banned of ['Discounts', 'Secure payment', 'Fast delivery', 'coupon', 'Promo', 'Wishlist', 'In stock', 'Variant ID']) assert.equal(await page.getByText(banned, { exact: false }).count(), 0, 'no ' + banned);
    assert.equal(await page.locator('input').filter({ hasNot: page.locator('header input') }).evaluateAll(els => els.filter(e => !e.closest('header')).length), 0, 'no inputs on the cart');
    const picks = page.locator('.cart-picks .store-product-card');
    await picks.first().waitFor({ timeout: 60000 });
    const pickLinks = await page.locator('.cart-picks a[href^="/products/"]').evaluateAll(as => as.map(x => x.getAttribute('href')));
    assert.ok(!pickLinks.includes('/products/' + a.slug), 'recommendations exclude cart items');
    assert.equal(await page.locator('.cart-picks').getByRole('link', { name: /See all/ }).getAttribute('href'), '/collections/trending');
    assert.equal(await page.locator('.cart-picks').getByText(/★|☆/).count(), 0, 'no rating stars');
    if (shots) await page.screenshot({ path: path.join(shots, 'cart-1440.png'), fullPage: true });

    // Quantity stepper
    const dec = page.getByRole('button', { name: 'Decrease quantity of ' + a.name });
    const inc = page.getByRole('button', { name: 'Increase quantity of ' + a.name });
    assert.equal(await dec.isDisabled(), true, 'minimum quantity 1');
    await inc.click();
    await page.getByText(ksh(a.price) + ' each').waitFor();
    assert.equal((await h1.innerText()).replace(/\s+/g, ' '), 'Shopping Cart (2 items)');
    assert.equal((await stored())[0].quantity, 2);
    assert.ok((await summary.innerText()).includes(ksh(a.price * 2)));
    await dec.click(); await page.waitForFunction(() => JSON.parse(localStorage.getItem('zentora-cart')).state.items[0].quantity === 1);

    // Several items incl. a very long name; remove one
    const items = [a, toItem(feed[1], 1), long];
    await seed(items);
    await page.locator('.cart-item').nth(2).waitFor();
    const nameBox = await page.locator('.cart-item-name').nth(2).boundingBox();
    assert.ok(nameBox.height < 50, 'long names clamp to two lines');
    await page.getByRole('button', { name: 'Remove ' + items[1].name + ' from cart' }).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('zentora-cart')).state.items.length === 2);
    assert.equal(await page.locator('.cart-item').count(), 2);
    assert.ok((await summary.innerText()).includes(ksh(a.price + long.price)));

    // Checkout and continue shopping routes
    assert.equal(await summary.getByRole('link', { name: /Proceed to Checkout/ }).getAttribute('href'), '/checkout');
    assert.equal(await page.getByRole('link', { name: /Continue shopping/ }).count(), 1, 'one continue-shopping action');

    // Clear cart: cancel keeps items, accept empties
    page.once('dialog', d => d.dismiss());
    await page.getByRole('button', { name: 'Clear cart' }).click();
    assert.equal((await stored()).length, 2);
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Clear cart' }).click();
    await page.getByRole('heading', { name: 'Your cart is empty' }).waitFor();
    assert.equal((await stored()).length, 0);
    assert.equal(await page.locator('.cart-summary').count(), 0);
    await page.getByRole('link', { name: /Continue shopping/ }).click(); await page.waitForURL(u => u.pathname === '/products');

    // Long cart: desktop summary stays in view while scrolling
    await seed(feed.slice(0, 10).map(toItem));
    await page.locator('.cart-item').nth(9).waitFor();
    await page.evaluate(() => scrollTo(0, 900));
    await page.waitForTimeout(200);
    const sticky = await summary.boundingBox();
    assert.ok(sticky.y >= 0 && sticky.y <= 40, 'summary sticks near the top: ' + sticky.y);
    if (shots) await page.screenshot({ path: path.join(shots, 'cart-long-1440.png') });

    // Mobile + widths: no overflow, no fixed bar over the bottom nav, checkout reachable
    await seed([a, long]);
    for (const width of [1440, 1024, 900, 768, 430, 390, 360, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('.cart-item').first().waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no overflow at ' + width);
      const cta = summary.getByRole('link', { name: /Proceed to Checkout/ });
      await cta.evaluate(e => e.scrollIntoView({ block: 'center' }));
      const r = await cta.boundingBox();
      assert.equal(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('.cart-checkout'), [r.x + r.width / 2, r.y + r.height / 2]), true, 'checkout reachable at ' + width);
      if (width < 768) {
        const fixedBottom = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().bottom >= innerHeight - 1 && e.getBoundingClientRect().height > 0).map(e => e.tagName));
        assert.deepEqual(fixedBottom, ['NAV'], 'only the bottom nav is fixed to the bottom at ' + width);
        const items = await page.locator('.cart-items').boundingBox(); const s = await summary.boundingBox();
        assert.ok(s.y > items.y + items.height - 1, 'summary follows items on mobile');
        if (shots) { await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: path.join(shots, 'cart-' + width + '.png'), fullPage: true }); }
      }
    }
    await summary.getByRole('link', { name: /Proceed to Checkout/ }).click(); await page.waitForURL(u => u.pathname === '/checkout' || u.pathname.startsWith('/login') || u.pathname.startsWith('/auth'));

    assert.deepEqual(errors, []);
    console.log('PASS: guest cart with live products: header count/pluralisation, backend delivery text once + expand/collapse (' + (clamped ? 'clamped preview' : 'short message') + '), stepper min/increment/decrement persisted, line/subtotal/total, remove, clear with confirm (cancel/accept), empty state, checkout/continue routes, trending picks (shared card, excludes cart, no ratings), sticky desktop summary, no fixed bar over bottom nav, widths 320-1440, no fake rows.');
  } finally {
    await Promise.race([(async () => { await browser.close(); server.httpServer.closeAllConnections(); await server.close(); })(), new Promise(r => setTimeout(r, 5000))]);
  }
})().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
