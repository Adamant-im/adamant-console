/*
    Helpers to read config files.

    Default location is ~/.adm
    Default filename can be overwritten using ADM_CONFIG_FILENAME environment variable
    Default filename can be overwritten using ADM_CONFIG_PATH environment variable
 */

const defaults = require('../config.default.json')
var _ = require("lodash")
const os = require("os")
const fs = require("fs")
const configPathName = '.adm'
const configFileName = process.env.ADM_CONFIG_FILENAME || 'config.json'
const userDir = os.homedir()
const configDirPath = process.env.ADM_CONFIG_PATH || `${userDir}/${configPathName}`
const untildify = require('untildify');
const configFilePath = untildify(`${configDirPath}/${configFileName}`)



if (fs.existsSync(configFilePath)) {
    var config = require(configFilePath)
    config = Object.assign(defaults, config)
} else if (fs.existsSync(configFileName)) {
    config = Object.assign(defaults, config)
}

config = config || defaults
module.exports = {
    getConfig: function () {
        return config
    },
    getRpcConfig: function () {
        return config.rpc
    },
    getNodeConnectString: function () {
        var config = this.getConfig()
        var network = config.network
        var currentNetwork = config.networks[network]
        var index = Math.floor(Math.random() * currentNetwork.nodes.length)
        if (!currentNetwork.nodes[index].protocol) {
            currentNetwork.nodes[index].protocol = 'http'
        }
        var connectString = currentNetwork.nodes[index].protocol + '://' + currentNetwork.nodes[index].ip
        if (currentNetwork.nodes[index].port) {
            connectString += ':' + currentNetwork.nodes[index].port
        }
        return connectString
    }
}

