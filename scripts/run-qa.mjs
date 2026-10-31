import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { auditPreviewOutput, previewAssets } from './lib/previewAssets.mjs';

const require = createRequire(import.meta.url);
const dist = path.resolve('dist');
const output = path.resolve(process.env.QA_OUTPUT || 'previews/mobile-refinement');
const base = process.env.QA_BASE || '';
const allowedMedia = Object.keys(previewAssets).map(asset => `/${asset}`);
const config = JSON.parse(fs.readFileSync('src/content/siteConfig.json', 'utf8'));
if (config.publicationMode !== 'internal' || Object.values(config.releaseApprovals).some(Boolean)) throw new Error('QA requires internal/unapproved configuration');
auditPreviewOutput(dist);
fs.mkdirSync(output, { recursive: true });
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.webp':'image/webp', '.mp4':'video/mp4', '.txt':'text/plain' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (base && !pathname.startsWith(`${base}/`)) { res.writeHead(404); res.end(); return; }
  let file = path.resolve(dist, `.${pathname.slice(base.length) || '/'}`);
  if (!file.startsWith(`${dist}/`) && file !== dist) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  if (!fs.existsSync(file)) { res.statusCode=404; file=path.join(dist,'404.html'); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
let origin;
let browser;
const report = { base, viewports:[320,360,375,390,414,430,751,767,768,1024,1280,1440,1920], pages:[], linkChecks:[], passed:false };
const allLinks = new Set();
try {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await puppeteer.launch({ executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--no-sandbox'] });
  for (const route of (process.env.QA_ROUTES ? process.env.QA_ROUTES.split(',').map(route=>route==='/'?'':route) : ['','profil','pengajian','kemasukan','galeri','hubungi','missing-phase2-page'])) {
    const is404 = route.startsWith('missing');
    const result = { page:is404?'404':route||'index', checks:[], consoleErrors:[], pageErrors:[], failedRequests:[], canceledImages:[], canceledVideos:[], accessibility:[], responsive:[], performance:[] };
    const check = (name, passed, details) => result.checks.push({name,passed:Boolean(passed), ...(details ? {details}: {})});
    const page = await browser.newPage();
    const pendingRequests = new Map();
    page.on('request', req=>pendingRequests.set(req,req.url()));
    for(const event of ['requestfinished','requestfailed']) page.on(event,req=>pendingRequests.delete(req));
    const idle = async idleTime => {try {await page.waitForNetworkIdle({idleTime,timeout:15000});} catch(err) {throw new Error(`${route||'index'} network idle: ${JSON.stringify([...pendingRequests.values()])}`,{cause:err});}};
    page.on('console', msg=> { if(msg.type()==='error' && !msg.text().includes('404 (Not Found)')) result.consoleErrors.push(msg.text()); });
    page.on('pageerror', err=> result.pageErrors.push(err.message));
    page.on('requestfailed', req=> {
      const error = req.failure()?.errorText || 'request failed';
      const url = new URL(req.url());
      // Chrome may cancel a speculative srcset candidate after choosing another.
      // Keep the cancellation as evidence, then verify the exact asset bytes below.
      if (error === 'net::ERR_ABORTED' && req.resourceType() === 'image' && url.origin === origin &&
          allowedMedia.includes(url.pathname.slice(base.length))) {
        result.canceledImages.push({url:req.url(),error});
      } else if(error === 'net::ERR_ABORTED' && req.resourceType() === 'media' && url.origin === origin && allowedMedia.includes(url.pathname.slice(base.length))) {
        // Chromium may stop a video transfer once explicitly requested metadata is decoded.
        result.canceledVideos.push({url:req.url(),error});
      } else result.failedRequests.push(`${error} ${req.url()}`);
    });
    page.on('response', res=> { if(res.status()>=400 && !(is404 && res.request().isNavigationRequest())) result.failedRequests.push(`${res.status()} ${res.url()}`); });
    // No external services contacted by the browser QA, including accidental submissions.
    await page.setRequestInterception(true);
    page.on('request', req=> req.url().startsWith(origin) || req.url().startsWith('data:') ? req.continue() : req.abort());
    await page.evaluateOnNewDocument(()=> {
      window.__metrics={lcp:0,cls:0};
      new PerformanceObserver(list=> {for(const e of list.getEntries()) window.__metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=> {for(const e of list.getEntries()) if(!e.hadRecentInput)window.__metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
    });
    for (const width of report.viewports) {
      console.log(`CHECK ${route||'index'} ${width}`);
      await page.setViewport({width,height:({320:640,360:800,375:812,390:844,414:896,430:932,768:1024})[width] || 900});
      // Resizing a live document can start a new responsive-image request.
      // Let it complete before navigation so the harness does not abort it.
      await idle(250);
      const response = await page.goto(`${origin}${base}/${route}`,{waitUntil:'networkidle0'});
      await page.evaluate(async()=> {
        document.querySelectorAll('img').forEach(img=>{ img.loading='eager'; });
        for(let y=0;y<document.body.scrollHeight;y+=700) window.scrollTo({top:y,behavior:'instant'});
        await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
        window.scrollTo({top:0,behavior:'instant'});
      });
      const state = await page.evaluate(()=> ({
        overflow:document.documentElement.scrollWidth>innerWidth,
        overflowingElements:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1 && !(e.closest('.gallery-controls') && getComputedStyle(e.closest('.gallery-controls')).overflowX==='auto')).slice(0,8).map(e=>e.tagName+'.'+e.className),
        brokenImages:[...document.images].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.src),
        media:[...document.querySelectorAll('img,video,source')].map(e=>e.getAttribute('src')).filter(Boolean),
        headerSource:document.querySelector('.hero-selected .hero-photo')?.getAttribute('src'),
        title:document.title, description:document.querySelector('meta[name=description]')?.content,
        canonical:document.querySelector('link[rel=canonical]')?.href, robots:document.querySelector('meta[name=robots]')?.content,
        h1:document.querySelectorAll('h1').length,
        links:[...document.querySelectorAll('a[href]')].map(a=>a.href),
        unapprovedLinks:[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>/wa.me|forms.gle|docs.google.com\/forms|^tel:|^mailto:/.test(h)),
        perf:{...window.__metrics, fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime},
      }));
      result.responsive.push({width,overflow:state.overflow,overflowingElements:state.overflowingElements});
      check(`HTTP ${width}`,response.status()===(is404?404:200));
      if(!route) check(`User-selected header ${width}`,state.headerSource===`${base}/assets/phase3/header-main-1600.webp`);
      check(`No overflow ${width}`,!state.overflow && state.overflowingElements.length===0);
      check(`No broken images ${width}`,state.brokenImages.length===0,state.brokenImages);
      check(`Media consent ${width}`,state.media.every(src=>allowedMedia.includes(src.slice(base.length))));
      check(`No unverified contact/Form links ${width}`,state.unapprovedLinks.length===0);
      check(`Metadata ${width}`,state.title && state.description && state.canonical?.startsWith(config.canonicalBase) && state.robots==='noindex, nofollow' && state.h1===1);
      for(const href of state.links) if(href.startsWith(origin))allLinks.add(href);
      if ([320,375,430].includes(width) && !base) await page.screenshot({path:path.join(output,`${result.page}_Mobile_${width}_Viewport.png`)});
      if(!route && [751,767].includes(width)) check(`Hero stacks at boundary ${width}`,await page.$eval('.hero-grid',e=>getComputedStyle(e).gridTemplateColumns.split(' ').length===1));
      if(!route && [751,767].includes(width) && !base) await page.screenshot({path:path.join(output,`index_MobileBoundary_${width}.png`)});
      if(width<=430) check(`Main control touch targets ${width}`,await page.$$eval('main .btn, main .circle-arrow, main .filter-button, main .faq-q',items=>items.filter(e=>e.getClientRects().length && !e.closest('[hidden]')).every(e=>{const r=e.getBoundingClientRect();return r.width>=44 && r.height>=44;})));
      if ([1024,1280,1440,1920].includes(width) && !base) {
        await page.screenshot({path:path.join(output,`${result.page}_Desktop_${width}_${width>=1440?'Full':'Viewport'}.png`),fullPage:width>=1440});
      }
      if(width===390 || width===1440) {
        await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
        const axe = await page.evaluate(async()=> {
          const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});
          return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))};
        });
        result.accessibility.push({width,...axe});
        check(`axe ${width}`,axe.violations.length===0);
        result.performance.push({width,...state.perf});
        check(`Lab LCP/CLS ${width}`,state.perf.lcp>0 && state.perf.lcp<2500 && state.perf.cls<0.1);
        if(width===390 && !base) { await page.screenshot({path:path.join(output,`${result.page}_Mobile_390_Full.png`),fullPage:true}); await page.screenshot({path:path.join(output,`${result.page}_Mobile_390_Viewport.png`)}); if(route==='kemasukan') await page.$eval('.client-poster',e=>e.scrollIntoView({behavior:'instant'})); if(route==='kemasukan') await page.screenshot({path:path.join(output,'kemasukan-poster_390.png')}); }
      }
    }
    // Keyboard navigation, focus restoration, and resize closure on every route.
    await page.setViewport({width:390,height:844});
    await idle(250);
    await page.goto(`${origin}${base}/${route}`,{waitUntil:'networkidle0'});
    await page.keyboard.press('Tab');
    check('Keyboard skip link',await page.evaluate(()=>document.activeElement?.getAttribute('href')==='#main-content'));
    await page.keyboard.press('Enter');
    check('Skip focuses main',await page.evaluate(()=>document.activeElement?.id==='main-content'));
    await page.focus('#menu-toggle-btn');
    await page.keyboard.press('Enter');
    check('Menu opens by keyboard',await page.$eval('#menu-toggle-btn',e=>e.getAttribute('aria-expanded')==='true'));
    await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const menuViolations=await page.evaluate(async()=> (await window.axe.run('#mobile-menu',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id));
    check('Expanded menu accessibility',menuViolations.length===0,menuViolations);
    check('Native modal menu and scroll lock',await page.evaluate(()=>document.querySelector('#mobile-menu').open && getComputedStyle(document.documentElement).overflow==='hidden'));
    check('One menu CTA and hidden sticky',await page.evaluate(()=>document.querySelectorAll('#mobile-nav .mobile-menu-cta').length===1 && document.querySelector('.mobile-sticky').hidden));
    check('aria-controls resolves to open modal',await page.$eval('#menu-toggle-btn',e=>document.getElementById(e.getAttribute('aria-controls')).open));
    await page.focus('#mobile-nav a:last-child');await page.keyboard.press('Tab');
    check('Modal keyboard focus contained',await page.evaluate(()=>document.querySelector('#mobile-menu').contains(document.activeElement)));
    if(!route && !base) await page.screenshot({path:path.join(output,'menu-open_390.png')});
    await page.keyboard.press('Escape');
    check('Escape restores focus' ,await page.evaluate(()=>document.activeElement.id==='menu-toggle-btn' && document.activeElement.getAttribute('aria-expanded')==='false'));
    check('Menu releases scroll lock',await page.evaluate(()=>getComputedStyle(document.documentElement).overflow!=='hidden'));
    check('Sticky hidden above hero',await page.$eval('.mobile-sticky',e=>e.hidden));
    if(await page.$('.hero, .inner-hero, .plain-hero')) {
      await page.evaluate(()=>{const hero=document.querySelector('.hero, .inner-hero, .plain-hero');window.scrollTo({top:hero.getBoundingClientRect().bottom+scrollY+120,behavior:'instant'});});
      await page.waitForFunction(()=>!document.querySelector('.mobile-sticky').hidden);
      check('Sticky appears after hero',true);
      if(!route && !base) await page.screenshot({path:path.join(output,'sticky-visible_390.png')});
      const scrollYBefore=await page.evaluate(()=>scrollY);
      await page.click('#menu-toggle-btn');
      check('Sticky hidden while menu open',await page.$eval('.mobile-sticky',e=>e.hidden));
      await page.mouse.wheel({deltaY:300});
      check('Menu prevents background scroll',await page.evaluate(y=>Math.abs(scrollY-y)<1,scrollYBefore));
      if(!route && !base) await page.screenshot({path:path.join(output,'sticky-hidden-menu-open_390.png')});
      await page.mouse.click(1,1);
      check('Backdrop click closes menu',await page.$eval('#mobile-menu',e=>!e.open));
      await page.evaluate(()=>{const fixture=document.createElement('input');fixture.id='qa-focus-fixture';fixture.type='tel';fixture.style='position:fixed;top:0;left:0;width:100px;height:48px';document.body.append(fixture);fixture.focus({preventScroll:true});});
      check('Editing hides persistent CTA',await page.$eval('.mobile-sticky',e=>e.hidden));
      await page.setViewport({width:390,height:430});
      check('Short editing viewport keeps CTA hidden',await page.$eval('.mobile-sticky',e=>e.hidden));
      await page.evaluate(()=>document.getElementById('qa-focus-fixture').remove());
      await page.setViewport({width:390,height:844});
      await page.click('#menu-toggle-btn');await page.click('#close-mobile-menu');
      check('Close button restores focus',await page.evaluate(()=>!document.querySelector('#mobile-menu').open && document.activeElement.id==='menu-toggle-btn'));
      await page.click('#menu-toggle-btn');
      const targetRoute=route==='profil'?'pengajian':'profil';
      await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.click(`#mobile-nav a[href="${base}/${targetRoute}"]`)]);
      check('Menu link navigates and closes',await page.$eval('#mobile-menu',e=>!e.open));
      await page.goBack({waitUntil:'networkidle0'});
      check('Back resets navigation state',await page.evaluate(()=>!document.querySelector('#mobile-menu').open && document.querySelector('#menu-toggle-btn').getAttribute('aria-expanded')==='false'));
      await page.goForward({waitUntil:'networkidle0'});await page.goBack({waitUntil:'networkidle0'});
      check('Forward/back does not retain scroll lock',await page.evaluate(()=>!document.querySelector('#mobile-menu').open && !document.documentElement.dataset.mobileMenu));
      if(route==='kemasukan') {
        await page.$eval('#pertanyaan',e=>e.scrollIntoView({behavior:'instant'}));
        await page.waitForFunction(()=>document.querySelector('.mobile-sticky').hidden);
        check('Form area suppresses sticky CTA',true);
        if(!base) await (await page.$('#inquiry')).screenshot({path:path.join(output,'kemasukan-form_390.png')});
        await page.$eval('.poster-text',e=>e.open=true);
        if(!base) await (await page.$('.poster-text')).screenshot({path:path.join(output,'kemasukan-poster-summary_390.png')});
        check('Accessible poster summary retains sourced programs',await page.$eval('.poster-text',e=>e.textContent.includes('Hafazan Al-Quran') && e.textContent.includes('Syahadah') && e.textContent.includes('SPM Fast Track')));
        await page.$eval('.poster-text',e=>e.open=false);
        check('Phone input and full-width form controls',await page.evaluate(()=>document.querySelector('#phone').type==='tel' && [...document.querySelectorAll('#inquiry input,#inquiry select')].every(e=>e.getBoundingClientRect().height>=48)));
      }
      if(route==='galeri') {
        await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
        await page.goto(`${origin}${base}/${route}`,{waitUntil:'networkidle0'});
        await page.$eval('.gallery-controls',e=>e.scrollIntoView({behavior:'instant'}));await page.tap('[data-filter="tvet"]');
        check('Touch gallery filter',await page.$$eval('.gallery-card:not([hidden])',e=>e.length===2));
        // Let native tap feedback settle; network-idle is unrelated to touch paint.
        await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,500)));
        if(!base) await page.screenshot({path:path.join(output,'galeri-filter_390.png')});
        await page.click('.gallery-card:not([hidden])');
        check('Lightbox hides sticky CTA',await page.$eval('.mobile-sticky',e=>e.hidden));
        await page.keyboard.press('Escape');await page.click('[data-filter="all"]');
        await page.$eval('#alumni-heading',e=>e.scrollIntoView({behavior:'instant'}));
        if(!base) await page.screenshot({path:path.join(output,'alumni_390.png')});
      }
      if(route==='hubungi') {
        await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
        await page.goto(`${origin}${base}/${route}`,{waitUntil:'networkidle0'});
        await page.$eval('#faq-btn-faq-2',e=>e.scrollIntoView({behavior:'instant',block:'center'}));await page.tap('#faq-btn-faq-2');
        check('Touch FAQ opens',await page.$eval('#faq-btn-faq-2',e=>e.getAttribute('aria-expanded')==='true'));
        // Let native tap feedback settle; network-idle is unrelated to touch paint.
        await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,500)));
        if(!base) await page.screenshot({path:path.join(output,'faq-open_390.png')});
        await page.click('#faq-btn-faq-2');
      }
      if(!is404) {
        await page.$eval('.final-cta',e=>e.scrollIntoView({behavior:'instant',block:'center'}));
        await page.waitForFunction(()=>document.querySelector('.mobile-sticky').hidden);
        check('Visible final CTA suppresses persistent duplicate',true);
      }
      await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));
      check('Footer leaves room for persistent CTA',await page.evaluate(()=>parseFloat(getComputedStyle(document.querySelector('.site-footer')).paddingBottom)>=100));
      if(!route && !base) await page.screenshot({path:path.join(output,'footer_390.png')});
    }
    await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
    await page.goto(`${origin}${base}/${route}`,{waitUntil:'networkidle0'});
    await page.tap('#menu-toggle-btn');
    check('Touch opens hamburger menu',await page.$eval('#mobile-menu',e=>e.open));
    await page.tap('#close-mobile-menu');
    check('Touch closes hamburger menu',await page.$eval('#mobile-menu',e=>!e.open));
    await page.setViewport({width:844,height:390,isMobile:true,hasTouch:true});
    await page.click('#menu-toggle-btn');
    check('Landscape menu scrolls within viewport',await page.$eval('#mobile-menu',e=>{const r=e.getBoundingClientRect();return e.open && r.top>=0 && r.bottom<=innerHeight && e.scrollHeight>=e.clientHeight;}));
    await page.keyboard.press('Escape');
    await page.click('#menu-toggle-btn');
    await page.setViewport({width:1440,height:900,isMobile:true,hasTouch:true});
    await page.waitForFunction(()=>document.getElementById('menu-toggle-btn').getAttribute('aria-expanded')==='false');
    check('Resize closes menu',true);
    if(route==='galeri') {
      check('Twelve authentic gallery photos',await page.$$eval('.gallery-card',items=>items.length===12 && items.every(i=>!i.querySelector('img').src.includes('placeholder'))));
      await page.click('[data-filter="tvet"]');
      check('Gallery filter works',await page.$$eval('.gallery-card:not([hidden])',items=>items.length===2 && items.every(i=>i.dataset.cat==='tvet')));
      await page.focus('.gallery-card:not([hidden])');await page.keyboard.press('Enter');
      check('Gallery keyboard lightbox opens',await page.$eval('#image-viewer',e=>e.open));
      await page.keyboard.press('Escape');
      check('Lightbox Escape restores focus',await page.evaluate(()=>!document.querySelector('#image-viewer').open && document.activeElement.matches('.gallery-card')));
      await page.click('[data-filter="all"]');
      check('Video controls and lazy media',await page.$$eval('video',items=>items.length===2 && items.every(v=>v.controls && !v.autoplay && v.preload==='none')));
      for(const video of await page.$$('video')) {
        // Request metadata explicitly only after verifying the production preload=none policy.
        await video.evaluate(v=>{v.preload='metadata';v.load();});
        await page.waitForFunction(v=>v.readyState>=1 || v.error,{timeout:15000},video);
        check('Video metadata decodes',await video.evaluate(v=>v.readyState>=1 && !v.error));
      }
      check('Six supplied alumni profiles' ,await page.$$eval('.alumni-card',cards=>cards.length===6 && cards.every(c=>c.querySelector('h3')?.textContent && !c.textContent.includes('Ruang profil'))));
      check('One attributed testimonial',await page.$$eval('.alumni-testimonial',items=>items.length===1 && items[0].textContent.includes('Nur Zulaikha')));
    }
    if(route==='kemasukan') {
      check('Registration held',await page.$eval('[data-registration-status]',e=>e.dataset.registrationStatus==='pending'));
      check('Form disabled until contact verified',await page.$eval('#inquiry fieldset',e=>e.disabled));
      const held=await page.evaluate(()=>{let calls=0;window.open=()=>{calls++;return null;};document.getElementById('inquiry').dispatchEvent(new Event('submit',{cancelable:true}));return calls===0 && document.getElementById('wa-fallback-link').getAttribute('href')==='#';});
      check('Programmatic submit cannot bypass contact gate',held);
    }
    if(route==='hubungi') {
      await page.focus('#faq-btn-faq-2'); await page.keyboard.press('Enter');
      check('FAQ opens with keyboard',await page.$eval('#faq-btn-faq-2',e=>e.getAttribute('aria-expanded')==='true'));
      await page.keyboard.press('Enter');
      check('FAQ closes with keyboard',await page.$eval('#faq-btn-faq-2',e=>e.getAttribute('aria-expanded')==='false'));
    }
    if(route==='profil') check('Three text-only recognition cards',await page.$$eval('.legal-card',cards=>cards.length===3 && cards.every(c=>!c.querySelector('img'))));
    for (const canceled of [...result.canceledImages,...result.canceledVideos]) {
      const response = await fetch(canceled.url);
      const bytes = Buffer.from(await response.arrayBuffer());
      const asset = new URL(canceled.url).pathname.slice(base.length + 1);
      canceled.status = response.status;
      canceled.hashVerified = response.status === 200 && createHash('sha256').update(bytes).digest('hex') === previewAssets[asset];
    }
    check('Canceled responsive candidates have exact reviewed bytes',result.canceledImages.every(item=>item.hashVerified),result.canceledImages);
    check('Canceled video metadata transfers have exact reviewed bytes',result.canceledVideos.every(item=>item.hashVerified),result.canceledVideos);
    check('No console errors' ,result.consoleErrors.length===0,result.consoleErrors);
    check('No runtime exceptions',result.pageErrors.length===0,result.pageErrors);
    check('No failed assets/requests',result.failedRequests.length===0,result.failedRequests);
    result.passed=result.checks.every(c=>c.passed);
    report.pages.push(result);
    console.log(`${result.passed?'PASS':'FAIL'} ${result.page}: ${result.checks.filter(c=>c.passed).length}/${result.checks.length}`);
    for(const c of result.checks.filter(c=>!c.passed))console.log(JSON.stringify(c));
    await page.close();
  }
  const linkPage=await browser.newPage();
  for(const href of allLinks) {
    const url=new URL(href);
    const res=await linkPage.goto(url.origin+url.pathname+url.search,{waitUntil:'domcontentloaded'});
    const status=res ? res.status() : (await fetch(url.origin+url.pathname+url.search)).status;
    const target=url.hash ? await linkPage.evaluate(hash=>Boolean(document.getElementById(decodeURIComponent(hash.slice(1)))),url.hash) : true;
    const expectedStatus=url.pathname===`${base}/missing-phase2-page` && url.hash ? 404 : 200;
    report.linkChecks.push({path:url.pathname+url.hash,status,expectedStatus,target,passed:status===expectedStatus&&target});
  }
  report.passed=report.pages.every(p=>p.passed)&&report.linkChecks.every(l=>l.passed);
} catch (err) {
  report.error = err.message;
  report.errorStack = err.stack;
  report.blocked = report.pages.length === 0;
  console.error(`[QA] ${report.blocked ? 'BLOCKED' : 'FAILED'}: ${err.stack}`);
} finally {
  if(browser)await browser.close();
  if(server.listening) await new Promise(resolve=>server.close(resolve));
  fs.writeFileSync(path.join(output,base?'qa-pages.json':'qa.json'),JSON.stringify(report,null,2)+'\n');
}
console.log(`QA ${report.blocked?'BLOCKED':report.passed?'PASSED':'FAILED'}: ${report.pages.length} routes, ${report.linkChecks.length} internal links.`);
if(!report.passed)process.exitCode=1;
