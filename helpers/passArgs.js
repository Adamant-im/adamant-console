const config = require('../helpers/configReader.js')
module.exports = {
    getPassPhrase: function (args) {
        if (args.options) {
            if (args.options.passPhrase)
            {
                return args.options.passPhrase
            }
        }
        return config.getConfig().passPhrase
    }
}
