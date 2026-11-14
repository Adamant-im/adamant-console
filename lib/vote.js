import * as api from './api/index.js';
import * as log from '../utils/log.js';
import { addHelp } from '../utils/help.js';

/**
 * Registers delegate voting commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const vote = program.command('vote').description('vote for delegates');

  addHelp(
    vote.command('for <delegates...>'),
    `
Arguments:
  Prefix delegate public keys with "+" to vote or "-" to unvote. A missing
  prefix is treated as "+". Usernames and addresses work only when that
  delegate is registered on the configured network. A mainnet username such
  as lynx does not resolve on testnet.

Examples:
  $ adm vote for +delegatePublicKey
  $ adm vote for +delegatePublicKey -otherDelegatePublicKey
`,
  )
    .description('votes for delegates in ADAMANT blockchain.')
    .action((delegates) => log.call(api.voteFor)(delegates));
};
