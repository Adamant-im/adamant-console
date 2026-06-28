import api from '../../utils/api.js';
import config from '../../utils/config.js';
import { requiredParam } from '../../utils/validate.js';

/**
 * Votes for or unvotes delegates from the configured account.
 *
 * Delegate values without a leading `+` or `-` are treated as upvotes.
 *
 * @param {string[]} delegateArr Delegate public keys or addresses, optionally prefixed with `+` or `-`
 * @param {string} [passphrase] Optional passphrase override for RPC/library use
 * @returns {Promise<object>} Vote transaction response, unwrapped from `data` when present
 */
export async function voteFor(
  delegateArr = requiredParam('delegates'),
  passphrase,
) {
  const delegates = delegateArr;

  for (const [index, delegate] of delegates.entries()) {
    const voteDirection = delegate.charAt(0);

    if (!['+', '-'].includes(voteDirection)) {
      delegates[index] = `+${delegate}`;
    }
  }

  const res = await api.voteForDelegate(
    passphrase || config.passphrase,
    delegates,
  );

  return res.data || res;
}
