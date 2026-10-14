import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const previewsDir = path.resolve('previews/new');
const baselineDir = path.resolve('previews');
fs.mkdirSync(previewsDir, { recursive: true });

const port = 4322;
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8'
};

// Start local server
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
console.log(`QA Test Server listening on http://localhost:${port}`);

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

const testResults = [];
let allPassed = true;

console.log('\n--- STARTING COMPREHENSIVE QA AUDIT ---\n');

for (const pg of pages) {
  console.log(`Testing page: ${pg.name} (${pg.path})`);
  const pageResult = {
    page: pg.name,
    path: pg.path,
    desktop: {},
    mobile: {},
    interactions: {},
    responsiveViewports: {},
    brokenAssets: [],
    consoleErrors: [],
    pageErrors: []
  };

  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      pageResult.consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    pageResult.pageErrors.push(err.message);
  });

  page.on('requestfailed', req => {
    pageResult.brokenAssets.push(`${req.url()} (${req.failure()?.errorText})`);
  });

  page.on('response', res => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      pageResult.brokenAssets.push(`${res.url()} [HTTP ${res.status()}]`);
    }
  });

  // 1. Desktop Test (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${port}${pg.path}`, { waitUntil: 'networkidle0' });

  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  const desktopHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const desktopH1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
  const title = await page.title();

  pageResult.desktop = {
    width: 1440,
    height: desktopHeight,
    overflow: desktopOverflow,
    h1Count: desktopH1Count,
    title
  };

  const desktopScreenshotPath = path.join(previewsDir, `${pg.name}_Desktop_Full.png`);
  await page.screenshot({ path: desktopScreenshotPath, fullPage: true });

  // 2. Mobile Test (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${port}${pg.path}`, { waitUntil: 'networkidle0' });

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  const mobileHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  pageResult.mobile = {
    width: 390,
    height: mobileHeight,
    overflow: mobileOverflow
  };

  const mobileScreenshotPath = path.join(previewsDir, `${pg.name}_Mobile_Full.png`);
  await page.screenshot({ path: mobileScreenshotPath, fullPage: true });

  // 3. Test Mobile Navigation on this page
  const menuToggle = await page.$('.menu-toggle');
  if (menuToggle) {
    await menuToggle.click();
    const menuOpenDisplay = await page.evaluate(() => {
      const el = document.getElementById('mobile-nav');
      return el ? window.getComputedStyle(el).display : 'missing';
    });
    const ariaExpandedAfterOpen = await page.evaluate(() => {
      return document.querySelector('.menu-toggle')?.getAttribute('aria-expanded');
    });

    await page.keyboard.press('Escape');
    const menuCloseDisplay = await page.evaluate(() => {
      const el = document.getElementById('mobile-nav');
      return el ? window.getComputedStyle(el).display : 'missing';
    });
    const ariaExpandedAfterClose = await page.evaluate(() => {
      return document.querySelector('.menu-toggle')?.getAttribute('aria-expanded');
    });

    pageResult.interactions.mobileNav = {
      openDisplay: menuOpenDisplay,
      closeDisplay: menuCloseDisplay,
      ariaExpandedAfterOpen,
      ariaExpandedAfterClose,
      passed: menuOpenDisplay === 'block' && menuCloseDisplay === 'none' && ariaExpandedAfterOpen === 'true' && ariaExpandedAfterClose === 'false'
    };
  }

  // 4. Test Page-Specific Interactions
  if (pg.name === 'galeri') {
    // Switch back to desktop for filter & lightbox tests
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${port}/galeri`, { waitUntil: 'networkidle0' });

    // Test filter buttons
    const filterTvetBtn = await page.$('button[data-filter="tvet"]');
    if (filterTvetBtn) {
      await filterTvetBtn.click();
      const visibleTvetCards = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.gallery-card')).filter(c => !c.hidden).length;
      });
      pageResult.interactions.galleryFilterTvet = { visibleCount: visibleTvetCards, passed: visibleTvetCards === 2 };
    }

    const filterAllBtn = await page.$('button[data-filter="all"]');
    if (filterAllBtn) {
      await filterAllBtn.click();
      const visibleAllCards = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.gallery-card')).filter(c => !c.hidden).length;
      });
      pageResult.interactions.galleryFilterAll = { visibleCount: visibleAllCards, passed: visibleAllCards === 12 };
    }

    // Test Lightbox
    const firstCard = await page.$('.gallery-card');
    if (firstCard) {
      await firstCard.click();
      await new Promise(r => setTimeout(r, 200));

      const lightboxState = await page.evaluate(() => {
        const dialog = document.getElementById('image-viewer');
        const img = document.getElementById('image-large');
        const caption = document.getElementById('image-caption');
        return {
          isOpen: dialog ? (dialog.open || dialog.classList.contains('open')) : false,
          imgSrc: img ? img.getAttribute('src') : null,
          captionText: caption ? caption.textContent : ''
        };
      });

      // Press Escape to close
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 200));

      const closedState = await page.evaluate(() => {
        const dialog = document.getElementById('image-viewer');
        return {
          isOpen: dialog ? (dialog.open || dialog.classList.contains('open')) : false,
          isBodyScrollLocked: document.body.style.overflow === 'hidden'
        };
      });

      pageResult.interactions.lightbox = {
        opened: lightboxState.isOpen,
        hasImage: Boolean(lightboxState.imgSrc),
        caption: lightboxState.captionText,
        closedOnEsc: !closedState.isOpen,
        bodyUnlocked: !closedState.isBodyScrollLocked,
        passed: lightboxState.isOpen && Boolean(lightboxState.imgSrc) && !closedState.isOpen && !closedState.isBodyScrollLocked
      };
    }
  }

  if (pg.name === 'hubungi') {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${port}/hubungi`, { waitUntil: 'networkidle0' });

    // Test FAQ Accordion
    const secondFaqBtn = await page.$('#faq-btn-faq-2');
    if (secondFaqBtn) {
      await secondFaqBtn.click();
      const faqState = await page.evaluate(() => {
        const item1 = document.querySelector('.faq-item:nth-child(1)');
        const item2 = document.querySelector('.faq-item:nth-child(2)');
        const btn2 = document.getElementById('faq-btn-faq-2');
        return {
          item1Open: item1?.classList.contains('open'),
          item2Open: item2?.classList.contains('open'),
          item2AriaExpanded: btn2?.getAttribute('aria-expanded')
        };
      });
      pageResult.interactions.faq = {
        item1Closed: !faqState.item1Open,
        item2Opened: faqState.item2Open,
        ariaExpanded: faqState.item2AriaExpanded === 'true',
        passed: !faqState.item1Open && faqState.item2Open && faqState.item2AriaExpanded === 'true'
      };
    }
  }

  if (pg.name === 'kemasukan') {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${port}/kemasukan`, { waitUntil: 'networkidle0' });

    // Test form validation and WhatsApp link generation
    const formTestResult = await page.evaluate(() => {
      const form = document.getElementById('inquiry');
      if (!form) return { passed: false, reason: 'form missing' };

      const parentInput = document.getElementById('parent');
      const phoneInput = document.getElementById('phone');
      const ageSelect = document.getElementById('age');
      const programSelect = document.getElementById('program');
      const questionArea = document.getElementById('question');

      if (!parentInput || !phoneInput || !ageSelect || !programSelect) {
        return { passed: false, reason: 'inputs missing' };
      }

      // Fill in test data
      parentInput.value = 'Encik Ahmad Razali';
      phoneInput.value = '0123456789';
      ageSelect.value = '12';
      programSelect.value = 'Hafazan 30 Juzuk';
      questionArea.value = 'Ujian teknikal borang tanpa penghantaran sebenar.';

      // Trigger submit event
      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      const fallbackLink = document.getElementById('wa-fallback-link');
      const fallbackBox = document.getElementById('popup-fallback');

      const href = fallbackLink ? fallbackLink.getAttribute('href') : '';
      const isEncodedCorrectly = href.includes('wa.me') &&
        href.includes(encodeURIComponent('Nama penjaga: Encik Ahmad Razali')) &&
        href.includes(encodeURIComponent('Umur calon pelajar: 12'));

      return {
        passed: isEncodedCorrectly,
        href,
        fallbackVisible: fallbackBox ? fallbackBox.style.display !== 'none' : false
      };
    });

    pageResult.interactions.whatsappForm = formTestResult;
  }

  // 5. Test Responsive Viewports (320, 375, 768, 1024, 1280)
  const viewports = [320, 375, 768, 1024, 1280];
  for (const vp of viewports) {
    await page.setViewport({ width: vp, height: 800 });
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    pageResult.responsiveViewports[vp] = { overflow, passed: !overflow };
    if (overflow) allPassed = false;
  }

  testResults.push(pageResult);
  await page.close();
}

// 6. Test 404 Route
console.log('Testing 404 Page (/404)');
const notFoundPage = await browser.newPage();
await notFoundPage.setViewport({ width: 1440, height: 900 });
const res404 = await notFoundPage.goto(`http://localhost:${port}/non-existent-page`, { waitUntil: 'networkidle0' });
const status404 = res404.status();
const notFoundH1 = await notFoundPage.evaluate(() => document.querySelector('h1')?.textContent);
const notFoundScreenshot = path.join(previewsDir, '404_Desktop_Full.png');
await notFoundPage.screenshot({ path: notFoundScreenshot, fullPage: true });

testResults.push({
  page: '404',
  path: '/non-existent-page',
  httpStatus: status404,
  h1: notFoundH1,
  passed: status404 === 404 && Boolean(notFoundH1)
});

await notFoundPage.close();
await browser.close();
server.close();

// Save results
const qaReportPath = path.join(baselineDir, 'qa_new.json');
fs.writeFileSync(qaReportPath, JSON.stringify(testResults, null, 2));
console.log(`\nQA Test Complete! Results written to ${qaReportPath}`);
console.log(`New screenshots saved to ${previewsDir}/\n`);
