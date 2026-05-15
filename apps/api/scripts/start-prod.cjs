/**
 * Production entry when the platform runs `pnpm start` without a prior build
 * (e.g. Railway custom start command). Skips build if dist/main.js already exists
 * (Dockerfile image build).
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const apiRoot = path.join(__dirname, '..');
const mainJs = path.join(apiRoot, 'dist', 'main.js');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: apiRoot,
    shell: process.platform === 'win32',
    ...options,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!fs.existsSync(mainJs)) {
  console.log('[start-prod] dist/main.js missing — running nest build…');
  for (const stale of [
    path.join(apiRoot, 'tsconfig.build.tsbuildinfo'),
    path.join(apiRoot, 'dist', '.tsbuildinfo'),
  ]) {
    if (fs.existsSync(stale)) fs.unlinkSync(stale);
  }
  run('pnpm', ['run', 'build']);
  if (!fs.existsSync(mainJs)) {
    console.error('[start-prod] Build finished but dist/main.js is still missing.');
    process.exit(1);
  }
}

run('node', ['dist/main.js']);
