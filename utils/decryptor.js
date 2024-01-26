const nacl = require('tweetnacl/nacl-fast');
const ed2curve = require('ed2curve');
const { decode } = require('@stablelib/utf8');

module.exports = {
  hexToBytes(hex) {
    const bytes = [];

    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }

    return Uint8Array.from(bytes);
  },
  decodeMessage(msg, ownMessage, privateKey, senderPublicKey) {
    const message = typeof msg === 'string' ? this.hexToBytes(msg) : msg;

    const nonce =
      typeof ownMessage === 'string' ? this.hexToBytes(ownMessage) : ownMessage;

    const senderKey =
      typeof senderPublicKey === 'string'
        ? this.hexToBytes(senderPublicKey)
        : senderPublicKey;

    const myPrivateKey =
      typeof privateKey === 'string' ? this.hexToBytes(privateKey) : privateKey;

    const DHPublicKey = ed2curve.convertPublicKey(senderKey);
    const DHSecretKey = ed2curve.convertSecretKey(myPrivateKey);
    const decrypted = nacl.box.open(message, nonce, DHPublicKey, DHSecretKey);

    return decrypted ? decode(decrypted) : '';
  },
};
