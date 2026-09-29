// Checks /account: the logged-out gateway, and that the signed-in page still renders.
// Signed-in state is simulated locally with stubbed /me responses (no real account);
// catalogue data is proxied read-only; external hosts are blocked. Screenshots → ACCOUNT_SHOTS.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const shots = process.env.ACCOUNT_SHOTS;
(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5202 } });
  await server.listen();
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = []; let signedIn = false; let logoutCalls = 0;
    page.on('pageerror', e => errors.push(e.message));
    await context.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (url.origin !== origin) return route.abort();
      if (!url.pathname.startsWith('/api/')) return route.continue();
      if (/logout/.test(url.pathname)) { logoutCalls++; return route.fulfill({ json: { success: true, data: {} } }); }
      if (!/^\/api\/(catalog|discovery|delivery-policy)/.test(url.pathname)) {
        if (!signedIn) return route.fulfill({ status: 401, json: { message: 'Test guest session' } });
        if (/profile/.test(url.pathname)) return route.fulfill({ json: { success: true, data: { email: 't@example.com', full_name: { String: 'Test Shopper', Valid: true }, avatar_url: { String: '', Valid: false }, bio: { String: '', Valid: false } } } });
        if (/cart/.test(url.pathname)) return route.fulfill({ json: { success: true, data: { id: 1, items: [] } } });
        return route.fulfill({ json: { success: true, data: [] } });
      }
      for (let a = 0; ; a++) {
        try {
          const r = await fetch('https://zentora-api.onrender.com/api/v1/' + url.pathname.slice(5) + url.search, { signal: AbortSignal.timeout(45000) });
          return route.fulfill({ status: r.status, contentType: 'application/json', body: await r.text() });
        } catch (e) { if (a === 3) return route.fulfill({ status: 503, json: {} }); await new Promise(r => setTimeout(r, 1500)); }
      }
    });

    // ── Logged out: gateway renders at /account with no redirect bounce ──
    const visited = [];
    page.on('framenavigated', f => { if (f === page.mainFrame()) visited.push(new URL(f.url()).pathname); });
    await page.goto(origin + '/account');
    const h1 = page.getByRole('heading', { level: 1 });
    await h1.waitFor(); await page.waitForTimeout(1500);
    assert.equal(await h1.innerText(), 'Your Zentora account');
    assert.deepEqual([...new Set(visited)], ['/account'], 'no redirect to /auth/login: ' + visited.join(' -> '));
    assert.equal(new URL(page.url()).hash, '', 'no #profile hash for guests');
    const main = page.locator('.acct-page');
    assert.equal(await main.getByRole('link', { name: 'Sign in', exact: true }).getAttribute('href'), '/auth/login');
    assert.equal(await main.getByRole('link', { name: 'Create account' }).getAttribute('href'), '/auth/register');
    assert.equal(await main.getByRole('link', { name: /Continue shopping/ }).getAttribute('href'), '/products');
    assert.deepEqual(await main.getByRole('heading', { level: 3 }).allInnerTexts(), ['Your orders', 'Delivery addresses', 'Account security']);
    assert.equal(await page.locator('.acct-benefits a, .acct-benefits button').count(), 0, 'benefits are informational, not navigation');
    const text = await main.innerText();
    for (const banned of [/wallet/i, /wishlist/i, /reward/i, /loyalty/i, /google/i, /facebook/i, /apple/i, /delivery status/i, /guest/i, /points/i]) assert.ok(!banned.test(text), 'no ' + banned);
    assert.equal(await page.locator('.acct-page svg:not([aria-hidden="true"])').count(), 0, 'icons hidden from screen readers');
    assert.equal(await page.locator('header').getByText('Sign in').count(), 1, 'header still shows the signed-out state');
    if (shots) await page.screenshot({ path: path.join(shots, 'account-1440.png'), fullPage: true });

    // Routes: sign in / create account open the real auth pages (not 404)
    await main.getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.waitForURL(u => u.pathname === '/auth/login'); await page.waitForLoadState('domcontentloaded');
    assert.equal(await page.getByRole('heading', { name: '404' }).count(), 0);
    await page.goto(origin + '/account'); await main.getByRole('link', { name: 'Create account' }).click();
    await page.waitForURL(u => u.pathname === '/auth/register');
    await page.goto(origin + '/account'); await main.getByRole('link', { name: /Continue shopping/ }).click();
    await page.waitForURL(u => u.pathname === '/products');

    // Mobile menu guest link now reaches the login page
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + '/account'); await h1.waitFor();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog', { name: 'Zentora' }).getByRole('link', { name: /Sign in/ }).click();
    await page.waitForURL(u => u.pathname === '/auth/login');

    // Widths: no overflow, stacked full-width CTAs on phones, 3 columns on desktop, footer follows
    for (const width of [320, 360, 390, 430, 480, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(origin + '/account'); await h1.waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no overflow at ' + width);
      const signIn = await main.getByRole('link', { name: 'Sign in', exact: true }).boundingBox();
      const create = await main.getByRole('link', { name: 'Create account' }).boundingBox();
      const items = await page.locator('.acct-benefits li').evaluateAll(ls => ls.map(l => Math.round(l.getBoundingClientRect().y)));
      if (width < 768) {
        assert.ok(create.y > signIn.y && Math.abs(create.width - signIn.width) < 1, 'stacked equal-width CTAs at ' + width);
        assert.ok(items[1] > items[0] && items[2] > items[1], 'benefits stack at ' + width);
      } else {
        assert.ok(Math.abs(create.y - signIn.y) < 1, 'CTAs side by side at ' + width);
        assert.ok(items.every(y => y === items[0]), 'benefits in one row at ' + width);
      }
      const gap = await page.evaluate(() => document.querySelector('footer.store-footer').getBoundingClientRect().top - document.querySelector('.acct-page').getBoundingClientRect().bottom);
      // Phones keep MainLayout's existing 64px bottom-nav reservation under <main>.
      assert.ok(gap >= 0 && gap <= (width < 768 ? 64 : 1), 'footer follows the content at ' + width + ' (gap ' + gap + ')');
      assert.ok((await main.boundingBox()).height <= 800, 'no stretched blank area at ' + width);
      if (shots && [320, 390, 768].includes(width)) await page.screenshot({ path: path.join(shots, 'account-' + width + '.png'), fullPage: true });
    }

    // ── Signed in: existing account page unchanged, gateway not shown ──
    signedIn = true;
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => localStorage.setItem('auth-store', JSON.stringify({ state: { isAuthenticated: true, user: { identity_id: 1, email: 't@example.com', full_name: 'Test Shopper', roles: ['customer'], permissions: null }, accessToken: 'test', refreshToken: null }, version: 0 })));
    await page.goto(origin + '/account');
    await page.getByRole('heading', { name: 'My Account', level: 1 }).waitFor();
    assert.equal(await page.locator('.acct-gateway').count(), 0, 'gateway never shown to signed-in users');
    await page.waitForURL(u => u.hash === '#profile');
    if (shots) await page.screenshot({ path: path.join(shots, 'account-signed-in-1440.png') });
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL(u => u.pathname === '/');
    assert.equal(logoutCalls, 1);
    assert.equal(await page.locator('header').getByText('Sign in').count(), 1, 'signed out after logout');
    assert.deepEqual(errors, []);
    console.log('PASS: logged-out /account gateway (no redirect bounce, real login/register/products routes, informational benefits only, no fake features, mobile menu sign-in fixed), widths 320-1440 (stacked on phones, row on desktop, footer follows), signed-in page unchanged, logout still goes home.');
  } finally {
    await Promise.race([(async () => { await browser.close(); server.httpServer.closeAllConnections(); await server.close(); })(), new Promise(r => setTimeout(r, 5000))]);
  }
})().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
