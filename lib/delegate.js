import * as api from './api/index.js';
import * as log from '../utils/log.js';

export default (program) => {
  const delegate = program.command('delegate');

  delegate
    .command('new <username>')
    .description(
      'registers user account as delegate and provide delegate data in JSON format.',
    )
    .action((username) => log.call(api.createDelegate)(username));
};
