import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const FIXTURES_DIR = path.resolve('tmp/test-fixtures');
fs.mkdirSync(FIXTURES_DIR, { recursive: true });

// Read the baseline real configuration to clone as base fixture
const baseConfigPath = path.resolve('src/content/siteConfig.json');
const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf-8'));

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  process.stdout.write(`[TEST ${totalTests}] ${name} ... `);
  try {
    fn();
    console.log('✅ PASSED');
    passedTests++;
  } catch (err) {
    console.log('❌ FAILED');
    console.error(`   Error: ${err.message}`);
  }
}

function runPrebuildWithConfig(configPath) {
  return execSync(`node scripts/prebuild.mjs`, {
    env: { ...process.env, MADUM_CONFIG_PATH: configPath },
    encoding: 'utf-8',
    stdio: 'pipe'
  });
}

function runPostbuildWithConfig(configPath) {
  return execSync(`node scripts/postbuild.mjs`, {
    env: { ...process.env, MADUM_CONFIG_PATH: configPath },
    encoding: 'utf-8',
    stdio: 'pipe'
  });
}

console.log('\n=== RUNNING RELEASE SAFETY GATE REGRESSION TESTS ===\n');

try {
  // 1. Mode internal dengan approval false: berhasil untuk local preview
  runTest('Case 1: Mode internal with all approvals false -> SUCCEEDS for local preview', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'case1-internal.json');
    const cfg = {
      ...baseConfig,
      publicationMode: 'internal',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: false,
        studentMediaConsentApproved: false,
        officialContactApproved: false,
        jaisUsageApproved: false
      }
    };
    fs.writeFileSync(fixturePath, JSON.stringify(cfg, null, 2));

    const stdout = runPrebuildWithConfig(fixturePath);
    if (!stdout.includes("Build mode 'internal' validated successfully")) {
      throw new Error(`Expected success message not found. Output:\n${stdout}`);
    }
  });

  // 2. Mode public dengan semua approval false: build gagal (exit non-zero)
  runTest('Case 2: Mode public with all approvals false -> FAILS (fail-closed)', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'case2-public-all-false.json');
    const cfg = {
      ...baseConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: false,
        studentMediaConsentApproved: false,
        officialContactApproved: false,
        jaisUsageApproved: false
      }
    };
    fs.writeFileSync(fixturePath, JSON.stringify(cfg, null, 2));

    let failedAsExpected = false;
    try {
      runPrebuildWithConfig(fixturePath);
    } catch (err) {
      failedAsExpected = true;
      if (!err.stderr.includes('FATAL RELEASE BLOCKER') && !err.stdout.includes('FATAL RELEASE BLOCKER')) {
        throw new Error(`Expected blocker message missing. Stderr:\n${err.stderr}`);
      }
    }
    if (!failedAsExpected) {
      throw new Error('Prebuild should have failed with exit code 1, but succeeded.');
    }
  });

  // 3. Mode public dengan satu approval false: build gagal (exit non-zero)
  runTest('Case 3: Mode public with one approval false (feesApproved: false) -> FAILS', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'case3-public-one-false.json');
    const cfg = {
      ...baseConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: false, // Only this one is false
        historyApproved: true,
        studentMediaConsentApproved: true,
        officialContactApproved: true,
        jaisUsageApproved: true
      }
    };
    fs.writeFileSync(fixturePath, JSON.stringify(cfg, null, 2));

    let failedAsExpected = false;
    try {
      runPrebuildWithConfig(fixturePath);
    } catch (err) {
      failedAsExpected = true;
      const combined = (err.stdout || '') + (err.stderr || '');
      if (!combined.includes('feesApproved')) {
        throw new Error(`Expected blocker for feesApproved missing. Output:\n${combined}`);
      }
      if (combined.includes('historyApproved')) {
        throw new Error(`Should NOT block historyApproved since it was true. Output:\n${combined}`);
      }
    }
    if (!failedAsExpected) {
      throw new Error('Prebuild should have failed when 1 approval is false.');
    }
  });

  // 4. Mode public dengan approval lengkap yang tervalidasi: gate dapat dilalui & sitemap dihasilkan
  runTest('Case 4: Mode public with all approvals true -> PASSES gate and generates sitemap.xml', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'case4-public-all-true.json');
    const cfg = {
      ...baseConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: true,
        historyApproved: true,
        studentMediaConsentApproved: true,
        officialContactApproved: true,
        jaisUsageApproved: true
      }
    };
    fs.writeFileSync(fixturePath, JSON.stringify(cfg, null, 2));

    // Prebuild must succeed
    const preOut = runPrebuildWithConfig(fixturePath);
    if (!preOut.includes("Build mode 'public' validated successfully")) {
      throw new Error(`Prebuild failed for fully approved public config. Output:\n${preOut}`);
    }

    // Postbuild must generate sitemap.xml and configure public robots.txt
    const postOut = runPostbuildWithConfig(fixturePath);
    const distSitemap = path.resolve('dist/sitemap.xml');
    const distRobots = path.resolve('dist/robots.txt');

    if (!fs.existsSync(distSitemap)) {
      throw new Error('dist/sitemap.xml was not created during public postbuild.');
    }

    const sitemapContent = fs.readFileSync(distSitemap, 'utf-8');
    if (!sitemapContent.includes('https://madum.ilmuniaga.com/profil') || !sitemapContent.includes('https://madum.ilmuniaga.com/kemasukan')) {
      throw new Error(`sitemap.xml does not contain expected routes:\n${sitemapContent}`);
    }

    const robotsContent = fs.readFileSync(distRobots, 'utf-8');
    if (!robotsContent.includes('Allow: /') || !robotsContent.includes('Sitemap: https://madum.ilmuniaga.com/sitemap.xml')) {
      throw new Error(`robots.txt does not have public configuration:\n${robotsContent}`);
    }
  });

  // 5. Konfigurasi hilang atau tidak valid: build gagal
  runTest('Case 5A: Missing config file -> FAILS', () => {
    let failed = false;
    try {
      runPrebuildWithConfig(path.join(FIXTURES_DIR, 'non-existent.json'));
    } catch {
      failed = true;
    }
    if (!failed) throw new Error('Expected failure for missing config.');
  });

  runTest('Case 5B: Corrupted / invalid JSON -> FAILS', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'case5b-corrupt.json');
    fs.writeFileSync(fixturePath, '{ "publicationMode": "internal", invalidJson }');
    let failed = false;
    try {
      runPrebuildWithConfig(fixturePath);
    } catch {
      failed = true;
    }
    if (!failed) throw new Error('Expected failure for corrupted JSON.');
  });

  runTest('Case 5C: Unknown publicationMode (e.g. "staging") -> FAILS', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'case5c-unknown-mode.json');
    const cfg = { ...baseConfig, publicationMode: 'staging' };
    fs.writeFileSync(fixturePath, JSON.stringify(cfg));
    let failed = false;
    try {
      runPrebuildWithConfig(fixturePath);
    } catch {
      failed = true;
    }
    if (!failed) throw new Error('Expected failure for unknown publicationMode.');
  });

  runTest('Case 5D: Non-boolean approval value -> FAILS', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'case5d-bad-approval.json');
    const cfg = {
      ...baseConfig,
      releaseApprovals: { ...baseConfig.releaseApprovals, feesApproved: 'yes' }
    };
    fs.writeFileSync(fixturePath, JSON.stringify(cfg));
    let failed = false;
    try {
      runPrebuildWithConfig(fixturePath);
    } catch {
      failed = true;
    }
    if (!failed) throw new Error('Expected failure for non-boolean approval.');
  });

  // 6. Mengubah hanya nilai runtime tanpa mengubah deklarasi tipe: hasil pembacaan tetap akurat
  runTest('Case 6: Changing only runtime JSON without touching TypeScript types -> Accurate parsing', () => {
    // Verify that the TypeScript interface siteConfig.ts still declares:
    // publicationMode: 'internal' | 'public'
    const tsCode = fs.readFileSync('src/content/siteConfig.ts', 'utf-8');
    if (!tsCode.includes("publicationMode: PublicationMode;") && !tsCode.includes("'internal' | 'public'")) {
      throw new Error("TypeScript interface definition not found in siteConfig.ts");
    }

    // Now test a fixture that sets publicationMode to 'public'
    const fixturePath = path.join(FIXTURES_DIR, 'case6-runtime-public.json');
    const cfg = {
      ...baseConfig,
      publicationMode: 'public',
      releaseApprovals: {
        feesApproved: false,
        historyApproved: false,
        studentMediaConsentApproved: false,
        officialContactApproved: false,
        jaisUsageApproved: false
      }
    };
    fs.writeFileSync(fixturePath, JSON.stringify(cfg));

    // Must strictly detect mode as 'public' and trigger blockers (proves regex was eliminated)
    let caughtBlocker = false;
    try {
      runPrebuildWithConfig(fixturePath);
    } catch (err) {
      const combined = (err.stdout || '') + (err.stderr || '');
      if (combined.includes("Active publicationMode: 'public'") && combined.includes("FATAL RELEASE BLOCKER")) {
        caughtBlocker = true;
      }
    }

    if (!caughtBlocker) {
      throw new Error("System failed to accurately read runtime JSON when types were unchanged.");
    }
  });

} finally {
  // Always clean up fixtures and restore normal internal postbuild
  if (fs.existsSync(FIXTURES_DIR)) {
    fs.rmSync(FIXTURES_DIR, { recursive: true, force: true });
  }

  // Restore normal internal robots.txt and verify sitemap is removed
  runPostbuildWithConfig(baseConfigPath);
  console.log('\n[CLEANUP] Restored baseline internal preview configuration.');
}

console.log(`\n=== REGRESSION SUITE RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
