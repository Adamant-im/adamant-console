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
  assert.match(output, /Query:/);
  assert.match(output, /Examples:/);
  assert.match(output, /adm get transactions senderId=U123456789/);
  assert.match(
    output,
    /adm get transactions 'types=0&orderBy=timestamp:desc&returnUnconfirmed=1'/,
  );
  assert.match(output, /Options:/);
});

test('leaf commands expose concise examples in help', (t) => {
  const commands = [
    [['account', 'new'], /adm account new/],
    [['client', 'version'], /adm client version/],
    [['delegate', 'new'], /adm delegate new mydelegate/],
    [['get', 'address'], /adm get address U123456789/],
    [['get', 'block'], /adm get block 123456789/],
    [['get', 'blocks'], /adm get blocks limit=10/],
    [['get', 'chat'], /adm get chat U123456789 U987654321/],
    [['get', 'chats'], /adm get chats U123456789/],
    [['get', 'delegate'], /adm get delegate lynx/],
    [['get', 'message'], /adm get message 123456789/],
    [['get', 'transaction'], /adm get transaction 123456789/],
    [['get', 'transactions'], /adm get transactions senderId=U123456789/],
    [['init'], /adm init \.\/adm-config/],
    [['node', 'height'], /adm node height/],
    [['node', 'status'], /adm node status/],
    [['node', 'version'], /adm node version/],
    [['rpc', 'server'], /adm rpc server/],
    [['send', 'message'], /adm send message U123456789 "hello"/],
    [['send', 'rich'], /adm send rich U123456789/],
    [['send', 'signal'], /adm send signal U123456789/],
    [['send', 'tokens'], /adm send tokens U123456789 1ADM/],
    [['vote', 'for'], /adm vote for \+delegatePublicKey/],
  ];

  for (const [command, expectedExample] of commands) {
    const result = runCli([...command, '--help'], t);
    const output = `${result.stdout}\n${result.stderr}`;

    assert.equal(result.status, 0, command.join(' '));
    assert.match(output, /Examples:/, command.join(' '));
    assert.match(output, expectedExample, command.join(' '));
  }
});
