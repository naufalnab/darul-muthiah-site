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

// https://astro.build/config
export default defineConfig({
  site: 'https://madum.ilmuniaga.com',
  output: 'static',
  build: {
    format: 'directory'
  },
  integrations: [madumReleaseGateIntegration()]
});
