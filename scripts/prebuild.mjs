import { runPrebuildChecks } from './lib/runPrebuildChecks.mjs';

try {
  runPrebuildChecks();
} catch (err) {
  process.exit(1);
}
