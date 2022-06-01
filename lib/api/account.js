const keys = require('../../utils/keys');

exports.createAccount = () => {
  const passPhrase = keys.createNewPassPhrase();
  const keypair = keys.createKeypairFromPassPhrase(passPhrase);

  const answer = {
    success: true,
    account: {
      passPhrase,
      address: keys.createAddressFromPublicKey(keypair.publicKey),
      publicKey: keypair.publicKey.toString('hex'),
      privateKey: keypair.privateKey.toString('hex'),
    },
  };

  return answer;
};
