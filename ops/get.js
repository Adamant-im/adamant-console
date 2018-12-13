/*
*/
const config = require('../helpers/configReader.js')
const popsicle = require('popsicle')
var possibleTypes=['account', 'address', 'block', 'blocks', 'delegate', 'transaction', 'transactions']
module.exports=function (vorpal) {
    return vorpal.command('get <type> <input> [params...]').description('Fetch info. Available types:  address, block, blocks, delegate, transaction, transactions, state').autocomplete(possibleTypes).action(function(args, callback) {
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
            self.log(JSON.stringify(answer,null,4))
            if (callback)
                callback()
            return answer
        })
	}
    })
}