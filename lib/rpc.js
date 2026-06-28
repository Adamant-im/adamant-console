import rpc from 'jayson/promise/index.js';

import * as api from './api/index.js';
import * as log from '../utils/log.js';
import config from '../utils/config.js';

import { packageInfo } from '../utils/package.js';

/**
 * Safe callback and error handling
 * @param {Function} func Callback function
 * @returns {(...args: unknown[]) => Promise<object>} Wrapped async function that returns an error object instead of throwing
 */
const call =
  (func) =>
  async (...args) => {
    try {
      return await func(...args);
    } catch (error) {
      return {
        success: false,
        error: error.toString(),
      };
    }
  };

/**
 * Extracts an error message from legacy and current `adamant-api` result shapes.
 *
 * @param {object} result API result object
 * @returns {string|undefined} Error message when the result represents a failure
 */
const getResultError = (result) => result.errorMessage || result.error;

/**
 * Returns a function that calls `func` with argument list argArray
 *
 * Example: callWithArgs(func)([1, 2]) => func(1, 2)
 * @param {Function} func Callback function
 * @param {Function} [callback] Optional response mapper
 * @returns {function(Array): Promise<unknown>} JSON-RPC method handler
 */
const callWithArgs = (func, callback) =>
  async function f(argArray) {
    if (!Array.isArray(argArray)) {
      return {
        success: false,
        error: '"params" parameter should be an array',
      };
    }

    const res = await call(func)(...argArray);
    const resultError = getResultError(res);

    if (resultError) {
      throw this.error(501, resultError);
    }

    if (typeof callback === 'function') {
      return callback(res);
    }

    return res;
  };

/**
 * Returns a function that calls `func` with a list of arguments in the form of
 * argObject values specified in the template
 *
 * Example: callWithTemplate(func, ['arg1', 'arg2'])({ arg1: 1, arg2: 2 }) => func(1, 2)
 * @param {Function} func Callback function
 * @param {string[]} [template] Ordered object keys to convert into positional arguments
 * @param {Function} [callback] Optional response mapper
 * @returns {function(object): Promise<unknown>} JSON-RPC method handler
 */
const callWithTemplate = (func, template = [], callback) =>
  async function f(argObject) {
    const argArray = [];

    if (typeof argObject === 'object') {
      for (const key of template) {
        argArray.push(argObject[key]);
      }
    }

    const res = await call(func)(...argArray);
    const resultError = getResultError(res);

    if (resultError) {
      throw this.error(501, resultError);
    }

    if (typeof callback === 'function') {
      return callback(res);
    }

    return res;
  };

/**
 * Registers JSON-RPC server commands.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  const rpcCommand = program.command('rpc');

  rpcCommand
    .command('server')
    .description('runs JSON-RPC server.')
    .action(() => {
      const server = new rpc.Server({
        async clientVersion() {
          return {
            success: true,
            version: packageInfo.version,
          };
        },

        accountNew: callWithArgs(api.createAccount, (data) => data.account),

        delegateNew: callWithArgs(api.createDelegate, (data) => data.account),

        getAddress: callWithArgs(api.getAddress, (data) => data.account),

        getBlock: callWithArgs(api.getBlock, (data) => data.block),

        getBlocks: callWithArgs(api.getBlocks, (data) => data.blocks),

        getDelegate: callWithArgs(api.getDelegate, (data) => data.delegate),

        getMessage: callWithArgs(api.getMessage, (data) => data.transaction),

        getTransaction: callWithArgs(
          api.getTransaction,
          (data) => data.transaction,
        ),

        getTransactionsInBlockById: callWithArgs(
          api.getTransactionsInBlockById,
          (data) => data.transactions,
        ),

        getTransactionsInBlockByHeight: callWithArgs(
          api.getTransactionsInBlockByHeight,
          (data) => data.transactions,
        ),

        getTransactionsReceivedByAddress: callWithArgs(
          api.getTransactionsReceivedByAddress,
          (data) => data.transactions,
        ),

        getTransactions: callWithArgs(
          api.getTransactions,
          (data) => data.transactions,
        ),

        nodeHeight: callWithArgs(api.getNodeHeight, (data) => data.height),

        nodeVersion: callWithArgs(
          api.getNodeVersion,
          ({ commit, version }) => ({ commit, version }),
        ),

        sendTokens: callWithTemplate(
          api.sendTokens,
          ['address', 'amount', 'passphrase'],
          (data) => data.transactionId,
        ),

        sendMessage: callWithTemplate(
          api.sendMessage,
          ['address', 'message', 'amount', 'passphrase'],
          (data) => data.transactionId,
        ),

        sendRich: callWithTemplate(
          api.sendRich,
          ['address', 'data', 'passphrase'],
          (data) => data.transactionId,
        ),

        sendSignal: callWithTemplate(
          api.sendSignal,
          ['address', 'data', 'passphrase'],
          (data) => data.transactionId,
        ),

        voteFor: callWithTemplate(
          api.voteFor,
          ['votes', 'passphrase'],
          (data) => data.transaction,
        ),
      });

      const { port } = config.rpc;

      server.http().listen(port);

      log.log({
        success: true,
        data: `JSON-RPC server listening on port ${port}`,
      });
    });
};
