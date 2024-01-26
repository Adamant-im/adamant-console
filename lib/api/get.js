import {
  createKeypairFromPassphrase,
  createAddressFromPublicKey,
  decodeMessage,
  TransactionType,
} from 'adamant-api';

import api from '../../utils/api.js';
import config from '../../utils/config.js';

import { requiredParam } from '../../utils/validate.js';

export async function getAddress(address = requiredParam('address')) {
  const res = await api.getAccountInfo({ address });

  return res.data || res;
}

export async function getBlock(id = requiredParam('id')) {
  const res = await api.getBlock(id);

  return res.data || res;
}

export async function getBlocks(...queries) {
  const res = await api.getBlocks(queryStringToObject(queries));

  return res.data || res;
}

export async function getDelegate(username = requiredParam('username')) {
  const res = await api.getDelegate({ username });

  return res.data || res;
}

export async function getMessage(id = requiredParam('id'), customPassphrase) {
  const res = await api.getTransaction(id, { returnAsset: 1 });

  const passphrase = customPassphrase || config.passphrase;

  if (!passphrase) {
    return res.data || res;
  }

  const { data } = res;

  if (!data) {
    return res;
  }

  const { transaction } = data;

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
      return res.data || res;
    }

    const recipientName =
      transaction.senderId === readerAddress
        ? transaction.recipientId
        : transaction.senderId;

    const publicKey = await api.getPublicKey(recipientName);

    if (publicKey) {
      const decoded = decodeMessage(
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
}

export async function getTransaction(id = requiredParam('id')) {
  const res = await api.getTransaction(id);

  return res.data || res;
}

export async function getTransactions(...queries) {
  const res = await api.getTransactions(queryStringToObject(queries));

  return res.data || res;
}

export async function getTransactionsInBlockById(
  blockId = requiredParam('blockId'),
) {
  return getTransactions(`blockId=${blockId}`, 'orderBy=timestamp:desc');
}

export async function getTransactionsInBlockByHeight(
  height = requiredParam('height'),
) {
  return getTransactions(
    `fromHeight=${height}`,
    `and:toHeight=${height}`,
    'orderBy=timestamp:desc',
  );
}

export async function getTransactionsReceivedByAddress(
  address = requiredParam('address'),
) {
  return getTransactions(
    `recipientId=${address}`,
    'and:minAmount=1',
    'orderBy=timestamp:desc',
  );
}

function queryStringToObject(queries) {
  const params = new URLSearchParams(queries.join('&').replace(/,/g, '&'));
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}
