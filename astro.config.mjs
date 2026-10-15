import { defineConfig } from 'astro/config';
import { runPrebuildChecks } from './scripts/lib/runPrebuildChecks.mjs';
import { runPostbuildTasks } from './scripts/lib/runPostbuildTasks.mjs';

/**
 * Astro integration ensuring the safety gatekeeper cannot be bypassed,
 * even when `astro build` is invoked directly outside npm lifecycle scripts.
 */
function madumReleaseGateIntegration() {
  return {
    name: 'madum-release-gate',
    hooks: {
      'astro:config:setup': () => {
        // Enforce prebuild release gate checks within Astro core pipeline
        runPrebuildChecks();
      },
      'astro:build:done': ({ dir }) => {
        // Enforce postbuild verification, robots.txt, and sitemap generation
        runPostbuildTasks(dir);
      }
    }
  };
}

const isGitHubPages = Boolean(process.env.GITHUB_ACTIONS && !process.env.CUSTOM_DOMAIN);
const site = process.env.ASTRO_SITE || (isGitHubPages ? 'https://naufalnab.github.io' : 'https://madum.ilmuniaga.com');
const base = process.env.ASTRO_BASE || (isGitHubPages ? '/darul-muthiah-site' : '/');

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: 'static',
  build: {
    format: 'directory'
  },
  integrations: [madumReleaseGateIntegration()]
});
