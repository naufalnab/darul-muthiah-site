import { runPostbuildTasks } from './lib/runPostbuildTasks.mjs';

try {
  runPostbuildTasks();
} catch (err) {
  process.exit(1);
}
