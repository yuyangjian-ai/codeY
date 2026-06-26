#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const binDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(binDir, '..');
const tsxCli = path.join(projectRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const entry = path.join(projectRoot, 'codeY.ts');

const child = spawn(process.execPath, [tsxCli, entry, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(error.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
