const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const esbuild = require('esbuild');
const http = require('node:http');
const path = require('node:path');
const projectRoot = path.resolve(__dirname, '..');
const assert = require('node:assert/strict');
(async () => {
  const bundle = await esbuild.build({ stdin: { contents: `
    import React from 'react';
    import {createRoot} from 'react-dom/client';
    import {MemoryRouter} from 'react-router-dom';
    import HeroCarousel from './src/features/public/home/components/HeroCarousel';
    const slides = ['First','Second','Third'].map((title,i) => ({id:String(i),title,badge:title,primary:{label:'Shop '+title,href:'/collections/'+i}}));
    const root=createRoot(document.getElementById('root'));
    window.renderCarousel = count => root.render(<MemoryRouter><HeroCarousel slides={slides.slice(0,count)} interval={1000}/><button id="outside">Outside</button></MemoryRouter>);
    window.renderCarousel(3);
  `, resolveDir: projectRoot, loader: 'tsx' }, bundle: true, write: false, platform: 'browser', jsx: 'automatic', alias: {'@':path.join(projectRoot,'src')} });
  const server = http.createServer((req,res) => { res.setHeader('Content-Type', req.url === '/app.js' ? 'text/javascript' : 'text/html'); res.end(req.url === '/app.js' ? bundle.outputFiles[0].text : '<div id="root"></div><script src="/app.js"></script>'); });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROME_PATH || undefined});
  try {
    const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.clock.install();
    await page.goto('http://127.0.0.1:'+server.address().port);
    const title=()=>page.locator('h1').textContent();
    await page.locator('h1').waitFor(); assert.equal(await title(),'First');
    await page.clock.runFor(1100); assert.equal(await title(),'Second');
    await page.clock.runFor(2100); assert.equal(await title(),'First');
    await page.getByRole('button',{name:'Previous slide',exact:true}).click(); assert.equal(await title(),'Third');
    await page.getByRole('button',{name:'Next slide',exact:true}).click(); assert.equal(await title(),'First');
    await page.getByRole('button',{name:'Show Second',exact:true}).click(); assert.equal(await title(),'Second');
    assert.equal(await page.getByRole('button',{name:'Show Second',exact:true}).getAttribute('aria-pressed'),'true');
    await page.clock.runFor(2100); assert.equal(await title(),'Second'); // interaction pauses
    await page.getByRole('button',{name:'Pause slideshow',exact:true}).click();
    await page.locator('#outside').focus(); await page.mouse.move(1200,700);
    await page.clock.runFor(2100); assert.equal(await title(),'Second');
    await page.getByRole('button',{name:'Play slideshow',exact:true}).click();
    await new Promise(resolve => setTimeout(resolve, 100));
    await page.clock.runFor(1100); await new Promise(resolve => setTimeout(resolve, 100)); assert.equal(await title(),'Third'); // works while play retains focus
    await page.locator('#outside').focus(); await page.mouse.move(1200,700);
    await page.locator('h1').hover(); await page.clock.runFor(2100); assert.equal(await title(),'Third');
    await page.locator('a').focus(); await page.mouse.move(1200,700);
    await page.clock.runFor(2100); assert.equal(await title(),'Third'); // mouseleave must not cancel focus pause
    await page.locator('#outside').focus(); await page.clock.runFor(1100); assert.equal(await title(),'First');
    await page.emulateMedia({reducedMotion:'reduce'}); await page.clock.runFor(2100); assert.equal(await title(),'First');
    await page.getByRole('button',{name:'Next slide',exact:true}).click(); assert.equal(await title(),'Second');
    assert.equal(await page.getByRole('button',{name:'Pause slideshow',exact:true}).count(),0);
    await page.evaluate(()=>window.renderCarousel(1)); await page.clock.runFor(100); assert.equal(await title(),'First');
    assert.equal(await page.getByRole('button',{name:'Next slide',exact:true}).count(),0);
    await page.evaluate(()=>window.renderCarousel(0)); await page.clock.runFor(100); assert.equal(await page.locator('h1').count(),0);
    assert.deepEqual(errors,[]);
    console.log('PASS: auto-advance, wraparound, previous/next, dots, interaction pause, explicit pause/play, overlapping focus/hover, reduced motion, changing/empty slides, no browser exceptions.');
  } finally { await browser.close(); server.close(); }
})().catch(e=>{ console.error(e); process.exitCode=1; });
