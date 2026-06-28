import * as api from './api/index.js';
import * as log from '../utils/log.js';
import { addHelp } from '../utils/help.js';

/**
 * Registers read-only blockchain query commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const get = program.command('get').description('read blockchain data');

  addHelp(
    get.command('address <address>'),
    `
Examples:
  $ adm get address U123456789
`,
  )
    .description(
      'returns information about ADAMANT network address (account), information returned consists of balance and publicKey.',
    )
    .action((address) => log.call(api.getAddress)(address));

  addHelp(
    get.command('block <blockId>'),
    `
Examples:
  $ adm get block 123456789
`,
  )
    .description(
      'returns block information, which contains information about forger (generatorId), timestamp, signatures, and other fields.',
    )
    .action((id) => log.call(api.getBlock)(id));

  addHelp(
    get.command('blocks <query>'),
    `
Query:
  Pass URL-style block query parameters.

Examples:
  $ adm get blocks limit=10
  $ adm get blocks orderBy=height:desc,limit=5
`,
  )
    .description(
      'returns array of blocks in ADAMANT chain from newest to oldest.',
    )
    .action((queries) => log.call(api.getBlocks)(queries));

  addHelp(
    get.command('delegate <delegate>'),
    `
Arguments:
  delegate can be a username, public key, or ADAMANT address.

Examples:
  $ adm get delegate lynx
  $ adm get delegate U11651572364276578835
`,
  )
    .description(
      'returns information about delegate by username, public key, or address.',
    )
    .action((delegate) => log.call(api.getDelegate)(delegate));

  addHelp(
    get.command('chats <address> [query]'),
    `
Query:
  Pass optional chatroom query parameters.

Examples:
  $ adm get chats U123456789
  $ adm get chats U123456789 includeDirectTransfers=1
`,
  )
    .description('returns chat rooms for an ADAMANT address.')
    .action((address, queries) => log.call(api.getChats)(address, queries));

  addHelp(
    get.command('chat <ownAddress> <partnerAddress> [query]'),
    `
Query:
  Pass optional chat message query parameters.

Examples:
  $ adm get chat U123456789 U987654321
  $ adm get chat U123456789 U987654321 returnUnconfirmed=1
`,
  )
    .description('returns messages between two ADAMANT addresses.')
    .action((ownAddress, partnerAddress, queries) =>
      log.call(api.getChatMessages)(ownAddress, partnerAddress, queries),
    );

  addHelp(
    get.command('message <transactionId>'),
    `
Examples:
  $ adm get message 123456789
`,
  )
    .description(
      'returns information about message and the message itself decoded. Works the same way as get transaction, but returns asset decoded.',
    )
    .action((id) => log.call(api.getMessage)(id));

  addHelp(
    get.command('transaction <transactionId> [query]'),
    `
Query:
  Pass optional transaction query parameters.

Examples:
  $ adm get transaction 123456789
  $ adm get transaction 123456789 returnUnconfirmed=1
`,
  )
    .description('returns information about specific transaction')
    .action((id, queries) => log.call(api.getTransaction)(id, queries));

  addHelp(
    get.command('transactions <query>'),
    `
Query:
  Pass one or more URL-style query fragments. Use "," or "&" to combine
  parameters. Prefix a parameter with "and:" or "or:" for explicit logical
  grouping.

Examples:
  $ adm get transactions senderId=U123456789
  $ adm get transactions recipientId=U123456789,limit=10
  $ adm get transactions senderId=U123456789,and:recipientId=U987654321
  $ adm get transactions types=0&orderBy=timestamp:desc&returnUnconfirmed=1
`,
  )
    .description('queries transactions with ADAMANT Node query parameters.')
    .action((queries) => log.call(api.getTransactions)(queries));
};
