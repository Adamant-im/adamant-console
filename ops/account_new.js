/*

*/
const keys = require('../helpers/keys.js');
const constants = require('../helpers/constants.js')
const config = require('../helpers/configReader.js')
module.exports=function (vorpal) {
    return vorpal.command('account new').description('Creates a new account').action(function(args, callback) {
    	var passPhrase = keys.createNewPassPhrase()
		var keypair = keys.createKeypairFromPassPhrase(passPhrase)
    	answer = {success:true,
            account:{
                address: keys.createAddressFromPublicKey(keypair.publicKey),
                passPhrase: passPhrase,
    	        publicKey: keypair.publicKey.toString('hex'),
                privateKey: keypair.privateKey.toString('hex')
            }
    	}
    	this.log(JSON.stringify(answer,null,4))
    	callback()
    });
};