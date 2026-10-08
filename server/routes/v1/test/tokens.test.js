/**
 * @jest-environment node
 */
/* eslint-disable global-require -- modules are re-required per test so each starts with an empty cache */
const mockResponse = require('../../../test/mockResponse')

jest.mock('axios')
jest.mock('../../../lib/logger', () => () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const TOKENS = [
  {
    currency: 'USD',
    issuer_account: 'rIssuerOne',
    name: 'US Dollar',
    holders: 5,
    market_cap_usd: '100',
    daily_volume_usd: '10',
    asset_subclass: 'stablecoin',
  },
  {
    currency: 'FOO',
    issuer_account: 'rIssuerTwo',
    name: 'Foo',
    holders: 50,
    market_cap_usd: '200',
    daily_volume_usd: '20',
  },
]

describe('tokens routes', () => {
  let axios

  // Fresh module per test so the token cache starts empty. On mainnet, requiring the module
  // starts the background fetch.
  const loadTokens = (environment) => {
    jest.resetModules()
    process.env.VITE_ENVIRONMENT = environment
    process.env.VITE_LOS_URL = 'https://los.test'
    axios = require('axios')
    return {
      init: (mockGet) => {
        axios.get.mockImplementation(mockGet)
        return require('../tokens')
      },
    }
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  describe('off mainnet', () => {
    let routes

    beforeEach(() => {
      routes = loadTokens('testnet').init(() => {
        throw new Error('LOS should not be called off mainnet')
      })
    })

    it('getAllTokens returns 503 without waiting', async () => {
      const res = mockResponse()
      await routes.getAllTokens({}, res)

      expect(res.status).toHaveBeenCalledWith(503)
      expect(res.set).toHaveBeenCalledWith('Retry-After', '60')
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token list is not available',
      })
      expect(axios.get).not.toHaveBeenCalled()
    })

    it('getTokensSearch returns an empty result without waiting', async () => {
      const res = mockResponse()
      await routes.getTokensSearch({ params: { query: 'usd' } }, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ result: 'success', tokens: [] }),
      )
    })
  })

  describe('on mainnet', () => {
    it('returns the cached token list once it is loaded', async () => {
      const routes = loadTokens('mainnet').init(() =>
        Promise.resolve({ data: { tokens: TOKENS.map((t) => ({ ...t })) } }),
      )
      // let the initial background fetch settle
      await jest.advanceTimersByTimeAsync(0)

      const res = mockResponse()
      await routes.getAllTokens({}, res)

      expect(res.status).toHaveBeenCalledWith(200)
      const body = res.json.mock.calls[0][0]
      // sorted by holders, descending
      expect(body.tokens.map((t) => t.currency)).toEqual(['FOO', 'USD'])
      expect(body.metrics).toEqual({
        count: 2,
        market_cap: '300.000000',
        volume_24h: '30.000000',
        stablecoin: '100.000000',
      })
    })

    it('waits for the cache to fill if it is still loading', async () => {
      const routes = loadTokens('mainnet').init(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: { tokens: TOKENS } }), 3000)
          }),
      )

      const res = mockResponse()
      const pending = routes.getAllTokens({}, res)
      await jest.advanceTimersByTimeAsync(2000)
      expect(res.json).not.toHaveBeenCalled()

      await jest.advanceTimersByTimeAsync(2000)
      await pending
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json.mock.calls[0][0].tokens).toHaveLength(2)
    })

    it('gives up after about 10 seconds and returns 503', async () => {
      const routes = loadTokens('mainnet').init(() =>
        Promise.reject(new Error('LOS unavailable')),
      )

      const res = mockResponse()
      const pending = routes.getAllTokens({}, res)
      await jest.advanceTimersByTimeAsync(9000)
      expect(res.json).not.toHaveBeenCalled()

      await jest.advanceTimersByTimeAsync(1000)
      await pending
      expect(res.status).toHaveBeenCalledWith(503)
      expect(res.set).toHaveBeenCalledWith('Retry-After', '60')
    })

    it('getTokensSearch filters the cached token list', async () => {
      const routes = loadTokens('mainnet').init(() =>
        Promise.resolve({ data: { tokens: TOKENS.map((t) => ({ ...t })) } }),
      )
      await jest.advanceTimersByTimeAsync(0)

      const res = mockResponse()
      await routes.getTokensSearch({ params: { query: 'dollar' } }, res)

      expect(res.status).toHaveBeenCalledWith(200)
      const body = res.json.mock.calls[0][0]
      expect(body.tokens.map((t) => t.currency)).toEqual(['USD'])
    })
  })
})
