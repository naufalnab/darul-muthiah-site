import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const siteConfigPath = path.resolve('src/content/siteConfig.ts');
const siteConfigCode = fs.readFileSync(siteConfigPath, 'utf-8');

const isPublicMatch = siteConfigCode.match(/publicationMode:\s*['"](internal|public)['"]/);
const publicationMode = isPublicMatch ? isPublicMatch[1] : 'internal';
const studentMediaConsentApproved = /studentMediaConsentApproved:\s*true/.test(siteConfigCode);

console.log(`[postbuild] Executing post-build tasks for mode: '${publicationMode}'`);

// 1. Create flat .html fallbacks for static web servers
const routes = ['profil', 'pengajian', 'kemasukan', 'galeri', 'hubungi'];
for (const r of routes) {
  const srcHtml = path.join(distDir, r, 'index.html');
  const targetHtml = path.join(distDir, `${r}.html`);
  if (fs.existsSync(srcHtml)) {
    fs.copyFileSync(srcHtml, targetHtml);
    console.log(`[postbuild] Created ${r}.html fallback from ${r}/index.html`);
  }
}

// 2. Strict privacy check in dist/
function auditDistDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      auditDistDir(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.pdf' || ext === '.zip' || ext === '.doc' || ext === '.docx' || /profail/i.test(entry.name)) {
        fs.unlinkSync(fullPath);
        console.error(`[postbuild:SAFETY] PURGED SENSITIVE FILE FROM DIST: ${entry.name}`);
      }
    }
  }
}
auditDistDir(distDir);

// 3. If in public mode without media approval, remove student media from dist/assets
if (publicationMode === 'public' && !studentMediaConsentApproved) {
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const studentMediaFilenames = [
      'aktiviti-maahad.webp',
      'aktiviti-tarbiah.webp',
      'anugerah.webp',
      'belajar-halaqah.webp',
      'hero-kelas.webp',
      'kelas-2.webp',
      'kelas-akademik.webp',
      'kemahiran-tvet.webp',
      'kemasyarakatan.webp',
      'keselamatan.webp',
      'lawatan-ilmu.webp',
      'lawatan.webp',
      'majlis-ilmu.webp',
      'outdoor.webp',
      'pengiktirafan.webp',
      'rehlah-2.webp',
      'rehlah-pelajar.webp',
      'seminar.webp',
      'sijil.webp',
      'sukan-pelajar.webp',
      'video-intro.webp',
      'video-nasyid.webp',
      'intro-madum.mp4',
      'nasyid-pelajar.mp4'
    ];
    for (const file of studentMediaFilenames) {
      const p = path.join(assetsDir, file);
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        console.log(`[postbuild:SAFETY] Purged unapproved student media: ${file}`);
      }
    }
  }
}

// 4. Configure robots.txt and sitemap based on publicationMode
const robotsPath = path.join(distDir, 'robots.txt');
if (publicationMode === 'internal') {
  fs.writeFileSync(robotsPath, '# Internal Review / Staging - Do not index\nUser-agent: *\nDisallow: /\n', 'utf-8');
  console.log('[postbuild] Configured robots.txt with Disallow: /');
} else {
  fs.writeFileSync(
    robotsPath,
    '# Public Production\nUser-agent: *\nAllow: /\n\nSitemap: https://madum.ilmuniaga.com/sitemap.xml\n',
    'utf-8'
  );
  console.log('[postbuild] Configured public robots.txt with sitemap reference');
}

console.log('[postbuild] Post-build completed successfully.\n');
