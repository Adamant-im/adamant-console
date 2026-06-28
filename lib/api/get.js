import {
  createKeypairFromPassphrase,
  createAddressFromPublicKey,
  decodeMessage,
  TransactionType,
} from 'adamant-api';

import api from '../../utils/api.js';
import config from '../../utils/config.js';

import { requiredParam } from '../../utils/validate.js';

/**
 * Gets account information by ADAMANT address.
 *
 * @param {string} address ADAMANT account address
 * @returns {Promise<object>} Account response, unwrapped from `data` when present
 */
export async function getAddress(address = requiredParam('address')) {
  const res = await api.getAccountInfo({ address });

  return res.data || res;
}

/**
 * Gets block information by block ID.
 *
 * @param {string} id ADAMANT block ID
 * @returns {Promise<object>} Block response, unwrapped from `data` when present
 */
export async function getBlock(id = requiredParam('id')) {
  const res = await api.getBlock(id);

  return res.data || res;
}

/**
 * Gets blocks matching node query parameters.
 *
 * @param {...string} queries Query fragments such as `limit=10` or `orderBy=height:desc`
 * @returns {Promise<object>} Blocks response, unwrapped from `data` when present
 */
export async function getBlocks(...queries) {
  const res = await api.getBlocks(queryStringToObject(queries));

  return res.data || res;
}

/**
 * Gets delegate information by username.
 *
 * @param {string} username Delegate username
 * @returns {Promise<object>} Delegate response, unwrapped from `data` when present
 */
export async function getDelegate(username = requiredParam('username')) {
  const res = await api.getDelegate({ username });

  return res.data || res;
}

/**
 * Gets a chat message transaction and decodes it when a matching passphrase is available.
 *
 * @param {string} id Transaction ID
 * @param {string} [customPassphrase] Optional passphrase used only for local message decoding
 * @returns {Promise<object>} Transaction response, with `transaction.decoded` when decoding succeeds
 */
export async function getMessage(id = requiredParam('id'), customPassphrase) {
  const res = await api.getTransaction(id, { returnAsset: 1 });

  const passphrase = customPassphrase || config.passphrase;

  if (!passphrase) {
    return res;
  }

  const { transaction } = res;
  const messageError = res.errorMessage || res.error;

  if (messageError) {
    return {
      success: false,
      error: messageError,
    };
  }

  if (transaction?.type !== TransactionType.CHAT_MESSAGE) {
    return {
      success: false,
      error: 'Not a message transaction',
    };
  }

  if (transaction.asset?.chat.own_message) {
    const keypair = createKeypairFromPassphrase(passphrase);
    const readerAddress = createAddressFromPublicKey(keypair.publicKey);

    if (
      ![transaction.senderId, transaction.recipientId].includes(readerAddress)
    ) {
      return res;
    }

    const recipientName =
      transaction.senderId === readerAddress
        ? transaction.recipientId
        : transaction.senderId;

    const publicKey = await api.getPublicKey(recipientName);

    if (publicKey) {
      const decoded = decodeMessage(
        transaction.asset.chat.message,
        publicKey,
        keypair,
        transaction.asset.chat.own_message,
      );

      transaction.decoded = decoded;
    }
  }

  return res;
}

/**
 * Gets transaction information by transaction ID.
 *
 * @param {string} id Transaction ID
 * @returns {Promise<object>} Transaction response, unwrapped from `data` when present
 */
export async function getTransaction(id = requiredParam('id')) {
  const res = await api.getTransaction(id);

  return res.data || res;
}

/**
 * Gets transactions matching node query parameters.
 *
 * @param {...string} queries Query fragments such as `senderId=...` or `orderBy=timestamp:desc`
 * @returns {Promise<object>} Transactions response, unwrapped from `data` when present
 */
export async function getTransactions(...queries) {
  const res = await api.getTransactions(queryStringToObject(queries));

  return res.data || res;
}

/**
 * Gets transactions included in a block by block ID.
 *
 * @param {string} blockId ADAMANT block ID
 * @returns {Promise<object>} Transactions response for the block
 */
export async function getTransactionsInBlockById(
  blockId = requiredParam('blockId'),
) {
  return getTransactions(`blockId=${blockId}`, 'orderBy=timestamp:desc');
}

/**
 * Gets transactions included in a block by block height.
 *
 * @param {number|string} height ADAMANT block height
 * @returns {Promise<object>} Transactions response for the block height
 */
export async function getTransactionsInBlockByHeight(
  height = requiredParam('height'),
) {
  return getTransactions(
    `fromHeight=${height}`,
    `and:toHeight=${height}`,
    'orderBy=timestamp:desc',
  );
}

/**
 * Gets incoming ADM transfer transactions for an address.
 *
 * @param {string} address ADAMANT recipient address
 * @returns {Promise<object>} Transactions response for received transfers
 */
export async function getTransactionsReceivedByAddress(
  address = requiredParam('address'),
) {
  return getTransactions(
    `recipientId=${address}`,
    'and:minAmount=1',
    'orderBy=timestamp:desc',
  );
}

/**
 * Converts CLI query fragments into a plain object for `adamant-api`.
 *
 * Commas are accepted as separators for interactive CLI convenience.
 *
 * @param {string[]} queries Query fragments collected from CLI or RPC parameters
 * @returns {Record<string, string>} Query object passed to `adamant-api`
 */
function queryStringToObject(queries) {
  const params = new URLSearchParams(queries.join('&').replace(/,/g, '&'));
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}
