import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { auditPreviewOutput } from './lib/previewAssets.mjs';

const base = (process.env.QA_BASE || '').replace(/\/$/, '');
const dist = path.resolve('dist');
const checks = [];
const test = (name, fn) => {
  try { fn(); checks.push({ name, passed: true }); }
  catch (err) { checks.push({ name, passed: false, reason: err.message }); }
};
const htmls = [];
const walk = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) walk(file);
    else if (file.endsWith('.html')) htmls.push(file);
  }
};
walk(dist);
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#38;', '&');
function target(url, current) {
  const u = new URL(decode(url), `https://preview.invalid${current}`);
  if (u.origin !== 'https://preview.invalid') return null;
  assert.ok(!base || u.pathname.startsWith(base + '/'), `Unprefixed subpath URL: ${url}`);
  let file = path.resolve(dist, '.' + (u.pathname.slice(base.length) || '/'));
  assert.ok(file === dist || file.startsWith(dist + path.sep), 'Path escaped dist');
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  assert.ok(fs.existsSync(file), `Missing target ${url}`);
  if (u.hash) assert.ok(fs.readFileSync(file, 'utf8').includes(`id="${decodeURIComponent(u.hash.slice(1))}"`), `Missing anchor ${url}`);
  return file;
}
test('Exact safe-preview hashes and media policy', () => auditPreviewOutput(dist));
for (const file of htmls) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const current = `${base}/${relative.replace(/index\.html$/, '')}`;
  const html = fs.readFileSync(file, 'utf8');
  test(`${relative}: metadata and held contact/Form`, () => {
    assert.match(html, /noindex, nofollow/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(html, /href="(?:https:\/\/(?:wa\.me|forms\.gle|docs\.google\.com\/forms)|tel:|mailto:)/);
    assert.doesNotMatch(html, /\bautoplay\b/);
  });
  test(`${relative}: all internal links, anchors and assets exist`, () => {
    for (const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
      if (!match[1].startsWith('#') && !/^(?:https?:)?\//.test(match[1])) continue;
      target(match[1], current);
    }
    for (const set of html.matchAll(/\bsrcset="([^"]+)"/g)) {
      for (const candidate of set[1].split(',')) target(candidate.trim().split(/\s+/)[0], current);
    }
  });
  test(`${relative}: image alternatives and dimensions`, () => {
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image[0], /\balt="[^"]*"/);
      for (const attr of ['width', 'height']) assert.match(image[0], new RegExp(`\\b${attr}="[^" ]`));
    }
  });
}
const gallery = fs.readFileSync(path.join(dist, 'galeri/index.html'), 'utf8');
test('Six client alumni profiles and one verbatim attributed testimonial', () => {
  assert.equal((gallery.match(/class="alumni-card"/g) || []).length, 6);
  for (const name of ['Sharifah Umairah binti Sayyid Anwar', 'Insyirah binti Ulwi', 'Nurul Wafa bt Tajul Ariffin', 'Nur Zulaikha Suffiah bt Mohammad Zaini', 'Putri Balqis', 'Nor Balqis Maisara binti Mohd Yassin']) assert.ok(gallery.includes(name));
  assert.equal((gallery.match(/class="alumni-testimonial"/g) || []).length, 1);
  assert.ok(gallery.includes('Alhamdulillah, Darul Muthiah banyak mendidik saya bukan sahaja dalam hafazan Al-Quran, tetapi juga dalam membentuk akhlak dan disiplin diri. Ilmu dan kenangan di sini akan sentiasa terpahat di hati. Terima kasih Puan Pengetua dan semua tenaga pengajar.'));
  assert.doesNotMatch(gallery, /portrait-000002/); // Do not guess a photo identity.
});
test('All real release approvals remain false and publication stays internal', () => {
  const config = JSON.parse(fs.readFileSync('src/content/siteConfig.json', 'utf8'));
  assert.equal(config.publicationMode, 'internal');
  assert.ok(Object.values(config.releaseApprovals).every(v => v === false));
  assert.ok(Object.values(JSON.parse(fs.readFileSync('src/content/phase3Review.json', 'utf8'))).every(v => v === false));
});
const passed = checks.every(c => c.passed);
const report = { kind: 'static integrity; no browser or performance measurements', base, htmlFiles: htmls.length, checks, passed };
fs.mkdirSync('docs/qa', { recursive: true });
fs.writeFileSync(`docs/qa/phase3-static${base ? '-pages' : ''}.json`, JSON.stringify(report, null, 2) + '\n');
for (const c of checks.filter(c => !c.passed)) console.error(c.name, c.reason);
console.log(`Static integrity ${passed ? 'PASSED' : 'FAILED'}: ${checks.filter(c => c.passed).length}/${checks.length}`);
if (!passed) process.exitCode = 1;
