import * as api from './api/index.js';
import * as log from '../utils/log.js';
import { addHelp } from '../utils/help.js';

/**
 * Registers account management commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const account = program
    .command('account')
    .description('manage local accounts');

  addHelp(
    account.command('new'),
    `
Examples:
  $ adm account new
`,
  )
    .description(
      'creates new ADAMANT account and provide account data in JSON format',
    )
    .action(log.call(api.createAccount));
};
