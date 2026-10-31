import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { auditPreviewOutput, previewAssets } from './lib/previewAssets.mjs';

const require = createRequire(import.meta.url);
const dist = path.resolve('dist');
const output = path.resolve('previews/phase3-desktop-refinement');
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
const report = { base, viewports:[320,375,390,768,1024,1280,1440,1920], pages:[], linkChecks:[], passed:false };
const allLinks = new Set();
try {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await puppeteer.launch({ executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--no-sandbox'] });
  for (const route of ['','profil','pengajian','kemasukan','galeri','hubungi','missing-phase2-page']) {
    const is404 = route.startsWith('missing');
    const result = { page:is404?'404':route||'index', checks:[], consoleErrors:[], pageErrors:[], failedRequests:[], accessibility:[], responsive:[], performance:[] };
    const check = (name, passed, details) => result.checks.push({name,passed:Boolean(passed), ...(details ? {details}: {})});
    const page = await browser.newPage();
    page.on('console', msg=> { if(msg.type()==='error' && !msg.text().includes('404 (Not Found)')) result.consoleErrors.push(msg.text()); });
    page.on('pageerror', err=> result.pageErrors.push(err.message));
    page.on('requestfailed', req=> result.failedRequests.push(`${req.failure()?.errorText || 'request failed'} ${req.url()}`));
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
      await page.setViewport({width,height:900});
      // Resizing a live document can start a new responsive-image request.
      // Let it complete before navigation so the harness does not abort it.
      await page.waitForNetworkIdle({idleTime:250,timeout:15000});
      const response = await page.goto(`${origin}${base}/${route}`,{waitUntil:'networkidle0'});
      await page.evaluate(async()=> {
        document.querySelectorAll('img').forEach(img=>{ img.loading='eager'; });
        for(let y=0;y<document.body.scrollHeight;y+=700) window.scrollTo({top:y,behavior:'instant'});
        await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
        window.scrollTo({top:0,behavior:'instant'});
      });
      const state = await page.evaluate(()=> ({
        overflow:document.documentElement.scrollWidth>innerWidth,
        overflowingElements:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(e=>e.tagName+'.'+e.className),
        brokenImages:[...document.images].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.src),
        media:[...document.querySelectorAll('img,video,source')].map(e=>e.getAttribute('src')).filter(Boolean),
        title:document.title, description:document.querySelector('meta[name=description]')?.content,
        canonical:document.querySelector('link[rel=canonical]')?.href, robots:document.querySelector('meta[name=robots]')?.content,
        h1:document.querySelectorAll('h1').length,
        links:[...document.querySelectorAll('a[href]')].map(a=>a.href),
        unapprovedLinks:[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>/wa.me|forms.gle|docs.google.com\/forms|^tel:|^mailto:/.test(h)),
        perf:{...window.__metrics, fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime},
      }));
      result.responsive.push({width,overflow:state.overflow,overflowingElements:state.overflowingElements});
      check(`HTTP ${width}`,response.status()===(is404?404:200));
      check(`No overflow ${width}`,!state.overflow && state.overflowingElements.length===0);
      check(`No broken images ${width}`,state.brokenImages.length===0,state.brokenImages);
      check(`Media consent ${width}`,state.media.every(src=>allowedMedia.includes(src.slice(base.length))));
      check(`No unverified contact/Form links ${width}`,state.unapprovedLinks.length===0);
      check(`Metadata ${width}`,state.title && state.description && state.canonical?.startsWith(config.canonicalBase) && state.robots==='noindex, nofollow' && state.h1===1);
      for(const href of state.links) if(href.startsWith(origin))allLinks.add(href);
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
        if(width===390 && !base) await page.screenshot({path:path.join(output,`${result.page}_Mobile_390_Full.png`),fullPage:true});
      }
    }
    // Keyboard navigation, focus restoration, and resize closure on every route.
    await page.setViewport({width:390,height:844});
    await page.waitForNetworkIdle({idleTime:250,timeout:15000});
    await page.goto(`${origin}${base}/${route}`,{waitUntil:'networkidle0'});
    await page.keyboard.press('Tab');
    check('Keyboard skip link',await page.evaluate(()=>document.activeElement?.getAttribute('href')==='#main-content'));
    await page.keyboard.press('Enter');
    check('Skip focuses main',await page.evaluate(()=>document.activeElement?.id==='main-content'));
    await page.focus('#menu-toggle-btn');
    await page.keyboard.press('Enter');
    check('Menu opens by keyboard',await page.$eval('#menu-toggle-btn',e=>e.getAttribute('aria-expanded')==='true'));
    await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const menuViolations=await page.evaluate(async()=> (await window.axe.run('#mobile-nav',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id));
    check('Expanded menu accessibility',menuViolations.length===0,menuViolations);
    await page.keyboard.press('Escape');
    check('Escape restores focus',await page.evaluate(()=>document.activeElement.id==='menu-toggle-btn' && document.activeElement.getAttribute('aria-expanded')==='false'));
    await page.click('#menu-toggle-btn');
    await page.setViewport({width:1440,height:900});
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
        await video.evaluate(v=>v.load());
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
    check('No console errors',result.consoleErrors.length===0,result.consoleErrors);
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
  report.blocked = report.pages.length === 0;
  console.error(`[QA] ${report.blocked ? 'BLOCKED' : 'FAILED'}: ${err.message}`);
} finally {
  if(browser)await browser.close();
  if(server.listening) await new Promise(resolve=>server.close(resolve));
  fs.writeFileSync(path.join(output,base?'qa-pages.json':'qa.json'),JSON.stringify(report,null,2)+'\n');
}
console.log(`QA ${report.blocked?'BLOCKED':report.passed?'PASSED':'FAILED'}: ${report.pages.length} routes, ${report.linkChecks.length} internal links.`);
if(!report.passed)process.exitCode=1;
