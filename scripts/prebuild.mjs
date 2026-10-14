import fs from 'node:fs';
import path from 'node:path';

console.log('[prebuild] Starting pre-build validation & publication safety checks...');

// Read siteConfig.ts content directly to inspect publicationMode and releaseApprovals
const siteConfigPath = path.resolve('src/content/siteConfig.ts');
const siteConfigCode = fs.readFileSync(siteConfigPath, 'utf-8');

const isPublicMatch = siteConfigCode.match(/publicationMode:\s*['"](internal|public)['"]/);
const publicationMode = isPublicMatch ? isPublicMatch[1] : 'internal';

const feesApproved = /feesApproved:\s*true/.test(siteConfigCode);
const historyApproved = /historyApproved:\s*true/.test(siteConfigCode);
const studentMediaConsentApproved = /studentMediaConsentApproved:\s*true/.test(siteConfigCode);
const officialContactApproved = /officialContactApproved:\s*true/.test(siteConfigCode);
const jaisUsageApproved = /jaisUsageApproved:\s*true/.test(siteConfigCode);

console.log(`[prebuild] Active publicationMode: '${publicationMode}'`);

if (publicationMode === 'public') {
  const pendingBlockers = [];
  if (!feesApproved) pendingBlockers.push('feesApproved (Jadual & kadar yuran pengajian rasmi belum diluluskan)');
  if (!historyApproved) pendingBlockers.push('historyApproved (Kronologi penubuhan institusi belum disahkan)');
  if (!studentMediaConsentApproved) pendingBlockers.push('studentMediaConsentApproved (Persetujuan bertulis/parental consent media pelajar bawah umur belum disahkan)');
  if (!officialContactApproved) pendingBlockers.push('officialContactApproved (Saluran rasmi WhatsApp/telefon/emel belum disahkan)');
  if (!jaisUsageApproved) pendingBlockers.push('jaisUsageApproved (Kebenaran penggunaan perakuan JAIS/LZS belum disahkan)');

  if (pendingBlockers.length > 0) {
    console.error('\n' + '='.repeat(78));
    console.error('❌ FATAL RELEASE BLOCKER: PUBLIC PRODUCTION BUILD REJECTED (FAIL-CLOSED)');
    console.error('='.repeat(78));
    console.error('Build pengeluaran awam (public mode) DITOLAK kerana sekatan pelepasan berikut:');
    pendingBlockers.forEach((b, idx) => console.error(`  ${idx + 1}. [BLOCKER] ${b}`));
    console.error('\nSebab: Sesuai dengan dasar keselamatan penerbitan MADUM, website dilarang');
    console.error('dipublikasikan ke khalayak umum tanpa kelulusan institusi yang lengkap.');
    console.error('\nUntuk menjana build pratonton Owner Review secara selamat, kekalkan:');
    console.error("  siteConfig.publicationMode = 'internal'");
    console.error('='.repeat(78) + '\n');
    process.exit(1);
  }
}

// Check public/ directory for accidental leak of client PDFs or internal raw assets
const publicDir = path.resolve('public');
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir, { recursive: true });
  const forbiddenFiles = publicFiles.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === '.pdf' || ext === '.zip' || ext === '.doc' || ext === '.docx' || /00000124/.test(f);
  });

  if (forbiddenFiles.length > 0) {
    console.error('\n❌ FATAL PRIVACY LEAK DETECTED IN public/ DIRECTORY:');
    forbiddenFiles.forEach(f => console.error(`  - Found forbidden sensitive file: ${f}`));
    console.error('Build dibatalkan untuk mengelakkan kebocoran dokumen PDF/klien.\n');
    process.exit(1);
  }
}

console.log('[prebuild] ✓ Privacy audit passed: No PDF, ZIP or internal client documents in public/');
console.log(`[prebuild] ✓ Build mode '${publicationMode}' validated successfully.\n`);
