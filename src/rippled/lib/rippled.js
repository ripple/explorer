import { unix } from 'moment';
import { XrplClient } from 'xrpl-client';
import { Error, XRP_BASE, EPOCH_OFFSET } from './utils';

const N_UNL_INDEX = '2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244';
const P2P_URL = process.env.REACT_APP_P2P_RIPPLED_HOST ?? process.env.REACT_APP_RIPPLED_HOST;

const formatEscrow = d => ({
  id: d.index,
  account: d.Account,
  destination: d.Destination,
  amount: d.Amount / XRP_BASE,
  condition: d.Condition,
  cancelAfter: d.CancelAfter
    ? unix(d.CancelAfter + EPOCH_OFFSET)
        .utc()
        .format()
    : undefined,
  finishAfter: d.FinishAfter
    ? unix(d.FinishAfter + EPOCH_OFFSET)
        .utc()
        .format()
    : undefined,
});

const formatPaychannel = d => ({
  id: d.index,
  account: d.Account,
  destination: d.Destination,
  amount: d.Amount / XRP_BASE,
  balance: d.Balance / XRP_BASE,
  settleDelay: d.SettleDelay,
});

const executeQuery = async (url, options) => {
  const params = { command: options.method };
  if (options.params != null) {
    Object.assign(params, options.params[0]);
  }
  return url.send(params).catch(error => {
    const message =
      error.response && error.response.error_message
        ? error.response.error_message
        : error.toString();
    const code = error.response && error.response.status ? error.response.status : 500;
    throw new Error(`URL: ${url} - ${message}`, code);
  });
};

// generic RPC query
function query(url, options) {
  return executeQuery(url ?? process.env.REACT_APP_RIPPLED_HOST, options);
}

// If there is a separate peer to peer (not reporting mode) server for admin requests, use it.
// Otherwise use the default url for everything.
function queryP2P(url, options) {
  return executeQuery(new XrplClient([`${P2P_URL}:51233`]) ?? url, options);
}

// get ledger
const getLedger = (url, parameters) => {
  const request = {
    method: 'ledger',
    params: [{ ...parameters, transactions: true, expand: true }],
  };

  return query(url, request).then(resp => {
    if (resp.error_message === 'ledgerNotFound') {
      throw new Error('ledger not found', 404);
    }

    if (resp.error_message === 'ledgerIndexMalformed') {
      throw new Error('invalid ledger index/hash', 400);
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500);
    }

    if (!resp.validated) {
      throw new Error('ledger not validated', 404);
    }
    return resp.ledger;
  });
};

// get transaction
const getTransaction = (url, txHash) => {
  const params = {
    method: 'tx',
    params: [{ transaction: txHash }],
  };

  return query(url, params).then(resp => {
    if (resp.error === 'txnNotFound') {
      throw new Error('transaction not found', 404);
    }

    if (resp.error === 'notImpl') {
      throw new Error('invalid transaction hash', 400);
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500);
    }

    if (!resp.validated) {
      throw new Error('transaction not validated', 500);
    }
    return resp;
  });
};

// get account info
const getAccountInfo = (url, account) =>
  query(url, {
    method: 'account_info',
    params: [{ account, ledger_index: 'validated', signer_lists: true }],
  }).then(resp => {
    if (resp.error === 'actNotFound') {
      throw new Error('account not found', 404);
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500);
    }

    return Object.assign(resp.account_data, {
      ledger_index: resp.ledger_index,
    });
  });

// get account escrows
const getAccountEscrows = (url, account, ledger_index = 'validated') =>
  query(url, {
    method: 'account_objects',
    params: [{ account, ledger_index, type: 'escrow', limit: 400 }],
  }).then(resp => {
    if (resp.error === 'actNotFound') {
      throw new Error('account not found', 404);
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500);
    }

    if (!resp.account_objects.length) {
      return undefined;
    }

    const escrows = { in: [], out: [], total: 0, totalIn: 0, totalOut: 0 };
    resp.account_objects.forEach(d => {
      const amount = Number(d.Amount);
      escrows.total += amount;
      if (account === d.Destination) {
        escrows.in.push(formatEscrow(d));
        escrows.totalIn += amount;
      } else {
        escrows.out.push(formatEscrow(d));
        escrows.totalOut += amount;
      }
    });

    escrows.total /= XRP_BASE;
    escrows.totalIn /= XRP_BASE;
    escrows.totalOut /= XRP_BASE;
    return escrows;
  });

