import * as api from './api/index.js';
import * as log from '../utils/log.js';
import { addHelp } from '../utils/help.js';

/**
 * Registers delegate registration commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const delegate = program
    .command('delegate')
    .description('register delegate accounts');

  addHelp(
    delegate.command('new <username>'),
    `
Examples:
  $ adm delegate new mydelegate
`,
  )
    .description(
      'registers user account as delegate and provide delegate data in JSON format.',
    )
    .action((username) => log.call(api.createDelegate)(username));
};
