import { AdamantApi } from 'adamant-api';
import config from './config.js';

const network = config.networks[config.network];

const nodes = network.nodes.map(
  ({ ip, protocol, port }) => `${protocol}://${ip}${port ? `:${port}` : ''}`,
);

// Check health in interactive mode
const checkHealthAtStartup = process.argv.length < 3;

const api = new AdamantApi({
  nodes,
  checkHealthAtStartup,
  logLevel: -1,
});

export default api;
