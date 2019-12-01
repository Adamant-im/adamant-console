/*
*/
const config = require('../helpers/configReader.js')
const popsicle = require('popsicle')
var possibleTypes=['height', 'version']

module.exports=function (vorpal) {
    return vorpal.command('node <type>').description('Retrieves info about connected node. Available types: height, version').autocomplete(possibleTypes).action(function(args, callback) {
	if (!possibleTypes.includes(args.type)) {
	    this.log(`Error: ${args.type} is unknown type for node command`)
        if (callback)
	        callback()
        return {success: false, error:`${args.type} is unknown type for node command`}
	}
	else {
		var endpoint=''
		var multipleSelect = false
		if (args.input=='?') {
            var multipleSelect = true
		}
		if (!multipleSelect) {
            switch (args.type) {
                case 'height':
                	endpoint = '/api/blocks/getHeight'
					break
                case 'version':
                    endpoint = '/api/peers/version'
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