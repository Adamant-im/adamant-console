import * as api from './api/index.js';
import * as log from '../utils/log.js';

export default (program) => {
  const send = program.command('send');

  send
    .command('tokens <address> <amount>')
    .description(
      'sends tokens from account. Note: to send tokens with comment, use "send message" instead.',
    )
    .action((address, amount) => log.call(api.sendTokens)(address, amount));

  send
    .command('message <address> <text> [amount]')
    .description('sends message from account.')
    .action((address, message, amount) =>
      log.call(api.sendMessage)(address, message, amount),
    );

  send
    .command('rich <address> <json>')
    .description('sends rich message.')
    .action((address, json) => log.call(api.sendRich)(address, json));

  send
    .command('signal <address> <json>')
    .description('sends signal message.')
    .action((address, json) => log.call(api.sendSignal)(address, json));
};
