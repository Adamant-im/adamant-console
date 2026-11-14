import api from '../../utils/api.js';
import config from '../../utils/config.js';
import { requiredParam } from '../../utils/validate.js';

/**
 * Votes for or unvotes delegates from the configured account.
 *
 * Delegate values without a leading `+` or `-` are treated as upvotes.
 *
 * @param {string[]} delegateArr Delegate public keys, usernames, or addresses, optionally prefixed with `+` or `-`
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

  return explainMissingDelegate(res.data || res);
}

const missingDelegateMarkers = [
  "unable to retrieve the delegate's public key",
  'the address is not a delegate',
];

/**
 * Adds the configured network to delegate-lookup failures.
 *
 * Usernames and addresses resolve only on the network selected in config.
 * Public keys do not require that lookup.
 *
 * @param {object} result Vote API result
 * @returns {object} Original result, or the same failure with a network hint
 */
function explainMissingDelegate(result) {
  const message = result?.errorMessage || result?.error;

  if (
    typeof message !== 'string' ||
    !missingDelegateMarkers.some((marker) => message.includes(marker))
  ) {
    return result;
  }

  const hint =
    `${message}. No matching delegate was found on the current network ` +
    `(${config.network}). Delegate usernames and addresses are network-specific. ` +
    `Vote with a public key prefixed by + or -, or use a delegate registered on ${config.network}.`;

  if (result.errorMessage) {
    return { ...result, errorMessage: hint };
  }

  return { ...result, error: hint };
}
