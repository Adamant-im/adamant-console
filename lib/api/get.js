import {
  createKeypairFromPassphrase,
  createAddressFromPublicKey,
  decodeMessage,
  TransactionType,
} from 'adamant-api';

import api from '../../utils/api.js';
import config from '../../utils/config.js';

import { requiredParam } from '../../utils/validate.js';

const delegateLookupKeys = new Set(['username', 'publicKey', 'address']);
const logicalQueryPrefixes = new Map([
  ['and:', 'and'],
  ['or:', 'or'],
]);
const controlQueryKeys = new Set([
  'limit',
  'offset',
  'orderBy',
  'returnUnconfirmed',
  'returnAsset',
  'includeDirectTransfers',
  'withoutDirectTransfers',
  'userId',
]);

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
 * Gets delegate information by username, public key, or address.
 *
 * @param {string} identifier Delegate username, public key, or ADAMANT address
 * @param {'username'|'publicKey'|'address'} [lookupKey] Explicit lookup key
 * @returns {Promise<object>} Delegate response, unwrapped from `data` when present
 */
export async function getDelegate(
  identifier = requiredParam('identifier'),
  lookupKey,
) {
  const key = lookupKey || getDelegateLookupKey(identifier);

  if (!delegateLookupKeys.has(key)) {
    throw new Error(
      `Invalid delegate lookup key '${key}'. Use username, publicKey, or address`,
    );
  }

  const res = await api.getDelegate({ [key]: identifier });

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

  const { transaction } = res;
  const messageError = res.errorMessage || res.error;

  if (messageError) {
    return {
      success: false,
      error: messageError,
    };
  }

  const passphrase = customPassphrase || config.passphrase;

  if (!passphrase) {
    return res;
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
export async function getTransaction(id = requiredParam('id'), ...queries) {
  const res = await api.getTransaction(id, queryStringToObject(queries));

  return res.data || res;
}

/**
 * Gets chat rooms for an ADAMANT address.
 *
 * @param {string} address ADAMANT account address
 * @param {...string} queries Query fragments such as `includeDirectTransfers=1`
 * @returns {Promise<object>} Chat rooms response, unwrapped from `data` when present
 */
export async function getChats(address = requiredParam('address'), ...queries) {
  const queryObject = chatQueryStringToObject(queries);

  if (queryObject.errorMessage) {
    return queryObject;
  }

  const res = await api.getChats(address, queryObject);

  return res.data || res;
}

/**
 * Gets chat message transactions between two ADAMANT addresses.
 *
 * @param {string} ownAddress First ADAMANT account address
 * @param {string} partnerAddress Second ADAMANT account address
 * @param {...string} queries Query fragments such as `returnUnconfirmed=1`
 * @returns {Promise<object>} Chat messages response, unwrapped from `data` when present
 */
export async function getChatMessages(
  ownAddress = requiredParam('ownAddress'),
  partnerAddress = requiredParam('partnerAddress'),
  ...queries
) {
  const queryObject = chatQueryStringToObject(queries);

  if (queryObject.errorMessage) {
    return queryObject;
  }

  const res = await api.getChatMessages(
    ownAddress,
    partnerAddress,
    queryObject,
  );

  return res.data || res;
}

/**
 * Gets chat transactions through the legacy `/api/chats/get` endpoint.
 *
 * Prefer `getChats` or `getChatMessages` for new callers.
 *
 * @param {...string} queries Query fragments such as `senderId=...`
 * @returns {Promise<object>} Chat transaction response, unwrapped from `data` when present
 */
export async function getChatTransactions(...queries) {
  const queryObject = chatQueryStringToObject(queries);

  if (queryObject.errorMessage) {
    return queryObject;
  }

  const res = await api.getChatTransactions(queryObject);

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
 * Explicit `and:` and `or:` prefixes are converted into logical groups for
 * `adamant-api` v3. Unprefixed transaction filters stay at the top level, where
 * `adamant-api` combines them with AND by default.
 *
 * @param {string[]} queries Query fragments collected from CLI or RPC parameters
 * @returns {Record<string, string|object>} Query object passed to `adamant-api`
 */
export function queryStringToObject(queries) {
  const params = new URLSearchParams(queries.join('&').replace(/,/g, '&'));
  const result = {};

  for (const [key, value] of params.entries()) {
    assignQueryParam(result, key, value);
  }

  normalizeDirectTransferFilters(result);

  return result;
}

/**
 * Converts CLI query fragments into plain AND-combined parameters for chat and
 * chatroom endpoints (`/api/chats/get` and `/api/chatrooms/*`).
 *
 * ADAMANT Node v0.11.0 normalizes `and:` prefixes to plain field names and
 * rejects `or:` filters on chat and chatroom endpoints. Released pre-v0.11.0
 * nodes ignore `and:` and `or:` prefixes on those endpoints. Flattening `and:`
 * to plain names and rejecting `or:` keeps behavior consistent across node
 * versions.
 *
 * @param {string[]} queries Query fragments collected from CLI or RPC parameters
 * @returns {Record<string, string> | { success: false, errorMessage: string }} Plain query object, or a failed result when `or:` filters are present
 */
function chatQueryStringToObject(queries) {
  const parsed = queryStringToObject(queries);

  if (
    parsed.or &&
    typeof parsed.or === 'object' &&
    Object.keys(parsed.or).length > 0
  ) {
    return {
      success: false,
      errorMessage:
        'OR filters (or:) are not supported on chat and chatroom endpoints. Use plain filter names, which are combined with AND.',
    };
  }

  delete parsed.or;

  if (parsed.and && typeof parsed.and === 'object') {
    for (const [key, value] of Object.entries(parsed.and)) {
      if (!(key in parsed)) {
        parsed[key] = value;
      }
    }

    delete parsed.and;
  }

  return parsed;
}

/**
 * Assigns one parsed query parameter to the object shape expected by `adamant-api`.
 *
 * @param {Record<string, string|object>} result Parsed query object being built
 * @param {string} key Query parameter key
 * @param {string} value Query parameter value
 * @returns {void}
 */
function assignQueryParam(result, key, value) {
  for (const [prefix, groupName] of logicalQueryPrefixes) {
    if (!key.startsWith(prefix)) {
      continue;
    }

    const fieldName = key.slice(prefix.length);

    if (controlQueryKeys.has(fieldName)) {
      // Prefixed control options share the top-level option namespace; duplicates are last-write-wins.
      result[fieldName] = value;
      return;
    }

    const group = getLogicalQueryGroup(result, groupName);
    group[fieldName] = value;
    return;
  }

  result[key] = value;
}

/**
 * Gets or creates a logical query group.
 *
 * @param {Record<string, string|object>} result Parsed query object being built
 * @param {'and'|'or'} groupName Logical group name
 * @returns {Record<string, string>} Logical group object
 */
function getLogicalQueryGroup(result, groupName) {
  if (
    !result[groupName] ||
    typeof result[groupName] !== 'object' ||
    Array.isArray(result[groupName])
  ) {
    result[groupName] = {};
  }

  return result[groupName];
}

/**
 * Infers the delegate lookup parameter expected by `/api/delegates/get`.
 *
 * @param {string} identifier Delegate username, public key, or address
 * @returns {'username'|'publicKey'|'address'} Delegate lookup key
 */
function getDelegateLookupKey(identifier) {
  if (/^U\d{6,21}$/.test(identifier)) {
    return 'address';
  }

  if (/^[a-fA-F0-9]{64}$/.test(identifier)) {
    return 'publicKey';
  }

  return 'username';
}

/**
 * Converts deprecated direct-transfer filters into the Node v0.10 parameter.
 *
 * @param {Record<string, string|object>} params Parsed query parameters
 * @returns {void}
 */
function normalizeDirectTransferFilters(params) {
  if (
    'withoutDirectTransfers' in params &&
    !('includeDirectTransfers' in params)
  ) {
    params.includeDirectTransfers = invertBooleanParam(
      params.withoutDirectTransfers,
    );
  }

  delete params.withoutDirectTransfers;
}

/**
 * Inverts a query-string boolean while preserving `0` and `1` string values.
 *
 * @param {string} value Query-string boolean value
 * @returns {string} Inverted boolean value
 */
function invertBooleanParam(value) {
  switch (String(value).toLowerCase()) {
    case '1':
    case 'true':
      return '0';
    case '0':
    case 'false':
      return '1';
    default:
      return value;
  }
}
