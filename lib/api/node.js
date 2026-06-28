import api from '../../utils/api.js';

/**
 * Gets the current blockchain height from the active ADAMANT node.
 *
 * @returns {Promise<object>} Node height response, unwrapped from `data` when present
 */
export async function getNodeHeight() {
  const res = await api.getHeight();

  return res.data || res;
}

/**
 * Gets ADAMANT node software version information.
 *
 * @returns {Promise<object>} Node version response, unwrapped from `data` when present
 */
export async function getNodeVersion() {
  const res = await api.getNodeVersion();

  return res.data || res;
}
