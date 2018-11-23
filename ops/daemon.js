var rpc = require('node-json-rpc');
const config = require('../helpers/configReader.js')

module.exports=function (vorpal) {
    return vorpal.command('daemon').allowUnknownOptions().description('Runs JSON-RPC daemon').action(function(args, callback) {
        var serv = new rpc.Server(config.getRpcConfig())

        var self = this

        serv.start(function (error) {
            // Did server start succeed ?
            if (error) throw error;
            else self.log('Server running ...');
        });

    });
};