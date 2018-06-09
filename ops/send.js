/*
 Handles send tokens/messages commands
 */
const keys = require('../helpers/keys.js');
const constants = require('../helpers/constants.js')
const encrypter = require('../helpers/encrypter.js')
const transactionFormer = require('../helpers/transactionFormer.js')
const config = require('../helpers/configReader.js')
const popsicle = require('popsicle')
var possibleTypes=['tokens', 'message', 'signal', 'rich'];
module.exports=function (vorpal) {
    return vorpal.command('send <type> <address> <payload>').description('send tokens/message/rich/signal to another account').autocomplete(possibleTypes).action(function(args, callback) {
        if (!possibleTypes.includes(args.type)) {
            this.log('Not valid type');
            callback();
        }
        else {
            if (args.type==='tokens') {
                var recipient_name = args.address
                var amount = "" + args.payload
                if (amount.indexOf('ADM')>0) {
                    amount=parseInt(parseFloat(amount)*100000000)
                }
                else
                    amount=parseInt(amount)
                var keypair = keys.createKeypairFromPassPhrase(config.getConfig().passPhrase)
                var data = { keyPair: keypair, recipientId: recipient_name, amount: amount}
                var transaction = transactionFormer.createTransaction(constants.transactionTypes.SEND, data)
                var self = this
                popsicle.request({
                    method: 'POST',
                    url: config.getNodeConnectString()+'/api/transactions/process',
                    body: {transaction: transaction}
                }).then(function (res) {
                    self.log(JSON.stringify(JSON.parse(res.body),null,4))
                    callback()
                })
            } else if (args.type==='message' || args.type==='rich' || args.type==='signal') {
                var recipient_name = args.address
                var message = args.payload
                var keypair = keys.createKeypairFromPassPhrase(config.getConfig().passPhrase)
                var message_type = 1
                if (args.type==='rich')
                    message_type = 2
                if (args.type==='signal')
                    message_type = 3
                var data = { keyPair: keypair, recipientId: recipient_name, message: message, message_type: message_type}

                var self = this
                popsicle.request({
                    method: 'GET',
                    url: config.getNodeConnectString()+'/api/accounts/getPublicKey?address=' + recipient_name
                }).then(function (res) {
                    var answer = JSON.parse(res.body)
                    if (answer.success) {
                        var encrypt_data = encrypter.encodeMessage(data.message, keypair, answer.publicKey)
                        data.message = encrypt_data.message
                        data.own_message = encrypt_data.own_message
                        var transaction = transactionFormer.createTransaction(constants.transactionTypes.CHAT_MESSAGE, data)
                        popsicle.request({
                            method: 'POST',
                            url: config.getNodeConnectString()+'/api/transactions/process',
                            body: {transaction: transaction}
                        }).then(function (res) {
                            self.log(JSON.stringify(JSON.parse(res.body),null,4))
                            callback()
                        })
                    } else {
                        self.log('Unknown address')
                        callback()
                    }
                })
                /* return this.$http.get(this.getAddressString() + '/api/accounts/getPublicKey?address=' + recipientAddress).then(response => {
                    if (response.body.success) {
                    window.pk_cache[recipientAddress] = response.body.publicKey
                    return response.body.publicKey
                }

                */

            }
        }
    });
};