import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const port = 4325;
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let parsedUrl = new URL(req.url || '/', `http://localhost:${port}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  let filePath = path.join(distDir, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, '404.html');
    res.statusCode = 404;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.setHeader('Content-Type', contentType);
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.end('Server Error');
  }
});

await new Promise(resolve => server.listen(port, resolve));
console.log(`[CWV Audit Server] Listening on http://localhost:${port}`);

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const pages = [
  { name: 'index', path: '/' },
  { name: 'profil', path: '/profil' },
  { name: 'pengajian', path: '/pengajian' },
  { name: 'kemasukan', path: '/kemasukan' },
  { name: 'galeri', path: '/galeri' },
  { name: 'hubungi', path: '/hubungi' }
];

const cwvResults = [];

for (const p of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Inject performance observer for LCP and CLS before load
  await page.evaluateOnNewDocument(() => {
    window.__cwv = {
      fcp: null,
      lcp: null,
      cls: 0,
      lcpElement: null
    };

    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        window.__cwv.lcp = lastEntry.renderTime || lastEntry.loadTime;
        window.__cwv.lcpElement = lastEntry.element ? (lastEntry.element.tagName + '.' + lastEntry.element.className) : null;
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cwv.cls += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(`http://localhost:${port}${p.path}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const metrics = await page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : null;
    const navEntry = performance.getEntriesByType('navigation')[0];
    const domContentLoaded = navEntry ? navEntry.domContentLoadedEventEnd : null;
    const loadTime = navEntry ? navEntry.loadEventEnd : null;

    return {
      fcpMs: fcp ? Math.round(fcp) : null,
      lcpMs: window.__cwv.lcp ? Math.round(window.__cwv.lcp) : (fcp ? Math.round(fcp) : null),
      lcpElement: window.__cwv.lcpElement,
      cls: Math.round(window.__cwv.cls * 1000) / 1000,
      domContentLoadedMs: domContentLoaded ? Math.round(domContentLoaded) : null,
      loadTimeMs: loadTime ? Math.round(loadTime) : null
    };
  });

  const rating = {
    fcpRating: metrics.fcpMs !== null && metrics.fcpMs < 1800 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
    lcpRating: metrics.lcpMs !== null && metrics.lcpMs < 2500 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
    clsRating: metrics.cls < 0.1 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
  };

  const pageReport = {
    page: p.name,
    path: p.path,
    ...metrics,
    ...rating
  };

  cwvResults.push(pageReport);
  console.log(`[CWV] Page: ${p.name} | FCP: ${metrics.fcpMs}ms (${rating.fcpRating}) | LCP: ${metrics.lcpMs}ms (${rating.lcpRating}) | CLS: ${metrics.cls} (${rating.clsRating})`);
  await page.close();
}

fs.writeFileSync(path.resolve('previews/cwv_audit.json'), JSON.stringify(cwvResults, null, 2), 'utf-8');
console.log('\n[CWV Audit] Report written to previews/cwv_audit.json');

await browser.close();
server.close();
