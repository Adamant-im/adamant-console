const api = require('../../utils/api');
const config = require('../../utils/config');
const { requiredParam } = require('../../utils/validate');

const prepareJSON = (json) => json.replace(/'/g, '"').replace(/\\line/g, '\n');

exports.sendTokens = async (
  address = requiredParam('address'),
  amountString = requiredParam('amountString'),
  passPhrase,
) => {
  const isAmountInADM = amountString.includes('ADM');
  const amount = parseFloat(amountString, 10);

  const res = await api.sendTokens(
    passPhrase || config.passPhrase,
    address,
    amount,
    isAmountInADM,
  );

  return res.data || res;
};

exports.sendMessage = async (
  address = requiredParam('address'),
  message = requiredParam('message'),
  amountString = '',
  passPhrase,
) => {
  const messageType = 'basic';
  const isAmountInADM = amountString.includes('ADM');
  const amount = parseFloat(amountString, 10);

  const messageStr =
    typeof message === 'object' ? JSON.stringify(message) : message;

  const res = await api.sendMessage(
    passPhrase || config.passPhrase,
    address,
    messageStr,
    messageType,
    amount,
    isAmountInADM,
  );

  return res.data || res;
};

exports.sendRich = async (
  address = requiredParam('address'),
  json = requiredParam('json'),
  passPhrase,
) => {
  const messageType = 'rich';
  const message =
    typeof json === 'object' ? JSON.stringify(json) : prepareJSON(json);

  const res = await api.sendMessage(
    passPhrase || config.passPhrase,
    address,
    message,
    messageType,
  );

  return res.data || res;
};

exports.sendSignal = async (
  address = requiredParam('address'),
  json = requiredParam('json'),
  passPhrase,
) => {
  const messageType = 'signal';
  const message =
    typeof json === 'object' ? JSON.stringify(json) : prepareJSON(json);

  const res = await api.sendMessage(
    passPhrase || config.passPhrase,
    address,
    message,
    messageType,
  );

  return res.data || res;
};
