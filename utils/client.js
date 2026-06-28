import config from './config.js';
import { packageInfo } from './package.js';

/**
 * Builds the public client metadata response shared by CLI and JSON-RPC.
 *
 * @returns {{
 *   success: true,
 *   version: string,
 *   config: string,
 *   network: string,
 *   account: string
 * }} Client version, effective config path, network, and account status
 */
export function getClientInfo() {
  return {
    success: true,
    version: packageInfo.version,
    config: config.configPath,
    network: config.network,
    account: config.accountAddress,
  };
}
