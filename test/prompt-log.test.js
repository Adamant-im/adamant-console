import assert from 'node:assert/strict';
import test from 'node:test';

import History from '../prompt/history.js';
import { call, log, warn } from '../utils/log.js';
import { requiredParam } from '../utils/validate.js';

function captureConsole(method, callback) {
  const original = console[method];
  const lines = [];

  console[method] = (...args) => {
    lines.push(args.join(' '));
  };

  return Promise.resolve()
    .then(callback)
    .then(
      () => lines,
      (error) => {
        throw error;
      },
    )
    .finally(() => {
      console[method] = original;
    });
}

test('History navigates back and forward through prompt entries', () => {
  const history = new History();

  assert.equal(history.back('current'), 'current');
  assert.equal(history.add('first'), 1);
  assert.equal(history.add('second'), 2);
  assert.equal(history.back(''), 'second');
  assert.equal(history.back(''), 'first');
  assert.equal(history.back('current'), 'current');
  assert.equal(history.next(''), 'second');
  assert.equal(history.next('current'), 'current');
});

test('log merges objects into pretty JSON', async () => {
  const [output] = await captureConsole('log', () => {
    log({ success: true }, { height: 1 });
  });

  assert.deepEqual(JSON.parse(output), {
    success: true,
    height: 1,
  });
});

test('warn writes standard error response JSON', async () => {
  const [output] = await captureConsole('log', () => {
    warn('boom');
  });

  assert.deepEqual(JSON.parse(output), {
    success: false,
    error: 'boom',
  });
});

test('call logs returned data and catches thrown errors', async () => {
  const outputs = await captureConsole('log', async () => {
    await call(async (value) => ({ success: true, value }))('ok');
    await call(async () => {
      throw new Error('failed');
    })();
  });

  assert.deepEqual(JSON.parse(outputs[0]), {
    success: true,
    value: 'ok',
  });
  assert.deepEqual(JSON.parse(outputs[1]), {
    success: false,
    error: 'Error: failed',
  });
});

test('requiredParam throws a standard missing-parameter error', () => {
  assert.throws(() => requiredParam('address'), {
    message: "Missing parameter 'address'",
  });
});
