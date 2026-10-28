import { auditPreviewOutput } from './previewAssets.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAndValidateConfig } from './loadConfig.mjs';

/**
 * Executes postbuild tasks including fallback routes, dist directory audit,
 * robots.txt configuration, and dynamic sitemap.xml generation.
 *
 * @param {string|URL} [distDirInput] Optional output directory
 */
export function runPostbuildTasks(distDirInput = null) {
  let distDir;
  if (distDirInput) {
    distDir = distDirInput instanceof URL || (typeof distDirInput === 'string' && distDirInput.startsWith('file:'))
      ? fileURLToPath(distDirInput)
      : path.resolve(distDirInput);
  } else {
    distDir = path.resolve('dist');
  }

  let siteConfig;
  try {
    siteConfig = loadAndValidateConfig();
  } catch (err) {
    console.error(`[postbuild:ERROR] ${err.message}`);
    throw err;
  }

  const { publicationMode, releaseApprovals, canonicalBase } = siteConfig;
  const studentMediaConsentApproved = releaseApprovals.studentMediaConsentApproved;

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

  // Assets were selected before Astro copies public files; no source files are deleted.
  // Defense in depth: reject any unreviewed generated binary or embedded media.
  if (!studentMediaConsentApproved) auditPreviewOutput(distDir);

  // 4. Configure robots.txt and sitemap based on publicationMode
  const robotsPath = path.join(distDir, 'robots.txt');
  const sitemapPath = path.join(distDir, 'sitemap.xml');

  if (publicationMode === 'internal') {
    // Disallow all crawlers; never expose sitemap during internal preview
    fs.writeFileSync(robotsPath, '# Internal Review / Staging - Do not index\nUser-agent: *\nDisallow: /\n', 'utf-8');
    if (fs.existsSync(sitemapPath)) {
      fs.unlinkSync(sitemapPath);
    }
    console.log('[postbuild] Configured robots.txt with Disallow: / (Internal mode, no sitemap exposed)');
  } else {
    // Public Production Mode: Generate actual sitemap.xml matching canonicalBase
    const baseUrl = canonicalBase.replace(/\/+$/, '');
    const publicPages = [
      { path: '', priority: '1.0', changefreq: 'weekly' },
      { path: '/profil', priority: '0.8', changefreq: 'monthly' },
      { path: '/pengajian', priority: '0.8', changefreq: 'monthly' },
      { path: '/kemasukan', priority: '0.9', changefreq: 'weekly' },
      { path: '/galeri', priority: '0.7', changefreq: 'monthly' },
      { path: '/hubungi', priority: '0.8', changefreq: 'monthly' }
    ];

    const currentDate = new Date().toISOString().split('T')[0];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPages
  .map(
    p => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>\n`;

    fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
    console.log(`[postbuild] Generated production sitemap.xml with ${publicPages.length} public routes`);

    fs.writeFileSync(
      robotsPath,
      `# Public Production\nUser-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`,
      'utf-8'
    );
  }

  // 5. If building with a subpath base (e.g. /darul-muthiah-site for GitHub Pages),
  // rewrite root-relative links in all generated HTML files to respect the base prefix
  const rawBase = process.env.ASTRO_BASE || (process.env.GITHUB_PAGES ? '/darul-muthiah-site' : '');
  const cleanBase = rawBase ? '/' + rawBase.replace(/^\/+|\/+$/g, '') : '';
  if (cleanBase && cleanBase !== '/') {
    function prefixRelativePaths(dir) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          prefixRelativePaths(fullPath);
        } else if (entry.name.endsWith('.html')) {
          let content = fs.readFileSync(fullPath, 'utf-8');
          // Replace href="/assets/...", src="/assets/...", poster="/assets/..."
          content = content.replace(/(href|src|poster)="\/(assets\/[^"]+)"/g, `$1="${cleanBase}/$2"`);
          // Replace page route hrefs
          content = content.replace(/href="\/(profil|pengajian|kemasukan|galeri|hubungi|404)(\b[^"]*)"/g, `href="${cleanBase}/$1$2"`);
          // Replace home href="/"
          content = content.replace(/href="\/"/g, `href="${cleanBase}/"`);
          fs.writeFileSync(fullPath, content, 'utf-8');
        }
      }
    }
    prefixRelativePaths(distDir);
    console.log(`[postbuild] Rewrote root-relative links for base prefix: '${cleanBase}'`);
  }

  if (!studentMediaConsentApproved) auditPreviewOutput(distDir);

  console.log('[postbuild] Post-build completed successfully.\n');
}
