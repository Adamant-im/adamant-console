import assert from 'node:assert/strict';
import test from 'node:test';

import api from '../utils/api.js';
import { createAccount } from '../lib/api/account.js';
import { createDelegate } from '../lib/api/delegate.js';
import {
  getAddress,
  getBlock,
  getBlocks,
  getChats,
  getChatMessages,
  getChatTransactions,
  getDelegate,
  getTransaction,
  getTransactions,
  queryStringToObject,
} from '../lib/api/get.js';
import {
  getNodeHeight,
  getNodeStatus,
  getNodeVersion,
} from '../lib/api/node.js';
import {
  sendMessage,
  sendRich,
  sendSignal,
  sendTokens,
} from '../lib/api/send.js';
import { voteFor } from '../lib/api/vote.js';

const originalMethods = new Map();

function stubApi(method, implementation) {
  if (!originalMethods.has(method)) {
    originalMethods.set(method, api[method]);
  }

  api[method] = implementation;
}

test.afterEach(() => {
  for (const [method, implementation] of originalMethods) {
    api[method] = implementation;
  }

  originalMethods.clear();
});

test('createAccount returns local account credentials', () => {
  const result = createAccount();

  assert.equal(result.success, true);
  assert.match(result.account.passphrase, /\S+/);
  assert.match(result.account.address, /^U\d{6,21}$/);
  assert.match(result.account.publicKey, /^[a-f0-9]{64}$/);
  assert.match(result.account.privateKey, /^[a-f0-9]{128}$/);
});

test('getDelegate infers username, public key, and address lookups', async () => {
  const calls = [];

  stubApi('getDelegate', async (params) => {
    calls.push(params);

    return { success: true, delegate: params };
  });

  await getDelegate('lynx');
  await getDelegate('U11651572364276578835');
  await getDelegate(
    'ef5e78a3d02e6d82f4ac0c5b8923c1b86185bd17c27c9ac027c20ec62db79a84',
  );
  await getDelegate('delegate-by-address', 'address');

  assert.deepEqual(calls, [
    { username: 'lynx' },
    { address: 'U11651572364276578835' },
    {
      publicKey:
        'ef5e78a3d02e6d82f4ac0c5b8923c1b86185bd17c27c9ac027c20ec62db79a84',
    },
    { address: 'delegate-by-address' },
  ]);
});

test('getDelegate rejects unsupported explicit lookup keys', async () => {
  await assert.rejects(() => getDelegate('lynx', 'name'), {
    message:
      "Invalid delegate lookup key 'name'. Use username, publicKey, or address",
  });
});

test('queryStringToObject parses comma and ampersand fragments', () => {
  assert.deepEqual(
    queryStringToObject([
      'senderId=U1,and:recipientId=U2',
      'or:type=0&limit=10',
    ]),
    {
      senderId: 'U1',
      and: {
        recipientId: 'U2',
      },
      or: {
        type: '0',
      },
      limit: '10',
    },
  );
});

test('queryStringToObject normalizes deprecated direct-transfer filters', () => {
  assert.deepEqual(
    queryStringToObject([
      'withoutDirectTransfers=1',
      'and:withoutDirectTransfers=0',
      'or:includeDirectTransfers=1',
      'or:withoutDirectTransfers=1',
    ]),
    {
      includeDirectTransfers: '1',
    },
  );
});

test('queryStringToObject passes prefixed control parameters as options', () => {
  assert.deepEqual(
    queryStringToObject(['and:limit=5', 'or:orderBy=timestamp:asc']),
    {
      limit: '5',
      orderBy: 'timestamp:asc',
    },
  );
});

test('queryStringToObject preserves malformed deprecated direct-transfer values', () => {
  assert.deepEqual(queryStringToObject(['withoutDirectTransfers=yes']), {
    includeDirectTransfers: 'yes',
  });
});

