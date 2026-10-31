import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { serveBuild, readyImages } from './lib/qaServer.mjs';
const output='previews/mobile-refinement/before';fs.mkdirSync(output,{recursive:true});
const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
const provenance=[];
try {
  for(const [label,directory] of [['UIUX-v1.0','/Users/mac/Documents/darul-muthiah/dist'],['Phase3-78cfed2',process.env.BASELINE_BUILD || '/tmp/madum-desktop-baseline-78cfed2/dist']]) {
    const server=await serveBuild(directory);const page=await b.newPage();
    provenance.push({label,root:server.root,origin:server.origin,artifactMtime:fs.statSync(path.join(server.root,'index.html')).mtime.toISOString(),source:label.startsWith('UIUX')?'Existing v1.0 built artifact, not rebuilt from the later privacy branch':'Frozen tracked source commit 78cfed2cf45f3009a568307d8032fa1d873ef969'});
    try {
      for(const route of ['','profil','pengajian','kemasukan','galeri','hubungi']) {
        await page.setViewport({width:390,height:844});await page.goto(server.origin+'/'+route,{waitUntil:'networkidle0'});await readyImages(page);
        await page.screenshot({path:`${output}/${route||'index'}_${label}_390_Full.png`,fullPage:true});
        if(!route) {await page.click('#menu-toggle-btn');await page.screenshot({path:`${output}/menu_${label}_390.png`});await page.click('#menu-toggle-btn');}
        if(label.startsWith('Phase3')) for(const width of [1024,1280,1440,1920]) {
          await page.setViewport({width,height:900});await page.waitForNetworkIdle({idleTime:250});await page.goto(server.origin+'/'+route,{waitUntil:'networkidle0'});await readyImages(page);
          await page.screenshot({path:`${output}/${route||'index'}_Phase3_${width}_Desktop.png`,fullPage:true});
        }
      }
    }finally {await page.close();await server.close();}
  }
}finally{await b.close();fs.writeFileSync(`${output}/provenance.json`,JSON.stringify(provenance,null,2)+'\n');}
