/**
 * @jest-environment node
 */
/* eslint-disable global-require -- modules are re-required per test so each starts with no ledgers */
jest.mock('../rippled', () => ({ getLedger: () => new Promise(() => {}) }))
jest.mock('../logger', () => () => ({
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
}))

const ledgerClosed = (index) => ({
  type: 'ledgerClosed',
  ledger_index: index,
  ledger_hash: `HASH${index}`,
  ledger_time: 800000000 + index,
  fee_base: 10,
  txn_count: 4,
})

const loadStreams = () => {
  let streams
  jest.isolateModules(() => {
    streams = require('../streams')
  })
  return streams
}

describe('streams metrics', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('serves metrics while ledgers arrive and none once they are stale', () => {
    const streams = loadStreams()
    expect(streams.getCurrentMetrics()).toEqual({})

    streams.handleLedger(ledgerClosed(1))
    jest.advanceTimersByTime(4000)
    streams.handleLedger(ledgerClosed(2))
    expect(streams.getCurrentMetrics()).toMatchObject({
      base_fee: '0.00001',
      ledger_interval: '4.000',
    })

    jest.advanceTimersByTime(61_000)
    expect(streams.getCurrentMetrics()).toEqual({})
  })

  it('restarts the rolling window after a gap in the stream', () => {
    const streams = loadStreams()

    streams.handleLedger(ledgerClosed(1))
    jest.advanceTimersByTime(4000)
    streams.handleLedger(ledgerClosed(2))
    jest.advanceTimersByTime(120_000)
    streams.handleLedger(ledgerClosed(3))
    jest.advanceTimersByTime(4000)
    streams.handleLedger(ledgerClosed(4))

    expect(streams.getCurrentMetrics()).toMatchObject({
      ledger_interval: '4.000',
    })
  })
})
