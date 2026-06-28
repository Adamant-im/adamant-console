import api from '../../utils/api.js';
import config from '../../utils/config.js';
import { requiredParam } from '../../utils/validate.js';

/**
 * Registers the configured account as a delegate.
 *
 * @param {string} username Delegate username to register on-chain
 * @param {string} [passphrase] Optional passphrase override for RPC/library use
 * @returns {Promise<object>} ADAMANT node response, unwrapped from `data` when present
 */
export async function createDelegate(
  username = requiredParam('username'),
  passphrase,
) {
  const res = await api.newDelegate(passphrase || config.passphrase, username);

  return res.data || res;
}
