const adamantApi = require('adamant-api');
const config = require('./config');

const network = config.networks[config.network];

const node = network.nodes.map(({ ip, protocol, port }) => (
  `${protocol}://${ip}${port ? `:${port}` : ''}`
));

// Check health in interactive mode
const checkHealthAtStartup = process.argv.length < 3;

const api = adamantApi({
  node,
  checkHealthAtStartup,
  logLevel: 'null',
});

module.exports = api;
