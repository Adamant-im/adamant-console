import * as api from './api/index.js';
import * as log from '../utils/log.js';

export default (program) => {
  const vote = program.command('vote');

  vote
    .command('for <delegates...>')
    .description('votes for delegates in ADAMANT blockchain.')
    .action((delegates) => log.call(api.voteFor)(delegates));
};
