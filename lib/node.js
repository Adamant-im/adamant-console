import * as api from './api/index.js';
import * as log from '../utils/log.js';
import { addHelp } from '../utils/help.js';

/**
 * Registers node status commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const node = program
    .command('node')
    .description('inspect ADAMANT node status');

  addHelp(
    node.command('height'),
    `
Examples:
  $ adm node height
`,
  )
    .description("returns current node's blockchain height.")
    .action(log.call(api.getNodeHeight));

  addHelp(
    node.command('version'),
    `
Examples:
  $ adm node version
`,
  )
    .description(
      "returns node's software information: version, build and commit.",
    )
    .action(log.call(api.getNodeVersion));

  addHelp(
    node.command('status'),
    `
Examples:
  $ adm node status
`,
  )
    .description(
      'returns aggregated node, network, loader, and WebSocket status.',
    )
    .action(log.call(api.getNodeStatus));
};
