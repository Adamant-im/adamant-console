const api = require('./api/index');
const log = require('../utils/log');

module.exports = (program) => {
  const delegate = program.command('delegate');

  delegate
    .command('new <username>')
    .description(
      'registers user account as delegate and provide delegate data in JSON format.',
    )
    .action((username) => log.call(api.createDelegate)(username));
};
