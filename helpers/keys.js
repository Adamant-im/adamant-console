var sodium = require('sodium-browserify-tweetnacl')
var crypto = require('crypto')
var Mnemonic = require('bitcore-mnemonic')
var bignum = require('./bignumber.js');

module.exports = {
    createNewPassPhrase: function () {
		return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
    },
    makeKeypairFromHash: function (hash) {
		var keypair = sodium.crypto_sign_seed_keypair(hash)
		return {
			publicKey: keypair.publicKey,
			privateKey: keypair.secretKey
		}
    },
    createHashFromPassPhrase: function (passPhrase) {
		var secretMnemonic = new Mnemonic(passPhrase, Mnemonic.Words.ENGLISH)
		return crypto.createHash('sha256').update(secretMnemonic.toSeed().toString('hex'), 'hex').digest()
    },
    createKeypairFromPassPhrase: function (passPhrase) {
		var hash = this.createHashFromPassPhrase(passPhrase);
		return this.makeKeypairFromHash(hash);
    },
    createAddressFromPublicKey: function (publicKey) {
		var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
		var temp = Buffer.alloc(8);

		for (var i = 0; i < 8; i++) {
				temp[i] = publicKeyHash[7 - i];
		}

		return 'U' + bignum.fromBuffer(temp).toString();
    }
}