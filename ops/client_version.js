/*

*/
const package = require('../package.json')

module.exports = function (vorpal) {
    return vorpal.command('client version').description('Shows Adamant-console version').action(function (args, callback) {
        answer = {
            success: true,
            version: package.version
        }
        this.log(JSON.stringify(answer, null, 4))
        if (callback)
            callback()
        else
            return answer
    });
};