import * as api from './api/index.js';
import * as log from '../utils/log.js';

export default (program) => {
  const account = program.command('account');

  account
    .command('new')
    .description(
      'creates new ADAMANT account and provide account data in JSON format',
    )
    .action(log.call(api.createAccount));
};
