var sodium = require('sodium-browserify-tweetnacl')
var crypto = require('crypto')
var Mnemonic = require('bitcore-mnemonic')

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
}