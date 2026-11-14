import * as api from './api/index.js';
import * as log from '../utils/log.js';
import { addHelp } from '../utils/help.js';

/**
 * Registers transaction and message sending commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const send = program.command('send').description('send ADM and messages');

  addHelp(
    send.command('tokens <address> <amount>'),
    `
Arguments:
  Use an ADM suffix for decimal ADM, for example 0.001ADM. An integer without
  a suffix is token units (8 decimals, 1 ADM = 100000000). A bare decimal
  such as 0.001 is rejected.

Examples:
  $ adm send tokens U123456789 0.001ADM
  $ adm send tokens U123456789 1ADM
  $ adm send tokens U123456789 100000
`,
  )
    .description(
      'sends tokens from account. Note: to send tokens with comment, use "send message" instead.',
    )
    .action((address, amount) => log.call(api.sendTokens)(address, amount));

  addHelp(
    send.command('message <address> <text> [amount]'),
    `
Arguments:
  amount is optional and uses the same format as send tokens. Use 0.1ADM for
  decimal ADM, or an integer number of token units.

Examples:
  $ adm send message U123456789 "hello"
  $ adm send message U123456789 "hello" 0.1ADM
`,
  )
    .description('sends message from account.')
    .action((address, message, amount) =>
      log.call(api.sendMessage)(address, message, amount),
    );

  addHelp(
    send.command('rich <address> <json>'),
    `
Examples:
  $ adm send rich U123456789 '{"type":"reply","text":"hello"}'
`,
  )
    .description('sends rich message.')
    .action((address, json) => log.call(api.sendRich)(address, json));

  addHelp(
    send.command('signal <address> <json>'),
    `
Examples:
  $ adm send signal U123456789 '{"type":"typing","value":true}'
`,
  )
    .description('sends signal message.')
    .action((address, json) => log.call(api.sendSignal)(address, json));
};
