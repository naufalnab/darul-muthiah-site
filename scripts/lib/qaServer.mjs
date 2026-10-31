import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
export async function serveBuild(directory, base = '') {
  const root = path.resolve(directory);
  const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.txt':'text/plain'};
  const server = http.createServer((req,res) => {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (base && !pathname.startsWith(base + '/')) { res.writeHead(404);res.end();return; }
    let file = path.resolve(root, '.' + (pathname.slice(base.length) || '/'));
    if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    if (!fs.existsSync(file)) {res.statusCode=404;file=path.join(root,'404.html');}
    res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {origin:`http://127.0.0.1:${server.address().port}`,root,close:()=>new Promise(resolve=>server.close(resolve))};
}
export async function readyImages(page) {
  await page.evaluate(async()=>{
    document.querySelectorAll('img').forEach(i=>i.loading='eager');
    await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
    window.scrollTo({top:0,behavior:'instant'});
    await document.fonts.ready;
  });
}
