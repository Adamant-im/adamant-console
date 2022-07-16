/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const Joi = require('joi');
const os = require('os');
const fs = require('fs');
const path = require('path');

const log = require('./log');

const configPathName = '.adm';
const configFileName = process.env.ADM_CONFIG_FILENAME || 'config.json';

const homeDir = os.homedir();
const configDirPath = process.env.ADM_CONFIG_PATH || `${homeDir}/${configPathName}`;

const configFilePath = path.resolve(`${configDirPath}/${configFileName}`);

const defaultConfig = require('../config.default.json');

let config = defaultConfig;

if (fs.existsSync(configFilePath)) {
  const loadedConfig = require(configFilePath);

  config = {
    ...defaultConfig,
    ...loadedConfig,
  };
} else if (fs.existsSync(configFileName)) {
  const localConfigFilePath = path.resolve(configFileName);
  const loadedConfig = require(localConfigFilePath);

  config = {
    ...defaultConfig,
    ...loadedConfig,
  };
}

const netSchema = Joi.object({
  nodes: Joi.array().items(
    Joi.object({
      ip: Joi.string(),
      protocol: Joi.string(),
      port: Joi.number().allow(''),
    }),
  ),
});

const schema = Joi.object({
  network: Joi.string(),
  rpc: Joi.object({
    port: Joi.number(),
  }),
  networks: Joi.object({
    [config.network]: netSchema.required(),
  }),
  // passPhrase can be set later
  passPhrase: Joi.string().allow(''),
});

const { error, value } = schema.validate(config, {
  allowUnknown: true,
});

if (error) {
  log.error(
    error.toString()
      .replace('ValidationError', 'Config validation error'),
  );
}

module.exports = value;