// get account paychannels
const getAccountPaychannels = async (url, account, ledger_index = 'validated') => {
  const list = [];
  let remaining = 0;
  const getChannels = marker =>
    query(url, {
      method: 'account_objects',
      params: [{ marker, account, ledger_index, type: 'payment_channel', limit: 400 }],
    }).then(resp => {
      if (resp.error === 'actNotFound') {
        throw new Error('account not found', 404);
      }

      if (resp.error_message) {
        throw new Error(resp.error_message, 500);
      }

      if (!resp.account_objects.length) {
        return undefined;
      }

      list.push(...resp.account_objects);
      if (resp.marker) {
        return getChannels(resp.marker);
      }

      return null;
    });

  await getChannels();
  const channels = list.map(c => {
    remaining += c.Amount - c.Balance;
    return formatPaychannel(c);
  });
  return channels.length
    ? {
        channels,
        total_available: remaining / XRP_BASE,
      }
    : null;
};

// get Token balance summary
const getBalances = (url, account, ledger_index = 'validated') =>
  queryP2P(url, {
    method: 'gateway_balances',
    params: [{ account, ledger_index }],
  }).then(resp => {
    if (resp.error === 'actNotFound') {
      throw new Error('account not found', 404);
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500);
    }

    return resp;
  });

// get account transactions
const getAccountTransactions = (url, account, limit = 20, marker = '') => {
  const markerComponents = marker.split('.');
  const ledger = parseInt(markerComponents[0], 10);
  const seq = parseInt(markerComponents[1], 10);
  return query(url, {
    method: 'account_tx',
    params: [
      {
        account,
        limit,
        ledger_index_max: -1,
        ledger_index_min: -1,
        marker: marker
          ? {
              ledger,
              seq,
            }
          : undefined,
      },
    ],
  }).then(resp => {
    if (resp.error === 'actNotFound') {
      throw new Error('account not found', 404);
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500);
    }
    return {
      transactions: resp.transactions,
      marker: resp.marker ? `${resp.marker.ledger}.${resp.marker.seq}` : undefined,
    };
  });
};

const getNegativeUNL = url =>
  query(url, {
    method: 'ledger_entry',
    params: [
      {
        index: N_UNL_INDEX,
      },
    ],
  }).then(resp => {
    if (resp.error === 'entryNotFound') {
      return [];
    }

    if (resp.error_message) {
      throw new Error(resp.error_message, 500);
    }

    return resp;
  });

const getServerInfo = url =>
  query(url, {
    method: 'server_info',
  }).then(resp => {
    if (resp.error !== undefined || resp.error_message !== undefined) {
      throw new Error(resp.error_message || resp.error, 500);
    }

    return resp;
  });

const getOffers = (url, currencyCode, issuerAddress, pairCurrencyCode, pairIssuerAddress) => {
  return query(url, {
    method: 'book_offers',
    params: [
      {
        taker_gets: {
          currency: `${currencyCode.toUpperCase()}`,
          issuer: currencyCode.toUpperCase() === 'XRP' ? undefined : `${issuerAddress}`,
        },
        taker_pays: {
          currency: `${pairCurrencyCode.toUpperCase()}`,
          issuer: pairCurrencyCode.toUpperCase() === 'XRP' ? undefined : `${pairIssuerAddress}`,
        },
      },
    ],
  }).then(resp => {
    if (resp.error !== undefined || resp.error_message !== undefined) {
      throw new Error(resp.error_message || resp.error, 500);
    }

    return resp;
  });
};
export {
  getLedger,
  getTransaction,
  getAccountInfo,
  getAccountEscrows,
  getAccountPaychannels,
  getBalances,
  getAccountTransactions,
  getNegativeUNL,
  getServerInfo,
  getOffers,
};
