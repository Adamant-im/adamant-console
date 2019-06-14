var sodium = require('sodium-browserify-tweetnacl')
var crypto = require('crypto')
var Mnemonic = require('bitcore-mnemonic')
var bignum = require('./bignumber.js')
var keys = require('./keys.js')
var nacl = require('tweetnacl/nacl-fast')
var ed2curve = require('ed2curve')
var ByteBuffer = require('bytebuffer')
const constants = require('./constants.js')
var utf8 = require('@stablelib/utf8')

module.exports = {
    bytesToHex: function (bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16))
            hex.push((bytes[i] & 0xF).toString(16))
        }
        return hex.join('')
    },
    hexToBytes: function (hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16))
        }
        return bytes
    },
    decodeMessage: function (msg, nonce, keypair, recipientPublicKey) {

        var text = msg
        var DHPublicKey = ed2curve.convertPublicKey(new Uint8Array(this.hexToBytes(recipientPublicKey)))
        var DHSecretKey = ed2curve.convertSecretKey(keypair.privateKey)
        var decrypted = nacl.box.open(text, nonce, DHPublicKey, DHSecretKey)
        decrypted = utf8.decode(decrypted)
        return decrypted;
    }
}
