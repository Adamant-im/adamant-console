var rpc = require('jayson/promise')

const config = require('../helpers/configReader.js')

module.exports = function (vorpal) {
    return vorpal.command('daemon').allowUnknownOptions().description('Runs JSON-RPC daemon').action(function (args, callback) {
        var self = this

        var methods = {
            accountNew: function (args, done) {
                return new Promise(function (resolve, reject) {
                    var data = vorpal.execSync('account new')
                    var err = null
                    if (data.success === false) {
                        err = server.error(1, data.error)
                        reject(err)
                    } else resolve(data.account);
                })
            },
            sendTokens: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'send tokens '
                    var err = null
                    var data = {success: false}
                    if (!args.address || !args.amount) {
                        err = this.error(-32602); // returns an error with the default properties set
                        reject(err)
                    } else {
                        if (args.passPhrase)
                            cmd += '--passPhrase="' + args.passPhrase + '"'
                        cmd = cmd + args.address + ' ' + args.amount
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.transactionId
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
        }
        var server = rpc.server(methods)
        server.http().listen(config.getRpcConfig().port)
        this.log('Daemon listing on port ' + config.getRpcConfig().port)

    });
};