import {
  createNewPassphrase,
  createKeypairFromPassphrase,
  createAddressFromPublicKey,
} from 'adamant-api';

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
