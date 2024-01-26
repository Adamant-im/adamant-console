const api = require('./api/index');
const log = require('../utils/log');

module.exports = (program) => {
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
