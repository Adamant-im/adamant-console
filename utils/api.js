import { AdamantApi } from 'adamant-api';
import config from './config.js';

const network = config.networks[config.network];

const nodes = network.nodes.map(
  ({ ip, protocol, port }) => `${protocol}://${ip}${port ? `:${port}` : ''}`,
);

// Interactive mode can surface node availability before the first command runs.
const checkHealthAtStartup = process.argv.length < 3;

/**
 * Shared ADAMANT SDK instance configured from local Console settings.
 *
 * @type {AdamantApi}
 */
const api = new AdamantApi({
  nodes,
  checkHealthAtStartup,
  logLevel: 'none',
});

export default api;
