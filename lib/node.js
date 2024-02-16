import * as api from './api/index.js';
import * as log from '../utils/log.js';

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
};
