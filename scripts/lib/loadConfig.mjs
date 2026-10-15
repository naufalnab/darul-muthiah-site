import fs from 'node:fs';
import path from 'node:path';

/**
 * Loads, parses, and strictly validates site configuration from JSON.
 * Replaces all brittle regex-based parsing with deterministic structured validation.
 *
 * @param {string} [customPath] Optional custom path for regression testing with fixtures
 * @returns {object} The validated configuration object
 */
export function loadAndValidateConfig(customPath = null) {
  const configPath = customPath ? path.resolve(customPath) : path.resolve('src/content/siteConfig.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`[CONFIG_ERROR] Fail konfigurasi tidak dijumpai di: ${configPath}`);
  }

  let raw;
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    raw = JSON.parse(content);
  } catch (err) {
    throw new Error(`[CONFIG_ERROR] Gagal menghuraikan JSON konfigurasi (${configPath}): ${err.message}`);
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`[CONFIG_ERROR] Format konfigurasi tidak sah: Mesti merupakan JSON Object.`);
  }

  // 1. Strict validation of publicationMode
  const validModes = ['internal', 'public'];
  if (!raw.publicationMode || typeof raw.publicationMode !== 'string' || !validModes.includes(raw.publicationMode)) {
    throw new Error(
      `[CONFIG_ERROR] 'publicationMode' tidak sah atau hilang: '${raw.publicationMode}'. Nilai yang dibenarkan hanyalah 'internal' atau 'public'.`
    );
  }

  // 2. Strict validation of releaseApprovals
  const requiredApprovals = [
    'feesApproved',
    'historyApproved',
    'studentMediaConsentApproved',
    'officialContactApproved',
    'jaisUsageApproved'
  ];

  if (!raw.releaseApprovals || typeof raw.releaseApprovals !== 'object' || Array.isArray(raw.releaseApprovals)) {
    throw new Error(`[CONFIG_ERROR] Objek 'releaseApprovals' hilang atau bukan sebuah objek.`);
  }

  for (const key of requiredApprovals) {
    if (typeof raw.releaseApprovals[key] !== 'boolean') {
      throw new Error(`[CONFIG_ERROR] Sekatan pelepasan 'releaseApprovals.${key}' mesti bernilai boolean (true/false).`);
    }
  }

  // 3. Validation of URL & critical identity fields
  if (!raw.canonicalBase || typeof raw.canonicalBase !== 'string' || !raw.canonicalBase.startsWith('http')) {
    throw new Error(`[CONFIG_ERROR] 'canonicalBase' tidak sah: Mesti merupakan URL http/https yang lengkap.`);
  }

  if (!raw.brandName || typeof raw.brandName !== 'string') {
    throw new Error(`[CONFIG_ERROR] 'brandName' hilang atau tidak sah.`);
  }

  return raw;
}
