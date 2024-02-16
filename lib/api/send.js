import api from '../../utils/api.js';
import config from '../../utils/config.js';
import { requiredParam } from '../../utils/validate.js';

const prepareJSON = (json) => json.replace(/'/g, '"').replace(/\\line/g, '\n');

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

export async function sendMessage(
  address = requiredParam('address'),
  message = requiredParam('message'),
  amountString = '',
  passphrase,
) {
  const messageType = 'basic';
  const isAmountInADM = amountString.includes('ADM');
  const amount = parseFloat(amountString, 10);

  const messageStr =
    typeof message === 'object' ? JSON.stringify(message) : message;

  const res = await sendMessage(
    passphrase || config.passphrase,
    address,
    messageStr,
    messageType,
    amount,
    isAmountInADM,
  );

  return res.data || res;
}

export async function sendRich(
  address = requiredParam('address'),
  json = requiredParam('json'),
  passphrase,
) {
  const messageType = 'rich';
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

export async function sendSignal(
  address = requiredParam('address'),
  json = requiredParam('json'),
  passphrase,
) {
  const messageType = 'signal';
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
