const os = require('os');
const axios = require('axios');
const utils = require('./utils');

const HOSTNAME = os.hostname();
const URL = `http://${process.env.RIPPLED_HOST}:${process.env.RIPPLED_RPC_PORT}`;
const URL_HEALTH = `http://${process.env.RIPPLED_HOST}:${process.env.RIPPLED_PEER_PORT}/health`;
// If there is a separate peer to peer server for admin requests, use it. Otherwise use the default url for everything.
const P2P_URL = process.env.P2P_RIPPLED_HOST
  ? `http://${process.env.P2P_RIPPLED_HOST}:${process.env.RIPPLED_RPC_PORT}`
  : URL;

const executeQuery = (url, options) => {
  const params = { ...options, headers: { 'X-User': HOSTNAME } };
  return axios.post(url, params).catch(error => {
    const message = error.response && error.response.data ? error.response.data : error.toString();
    const code = error.response && error.response.status ? error.response.status : 500;
    throw new utils.Error(`URL: ${url} - ${message}`, code);
  });
};

// generic RPC query
function query(...options) {
  return executeQuery(URL, ...options);
}

function queryP2P(...options) {
  return executeQuery(P2P_URL, ...options);
}

// get account info
module.exports.getAccountInfo = (account, ledger_index = 'validated') =>
  query({
    method: 'account_info',
    params: [{ account, ledger_index, signer_lists: true }],
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
        ledger_index: resp.ledger_index,
      });
    });

// get Token balance summary
module.exports.getBalances = (account, ledger_index = 'validated') =>
  queryP2P({
    method: 'gateway_balances',
    params: [{ account, ledger_index }],
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

module.exports.getOffers = (currencyCode, issuerAddress, pairCurrencyCode, pairIssuerAddress) => {
  return query({
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
  })
    .then(resp => resp.data.result)
    .then(resp => {
      if (resp.error !== undefined || resp.error_message !== undefined) {
        throw new utils.Error(resp.error_message || resp.error, 500);
      }

      return resp;
    });
};

module.exports.getHealth = async () => {
  return axios.get(URL_HEALTH).catch(error => {
    if (error.response) {
      throw new utils.Error(error.response.data, error.response.status);
    } else if (error.request) {
      throw new utils.Error('rippled unreachable', 500);
    } else {
      throw new utils.Error('rippled unreachable', 500);
    }
  });
};

module.exports.getLedger = parameters => {
  const request = {
    method: 'ledger',
    params: [{ ...parameters, transactions: true, expand: true }],
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
