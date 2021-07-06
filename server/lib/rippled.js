const os = require('os');
const axios = require('axios');
const moment = require('moment');
const utils = require('./utils');

const HOSTNAME = os.hostname();
const URL = `https://${process.env.RIPPLED_HOST}:${process.env.RIPPLED_RPC_PORT}`;
const N_UNL_INDEX = '2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244';

const formatEscrow = d => ({
  id: d.index,
  account: d.Account,
  destination: d.Destination,
  amount: d.Amount / utils.XRP_BASE,
  condition: d.Condition,
  cancelAfter: d.CancelAfter
    ? moment
        .unix(d.CancelAfter + utils.EPOCH_OFFSET)
        .utc()
        .format()
    : undefined,
  finishAfter: d.FinishAfter
    ? moment
        .unix(d.FinishAfter + utils.EPOCH_OFFSET)
        .utc()
        .format()
    : undefined
});

const formatPaychannel = d => ({
  id: d.index,
  account: d.Account,
  destination: d.Destination,
  amount: d.Amount / utils.XRP_BASE,
  balance: d.Balance / utils.XRP_BASE,
  settleDelay: d.SettleDelay
});

// generic RPC query
const query = options => {
  const params = { ...options, headers: { 'X-User': HOSTNAME } };
  return axios.post(URL, params).catch(error => {
    const message = error.response && error.response.data ? error.response.data : error.toString();
    const code = error.response && error.response.status ? error.response.status : 500;
    throw new utils.Error(`URL: ${URL} - ${message}`, code);
  });
};

// get ledger
module.exports.getLedger = parameters => {
  const request = {
    method: 'ledger',
    params: [{ ...parameters, transactions: true, expand: true }]
  };

  return query(request)
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error_message === 'ledgerNotFound') {
        throw new utils.Error('ledger not found', 404);
      }

      if (resp.error_message === 'ledgerIndexMalformed') {
        throw new utils.Error('invalid ledger index/hash', 400);
      }

      if (resp.error_message) {
        throw new utils.Error(resp.error_message, 500);
      }

      if (!resp.validated) {
        throw new utils.Error('ledger not validated', 404);
      }
      return resp.ledger;
    });
};

// get transaction
module.exports.getTransaction = txHash => {
  const params = {
    method: 'tx',
    params: [{ transaction: txHash }]
  };

  return query(params)
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error === 'txnNotFound') {
        throw new utils.Error('transaction not found', 404);
      }

      if (resp.error === 'notImpl') {
        throw new utils.Error('invalid transaction hash', 400);
      }

      if (resp.error_message) {
        throw new utils.Error(resp.error_message, 500);
      }

      if (!resp.validated) {
        throw new utils.Error('transaction not validated', 500);
      }

      return resp;
    });
};

// get account info
module.exports.getAccountInfo = (account, ledger_index = 'validated') =>
  query({
    method: 'account_info',
    params: [{ account, ledger_index, signer_lists: true }]
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error === 'actNotFound') {
        throw new utils.Error('account not found', 404);
      }

      if (resp.error_message) {
        throw new utils.Error(resp.error_message, 500);
      }

      return Object.assign(resp.account_data, {
        ledger_index: resp.ledger_index
      });
    });

// get account escrows
module.exports.getAccountEscrows = (account, ledger_index = 'validated') =>
  query({
    method: 'account_objects',
    params: [{ account, ledger_index, type: 'escrow', limit: 400 }]
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error === 'actNotFound') {
        throw new utils.Error('account not found', 404);
      }

      if (resp.error_message) {
        throw new utils.Error(resp.error_message, 500);
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

      escrows.total /= utils.XRP_BASE;
      escrows.totalIn /= utils.XRP_BASE;
      escrows.totalOut /= utils.XRP_BASE;
      return escrows;
    });

// get account paychannels
module.exports.getAccountPaychannels = async (account, ledger_index = 'validated') => {
  const list = [];
  let remaining = 0;
  const getChannels = marker =>
    query({
      method: 'account_objects',
      params: [{ marker, account, ledger_index, type: 'payment_channel', limit: 400 }]
    })
      .then(resp => resp.data.result)
      .then(resp => {
        if (resp.error === 'actNotFound') {
          throw new utils.Error('account not found', 404);
        }

        if (resp.error_message) {
          throw new utils.Error(resp.error_message, 500);
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
        total_available: remaining / utils.XRP_BASE
      }
    : null;
};

// get Token balance summary
module.exports.getBalances = (account, ledger_index = 'validated') =>
  query({
    method: 'gateway_balances',
    params: [{ account, ledger_index }]
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error === 'actNotFound') {
        throw new utils.Error('account not found', 404);
      }

      if (resp.error_message) {
        throw new utils.Error(resp.error_message, 500);
      }

      return resp;
    });

// get account transactions
module.exports.getAccountTransactions = (account, limit = 20, marker = '') => {
  const markerComponents = marker.split('.');
  const ledger = parseInt(markerComponents[0], 10);
  const seq = parseInt(markerComponents[1], 10);
  return query({
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
              seq
            }
          : undefined
      }
    ]
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error === 'actNotFound') {
        throw new utils.Error('account not found', 404);
      }

      if (resp.error_message) {
        throw new utils.Error(resp.error_message, 500);
      }
      return {
        transactions: resp.transactions,
        marker: resp.marker ? `${resp.marker.ledger}.${resp.marker.seq}` : undefined
      };
    });
};

module.exports.getNegativeUNL = () =>
  query({
    method: 'ledger_entry',
    params: [
      {
        index: N_UNL_INDEX
      }
    ]
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error === 'entryNotFound') {
        return [];
      }

      if (resp.error_message) {
        throw new utils.Error(resp.error_message, 500);
      }

      return resp;
    });

module.exports.getServerInfo = () =>
  query({
    method: 'server_info'
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error !== undefined || resp.error_message !== undefined) {
        throw new utils.Error(resp.error_message || resp.error, 500);
      }

      return resp;
    });

module.exports.getOffers = (currencyCode, issuerAddress, pairCurrencyCode, pairIssuerAddress) => {
  return query({
    method: 'book_offers',
    params: [
      {
        taker_gets: {
          currency: `${currencyCode.toUpperCase()}`,
          issuer: currencyCode.toUpperCase() === 'XRP' ? undefined : `${issuerAddress}`
        },
        taker_pays: {
          currency: `${pairCurrencyCode.toUpperCase()}`,
          issuer: pairCurrencyCode.toUpperCase() === 'XRP' ? undefined : `${pairIssuerAddress}`
        }
      }
    ]
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error !== undefined || resp.error_message !== undefined) {
        throw new utils.Error(resp.error_message || resp.error, 500);
      }

      return resp;
    });
};
