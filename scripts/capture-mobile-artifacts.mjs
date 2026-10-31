import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import{serveBuild,readyImages}from'./lib/qaServer.mjs';
const output='previews/mobile-refinement/debug';fs.mkdirSync(output,{recursive:true});
const server=await serveBuild('dist');const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage();await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});await page.goto(server.origin,{waitUntil:'networkidle0'});await readyImages(page);
 await page.screenshot({path:`${output}/viewport-top.png`});
 await page.evaluate(()=>window.scrollTo({top:1000,behavior:'instant'}));await page.waitForFunction(()=>!document.querySelector('.mobile-sticky').hidden);
 await page.screenshot({path:`${output}/viewport-scrolled.png`});
 const styles=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>['fixed','sticky'].includes(getComputedStyle(e).position)).map(e=>({element:e.tagName+'.'+e.className,position:getComputedStyle(e).position,display:getComputedStyle(e).display,hidden:e.hidden,background:getComputedStyle(e).backgroundColor,zIndex:getComputedStyle(e).zIndex,rect:{top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}})));
 await page.screenshot({path:`${output}/full-page-after-scroll.png`,fullPage:true});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('.mobile-sticky').hidden);
 const cdp=await page.createCDPSession();const dimensions=await cdp.send('Page.getLayoutMetrics');const result=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:390,height:dimensions.cssContentSize.height,scale:1}});fs.writeFileSync(`${output}/cdp-full-page-top.png`,Buffer.from(result.data,'base64'));
 await page.setViewport({width:844,height:390,isMobile:true,hasTouch:true});
 await page.tap('#menu-toggle-btn');await page.screenshot({path:`${output}/landscape-menu_844x390.png`});await page.keyboard.press('Escape');await page.screenshot({path:`${output}/landscape-viewport_844x390.png`});
 fs.writeFileSync(`${output}/capture-observations.json`,JSON.stringify({root:server.root,origin:server.origin,viewport:{width:390,height:844},methods:['Chromium viewport at top','Chromium viewport after scroll','Puppeteer fullPage after scroll','CDP captureBeyondViewport at top'],computedFixedElements:styles,interpretation:'Native visible browser also inspected through CUA. No black capsule reproduced in normal viewport; full-page fixed-element placement must be interpreted as capture behavior, not a new CSS shape.'},null,2)+'\n');
}finally{await browser.close();await server.close();}
