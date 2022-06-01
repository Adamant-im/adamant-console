const api = require('./api/index');
const log = require('../utils/log');

module.exports = (program) => {
  const account = program.command('account');

  account
    .command('new')
    .description('creates new ADAMANT account and provide account data in JSON format')
    .action(log.call(api.createAccount));
};
