import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const cliPath = path.join(repoRoot, 'bin/adamant.js');

function runCli(args, t) {
  const configDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'adamant-console-test-'),
  );

  t.after(() => {
    fs.rmSync(configDir, { recursive: true, force: true });
  });

  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: configDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      ADM_CONFIG_PATH: configDir,
      ADM_CONFIG_FILENAME: 'config.jsonc',
      NO_COLOR: '1',
    },
  });
}

test('nested commands show command help after argument errors', (t) => {
  const result = runCli(['get', 'transactions'], t);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.equal(result.status, 1);
  assert.match(output, /error: missing required argument 'query'/);
  assert.match(output, /Usage: adm get transactions \[options\] <query>/);
  assert.match(output, /Options:/);
});
