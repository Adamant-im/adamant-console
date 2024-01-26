const api = require('./api/index');
const log = require('../utils/log');

module.exports = (program) => {
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
    .command('delegate <delegateName>')
    .description("returns information about delegate and it's productivity")
    .action((username) => log.call(api.getDelegate)(username));

  get
    .command('message <transactionId>')
    .description(
      'returns information about message and the message itself decoded. Works the same way as get transaction, but returns asset decoded.',
    )
    .action((id) => log.call(api.getMessage)(id));

  get
    .command('transaction <transactionId>')
    .description('returns information about specific transaction')
    .action((id) => log.call(api.getTransaction)(id));

  get
    .command('transactions <query>')
    .description('performs complex queries to transactions store')
    .action((queries) => log.call(api.getTransactions)(queries));
};
