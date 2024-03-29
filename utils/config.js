/* eslint-disable import/no-dynamic-require */

import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Joi from 'joi';
import jsonminify from 'jsonminify';
import chalk from 'chalk';

import * as log from './log.js';

const configPathName = '.adm';
const configFileName = process.env.ADM_CONFIG_FILENAME || 'config.jsonc';

const homeDir = os.homedir();
const configDirPath =
  process.env.ADM_CONFIG_PATH || `${homeDir}/${configPathName}`;

const configFilePath = path.normalize(`${configDirPath}/${configFileName}`);
const localConfigFilePath = path.resolve(configFileName);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultConfigFilePath = path.join(__dirname, '../config.default.jsonc');

function loadConfig(configPath) {
  let parsedConfig = {};

  try {
    const data = fs.readFileSync(configPath, 'utf8');

    parsedConfig = JSON.parse(jsonminify(data));
  } catch (err) {
    console.log(
      chalk.red(
        'Failed to parse the configuration from:\n' +
          `└── ${chalk.yellow(configPath)}.`,
      ),
    );
    console.log();
    console.log(err);
    process.exit(1);
  }

  return parsedConfig;
}

let config = loadConfig(defaultConfigFilePath);

const configPaths = [configFilePath, localConfigFilePath];

for (const configPath of configPaths) {
  let existingConfigPath;

  const configWithComments = `${configPath}c`;

  if (fs.existsSync(configPath)) {
    existingConfigPath = configPath;
  } else if (
    !process.env.ADM_CONFIG_FILENAME &&
    fs.existsSync(configWithComments)
  ) {
    existingConfigPath = configWithComments;
  }

  if (existingConfigPath) {
    const loadedConfig = loadConfig(existingConfigPath);

    config = {
      ...config,
      ...loadedConfig,
    };

    break;
  }
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
  // passphrase can be set later
  passphrase: Joi.string().allow(''),
});

const { error, value } = schema.validate(config, {
  allowUnknown: true,
});

if (error) {
  log.error(
    error.toString().replace('ValidationError', 'Config validation error'),
  );
}

export default value;
