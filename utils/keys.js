const sodium = require('sodium-browserify-tweetnacl');
const crypto = require('crypto');
const Mnemonic = require('bitcore-mnemonic');

module.exports = {
  createNewPassPhrase() {
    return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
  },
  makeKeypairFromHash(hash) {
    const keypair = sodium.crypto_sign_seed_keypair(hash);

    return {
      publicKey: keypair.publicKey,
      privateKey: keypair.secretKey,
    };
  },
  createHashFromPassPhrase(passPhrase) {
    const secretMnemonic = new Mnemonic(passPhrase, Mnemonic.Words.ENGLISH);

    return crypto
      .createHash('sha256')
      .update(secretMnemonic.toSeed().toString('hex'), 'hex')
      .digest();
  },
  createKeypairFromPassPhrase(passPhrase) {
    const hash = this.createHashFromPassPhrase(passPhrase);

    return this.makeKeypairFromHash(hash);
  },
  createAddressFromPublicKey(publicKey) {
    const publicKeyHash = crypto
      .createHash('sha256')
      .update(publicKey, 'hex')
      .digest();

    const temp = Buffer.alloc(8);

    for (let i = 0; i < 8; i += 1) {
      temp[i] = publicKeyHash[7 - i];
    }

    const hash = BigInt(`0x${temp.toString('hex')}`).toString();

    return `U${hash}`;
  },
};
