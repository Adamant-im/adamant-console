import rpc from 'jayson/promise/index.js';

import * as api from './api/index.js';
import * as log from '../utils/log.js';
import config from '../utils/config.js';

import packageInfo from '../package.json' assert { type: 'json' };

/**
 * Safe callback and error handling
 * @param {Function} func Callback function
 * @returns { (...args) => Promise }
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
 * Returns a function that calls `func` with argument list argArray
 *
 * Example: callWithArgs(func)([1, 2]) => func(1, 2)
 * @param {Function} func Callback function
 * @returns { (argArray: any[]) => Promise }
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

    if (res.error) {
      throw this.error(501, res.error);
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
 * @returns { (argArray: any[]) => Promise }
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

    if (res.error) {
      throw this.error(501, res.error);
    }

    if (typeof callback === 'function') {
      return callback(res);
    }

    return res;
  };

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
          ['address', 'amount', 'passPhrase'],
          (data) => data.transactionId,
        ),

        sendMessage: callWithTemplate(
          api.sendMessage,
          ['address', 'message', 'amount', 'passPhrase'],
          (data) => data.transactionId,
        ),

        sendRich: callWithTemplate(
          api.sendRich,
          ['address', 'data', 'passPhrase'],
          (data) => data.transactionId,
        ),

        sendSignal: callWithTemplate(
          api.sendSignal,
          ['address', 'data', 'passPhrase'],
          (data) => data.transactionId,
        ),

        voteFor: callWithTemplate(
          api.voteFor,
          ['votes', 'passPhrase'],
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
