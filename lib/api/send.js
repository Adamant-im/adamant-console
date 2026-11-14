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

const amountPattern = /^(\d+(?:\.\d+)?)(?:\s*ADM)?$/;

/**
 * Builds the amount-format error returned for CLI and JSON-RPC callers.
 *
 * @param {unknown} amountInput Rejected amount value
 * @returns {{ success: false, errorMessage: string }} Failed result with an actionable hint
 */
function amountFormatError(amountInput) {
  const raw =
    typeof amountInput === 'string' ? amountInput.trim() : amountInput;
  const suggestion =
    typeof raw === 'string' && /^\d+\.\d+$/.test(raw)
      ? `Use ${raw}ADM for a decimal ADM amount, or an integer number of token units (8 decimals, 1 ADM = 100000000).`
      : 'Use an ADM suffix for decimal ADM amounts, for example 0.001ADM, or an integer number of token units (8 decimals, 1 ADM = 100000000).';

  return {
    success: false,
    errorMessage: `Wrong 'amount' parameter: ${amountInput}. ${suggestion}`,
  };
}

/**
 * Interprets a token amount from CLI or JSON-RPC input.
 *
 * Decimal ADM values require an `ADM` suffix. Integers without a suffix are
 * token units with 8 decimal places, where 1 ADM is 100000000 units. A bare
 * decimal such as `0.001` is rejected.
 *
 * @param {string|number|null|undefined} amountInput Amount text, or an integer number of token units
 * @param {{ optional?: boolean }} [options] When optional, an empty value means no attached tokens
 * @returns {{ amount: number, isAmountInADM: boolean } | { success: false, errorMessage: string }} Parsed amount, or a failed result that explains the accepted formats
 */
function interpretAmount(amountInput, { optional = false } = {}) {
  if (
    optional &&
    (amountInput === '' || amountInput === undefined || amountInput === null)
  ) {
    return { amount: Number.NaN, isAmountInADM: false };
  }

  if (typeof amountInput === 'number') {
    if (Number.isSafeInteger(amountInput) && amountInput >= 0) {
      return { amount: amountInput, isAmountInADM: false };
    }

    return amountFormatError(amountInput);
  }

  if (typeof amountInput !== 'string') {
    return amountFormatError(amountInput);
  }

  const trimmed = amountInput.trim();
  const match = trimmed.match(amountPattern);

  if (!match) {
    return amountFormatError(amountInput);
  }

  const numericText = match[1];
  const isAmountInADM = trimmed.endsWith('ADM');
  const amount = Number(numericText);

  if (!isAmountInADM && numericText.includes('.')) {
    return amountFormatError(amountInput);
  }

  if (!isAmountInADM && !Number.isSafeInteger(amount)) {
    return amountFormatError(amountInput);
  }

  return { amount, isAmountInADM };
}

/**
 * Sends ADM tokens from the configured account.
 *
 * @param {string} address Recipient ADAMANT address or public key
 * @param {string|number} amountString Decimal ADM text such as `0.001ADM`, or an integer number of token units
 * @param {string} [passphrase] Optional passphrase override for RPC/library use
 * @returns {Promise<object>} Send transaction response, unwrapped from `data` when present
 */
export async function sendTokens(
  address = requiredParam('address'),
  amountString = requiredParam('amountString'),
  passphrase,
) {
  const interpreted = interpretAmount(amountString);

  if (interpreted.errorMessage) {
    return interpreted;
  }

  const res = await api.sendTokens(
    passphrase || config.passphrase,
    address,
    interpreted.amount,
    interpreted.isAmountInADM,
  );

  return res.data || res;
}

/**
 * Sends an encrypted chat message, optionally with ADM attached.
 *
 * @param {string} address Recipient ADAMANT address or public key
 * @param {string|object} message Message text or object to serialize
 * @param {string|number} [amountString] Optional decimal ADM text such as `0.1ADM`, or an integer number of token units
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
  const interpreted = interpretAmount(amountString, { optional: true });

  if (interpreted.errorMessage) {
    return interpreted;
  }

  const messageStr =
    typeof message === 'object' ? JSON.stringify(message) : message;

  const res = await api.sendMessage(
    passphrase || config.passphrase,
    address,
    messageStr,
    messageType,
    interpreted.amount,
    interpreted.isAmountInADM,
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
