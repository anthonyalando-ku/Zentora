// Read-only integration check against the public catalogue. Analytics writes are
// intercepted locally; empty/error responses are test-only browser overrides.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5193 } });
  await server.listen();
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
  const requestAbort = new AbortController();
  try {
    const context = await browser.newContext({viewport:{width:1440,height:1000}});
    const page = await context.newPage();
    const errors=[]; const requests=[]; let mode='live'; let writes=0;
    page.on('pageerror',e=>errors.push(e.message));
    await context.route('**/*',async route=>{
      const request=route.request(); const url=new URL(request.url());
      if(url.origin!==origin) return route.abort(); // including analytics and external images
      if(!url.pathname.startsWith('/api/')) return route.continue();
      requests.push(url);
      if(request.method()!=='GET') { writes++; return route.fulfill({json:{search_event_id:1}}); }
      if(url.pathname==='/api/catalog/products' && mode==='error') return route.fulfill({status:503,json:{message:'Test-only service unavailable'}});
      if(url.pathname==='/api/catalog/products' && mode==='empty') return route.fulfill({json:{items:[],total:0,page:1,size:40}});
      if(!/^\/api\/(catalog|discovery)\//.test(url.pathname)) return route.fulfill({status:401,json:{message:'Test guest session'}});
      const response=await fetch('https://zentora-api.onrender.com/api/v1/'+url.pathname.slice(5)+url.search,{signal:AbortSignal.any([requestAbort.signal,AbortSignal.timeout(45000)])});
      await route.fulfill({status:response.status,contentType:'application/json',body:await response.text()});
    });
    const go=async suffix=>{await page.goto(origin+'/products'+suffix);await page.locator('.catalogue-toolbar').waitFor();};
    const lastParams=()=>requests.filter(u=>u.pathname==='/api/catalog/products').at(-1)?.searchParams;
    const waitParam=async (key,value,apiValue=value)=>{await page.waitForURL(u=>u.searchParams.get(key)===value);for(let i=0;i<100 && lastParams()?.get(key)!==apiValue;i++) await page.waitForTimeout(100);assert.equal(lastParams().get(key),apiValue);};
    await go(''); await page.locator('.catalogue-product-slot').first().waitFor({timeout:60000});
    const count=await page.locator('.catalogue-product-slot').count(); assert.ok(count>0 && count<=40);
    assert.ok(await page.locator('.catalogue-toolbar').innerText());
    await page.locator('.catalogue-product-slot .store-image-fallback').first().waitFor();
    assert.equal(await page.getByRole('button',{name:'Add to wishlist'}).count(),0);
    assert.ok(await page.locator('header a[href="/cart"]').count());
    assert.ok(await page.locator('header a[href="/account"]').count());
    await page.getByRole('button',{name:'Page 2',exact:true}).click(); await waitParam('page','2');
    await page.getByLabel('Sort products').selectOption('rating'); await waitParam('sort','rating'); assert.equal(new URL(page.url()).searchParams.get('page'),'1');
    await page.getByLabel('Sort products').selectOption('price-asc'); await waitParam('sort','price-asc','price_asc');
    await page.getByLabel('Sort products').selectOption('price-desc'); await waitParam('sort','price-desc','price_desc');
    await page.getByLabel('Sort products').selectOption('newest'); await page.reload(); await waitParam('sort','newest','new_arrivals');
    const category=page.locator('.catalogue-sidebar [role="group"][aria-label="Category"] label').nth(1);
    await category.click(); await page.waitForURL(u=>u.searchParams.has('category_id')); const categoryId=new URL(page.url()).searchParams.get('category_id'); await waitParam('category_id',categoryId);
    await page.getByRole('textbox',{name:'Search category'}).fill('no-such-category-for-test'); assert.equal(await page.locator('.catalogue-sidebar [aria-label="Category"] input').count(),1);
    await page.getByRole('textbox',{name:'Search category'}).fill('');
    await page.locator('.catalogue-sidebar [role="group"][aria-label="Brand"] label').nth(1).click(); await page.waitForURL(u=>u.searchParams.has('brand_id')); await waitParam('brand_id',new URL(page.url()).searchParams.get('brand_id'));
    await page.getByLabel('Minimum',{exact:true}).fill('1000'); await page.getByLabel('Maximum',{exact:true}).fill('100'); assert.equal(await page.getByRole('button',{name:'Apply price'}).isDisabled(),true);
    await page.getByLabel('Maximum',{exact:true}).fill('200000'); await page.getByRole('button',{name:'Apply price'}).click(); await waitParam('price_min','1000'); await waitParam('price_max','200000');
    await page.getByLabel('In stock only',{exact:true}).click(); await waitParam('in_stock_only','true'); assert.equal(await page.getByLabel('In stock only',{exact:true}).isChecked(),true);
    await page.getByLabel('Discount only',{exact:true}).click(); await waitParam('discount_only','true');
    await page.getByRole('radio',{name:'4 & up',exact:true}).click(); await waitParam('min_rating','4');
    const filtered=page.url(); await page.reload(); await page.getByRole('radio',{name:'4 & up',exact:true}).waitFor(); assert.equal(await page.getByRole('radio',{name:'4 & up',exact:true}).isChecked(),true);
    await page.locator('.catalogue-sidebar').getByRole('button',{name:'Clear all',exact:true}).click(); await page.waitForURL(u=>!u.searchParams.has('category_id')); assert.equal(new URL(page.url()).searchParams.get('sort'),'newest');
    await page.goBack(); assert.equal(page.url(),filtered); await page.goForward();
    await page.locator('.catalogue-product-slot').first().waitFor({timeout:45000});
    for(const width of [1440,768,375,320]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No body overflow at '+width);
    }
    await page.getByRole('button',{name:'Filters',exact:true}).click(); const drawer=page.getByRole('dialog'); await drawer.waitFor({state:'visible'});
    await drawer.getByLabel('In stock only',{exact:true}).click(); await waitParam('in_stock_only','true');
    await page.keyboard.press('Escape'); assert.equal(await drawer.isVisible(),false); assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
    await page.getByRole('button',{name:/^Filters/}).click(); await drawer.getByRole('button',{name:'Clear all',exact:true}).click(); await drawer.getByRole('button',{name:'View results'}).click(); assert.equal(await drawer.isVisible(),false);
    await go('?query=bike'); await page.locator('.catalogue-product-slot').first().waitFor({timeout:45000});
    assert.equal(await page.getByLabel('Sort products').count(),0); assert.equal(await page.locator('.catalogue-sidebar').count(),0);
    const writesBefore=writes; const beforeChat=page.url();
    const popupPromise=page.waitForEvent('popup'); await page.locator('.catalogue-product-slot a[href^="https://wa.me/"]').first().click(); const popup=await popupPromise; await popup.close();
    assert.equal(page.url(),beforeChat); assert.equal(writes,writesBefore,'Chat must not trigger product click tracking');
    const productLink=page.locator('.catalogue-product-slot a[href^="/products/"]').first(); const href=await productLink.getAttribute('href'); await productLink.click(); await page.waitForURL(origin+href); assert.ok(writes>writesBefore);
    mode='empty'; await go(''); await page.getByText('No products found',{exact:true}).waitFor({timeout:45000});
    mode='error'; await page.reload(); await page.getByRole('heading',{name:"We couldn't load the products"}).waitFor({timeout:45000}); assert.equal(await page.locator('header').count(),1);
    mode='live'; await page.getByRole('button',{name:'Try again',exact:true}).click(); await page.locator('.catalogue-product-slot').first().waitFor({timeout:45000});
    assert.deepEqual(errors,[]);
    console.log('PASS: live catalogue data, pagination, all supported filters and sorts, price validation, URL refresh/back/forward, mobile drawer, widths 320/375/768/1440, image fallbacks, search navigation, isolated WhatsApp action, empty/error/retry states. All analytics writes intercepted locally.');
  } catch(error) { console.error(error); throw error; }
  finally {
    // Bound teardown, including pending browser routes and Vite transforms.
    // This dedicated test process exits below, even if a dev-server handle lingers.
    await Promise.race([(async () => {
      for(const context of browser.contexts()) await context.unrouteAll({behavior:'ignoreErrors'});
      requestAbort.abort();
      await browser.close();
      server.httpServer.closeAllConnections();
      await server.close();
    })(),new Promise(resolve=>setTimeout(resolve,5000))]);
  }
})().then(()=>process.exit(0)).catch(error=>{console.error(error);process.exit(1);});
