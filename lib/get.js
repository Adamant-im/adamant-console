import * as api from './api/index.js';
import * as log from '../utils/log.js';

/**
 * Registers read-only blockchain query commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const get = program.command('get');

  get
    .command('address <address>')
    .description(
      'returns information about ADAMANT network address (account), information returned consists of balance and publicKey.',
    )
    .action((address) => log.call(api.getAddress)(address));

  get
    .command('block <blockId>')
    .description(
      'returns block information, which contains information about forger (generatorId), timestamp, signatures, and other fields.',
    )
    .action((id) => log.call(api.getBlock)(id));

  get
    .command('blocks <query>')
    .description(
      'returns array of blocks in ADAMANT chain from newest to oldest.',
    )
    .action((queries) => log.call(api.getBlocks)(queries));

  get
    .command('delegate <delegate>')
    .description(
      'returns information about delegate by username, public key, or address.',
    )
    .action((delegate) => log.call(api.getDelegate)(delegate));

  get
    .command('chats <address> [query]')
    .description('returns chat rooms for an ADAMANT address.')
    .action((address, queries) => log.call(api.getChats)(address, queries));

  get
    .command('chat <ownAddress> <partnerAddress> [query]')
    .description('returns messages between two ADAMANT addresses.')
    .action((ownAddress, partnerAddress, queries) =>
      log.call(api.getChatMessages)(ownAddress, partnerAddress, queries),
    );

  get
    .command('message <transactionId>')
    .description(
      'returns information about message and the message itself decoded. Works the same way as get transaction, but returns asset decoded.',
    )
    .action((id) => log.call(api.getMessage)(id));

  get
    .command('transaction <transactionId> [query]')
    .description('returns information about specific transaction')
    .action((id, queries) => log.call(api.getTransaction)(id, queries));

  get
    .command('transactions <query>')
    .description('performs complex queries to transactions store')
    .action((queries) => log.call(api.getTransactions)(queries));
};
