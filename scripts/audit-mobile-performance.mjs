import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import {serveBuild} from './lib/qaServer.mjs';
const server=await serveBuild('dist');const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});const results=[];
try{
 for(const route of ['','profil','pengajian','kemasukan','galeri','hubungi']){
  const page=await browser.newPage();await page.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});await page.setCacheEnabled(false);const cdp=await page.createCDPSession();await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600*1024/8,uploadThroughput:750*1024/8});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.evaluateOnNewDocument(()=>{window.__mobilePerf={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__mobilePerf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__mobilePerf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
  await page.goto(server.origin+'/'+route,{waitUntil:'networkidle0'});
  const data=await page.evaluate(()=>({fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,...window.__mobilePerf,transferBytes:performance.getEntriesByType('resource').reduce((s,e)=>s+e.transferSize,0),initialVideoRequests:performance.getEntriesByType('resource').filter(e=>e.name.endsWith('.mp4')).length}));results.push({page:route||'index',...data});console.log(JSON.stringify(results.at(-1)));await page.close();
 }
}finally{await browser.close();await server.close();}
fs.writeFileSync('previews/mobile-refinement/performance-mobile.json',JSON.stringify({method:'Cold-cache Chromium mobile 390x844, DPR2, 150ms latency, 1.6Mbps down/750Kbps up, CPU4x. Local static server; lab observations, not field CWV.',results},null,2)+'\n');
if(results.some(r=>!r.lcp || r.initialVideoRequests))process.exitCode=1;
