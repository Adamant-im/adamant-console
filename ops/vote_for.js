/*

*/
const keys = require('../helpers/keys.js');
const constants = require('../helpers/constants.js')
const transactionFormer = require('../helpers/transactionFormer.js')
const config = require('../helpers/configReader.js')
const passArgs = require('../helpers/passArgs.js')
const popsicle = require('popsicle')

module.exports=function (vorpal) {
    return vorpal.command('vote for <input...>').description('Upvotes for delegates represented by <input...> comma-separated publicKeys. Downvotes, if "-" sign precedes publicKey.').action(function(args, callback) {
        var votes = args.input
        for (var i in votes) {
            var firstSymbol=votes[i].toString().charAt(0);
    	    if (firstSymbol!=='-' && firstSymbol!=='+')
                votes[i]='+'+votes[i]
        }
	var keypair = keys.createKeypairFromPassPhrase(passArgs.getPassPhrase(args))
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
