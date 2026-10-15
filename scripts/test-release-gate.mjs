import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const CONFIG_PATH = path.resolve('src/content/siteConfig.json');
const DIST_PATH = path.resolve('dist');

// Read and backup the production baseline configuration
if (!fs.existsSync(CONFIG_PATH)) {
  console.error(`FATAL: Configuration not found at ${CONFIG_PATH}`);
  process.exit(1);
}
const baselineConfigRaw = fs.readFileSync(CONFIG_PATH, 'utf-8');
const baselineConfig = JSON.parse(baselineConfigRaw);

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  process.stdout.write(`[TEST ${totalTests}] ${name} ... `);
  try {
    fn();
    console.log('✅ PASSED');
    passedTests++;
  } catch (err) {
    console.log('❌ FAILED');
    console.error(`   ${err.message}`);
  }
}

function writeTestConfig(configObj) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configObj, null, 2), 'utf-8');
}

function runFullBuild() {
  return execSync('pnpm run build', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
}

function runDirectAstroBuild() {
  return execSync('pnpm exec astro build', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
}

console.log('\n=== RUNNING FULL-BUILD RELEASE SAFETY GATE REGRESSION SUITE ===\n');

try {
  // 1. Internal + approvals false -> full build berhasil, noindex, Disallow, tanpa sitemap
  runTest('1. Internal + approvals false -> Full build SUCCEEDS, Disallow: /, no sitemap', () => {
    writeTestConfig({
      ...baselineConfig,
      publicationMode: 'internal',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: false,
        studentMediaConsentApproved: false,
        officialContactApproved: false,
        jaisUsageApproved: false
      }
    });

    const output = runFullBuild();
    if (!output.includes("Build mode 'internal' validated successfully")) {
      throw new Error(`Expected internal validation message missing. Output:\n${output}`);
    }

    const robotsPath = path.join(DIST_PATH, 'robots.txt');
    const sitemapPath = path.join(DIST_PATH, 'sitemap.xml');

    if (!fs.existsSync(robotsPath)) {
      throw new Error('dist/robots.txt was not generated.');
    }
    const robots = fs.readFileSync(robotsPath, 'utf-8');
    if (!robots.includes('Disallow: /')) {
      throw new Error(`robots.txt must contain Disallow: / in internal mode:\n${robots}`);
    }
    if (robots.includes('Sitemap:')) {
      throw new Error(`robots.txt must NOT reference sitemap in internal mode:\n${robots}`);
    }
    if (fs.existsSync(sitemapPath)) {
      throw new Error('dist/sitemap.xml must NOT exist during internal mode.');
    }
  });

  // 2. Public + approvals false -> full build gagal
  runTest('2. Public + all approvals false -> Full build FAILS (fail-closed exit non-zero)', () => {
    writeTestConfig({
      ...baselineConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: false,
        studentMediaConsentApproved: false,
        officialContactApproved: false,
        jaisUsageApproved: false
      }
    });

    let failed = false;
    try {
      runFullBuild();
    } catch (err) {
      failed = true;
      const combined = (err.stdout || '') + (err.stderr || '');
      if (!combined.includes('FATAL RELEASE BLOCKER')) {
        throw new Error(`Expected FATAL RELEASE BLOCKER missing. Output:\n${combined}`);
      }
    }
    if (!failed) {
      throw new Error('Full build should have failed with exit code non-zero, but succeeded.');
    }
  });

  // 3. Public + satu approval false -> full build gagal
  runTest('3. Public + one approval false (feesApproved: false) -> Full build FAILS', () => {
    writeTestConfig({
      ...baselineConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: true,
        studentMediaConsentApproved: true,
        officialContactApproved: true,
        jaisUsageApproved: true
      }
    });

    let failed = false;
    try {
      runFullBuild();
    } catch (err) {
      failed = true;
      const combined = (err.stdout || '') + (err.stderr || '');
      if (!combined.includes('feesApproved')) {
        throw new Error(`Expected blocker for feesApproved missing. Output:\n${combined}`);
      }
      if (combined.includes('historyApproved (')) {
        throw new Error(`historyApproved should not be in blockers since it was true.`);
      }
    }
    if (!failed) {
      throw new Error('Full build should have failed when 1 approval is false.');
    }
  });

  // 4. Public + seluruh approval true dalam fixture -> full build berhasil, sitemap dan metadata publik konsisten
  runTest('4. Public + all approvals true -> Full build SUCCEEDS, sitemap.xml generated & public robots.txt', () => {
    writeTestConfig({
      ...baselineConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: true,
        historyApproved: true,
        studentMediaConsentApproved: true,
        officialContactApproved: true,
        jaisUsageApproved: true
      }
    });

    const output = runFullBuild();
    if (!output.includes("Build mode 'public' validated successfully")) {
      throw new Error(`Expected public validation message missing. Output:\n${output}`);
    }

    const robotsPath = path.join(DIST_PATH, 'robots.txt');
    const sitemapPath = path.join(DIST_PATH, 'sitemap.xml');

    if (!fs.existsSync(robotsPath)) {
      throw new Error('dist/robots.txt was not generated.');
    }
    const robots = fs.readFileSync(robotsPath, 'utf-8');
    if (!robots.includes('Allow: /') || !robots.includes('Sitemap: https://madum.ilmuniaga.com/sitemap.xml')) {
      throw new Error(`robots.txt must contain Allow: / and Sitemap in public mode:\n${robots}`);
    }

    if (!fs.existsSync(sitemapPath)) {
      throw new Error('dist/sitemap.xml was not created during public build.');
    }
    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    const expectedRoutes = [
      'https://madum.ilmuniaga.com',
      'https://madum.ilmuniaga.com/profil',
      'https://madum.ilmuniaga.com/pengajian',
      'https://madum.ilmuniaga.com/kemasukan',
      'https://madum.ilmuniaga.com/galeri',
      'https://madum.ilmuniaga.com/hubungi'
    ];
    for (const r of expectedRoutes) {
      if (!sitemap.includes(`<loc>${r}</loc>`)) {
        throw new Error(`sitemap.xml missing route ${r}:\n${sitemap}`);
      }
    }
  });

  // 5. JSON hilang/rusak -> full build gagal
  runTest('5A. Config file missing -> Full build FAILS', () => {
    const tempBackup = CONFIG_PATH + '.bak';
    fs.renameSync(CONFIG_PATH, tempBackup);
    let failed = false;
    try {
      runFullBuild();
    } catch {
      failed = true;
    } finally {
      if (fs.existsSync(tempBackup)) {
        fs.renameSync(tempBackup, CONFIG_PATH);
      }
    }
    if (!failed) {
      throw new Error('Full build should have failed when config file is missing.');
    }
  });

  runTest('5B. Corrupted / malformed JSON -> Full build FAILS', () => {
    fs.writeFileSync(CONFIG_PATH, '{\n  "publicationMode": "internal",\n  badJsonSyntax\n}', 'utf-8');
    let failed = false;
    try {
      runFullBuild();
    } catch {
      failed = true;
    }
    if (!failed) {
      throw new Error('Full build should have failed when config JSON is corrupted.');
    }
  });

  // 6. Override atau ketidaksesuaian konfigurasi -> tidak dapat melewati release gate
  runTest('6A. Invalid / unknown publicationMode (e.g. "staging") -> Full build FAILS', () => {
    writeTestConfig({
      ...baselineConfig,
      publicationMode: 'staging'
    });
    let failed = false;
    try {
      runFullBuild();
    } catch (err) {
      failed = true;
      const combined = (err.stdout || '') + (err.stderr || '');
      if (!combined.includes("'publicationMode' tidak sah")) {
        throw new Error(`Expected invalid publicationMode message. Output:\n${combined}`);
      }
    }
    if (!failed) {
      throw new Error('Full build should have failed for invalid publicationMode.');
    }
  });

  runTest('6B. Non-boolean approval value -> Full build FAILS', () => {
    writeTestConfig({
      ...baselineConfig,
      releaseApprovals: {
        ...baselineConfig.releaseApprovals,
        feesApproved: 'true' // String instead of boolean
      }
    });
    let failed = false;
    try {
      runFullBuild();
    } catch {
      failed = true;
    }
    if (!failed) {
      throw new Error('Full build should have failed when approval is non-boolean.');
    }
  });

  runTest('6C. Attempting environment variable bypass (MADUM_CONFIG_PATH) -> Strictly IGNORED', () => {
    // Write public config without approvals into siteConfig.json
    writeTestConfig({
      ...baselineConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: false,
        studentMediaConsentApproved: false,
        officialContactApproved: false,
        jaisUsageApproved: false
      }
    });

    // Create a rogue fake config file in tmp with internal mode
    const fakePath = '/tmp/fake-internal-override.json';
    fs.writeFileSync(fakePath, JSON.stringify({ ...baselineConfig, publicationMode: 'internal' }));

    let failed = false;
    try {
      execSync('pnpm run build', {
        env: { ...process.env, MADUM_CONFIG_PATH: fakePath },
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    } catch (err) {
      failed = true;
      const combined = (err.stdout || '') + (err.stderr || '');
      if (!combined.includes('FATAL RELEASE BLOCKER')) {
        throw new Error(`Expected blocker. Output:\n${combined}`);
      }
    } finally {
      if (fs.existsSync(fakePath)) fs.unlinkSync(fakePath);
    }

    if (!failed) {
      throw new Error('Build bypassed gate via environment variable override! Must strictly fail.');
    }
  });

  // 7. Menjalankan Astro build langsung -> tetap menerapkan pengamanan yang diperlukan
  runTest('7. Direct `astro build` command (outside npm lifecycle) -> STILL ENFORCES RELEASE GATE', () => {
    // Configure public mode without approvals
    writeTestConfig({
      ...baselineConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: false,
        studentMediaConsentApproved: false,
        officialContactApproved: false,
        jaisUsageApproved: false
      }
    });

    let directBuildFailed = false;
    try {
      // Execute direct astro build without running pnpm run build (bypassing prebuild npm script)
      runDirectAstroBuild();
    } catch (err) {
      directBuildFailed = true;
      const combined = (err.stdout || '') + (err.stderr || '');
      if (!combined.includes('FATAL RELEASE BLOCKER') && !combined.includes('[RELEASE_BLOCKER]')) {
        throw new Error(`Direct astro build failed without expected blocker message. Output:\n${combined}`);
      }
    }

    if (!directBuildFailed) {
      throw new Error('Direct astro build bypassed release gate! Astro integration failed to abort.');
    }
  });

} finally {
  // CRITICAL CLEANUP: ALWAYS restore baseline production configuration
  fs.writeFileSync(CONFIG_PATH, baselineConfigRaw, 'utf-8');

  // Verify baseline configuration is restored to internal mode with all approvals false
  const restoredConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const isInternal = restoredConfig.publicationMode === 'internal';
  const allApprovalsFalse = Object.values(restoredConfig.releaseApprovals).every(v => v === false);

  if (!isInternal || !allApprovalsFalse) {
    console.error('FATAL: Failed to restore baseline configuration!');
    process.exit(1);
  }

  // Run a final clean build to ensure dist/ is restored to internal state
  try {
    runFullBuild();
    console.log('\n[CLEANUP] Workspace and dist/ successfully restored to baseline internal preview mode.');
  } catch (err) {
    console.error('[CLEANUP:ERROR] Final restoration build failed:', err.message);
  }
}

console.log(`\n=== REGRESSION SUITE RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
