import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const phase3Assets = JSON.parse(fs.readFileSync(new URL('./phase3PreviewAssets.json', import.meta.url), 'utf8'));

// Content hashes prevent an approved filename from being replaced with a pupil photo.
export const previewAssets = {
  ...phase3Assets,
  'assets/logo-madum.webp': '7c206c30f264a25c94985a2f5e0436c99320c1dec2b70c738004a4795aee6d73',
  'assets/preview-placeholder.svg': '69116b18679adad4e2ac3061be18c9c65b4cbce65d01047763abd4065e6fb1a5',
};
export const digest = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

// Astro serves/copies only this derived directory. Original public/ is never changed.
export function preparePreviewAssets() {
  const target = path.resolve('.astro/safe-public');
  fs.rmSync(target, { recursive: true, force: true });
  for (const [relative, expected] of Object.entries(previewAssets)) {
    const source = path.resolve('public', relative);
    if (!fs.existsSync(source) || fs.lstatSync(source).isSymbolicLink() || digest(source) !== expected) {
      throw new Error(`[PRIVACY_LEAK] Preview asset missing or changed: ${relative}. Editorial review required.`);
    }
    fs.mkdirSync(path.dirname(path.join(target, relative)), { recursive: true });
    fs.copyFileSync(source, path.join(target, relative));
  }
  fs.writeFileSync(path.join(target, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  return target;
}

export function auditPreviewOutput(dir) {
  const walk = folder => fs.readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(folder, entry.name);
    if (entry.isSymbolicLink()) throw new Error('[PRIVACY_LEAK] Symlink in output');
    return entry.isDirectory() ? walk(file) : [file];
  });
  for (const file of walk(dir)) {
    const relative = path.relative(dir, file).split(path.sep).join('/');
    if (Object.hasOwn(previewAssets, relative)) {
      if (digest(file) !== previewAssets[relative]) throw new Error(`[PRIVACY_LEAK] Changed approved asset: ${relative}`);
    } else if (!(relative.endsWith('.html') || relative === 'robots.txt' || /^_astro\/[\w.-]+\.(css|js)$/.test(relative))) {
      // Includes unknown nested photos, videos, documents, archives, JSON and source maps.
      throw new Error(`[PRIVACY_LEAK] Unreviewed output asset: ${relative}`);
    }
    if (/\.(html|css|js)$/.test(relative)) {
      const content = fs.readFileSync(file, 'utf8');
      // Only exact reviewed local URLs may occur in media-bearing attributes.
      // Responsive <picture>/<source> is permitted; arbitrary URLs, data URIs,
      // CSS media references, active video and embedded documents still fail closed.
      const approvedUrl = url => Object.keys(previewAssets).some(asset =>
        url === `/${asset}` || (url.startsWith('/') && url.endsWith(`/${asset}`) &&
          /^\/(?:[a-z0-9_-]+\/)+assets\//i.test(url)));
      if (relative.endsWith('.html')) {
        if (/<(?:video|audio|iframe|object|embed)\b/i.test(content)) {
          throw new Error(`[PRIVACY_LEAK] Unreviewed media element: ${relative}`);
        }
        for (const tag of content.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
          let hasSource = false;
          for (const attr of tag[0].matchAll(/\b(src|srcset)="([^"]+)"/gi)) {
            hasSource = true;
            const urls = attr[1].toLowerCase() === 'srcset'
              ? attr[2].split(',').map(candidate => candidate.trim().split(/\s+/)[0])
              : [attr[2]];
            if (!urls.every(approvedUrl)) throw new Error(`[PRIVACY_LEAK] Unreviewed image URL: ${relative}`);
          }
          if (!hasSource) throw new Error(`[PRIVACY_LEAK] Media element without reviewed source: ${relative}`);
        }
      }
      let references = content;
      for (const asset of Object.keys(previewAssets)) references = references.replaceAll(asset, 'reviewed-asset');
      if (/data:(?:image|video|audio)\//i.test(content) || /\.(?:webp|mp4|jpe?g|png)(?:["'?#\s<),]|$)/i.test(references)) {
        throw new Error(`[PRIVACY_LEAK] Unreviewed media reference or embedded media: ${relative}`);
      }
    }
  }
  console.log('[postbuild] Preview allowlist and content hashes verified.');
}
