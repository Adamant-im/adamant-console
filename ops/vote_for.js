/*

*/
const keys = require('../helpers/keys.js');
const constants = require('../helpers/constants.js')
const transactionFormer = require('../helpers/transactionFormer.js')
const config = require('../helpers/configReader.js')
const popsicle = require('popsicle')
module.exports=function (vorpal) {
    return vorpal.command('vote for <input...>').description('Add votes for delegates (or remove them by prepending - to delegate name').action(function(args, callback) {
        var votes = args.input
        for (var i in votes) {
            var firstSymbol=votes[i].toString().charAt(0);
    	    if (firstSymbol!=='-' && firstSymbol!=='+')
                votes[i]='+'+votes[i]
        }
	var keypair = keys.createKeypairFromPassPhrase(config.getConfig().passPhrase)
    	var data = {type: constants.transactionTypes.VOTE, keyPair: keypair, votes: votes}
    	var transaction = transactionFormer.createTransaction(data.type, data)
        this.log(transaction)
    	var self = this
        popsicle.request({
            method: 'POST',
            url: config.getNodeConnectString()+'/api/accounts/delegates',
            body: transaction
        }).then(function (res) {
            self.log(JSON.stringify(JSON.parse(res.body),null,4))
            callback()
        })
    });
};
