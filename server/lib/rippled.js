const axios = require('axios')
const { XrplClient } = require('xrpl-client')
const utils = require('./utils')
const streams = require('./streams')

const RIPPLEDS = []
process.env.VITE_RIPPLED_HOST?.split(',').forEach((d) => {
  const rippled = d.split(':')
  RIPPLEDS.push(
    `wss://${rippled[0]}:${rippled[1] || process.env.VITE_RIPPLED_WS_PORT}`,
    `wss://${rippled[0]}`,
  )
})

const RIPPLED_CLIENT = new XrplClient(RIPPLEDS, { tryAllNodes: true })
// If there is a separate peer to peer server for admin requests, use it. Otherwise use the default url for everything.
const HAS_P2P_SOCKET =
  process.env.VITE_P2P_RIPPLED_HOST != null &&
  process.env.VITE_P2P_RIPPLED_HOST !== ''
const P2P_RIPPLED_CLIENT = HAS_P2P_SOCKET
  ? new XrplClient([
      `wss://${process.env.VITE_P2P_RIPPLED_HOST}:${process.env.VITE_RIPPLED_WS_PORT}`,
    ])
  : undefined

const P2P_URL_BASE = process.env.VITE_P2P_RIPPLED_HOST
  ? process.env.VITE_P2P_RIPPLED_HOST
  : process.env.VITE_RIPPLED_HOST
const URL_HEALTH = `https://${P2P_URL_BASE}:${process.env.VITE_RIPPLED_PEER_PORT}/health`

RIPPLED_CLIENT.on('ledger', (data) => {
  if (data.type === 'ledgerClosed') {
    streams.handleLedger(data)
  }
})

const executeQuery = async (rippledSocket, params) =>
  rippledSocket.send(params).catch((error) => {
    const message =
      error.response && error.response.error_message
        ? error.response.error_message
        : error.toString()
    const code =
      error.response && error.response.status ? error.response.status : 500
    throw new Error(`URL: ${rippledSocket.endpoint} - ${message}`, code)
  })

// generic RPC query
function query(...options) {
  return executeQuery(RIPPLED_CLIENT, ...options)
}

function queryP2P(...options) {
  return executeQuery(P2P_RIPPLED_CLIENT ?? RIPPLED_CLIENT, ...options)
}

// get account info
module.exports.getAccountInfo = (account, ledger_index = 'validated') =>
  query({
    command: 'account_info',
    account,
    ledger_index,
    signer_lists: true,
  }).then((resp) => {
    if (resp.error === 'actNotFound') {
      throw new utils.Error('account not found', 404)
    }

    if (resp.error_message) {
      throw new utils.Error(resp.error_message, 500)
    }

    return Object.assign(resp.account_data, {
      ledger_index: resp.ledger_index,
    })
  })

// get Token balance summary
module.exports.getBalances = (account, ledger_index = 'validated') =>
  queryP2P({
    command: 'gateway_balances',
    account,
    ledger_index,
  }).then((resp) => {
    if (resp.error === 'actNotFound') {
      throw new utils.Error('account not found', 404)
    }

    if (resp.error_message) {
      throw new utils.Error(resp.error_message, 500)
    }

    return resp
  })

module.exports.getOffers = (
  currencyCode,
  issuerAddress,
  pairCurrencyCode,
  pairIssuerAddress,
) =>
  query({
    command: 'book_offers',
    taker_gets: {
      currency: `${currencyCode.toUpperCase()}`,
      issuer:
        currencyCode.toUpperCase() === 'XRP' ? undefined : `${issuerAddress}`,
    },
    taker_pays: {
      currency: `${pairCurrencyCode.toUpperCase()}`,
      issuer:
        pairCurrencyCode.toUpperCase() === 'XRP'
          ? undefined
          : `${pairIssuerAddress}`,
    },
  }).then((resp) => {
    if (resp.error !== undefined || resp.error_message !== undefined) {
      throw new utils.Error(resp.error_message || resp.error, 500)
    }

    return resp
  })

module.exports.getHealth = async () =>
  axios.get(URL_HEALTH).catch((error) => {
    if (error.response) {
      throw new utils.Error(error.response.data, error.response.status)
    } else if (error.request) {
      throw new utils.Error('rippled unreachable', 500)
    } else {
      throw new utils.Error('rippled unreachable', 500)
    }
  })

module.exports.getLedger = (parameters) => {
  const request = {
    command: 'ledger',
    ...parameters,
    transactions: true,
    expand: true,
  }

  return query(request).then((resp) => {
    if (resp.error_message === 'ledgerNotFound') {
      throw new utils.Error('ledger not found', 404)
    }

    if (resp.error_message === 'ledgerIndexMalformed') {
      throw new utils.Error('invalid ledger index/hash', 400)
    }

    if (resp.error_message) {
      throw new utils.Error(resp.error_message, 500)
    }

    if (!resp.validated) {
      throw new utils.Error('ledger not validated', 404)
    }
    return resp.ledger
  })
}
