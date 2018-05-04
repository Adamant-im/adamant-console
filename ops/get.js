/*
*/
const config = require('../helpers/configReader.js')
const popsicle = require('popsicle')
var possibleTypes=['account', 'address', 'block', 'delegate', 'transaction']
module.exports=function (vorpal) {
    return vorpal.command('get <type> <input> [params...]').description('Fetch info. Available types:  address, block, delegate, transaction, state').autocomplete(possibleTypes).action(function(args, callback) {
	if (!possibleTypes.includes(args.type)) {
	    this.log('Not valid type')
	    callback()
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
                case 'state':
                    endpoint = '/api/states/get?id=' + args.input
					break
                case 'delegate':
                    endpoint = '/api/delegates/get?username=' + args.input
                    break
                case 'transaction':
                    endpoint = '/api/transactions/get?id=' + args.input
                    break
				default:
                    this.log('Not implemented yet')
                    callback()
                    return
            }
        } else {
            this.log('Not implemented yet')
            callback()
			return
		}
        var self = this
        popsicle.request({
            method: 'GET',
            url: config.getNodeConnectString() + endpoint
        }).then(function (res) {
            self.log(JSON.stringify(JSON.parse(res.body),null,4))
            callback()
        })
	}
    })
}