// Checks the mobile menu and categories drawers. Live public categories (with their
// backend image_url) plus test-only overrides for broken/missing images, slow and
// failing responses. Signed-in states are simulated locally (no real account);
// writes and non-image external hosts are blocked. Screenshots go to DRAWER_SHOTS.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const shots = process.env.DRAWER_SHOTS;
const LONG = 'Extremely Long Category Name For Layout Testing Across Narrow Phones';
(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5200 } });
  await server.listen();
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  let mode = 'live';
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await context.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (url.hostname.endsWith('imagekit.io')) return route.continue();
      if (url.origin !== origin) return route.abort();
      if (!url.pathname.startsWith('/api/')) return route.continue();
      if (request.method() !== 'GET') return route.fulfill({ json: {} });
      if (url.pathname === '/api/me/cart') return route.fulfill({ json: { success: true, data: { id: 1, items: [] } } });
      const isCategories = url.pathname === '/api/catalog/categories';
      if (isCategories && mode === 'error') return route.fulfill({ status: 503, json: { message: 'Test-only failure' } });
      if (isCategories && mode === 'slow') await new Promise(r => setTimeout(r, 2500));
      if (!/^\/api\/(catalog|discovery|delivery-policy)/.test(url.pathname)) return route.fulfill({ status: 401, json: {} });
      for (let a = 0; ; a++) {
        try {
          const r = await fetch('https://zentora-api.onrender.com/api/v1/' + url.pathname.slice(5) + url.search, { signal: AbortSignal.timeout(45000) });
          let body = await r.text();
          if (isCategories && mode === 'odd') {
            const j = JSON.parse(body);
            const list = j.data;
            list[0] = { ...list[0], image_url: 'https://ik.imagekit.io/zentora-test-missing/broken-image.png' }; // 404
            list[1] = { ...list[1], image_url: 'not a url' };                                                  // malformed
            list[2] = { ...list[2], image_url: null };                                                          // missing
            list[3] = { ...list[3], image_url: '' };                                                            // empty
            list[4] = { ...list[4], name: LONG };
            body = JSON.stringify(j);
          }
          return route.fulfill({ status: r.status, contentType: 'application/json', body });
        } catch (e) { if (a === 3) return route.fulfill({ status: 503, json: {} }); await new Promise(r => setTimeout(r, 1500)); }
      }
    });
    const categories = await (async () => { for (let a = 0; ; a++) { try { return (await (await fetch('https://zentora-api.onrender.com/api/v1/catalog/categories')).json()).data; } catch (e) { if (a === 3) throw e; } } })();
    const withImage = categories.filter(c => typeof c.image_url === 'string' && /^https?:\/\/\S+$/.test(c.image_url.trim()));
    const dialog = name => page.getByRole('dialog', { name });
    const bodyOverflow = () => page.evaluate(() => document.body.style.overflow);
    const setAuth = roles => page.evaluate(roles => {
      if (!roles) { localStorage.removeItem('auth-store'); localStorage.removeItem('access_token'); return; }
      localStorage.setItem('auth-store', JSON.stringify({ state: { isAuthenticated: true, user: { identity_id: 1, email: 't@example.com', full_name: 'Test Shopper', roles, permissions: null }, accessToken: 'test', refreshToken: null }, version: 0 }));
    }, roles);

    // ── Main drawer, guest ──
    await page.goto(origin + '/'); await page.locator('.store-hero h1').waitFor({ timeout: 60000 });
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    const menu = dialog('Zentora');
    await menu.waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Close menu', 'focus moves into the drawer');
    assert.equal(await bodyOverflow(), 'hidden');
    const links = await menu.locator('a').evaluateAll(as => as.map(a => [a.textContent.trim(), a.getAttribute('href')]));
    assert.deepEqual(links, [['Zentora' + 'Everyday finds. All in one place.', '/'], ['Sign inSign in to continue', '/login'], ['Home', '/'], ['Products', '/products'], ['Deals', '/collections/deals'], ['Help Center', '/help'], ['Contact Us', '/contact'], ['Call +254 795 974591', 'tel:+254795974591']]);
    assert.equal(await menu.getByRole('link', { name: 'Home', exact: true }).getAttribute('aria-current'), 'page');
    for (const banned of ['Admin Console', 'Wishlist', 'wallet', 'Orders', 'Cart']) assert.equal(await menu.getByText(banned).count(), 0, 'no ' + banned + ' for guests');
    if (shots) await page.screenshot({ path: path.join(shots, 'menu-guest-390.png') });
    // Focus trap: Shift+Tab from the first control wraps to the last one inside the panel.
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement?.closest('.store-drawer')), true, 'focus stays inside');
    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'detached' });
    assert.equal(await bodyOverflow(), '', 'scroll restored');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Open menu', 'focus returns to trigger');
    await toggle.click(); await menu.waitFor();
    await page.mouse.click(385, 420); // backdrop, right of the panel
    await menu.waitFor({ state: 'detached' });
    await toggle.click(); await menu.getByRole('button', { name: 'Close menu' }).click(); await menu.waitFor({ state: 'detached' });
    await toggle.click(); await menu.getByRole('link', { name: 'Products', exact: true }).click();
    await page.waitForURL(u => u.pathname === '/products'); await menu.waitFor({ state: 'detached' });
    assert.equal(await bodyOverflow(), '');

    // ── Main drawer, signed-in customer and admin ──
    await setAuth(['customer']); await page.goto(origin + '/');
    await toggle.click(); await menu.waitFor();
    assert.equal(await menu.getByRole('link', { name: /Test Shopper/ }).getAttribute('href'), '/account');
    assert.equal(await menu.getByText('Admin Console').count(), 0, 'customers never see admin');
    await page.keyboard.press('Escape');
    await setAuth(['admin']); await page.goto(origin + '/');
    await toggle.click(); await menu.waitFor();
    assert.equal(await menu.getByRole('link', { name: 'Admin Console' }).getAttribute('href'), '/admin');
    if (shots) await page.screenshot({ path: path.join(shots, 'menu-admin-390.png') });
    await page.keyboard.press('Escape');
    await setAuth(null);

    // ── Categories drawer: live backend images ──
    await page.goto(origin + '/'); await page.locator('.store-hero h1').waitFor({ timeout: 60000 });
    const catsTrigger = page.locator('nav[aria-label="Primary"]').getByRole('button', { name: 'Categories' });
    await catsTrigger.click();
    const cats = dialog('All Categories'); await cats.waitFor();
    const rows = cats.locator('.store-drawer-cat');
    await rows.first().waitFor();
    assert.equal(await rows.count(), categories.length, 'all categories listed');
    await page.waitForFunction(n => [...document.querySelectorAll('.store-drawer-cat img')].filter(i => i.complete && i.naturalWidth > 0).length >= Math.min(n, 3), withImage.length, { timeout: 30000 });
    assert.ok(await cats.locator('.store-drawer-cat img').count() > 0, 'backend category images render');
    assert.equal(await cats.locator('.store-drawer-cat img').first().getAttribute('src'), withImage.length ? new URL(withImage[0].image_url.trim()).href : null);
    if (shots) await page.screenshot({ path: path.join(shots, 'categories-390.png') });

    // Search: local filter, clear, empty state
    const search = cats.getByRole('searchbox', { name: 'Search categories' });
    await search.fill('air');
    const airNames = categories.filter(c => c.name.toLowerCase().includes('air')).map(c => c.name);
    assert.deepEqual(await cats.locator('.store-drawer-cat-name').allInnerTexts(), airNames);
    await cats.getByRole('button', { name: 'Clear category search' }).click();
    assert.equal(await rows.count(), categories.length);
    await search.fill('zzzz-no-match');
    await cats.getByText('No categories found').waitFor();
    if (shots) await page.screenshot({ path: path.join(shots, 'categories-empty-390.png') });
    await search.fill('');

    // Layout: list scrolls, CTA stays in view above the safe area, no overflow
    const list = cats.locator('.store-drawer-body');
    assert.ok(await list.evaluate(e => e.scrollHeight > e.clientHeight), 'category list scrolls');
    const foot = await cats.locator('.store-drawer-foot').boundingBox(); const listBox = await list.boundingBox();
    assert.ok(foot.y + foot.height <= 844 + 1 && listBox.y + listBox.height <= foot.y + 1, 'CTA pinned below list');
    const target = categories[Math.min(5, categories.length - 1)];
    await rows.nth(Math.min(5, categories.length - 1)).locator('.store-drawer-cat-name').click();
    await page.waitForURL(u => u.pathname === '/products' && u.searchParams.get('category_id') === String(target.id));
    await cats.waitFor({ state: 'detached' });
    assert.equal(await bodyOverflow(), '');
    await catsTrigger.click(); await cats.waitFor();
    await cats.getByRole('link', { name: /View all departments/ }).click();
    await page.waitForURL(u => u.pathname === '/products' && !u.searchParams.has('category_id'));

    // Broken / malformed / missing / empty image URLs and long names
    mode = 'odd';
    await page.goto(origin + '/help'); await page.locator('nav[aria-label="Primary"]').waitFor();
    await catsTrigger.click(); await cats.waitFor(); await rows.first().waitFor();
    await page.waitForFunction(() => { const first = document.querySelectorAll('.store-drawer-cat')[0]; return first && !first.querySelector('img'); }, null, { timeout: 30000 });
    for (let i = 0; i < 4; i++) {
      assert.equal(await rows.nth(i).locator('img').count(), 0, 'row ' + i + ' has no <img>');
      assert.equal(await rows.nth(i).locator('.store-category-initials').count(), 1, 'row ' + i + ' uses the initials fallback');
    }
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('.store-drawer img')].filter(i => i.complete && i.naturalWidth === 0 && getComputedStyle(i).opacity !== '0').length), 0, 'no visible broken images');
    const heights = await rows.evaluateAll(rs => rs.slice(0, 8).map(r => Math.round(r.getBoundingClientRect().height)));
    assert.ok(heights.every(h => h === heights[0] || h <= 72), 'stable row heights ' + heights);
    assert.ok((await rows.nth(4).locator('.store-drawer-cat-name').boundingBox()).height <= 40, 'long name clamps to 2 lines');
    if (shots) await page.screenshot({ path: path.join(shots, 'categories-fallbacks-390.png') });
    await page.keyboard.press('Escape');

    // Loading and error states
    mode = 'slow'; await page.goto(origin + '/help'); await catsTrigger.click();
    await cats.locator('[aria-label="Loading categories"]').waitFor({ timeout: 2000 });
    await rows.first().waitFor({ timeout: 60000 });
    await page.keyboard.press('Escape');
    mode = 'error'; await page.goto(origin + '/help'); await catsTrigger.click();
    await cats.getByText("Categories couldn't load").waitFor({ timeout: 60000 });
    mode = 'live'; await cats.getByRole('button', { name: 'Try again' }).click();
    await rows.first().waitFor({ timeout: 60000 });
    await page.keyboard.press('Escape');

    // Widths: no overflow with either drawer open; desktop hides the mobile menu
    for (const width of [320, 360, 390, 430, 480]) {
      await page.setViewportSize({ width, height: 740 });
      for (const [open, d] of [[toggle, menu], [catsTrigger, cats]]) {
        await open.click(); await d.waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no overflow at ' + width);
        await d.locator('.store-drawer').evaluate(e => Promise.all(e.getAnimations().map(a => a.finished)));
        const panel = await d.locator('.store-drawer').boundingBox();
        assert.ok(panel.width <= Math.min(width * 0.88, 360) + 1 && panel.x === 0, 'drawer width at ' + width);
        if (shots && (width === 320 || width === 480)) await page.screenshot({ path: path.join(shots, (d === menu ? 'menu' : 'categories') + '-' + width + '.png') });
        await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
      }
    }
    await page.setViewportSize({ width: 768, height: 900 });
    assert.equal(await toggle.isVisible(), false, 'desktop header replaces the mobile menu at 768px');
    assert.equal(await page.locator('nav[aria-label="Primary"]').isVisible(), false, 'bottom nav hidden on desktop');
    assert.deepEqual(errors, []);
    console.log('PASS: main drawer (guest/customer/admin links, focus in/trap/restore, Escape/backdrop/X close, scroll lock restored, navigation closes); categories drawer (live backend images, broken/malformed/null/empty URLs use initials fallback with no broken images, long names clamp, local search + clear + empty state, category and View-all routes, pinned CTA, loading skeleton, error + retry); no overflow 320-480; desktop unchanged at 768.');
  } finally {
    await Promise.race([(async () => { await browser.close(); server.httpServer.closeAllConnections(); await server.close(); })(), new Promise(r => setTimeout(r, 5000))]);
  }
})().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
