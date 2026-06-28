import * as api from './api/index.js';
import * as log from '../utils/log.js';

/**
 * Registers node status commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const node = program.command('node');

  node
    .command('height')
    .description("returns current node's blockchain height.")
    .action(log.call(api.getNodeHeight));

  node
    .command('version')
    .description(
      "returns node's software information: version, build and commit.",
    )
    .action(log.call(api.getNodeVersion));

  node
    .command('status')
    .description(
      'returns aggregated node, network, loader, and WebSocket status.',
    )
    .action(log.call(api.getNodeStatus));
};
