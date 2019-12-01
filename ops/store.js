/*

*/
const keys = require('../helpers/keys.js');
const constants = require('../helpers/constants.js')
const transactionFormer = require('../helpers/transactionFormer.js')
const config = require('../helpers/configReader.js')
const popsicle = require('popsicle')

module.exports=function (vorpal) {
    return vorpal.command('store <value> [key]').description('Stores <value> with a [key] in account\'s KVS').action(function(args, callback) {
		var keypair = keys.createKeypairFromPassPhrase(config.getConfig().passPhrase)
    	var data = {type: constants.transactionTypes.STATE, keyPair: keypair, value: args.value, key: args.key}
    	var transaction = transactionFormer.createTransaction(data.type, data);
    	var self = this
        popsicle.request({
            method: 'POST',
            url: config.getNodeConnectString()+'/api/states/store',
            body: {transaction: transaction}
        }).then(function (res) {
            self.log(JSON.stringify(JSON.parse(res.body),null,4))
            callback()
        })
    });
};