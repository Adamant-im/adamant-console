/*
*/
const config = require('../helpers/configReader.js')
const keys = require('../helpers/keys.js');
const passArgs = require('../helpers/passArgs.js')
const popsicle = require('popsicle')
const decrypter = require('../helpers/decrypter.js')
var possibleTypes=['account', 'address', 'block', 'blocks', 'delegate', 'transaction', 'transactions', 'message']
module.exports=function (vorpal) {
    return vorpal.command('get <type> <input> [params...]').allowUnknownOptions().description('Fetch info. Available types:  address, block, blocks, delegate, transaction, transactions, state').autocomplete(possibleTypes).action(function(args, callback) {
	if (!possibleTypes.includes(args.type)) {
	    this.log('Not valid type')
        if (callback)
	        callback()
        return {success: false, error:'Not valid type'}
	}
	else {
		var endpoint=''
		var multipleSelect = false
		if (args.input=='?') {
            var multipleSelect = true
		}
		if (!multipleSelect) {
            switch (args.type) {
                case 'address':
                	endpoint = '/api/accounts?address=' + args.input
					break
                case 'block':
                    endpoint = '/api/blocks/get?id=' + args.input
					break
                case 'blocks':
                    endpoint = '/api/blocks?' + args.input.split("'").join('').split(' ').join('').split(',').join('&')
                    break
                case 'state':
                    endpoint = '/api/states/get?id=' + args.input
					break
                case 'message':
                    endpoint = '/api/transactions/get?returnAsset=1&id=' + args.input
                    break
                case 'delegate':
                    endpoint = '/api/delegates/get?username=' + args.input
                    break
                case 'transaction':
                    endpoint = '/api/transactions/get?id=' + args.input
                    break
                case 'transactions':
                    endpoint = '/api/transactions?' + args.input.split("'").join('').split(' ').join('').split(',').join('&')
                    break
				default:
                    this.log('Not implemented yet')
                    if (callback)
                        callback()
                    return {success: false, error:'Not implemented yet'}
            }
        } else {
            this.log('Not implemented yet')
            if (callback)
                callback()
            return {success: false, error:'Not implemented yet'}
		}
        var self = this
        return popsicle.request({
            method: 'GET',
            url: config.getNodeConnectString() + endpoint
        }).then(function (res) {
            var answer = JSON.parse(res.body)
            if (args.type=='message') {
                if (answer.transaction.asset.chat.own_message) {
                    var keypair = keys.createKeypairFromPassPhrase(passArgs.getPassPhrase(args))
                    var reader_address=keys.createAddressFromPublicKey(keypair.publicKey)
                    if (reader_address!=answer.transaction.senderId && reader_address!=answer.transaction.recipientId) {
                        self.log("Can't decode message, key is not available");
                        if (callback)
                            callback()
                        return false
                    }
                    recipient_name=answer.transaction.senderId
                    if (recipient_name===reader_address)
                        recipient_name=answer.transaction.recipientId
                    return popsicle.request({
                        method: 'GET',
                        url: config.getNodeConnectString()+'/api/accounts/getPublicKey?address=' + recipient_name
                    }).then(function (res) {
                        var pk_answer = JSON.parse(res.body)
                        if (pk_answer.success) {
                            var decoded = decrypter.decodeMessage(Buffer.from(answer.transaction.asset.chat.message,'hex'), Buffer.from(answer.transaction.asset.chat.own_message,'hex'),keypair, pk_answer.publicKey)
                            answer.transaction.asset.chat.message = decoded
                            delete answer.transaction.asset.chat.own_message
                            self.log(JSON.stringify(answer,null,4))
                            if (callback)
                                callback()
                            return answer
                        }
                    })

                }
            }
		    else
            self.log(JSON.stringify(answer,null,4))
            if (callback)
                callback()
            return answer
        })
	}
    })
}
