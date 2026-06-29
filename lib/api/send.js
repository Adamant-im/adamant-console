import { MessageType } from 'adamant-api';

import api from '../../utils/api.js';
import config from '../../utils/config.js';
import { requiredParam } from '../../utils/validate.js';

/**
 * Normalizes JSON-like CLI input for rich and signal messages.
 *
 * @param {string} json JSON string accepted by the CLI
 * @returns {string} JSON string with common shell-friendly substitutions applied
 */
const prepareJSON = (json) => json.replace(/'/g, '"').replace(/\\line/g, '\n');

/**
 * Sends ADM tokens from the configured account.
 *
 * @param {string} address Recipient ADAMANT address or public key
 * @param {string} amountString Token amount, optionally suffixed with `ADM`
 * @param {string} [passphrase] Optional passphrase override for RPC/library use
 * @returns {Promise<object>} Send transaction response, unwrapped from `data` when present
 */
export async function sendTokens(
  address = requiredParam('address'),
  amountString = requiredParam('amountString'),
  passphrase,
) {
  const isAmountInADM = amountString.includes('ADM');
  const amount = parseFloat(amountString, 10);

  const res = await api.sendTokens(
    passphrase || config.passphrase,
    address,
    amount,
    isAmountInADM,
  );

  return res.data || res;
}

/**
 * Sends an encrypted chat message, optionally with ADM attached.
 *
 * @param {string} address Recipient ADAMANT address or public key
 * @param {string|object} message Message text or object to serialize
 * @param {string} [amountString] Optional token amount, optionally suffixed with `ADM`
 * @param {string} [passphrase] Optional passphrase override for RPC/library use
 * @returns {Promise<object>} Send transaction response, unwrapped from `data` when present
 */
export async function sendMessage(
  address = requiredParam('address'),
  message = requiredParam('message'),
  amountString = '',
  passphrase,
) {
  const messageType = MessageType.Chat;
  const isAmountInADM = amountString.includes('ADM');
  const amount = parseFloat(amountString, 10);

  const messageStr =
    typeof message === 'object' ? JSON.stringify(message) : message;

  const res = await api.sendMessage(
    passphrase || config.passphrase,
    address,
    messageStr,
    messageType,
    amount,
    isAmountInADM,
  );

  return res.data || res;
}

/**
 * Sends an encrypted rich message.
 *
 * @param {string} address Recipient ADAMANT address or public key
 * @param {string|object} json Rich message payload
 * @param {string} [passphrase] Optional passphrase override for RPC/library use
 * @returns {Promise<object>} Send transaction response, unwrapped from `data` when present
 */
export async function sendRich(
  address = requiredParam('address'),
  json = requiredParam('json'),
  passphrase,
) {
  const messageType = MessageType.Rich;
  const message =
    typeof json === 'object' ? JSON.stringify(json) : prepareJSON(json);

  const res = await api.sendMessage(
    passphrase || config.passphrase,
    address,
    message,
    messageType,
  );

  return res.data || res;
}

/**
 * Sends an encrypted signal message.
 *
 * @param {string} address Recipient ADAMANT address or public key
 * @param {string|object} json Signal payload
 * @param {string} [passphrase] Optional passphrase override for RPC/library use
 * @returns {Promise<object>} Send transaction response, unwrapped from `data` when present
 */
export async function sendSignal(
  address = requiredParam('address'),
  json = requiredParam('json'),
  passphrase,
) {
  const messageType = MessageType.Signal;
  const message =
    typeof json === 'object' ? JSON.stringify(json) : prepareJSON(json);

  const res = await api.sendMessage(
    passphrase || config.passphrase,
    address,
    message,
    messageType,
  );

  return res.data || res;
}
