/**
 * @jest-environment node
 */
/* eslint-disable global-require -- modules are re-required per test so each starts with a fresh connection */
const mockClients = []
const mockLogs = []

jest.mock('xrpl', () => {
  const { EventEmitter } = require('events')

  class RippledError extends Error {
    constructor(message, data) {
      super(message)
      this.data = data
    }
  }

  function Client(url) {
    const client = new EventEmitter()
    Object.assign(client, {
      url,
      connected: true,
      requests: [],
      disconnectCalls: 0,
      onRequest: () => Promise.resolve({ result: {} }),
      connect: () => Promise.resolve(),
      disconnect: () => {
        client.disconnectCalls += 1
        return Promise.resolve()
      },
      isConnected: () => client.connected,
      request: (request) => {
        client.requests.push(request)
        return client.onRequest(request)
      },
    })
    mockClients.push(client)
    return client
  }

  return { Client, RippledError }
})

jest.mock('../logger', () => () => ({
  info: (...args) => mockLogs.push(['info', ...args]),
  warn: (...args) => mockLogs.push(['warn', ...args]),
  error: (...args) => mockLogs.push(['error', ...args]),
  debug: () => {},
}))

jest.mock('../streams', () => ({ handleLedger: jest.fn() }))

const SUBSCRIBE = { command: 'subscribe', streams: ['ledger'] }
const AMM_INFO = {
  command: 'amm_info',
  amm_account: 'rAMM',
  ledger_index: 'validated',
}
const ledgerClosed = (index) => ({ type: 'ledgerClosed', ledger_index: index })
const flushPromises = () =>
  new Promise(jest.requireActual('timers').setImmediate)

const loadRippled = (host = 'a.example.com:51233,b.example.com:51233') => {
  process.env.VITE_RIPPLED_HOST = host
  let modules
  jest.isolateModules(() => {
    modules = {
      rippled: require('../rippled'),
      streams: require('../streams'),
      xrpl: require('xrpl'),
    }
  })
  return modules
}

describe('rippled', () => {
  const originalHost = process.env.VITE_RIPPLED_HOST

  beforeEach(() => {
    mockClients.length = 0
    mockLogs.length = 0
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    if (originalHost === undefined) {
      delete process.env.VITE_RIPPLED_HOST
    } else {
      process.env.VITE_RIPPLED_HOST = originalHost
    }
  })

  it('connects to the first host and subscribes to ledgers on every connect', () => {
    loadRippled()

    expect(mockClients).toHaveLength(1)
    const [client] = mockClients
    expect(client.url).toBe('wss://a.example.com:51233')
    expect(client.apiVersion).toBe(1)

    client.emit('connected')
    // xrpl.js emits `connected` again after reconnecting on its own
    client.emit('connected')
    expect(client.requests).toEqual([SUBSCRIBE, SUBSCRIBE])
  })

  it('passes ledgers to streams and logs errors from the handler', () => {
    const { streams } = loadRippled()
    streams.handleLedger.mockImplementation(() => {
      throw new Error('boom')
    })

    expect(() =>
      mockClients[0].emit('ledgerClosed', ledgerClosed(5)),
    ).not.toThrow()
    expect(streams.handleLedger).toHaveBeenCalledWith(ledgerClosed(5))
    expect(
      mockLogs.some(
        ([level, message]) => level === 'error' && message.includes('ledger 5'),
      ),
    ).toBe(true)
  })

  it('replaces the connection when no ledger arrives for 60s', async () => {
    const { streams } = loadRippled()
    const [first] = mockClients

    jest.advanceTimersByTime(50_000)
    first.emit('ledgerClosed', ledgerClosed(1))
    jest.advanceTimersByTime(50_000)
    expect(mockClients).toHaveLength(1)

    jest.advanceTimersByTime(20_000)
    expect(mockClients).toHaveLength(2)
    const second = mockClients[1]
    expect(second.url).toBe('wss://b.example.com:51233')

    await flushPromises()
    expect(first.disconnectCalls).toBe(2)

    // the old connection no longer feeds metrics or crashes on late errors
    first.emit('ledgerClosed', ledgerClosed(2))
    expect(streams.handleLedger).toHaveBeenCalledTimes(1)
    expect(() => first.emit('error', 'websocket', 'late error')).not.toThrow()

    second.emit('ledgerClosed', ledgerClosed(3))
    expect(streams.handleLedger).toHaveBeenLastCalledWith(ledgerClosed(3))
  })

  it('getLedger returns validated ledgers and maps rippled errors', async () => {
    const { rippled, xrpl } = loadRippled()
    const [client] = mockClients

    client.onRequest = () =>
      Promise.resolve({
        result: { ledger: { ledger_index: '7' }, validated: true },
      })
    await expect(rippled.getLedger({ ledger_hash: 'ABC' })).resolves.toEqual({
      ledger_index: '7',
    })
    expect(client.requests[0]).toEqual({
      command: 'ledger',
      ledger_hash: 'ABC',
      transactions: true,
      expand: true,
    })

    client.onRequest = () =>
      Promise.reject(
        new xrpl.RippledError('ledgerNotFound', {
          status: 'error',
          error: 'lgrNotFound',
          error_message: 'ledgerNotFound',
        }),
      )
    await expect(
      rippled.getLedger({ ledger_hash: 'ABC' }),
    ).rejects.toMatchObject({ message: 'ledger not found', code: 404 })

    client.onRequest = () =>
      Promise.resolve({ result: { ledger: {}, validated: false } })
    await expect(
      rippled.getLedger({ ledger_hash: 'ABC' }),
    ).rejects.toMatchObject({ message: 'ledger not validated', code: 404 })

    client.onRequest = () => Promise.reject(new Error('Not connected'))
    await expect(rippled.getLedger({ ledger_hash: 'ABC' })).rejects.toThrow(
      'URL: wss://a.example.com:51233 - Not connected',
    )
  })

  it('waits for the connection before sending a request', async () => {
    const { rippled } = loadRippled()
    const [client] = mockClients
    client.connected = false
    client.onRequest = () =>
      Promise.resolve({ result: { amm: { trading_fee: 220 } } })

    const pending = rippled.getAMMInfo('rAMM')
    await flushPromises()
    expect(client.requests).not.toContainEqual(AMM_INFO)

    client.connected = true
    client.emit('connected')
    await expect(pending).resolves.toEqual({ amm: { trading_fee: 220 } })
    expect(client.requests).toContainEqual(AMM_INFO)
  })

  it('sends the request anyway if the connection does not open within 10s', async () => {
    const { rippled } = loadRippled()
    const [client] = mockClients
    client.connected = false
    const listeners = client.listenerCount('connected')

    const pending = rippled.getAMMInfo('rAMM')
    await flushPromises()
    expect(client.listenerCount('connected')).toBe(listeners + 1)

    jest.advanceTimersByTime(10_000)
    await expect(pending).resolves.toEqual({})
    expect(client.requests).toEqual([AMM_INFO])
    expect(client.listenerCount('connected')).toBe(listeners)
  })

  it('does not connect when no host is configured', async () => {
    const { rippled } = loadRippled('')

    expect(mockClients).toHaveLength(0)
    await expect(rippled.getAMMInfo('rAMM')).rejects.toThrow(
      'No rippled host configured',
    )
  })
})
