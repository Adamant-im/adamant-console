/*
 Handles send tokens/messages commands
 */
const keys = require('../helpers/keys.js');
const constants = require('../helpers/constants.js')
const transactionFormer = require('../helpers/transactionFormer.js')
const config = require('../helpers/configReader.js')
const popsicle = require('popsicle')
var possibleTypes=['tokens', 'message'];
module.exports=function (vorpal) {
    return vorpal.command('send <type> <address> <payload>').description('send tokens/message to another account').autocomplete(possibleTypes).action(function(args, callback) {
        if (!possibleTypes.includes(args.type)) {
            this.log('Not valid type');
            callback();
        }
        else {
            if (args.type==='tokens') {
                var recipient_name = args.address
                var amount = args.payload
                if (amount.indexOf('ADM')>0) {
                    amount=parseInt(parseFloat(amount)*100000000)
                }
                else
                    amount=parseInt(amount)
                var keypair = keys.createKeypairFromPassPhrase(config.getConfig().passPhrase)
                var data = { keyPair: keypair, recipientId: recipient_name, amount: amount}
                var transaction = transactionFormer.createTransaction(constants.transactionTypes.SEND, data)
                this.log(transaction)
                var self = this
                popsicle.request({
                    method: 'POST',
                    url: config.getNodeConnectString()+'/api/transactions/process',
                    body: {transaction: transaction}
                }).then(function (res) {
                    self.log(JSON.stringify(JSON.parse(res.body),null,4))
                    callback()
                })
            } else if (args.type==='message') {
                callback();
            }
        }
    });
};