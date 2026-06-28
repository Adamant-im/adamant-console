import {
  createNewPassphrase,
  createKeypairFromPassphrase,
  createAddressFromPublicKey,
} from 'adamant-api';

/**
 * Creates a new local ADAMANT account.
 *
 * The returned object contains the generated passphrase and keys. Callers must
 * show or store it only in trusted local contexts.
 *
 * @returns {{
 *   success: true,
 *   account: {
 *     passphrase: string,
 *     address: string,
 *     publicKey: string,
 *     privateKey: string
 *   }
 * }} Newly generated account credentials and address
 */
export const createAccount = () => {
  const passphrase = createNewPassphrase();
  const keypair = createKeypairFromPassphrase(passphrase);

  const answer = {
    success: true,
    account: {
      passphrase,
      address: createAddressFromPublicKey(keypair.publicKey),
      publicKey: keypair.publicKey.toString('hex'),
      privateKey: keypair.privateKey.toString('hex'),
    },
  };

  return answer;
};
