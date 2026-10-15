import fs from 'node:fs';
import path from 'node:path';
import { loadAndValidateConfig } from './lib/loadConfig.mjs';

console.log('[prebuild] Starting pre-build validation & publication safety checks...');

let siteConfig;
try {
  // Support custom config path via environment variable for automated testing
  const customConfigPath = process.env.MADUM_CONFIG_PATH || null;
  siteConfig = loadAndValidateConfig(customConfigPath);
} catch (err) {
  console.error('\n' + '='.repeat(78));
  console.error('❌ FATAL CONFIGURATION ERROR: BUILD REJECTED');
  console.error('='.repeat(78));
  console.error(err.message);
  console.error('='.repeat(78) + '\n');
  process.exit(1);
}

const { publicationMode, releaseApprovals } = siteConfig;
console.log(`[prebuild] Active publicationMode: '${publicationMode}'`);

if (publicationMode === 'public') {
  const pendingBlockers = [];
  if (!releaseApprovals.feesApproved) {
    pendingBlockers.push('feesApproved (Jadual & kadar yuran pengajian rasmi belum diluluskan)');
  }
  if (!releaseApprovals.historyApproved) {
    pendingBlockers.push('historyApproved (Kronologi penubuhan institusi belum disahkan)');
  }
  if (!releaseApprovals.studentMediaConsentApproved) {
    pendingBlockers.push('studentMediaConsentApproved (Persetujuan bertulis/parental consent media pelajar bawah umur belum disahkan)');
  }
  if (!releaseApprovals.officialContactApproved) {
    pendingBlockers.push('officialContactApproved (Saluran rasmi WhatsApp/telefon/emel belum disahkan)');
  }
  if (!releaseApprovals.jaisUsageApproved) {
    pendingBlockers.push('jaisUsageApproved (Kebenaran penggunaan perakuan JAIS/LZS belum disahkan)');
  }

  if (pendingBlockers.length > 0) {
    console.error('\n' + '='.repeat(78));
    console.error('❌ FATAL RELEASE BLOCKER: PUBLIC PRODUCTION BUILD REJECTED (FAIL-CLOSED)');
    console.error('='.repeat(78));
    console.error('Build pengeluaran awam (public mode) DITOLAK kerana sekatan pelepasan berikut:');
    pendingBlockers.forEach((b, idx) => console.error(`  ${idx + 1}. [BLOCKER] ${b}`));
    console.error('\nSebab: Sesuai dengan dasar keselamatan penerbitan MADUM, website dilarang');
    console.error('dipublikasikan ke khalayak umum tanpa kelulusan institusi yang lengkap.');
    console.error('\nUntuk menjana build pratonton Owner Review secara selamat, kekalkan:');
    console.error("  \"publicationMode\": \"internal\" dalam src/content/siteConfig.json");
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
