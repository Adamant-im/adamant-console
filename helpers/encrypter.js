var sodium = require('sodium-browserify-tweetnacl')
var crypto = require('crypto')
var Mnemonic = require('bitcore-mnemonic')
var bignum = require('./bignumber.js')
var keys = require('./keys.js')
var nacl = require('tweetnacl/nacl-fast')
var ed2curve = require('ed2curve')
var ByteBuffer = require('bytebuffer')
const constants = require('./constants.js')

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
    encodeMessage: function (msg, keypair, recipientPublicKey) {
        var nonce = Buffer.allocUnsafe(24)
        sodium.randombytes(nonce)
        var plainText = Buffer.from(msg.toString())
        var DHPublicKey = ed2curve.convertPublicKey(new Uint8Array(this.hexToBytes(recipientPublicKey)))
        var DHSecretKey = ed2curve.convertSecretKey(keypair.privateKey)
        var encrypted = nacl.box(plainText, nonce, DHPublicKey, DHSecretKey)
        return {
            message: this.bytesToHex(encrypted),
            own_message: this.bytesToHex(nonce)
        }
    }
}