test('read wrappers pass Node v0.10 query parameters through', async () => {
  const calls = [];

  stubApi('getTransaction', async (id, params) => {
    calls.push(['transaction', id, params]);

    return { success: true };
  });
  stubApi('getTransactions', async (params) => {
    calls.push(['transactions', params]);

    return { success: true };
  });
  stubApi('getChats', async (address, params) => {
    calls.push(['chats', address, params]);

    return { success: true };
  });
  stubApi('getChatMessages', async (ownAddress, partnerAddress, params) => {
    calls.push(['chatMessages', ownAddress, partnerAddress, params]);

    return { success: true };
  });
  stubApi('getChatTransactions', async (params) => {
    calls.push(['chatTransactions', params]);

    return { success: true };
  });

  await getTransaction('123', 'returnUnconfirmed=1');
  await getTransactions(
    'blockId=7917597195203393333,and:recipientId=U2',
    'orderBy=timestamp:asc',
  );
  await getChats('U1', 'includeDirectTransfers=1');
  await getChatMessages('U1', 'U2', 'returnUnconfirmed=1');
  await getChatTransactions('withoutDirectTransfers=1');

  assert.deepEqual(calls, [
    ['transaction', '123', { returnUnconfirmed: '1' }],
    [
      'transactions',
      {
        blockId: '7917597195203393333',
        and: { recipientId: 'U2' },
        orderBy: 'timestamp:asc',
      },
    ],
    ['chats', 'U1', { includeDirectTransfers: '1' }],
    ['chatMessages', 'U1', 'U2', { returnUnconfirmed: '1' }],
    ['chatTransactions', { includeDirectTransfers: '0' }],
  ]);
});

test('basic read wrappers unwrap data payloads', async () => {
  stubApi('getAccountInfo', async (params) => ({
    data: { account: params },
  }));
  stubApi('getBlock', async (id) => ({
    data: { block: { id } },
  }));
  stubApi('getBlocks', async (params) => ({
    data: { blocks: [], params },
  }));

  assert.deepEqual(await getAddress('U1'), { account: { address: 'U1' } });
  assert.deepEqual(await getBlock('B1'), { block: { id: 'B1' } });
  assert.deepEqual(await getBlocks('limit=1'), {
    blocks: [],
    params: { limit: '1' },
  });
});

test('node wrappers call current SDK endpoints', async () => {
  stubApi('getHeight', async () => ({ data: { height: 1 } }));
  stubApi('getNodeVersion', async () => ({ data: { version: '0.10.0' } }));
  stubApi('getNodeStatus', async () => ({
    data: { loader: { loaded: true }, version: { version: '0.10.0' } },
  }));

  assert.deepEqual(await getNodeHeight(), { height: 1 });
  assert.deepEqual(await getNodeVersion(), { version: '0.10.0' });
  assert.deepEqual(await getNodeStatus(), {
    loader: { loaded: true },
    version: { version: '0.10.0' },
  });
});

test('send wrappers delegate signing to adamant-api', async () => {
  const calls = [];

  stubApi('sendTokens', async (...args) => {
    calls.push(['tokens', ...args]);

    return { data: { transactionId: 'token-tx' } };
  });
  stubApi('sendMessage', async (...args) => {
    calls.push(['message', ...args]);

    return { data: { transactionId: 'message-tx' } };
  });

  assert.deepEqual(await sendTokens('U1', '1ADM', 'secret'), {
    transactionId: 'token-tx',
  });
  assert.deepEqual(
    await sendMessage('U2', { text: 'hello' }, '0.1ADM', 'secret'),
    {
      transactionId: 'message-tx',
    },
  );
  assert.deepEqual(await sendRich('U3', "{'type':'x'}", 'secret'), {
    transactionId: 'message-tx',
  });
  assert.deepEqual(await sendSignal('U4', "{'type':'signal'}", 'secret'), {
    transactionId: 'message-tx',
  });

  assert.equal(calls[0][0], 'tokens');
  assert.deepEqual(calls[0].slice(2), ['U1', 1, true]);
  assert.equal(calls[1][2], 'U2');
  assert.equal(calls[1][3], '{"text":"hello"}');
  assert.equal(calls[2][3], '{"type":"x"}');
  assert.equal(calls[3][3], '{"type":"signal"}');
});

test('delegate and vote wrappers pass explicit passphrases', async () => {
  stubApi('newDelegate', async (...args) => ({
    data: { args },
  }));
  stubApi('voteForDelegate', async (...args) => ({
    data: { args },
  }));

  assert.deepEqual(await createDelegate('lynx', 'secret'), {
    args: ['secret', 'lynx'],
  });
  assert.deepEqual(await voteFor(['delegatePublicKey', '-other'], 'secret'), {
    args: ['secret', ['+delegatePublicKey', '-other']],
  });
});
