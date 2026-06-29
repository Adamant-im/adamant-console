import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

import {
  createAddressFromPublicKey,
  createKeypairFromPassphrase,
} from 'adamant-api';

const repoRoot = path.resolve(import.meta.dirname, '..');
const configModuleUrl = pathToFileURL(
  path.join(repoRoot, 'utils/config.js'),
).href;
const cliPath = path.join(repoRoot, 'bin/adamant.js');

function runNode(args, options = {}) {
  return execFileSync(process.execPath, args, {
    cwd: options.cwd || repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      ADM_CONFIG_PATH: options.configDir,
      ADM_CONFIG_FILENAME: 'config.jsonc',
      NO_COLOR: '1',
    },
  });
}

function readConfigFromChild(configDir) {
  const source = `
    const { default: config } = await import(${JSON.stringify(configModuleUrl)});
    console.log(JSON.stringify({
      configPath: config.configPath,
      account: config.accountAddress,
      network: config.network
    }));
  `;

  return JSON.parse(
    runNode(['--input-type=module', '--eval', source], {
      configDir,
      cwd: configDir,
    }),
  );
}

function createTempConfigDir(t) {
  const configDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'adamant-console-test-'),
  );

  t.after(() => {
    fs.rmSync(configDir, { recursive: true, force: true });
  });

  return configDir;
}

test('config uses config.default.jsonc when no user config exists', (t) => {
  const configDir = createTempConfigDir(t);

  const config = readConfigFromChild(configDir);

  assert.equal(config.network, 'testnet');
  assert.match(config.configPath, /config\.default\.jsonc$/);
  assert.equal(config.account, 'Not set');
});

test('config treats the default placeholder passphrase as unset', (t) => {
  const configDir = createTempConfigDir(t);

  fs.writeFileSync(
    path.join(configDir, 'config.jsonc'),
    JSON.stringify({
      network: 'mainnet',
      passphrase: 'distance expect praise frequent..',
    }),
  );

  const config = readConfigFromChild(configDir);

  assert.equal(config.network, 'mainnet');
  assert.equal(config.configPath, path.join(configDir, 'config.jsonc'));
  assert.equal(config.account, 'Not set');
});

test('config derives an account only for an intentional passphrase', (t) => {
  const configDir = createTempConfigDir(t);
  const passphrase = 'advance pulse leisure sadness orange antenna spare brief';
  const keypair = createKeypairFromPassphrase(passphrase);

  fs.writeFileSync(
    path.join(configDir, 'config.jsonc'),
    JSON.stringify({
      passphrase,
    }),
  );

  const config = readConfigFromChild(configDir);

  assert.equal(config.account, createAddressFromPublicKey(keypair.publicKey));
});

test('adm client version reports config, network, and unset account', (t) => {
  const configDir = createTempConfigDir(t);
  const output = runNode([cliPath, 'client', 'version'], {
    configDir,
    cwd: configDir,
  });
  const info = JSON.parse(output);

  assert.equal(info.success, true);
  assert.match(info.version, /^\d+\.\d+\.\d+/);
  assert.match(info.config, /config\.default\.jsonc$/);
  assert.equal(info.network, 'testnet');
  assert.equal(info.account, 'Not set');
});
