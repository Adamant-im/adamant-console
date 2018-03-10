/*
    Helpers to read config files.

    Default location is ~/.adm
    Default filename can be overwritten usign ADM_CONFIG_FILENAME environment variable
    Default filename can be overwritten usign ADM_CONFIG_PATH environment variable
 */

const defaults = require('../config.default.json')
var _ = require("lodash")
const os = require("os")
const fs = require("fs")
const configPathName = '.adm'
const configFileName = process.env.ADM_CONFIG_FILENAME || 'config.json'
const userDir = os.homedir()
const configDirPath = process.env.ADM_CONFIG_PATH || `${userDir}/${configPathName}`
const configFilePath = `${configDirPath}/${configFileName}`


if (fs.existsSync(configFilePath)) {
    var config = require(configFilePath)
    config = _.merge({}, defaults, config)
}

module.exports = config || defaults

