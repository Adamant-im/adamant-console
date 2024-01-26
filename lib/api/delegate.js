import api from '../../utils/api.js';
import config from '../../utils/config.js';
import { requiredParam } from '../../utils/validate.js';

export async function createDelegate(
  username = requiredParam('username'),
  passphrase,
) {
  const res = await api.newDelegate(passphrase || config.passphrase, username);

  return res.data || res;
}
