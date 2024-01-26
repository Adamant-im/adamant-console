const api = require('../../utils/api');
const config = require('../../utils/config');

const keys = require('../../utils/keys');
const decrypter = require('../../utils/decryptor');
const { transactionTypes } = require('../../utils/constants');

const { requiredParam } = require('../../utils/validate');

exports.getAddress = async (address = requiredParam('address')) => {
  const res = await api.get('accounts', { address });

  return res.data || res;
};

exports.getBlock = async (id = requiredParam('id')) => {
  const res = await api.get('blocks/get', { id });

  return res.data || res;
};

exports.getBlocks = async (...queries) => {
  const urlQuery = queries.join(',');

  const parsedQuery = new URLSearchParams(urlQuery.replace(/,/g, '&'));

  const res = await api.get('blocks', parsedQuery);

  return res.data || res;
};

exports.getDelegate = async (username = requiredParam('username')) => {
  const res = await api.get('delegates/get', { username });

  return res.data || res;
};

exports.getMessage = async (id = requiredParam('id'), customPassPhrase) => {
  const res = await api.get('transactions/get', { returnAsset: 1, id });

  const passPhrase = customPassPhrase || config.passPhrase;

  if (!passPhrase) {
    return res.data || res;
  }

  const { data } = res;

  if (!data) {
    return res;
  }

  const { transaction } = data;

  if (transaction?.type !== transactionTypes.CHAT_MESSAGE) {
    return {
      success: false,
      error: 'Not a message transaction',
    };
  }

  if (transaction.asset?.chat.own_message) {
    const keypair = keys.createKeypairFromPassPhrase(passPhrase);
    const readerAddress = keys.createAddressFromPublicKey(keypair.publicKey);

    if (
      ![transaction.senderId, transaction.recipientId].includes(readerAddress)
    ) {
      return res.data || res;
    }

    const recipientName =
      transaction.senderId === readerAddress
        ? transaction.recipientId
        : transaction.senderId;

    const publicKey = await api.getPublicKey(recipientName);

    if (publicKey) {
      const decoded = decrypter.decodeMessage(
        transaction.asset.chat.message,
        transaction.asset.chat.own_message,
        keypair.privateKey,
        publicKey,
      );

      transaction.asset.chat.message = decoded;

      delete transaction.asset.chat.own_message;
    }
  }

  return data;
};

exports.getTransaction = async (id = requiredParam('id')) => {
  const res = await api.get('transactions/get', { id });

  return res.data || res;
};

exports.getTransactions = async (...queries) => {
  const urlQuery = queries.join(',');

  const parsedQuery = new URLSearchParams(urlQuery.replace(/,/g, '&'));

  const res = await api.get('transactions', parsedQuery);

  return res.data || res;
};

exports.getTransactionsInBlockById = async (
  blockId = requiredParam('blockId'),
) => exports.getTransactions(`blockId=${blockId}`, 'orderBy=timestamp:desc');

exports.getTransactionsInBlockByHeight = async (
  height = requiredParam('height'),
) =>
  exports.getTransactions(
    `fromHeight=${height}`,
    `and:toHeight=${height}`,
    'orderBy=timestamp:desc',
  );

exports.getTransactionsReceivedByAddress = async (
  address = requiredParam('address'),
) =>
  exports.getTransactions(
    `recipientId=${address}`,
    'and:minAmount=1',
    'orderBy=timestamp:desc',
  );
