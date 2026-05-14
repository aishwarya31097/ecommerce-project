/**
 * Loads apps/api/.env over existing process.env so a shell-level DATABASE_URL=""
 * (common on Windows) does not win over the real mysql:// URL in .env.
 */
const path = require('path');
const { spawnSync } = require('child_process');

const apiRoot = path.join(__dirname, '..');

require('dotenv').config({
  path: path.join(apiRoot, '.env'),
  override: true,
});

const result = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  cwd: apiRoot,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
