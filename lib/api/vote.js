import api from '../../utils/api.js';
import config from '../../utils/config.js';
import { requiredParam } from '../../utils/validate.js';

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
