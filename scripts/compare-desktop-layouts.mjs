import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import{serveBuild,readyImages}from'./lib/qaServer.mjs';
const baseline=await serveBuild(process.env.BASELINE_BUILD || '/tmp/madum-desktop-baseline-78cfed2/dist');const after=await serveBuild('dist');
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
const selectors=['.preview-bar','.announcement','.site-header','.nav-wrap','.hero h1','.hero-photo','.inner-hero','.plain-hero','.intro-images','.intro-copy','.program-card','.pillar','.gallery-item','.gallery-card','.editorial-visual','.client-poster','.fee-editorial','.form-shell','.alumni-card','.alumni-testimonial','.contact-card','.faq-q','.site-footer'];const comparisons=[];
try{
 for(const route of ['','profil','pengajian','kemasukan','galeri','hubungi'])for(const width of [1024,1280,1440,1920]){
  const states=[];
  for(const server of [baseline,after]){
   const page=await browser.newPage();await page.setViewport({width,height:900});await page.goto(`${server.origin}/${route}`,{waitUntil:'networkidle0'});await readyImages(page);
   states.push(await page.evaluate(selectors=>({height:document.documentElement.scrollHeight,items:Object.fromEntries(selectors.map(selector=>[selector,[...document.querySelectorAll(selector)].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,fontSize:getComputedStyle(e).fontSize};})]))}),selectors));await page.close();
  }
  const differences=[];for(const selector of selectors){const a=states[0].items[selector],b=states[1].items[selector];if(JSON.stringify(a)!==JSON.stringify(b))differences.push({selector,before:a,after:b});}
  const passed=states[0].height===states[1].height && !differences.length;comparisons.push({page:route||'index',width,baselineHeight:states[0].height,afterHeight:states[1].height,differences,passed});console.log(`${passed?'PASS':'FAIL'} ${route||'index'} ${width}`);
 }
}finally{await browser.close();await baseline.close();await after.close();}
const passed=comparisons.every(c=>c.passed);fs.writeFileSync('previews/mobile-refinement/desktop-layout-regression.json',JSON.stringify({baselineCommit:'78cfed2',method:'Fresh baseline build from tracked commit; compare exact element rectangles, font sizes and document height; separate browser page per capture to avoid srcset cache and sticky screenshot rasterization differences',comparisons,passed},null,2)+'\n');if(!passed)process.exitCode=1;
