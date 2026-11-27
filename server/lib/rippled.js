const axios = require('axios')
const { Client, RippledError } = require('xrpl')
const log = require('./logger')({ name: 'rippled' })
const utils = require('./utils')
const streams = require('./streams')

const RIPPLEDS = []
process.env.VITE_RIPPLED_HOST?.split(',')
  .filter((host) => host)
  .forEach((host) => {
    if (host.includes(':')) {
      RIPPLEDS.push(`wss://${host}`)
    } else if (process.env.VITE_RIPPLED_WS_PORT) {
      RIPPLEDS.push(`wss://${host}:${process.env.VITE_RIPPLED_WS_PORT}`)
    } else {
      RIPPLEDS.push(`wss://${host}`)
    }
  })

const P2P_URL_BASE = process.env.VITE_P2P_RIPPLED_HOST
  ? process.env.VITE_P2P_RIPPLED_HOST
  : process.env.VITE_RIPPLED_HOST
const URL_HEALTH = `https://${P2P_URL_BASE}:${process.env.VITE_RIPPLED_PEER_PORT}/health`

// If no ledger arrives for this long, the connection is replaced even if the
// socket still looks open (silently dropped connection, lost subscription,
// unsynced node, or a failed initial connect).
const LEDGER_TIMEOUT = 60 * 1000
const WATCHDOG_INTERVAL = 10 * 1000
// how long a request waits for the socket to connect before it is sent anyway
const CONNECT_WAIT = 10 * 1000

let client
let endpointIndex = 0
let lastConnectAt = 0
let lastLedgerAt = 0
let lastLedgerIndex

const getEndpoint = () => RIPPLEDS[endpointIndex % RIPPLEDS.length]

const handleLedgerClosed = (data) => {
  lastLedgerAt = Date.now()
  lastLedgerIndex = data.ledger_index
  log.info(`Received ${data?.type} message`)
  try {
    streams.handleLedger(data)
  } catch (error) {
    log.error(`Failed to handle ledger ${data?.ledger_index}:`, error)
  }
}

const connect = () => {
  const endpoint = getEndpoint()
  const rippledClient = new Client(endpoint)
  // keep the API v1 response format the rest of the server expects
  rippledClient.apiVersion = 1

  // xrpl.js does not restore subscriptions after it reconnects
  rippledClient.on('connected', () => {
    log.info(`Connected to ${endpoint}`)
    rippledClient
      .request({ command: 'subscribe', streams: ['ledger'] })
      .catch((error) =>
        log.error(`Failed to subscribe to ledgers on ${endpoint}:`, error),
      )
  })
  rippledClient.on('disconnected', (code) => {
    log.warn(`Disconnected from ${endpoint} (code ${code})`)
  })
  rippledClient.on('error', (code, message) => {
    log.error(`Rippled client error on ${endpoint}: ${code} ${message}`)
  })
  rippledClient.on('ledgerClosed', handleLedgerClosed)

  client = rippledClient
  lastConnectAt = Date.now()
  rippledClient
    .connect()
    .catch((error) => log.error(`Failed to connect to ${endpoint}:`, error))
}

// Drop the current connection and connect to the next endpoint
const reconnect = () => {
  const oldClient = client
  oldClient.removeAllListeners()
  // late errors from the old connection must not crash the process
  oldClient.on('error', () => {})
  // the second disconnect() cancels the reconnect xrpl.js schedules when the
  // old socket closes abnormally
  oldClient
    .disconnect()
    .then(() => oldClient.disconnect())
    .catch(() => {})

  endpointIndex += 1
  connect()
}

if (RIPPLEDS.length > 0) {
  connect()

  setInterval(() => {
    const idle = Date.now() - Math.max(lastLedgerAt, lastConnectAt)
    if (idle > LEDGER_TIMEOUT) {
      log.error(
        `No ledger from ${getEndpoint()} in ${idle / 1000}s, reconnecting`,
      )
      reconnect()
    }
  }, WATCHDOG_INTERVAL)

  setInterval(() => {
    log.info('Rippled client:', {
      state: {
        endpoint: getEndpoint(),
        connected: client.isConnected(),
        lastLedgerIndex,
        secSinceLastLedger: lastLedgerAt
          ? (Date.now() - lastLedgerAt) / 1000
          : null,
      },
    })
  }, 60_000) // Log rippled client state every 60 seconds
}

// xrpl.js rejects requests while the socket is (re)connecting, unlike
// xrpl-client which queued them, so wait for the connection first
const waitForConnection = (rippledClient) =>
  new Promise((resolve) => {
    let timer
    const onConnected = () => {
      clearTimeout(timer)
      resolve()
    }
    timer = setTimeout(() => {
      rippledClient.off('connected', onConnected)
      resolve()
    }, CONNECT_WAIT)
    rippledClient.once('connected', onConnected)
  })

// generic RPC query
const query = async (request) => {
  if (!client) {
    throw new Error('No rippled host configured')
  }

  if (!client.isConnected()) {
    await waitForConnection(client)
  }

  try {
    const response = await client.request(request)
    return response.result
  } catch (error) {
    // xrpl.js rejects rippled error responses; return them like a normal
    // response so callers can map the error codes themselves
    if (error instanceof RippledError) {
      return error.data
    }
    throw new Error(`URL: ${getEndpoint()} - ${error.message}`)
  }
}

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

// get AMM info by AMM account ID
module.exports.getAMMInfo = (ammAccountId) =>
  query({
    command: 'amm_info',
    amm_account: ammAccountId,
    ledger_index: 'validated',
  }).then((resp) => {
    if (resp.error_message) {
      throw new utils.Error(resp.error_message, 500)
    }
    return resp
  })
