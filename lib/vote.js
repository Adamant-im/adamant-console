const api = require('./api/index');
const log = require('../utils/log');

module.exports = (program) => {
  const vote = program.command('vote');

  vote
    .command('for <delegates...>')
    .description('votes for delegates in ADAMANT blockchain.')
    .action((delegates) => log.call(api.voteFor)(delegates));
};
