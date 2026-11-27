/**
 * @jest-environment node
 */
/* eslint-disable global-require -- modules are re-required per test so each starts with an empty cache */
const mockResponse = require('../../../test/mockResponse')

jest.mock('axios')
jest.mock('../../../lib/rippled', () => ({ getAMMInfo() {} }))
jest.mock('../../../lib/logger', () => () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const LOS_URL = 'https://los.test'
const MAX_CACHED_TRENDS = 500
const AMM_ACCOUNT = 'rHUpaqUPbwzKZdzQ8ZQCme18FrgW9pB4am'
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

// Distinct, correctly formatted classic addresses for filling the cache
const fakeAddress = (n) => {
  let digits = ''
  let rest = n
  do {
    digits = BASE58[rest % 58] + digits
    rest = Math.floor(rest / 58)
  } while (rest > 0)
  return `r${digits.padStart(25, '1')}`
}

describe('getHistoricalTrends', () => {
  let axios
  let getHistoricalTrends

  beforeEach(() => {
    // Fresh module per test so the cache starts empty. Off mainnet, no background fetches run.
    jest.resetModules()
    process.env.VITE_ENVIRONMENT = 'testnet'
    process.env.VITE_LOS_URL = LOS_URL
    axios = require('axios')
    axios.get.mockResolvedValue({ data: { total_data_points: 0, data: [] } })
    ;({ getHistoricalTrends } = require('../amms'))
  })

  const callGetTrends = async (query) => {
    const res = mockResponse()
    await getHistoricalTrends({ query }, res)
    return res
  }

  it('fetches aggregated trends', async () => {
    const res = await callGetTrends({
      amm_account_id: 'aggregated',
      time_range: '1Y',
      xrp_only: 'true',
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ total_data_points: 0, data: [] }),
    )
    expect(axios.get).toHaveBeenCalledWith(
      `${LOS_URL}/amms/historical-trends`,
      expect.objectContaining({
        params: {
          amm_account_id: 'aggregated',
          time_range: '1Y',
          xrp_only: true,
        },
      }),
    )
  })

  it('fetches trends for a specific pool', async () => {
    const res = await callGetTrends({
      amm_account_id: AMM_ACCOUNT,
      time_range: '5Y',
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(axios.get).toHaveBeenCalledWith(
      `${LOS_URL}/amms/historical-trends`,
      expect.objectContaining({
        params: {
          amm_account_id: AMM_ACCOUNT,
          time_range: '5Y',
          xrp_only: undefined,
        },
      }),
    )
  })

  it('defaults to aggregated 6M when no params are given', async () => {
    const res = await callGetTrends({})

    expect(res.status).toHaveBeenCalledWith(200)
    expect(axios.get).toHaveBeenCalledWith(
      `${LOS_URL}/amms/historical-trends`,
      expect.objectContaining({
        params: expect.objectContaining({
          amm_account_id: 'aggregated',
          time_range: '6M',
        }),
      }),
    )
  })

  it.each(['1W', '1M', '6M', '1Y', '5Y'])(
    'accepts time_range %s',
    async (timeRange) => {
      const res = await callGetTrends({ time_range: timeRange })

      expect(res.status).toHaveBeenCalledWith(200)
    },
  )

  it.each([
    ['amm_account_id is not an address', { amm_account_id: 'not-an-amm' }],
    ['amm_account_id is too short', { amm_account_id: 'rABC' }],
    ['amm_account_id is too long', { amm_account_id: `r${'a'.repeat(35)}` }],
    [
      'amm_account_id has non-base58 characters',
      { amm_account_id: 'rHUpaqUPbwzKZdzQ8ZQCme18FrgW9pB40l' },
    ],
    ['amm_account_id is repeated', { amm_account_id: ['aggregated'] }],
    ['time_range is unknown', { time_range: '7D' }],
    ['time_range is lowercase', { time_range: '6m' }],
  ])('returns 400 when %s', async (_label, query) => {
    const res = await callGetTrends(query)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('serves a repeated request from the cache', async () => {
    await callGetTrends({ amm_account_id: AMM_ACCOUNT, time_range: '1M' })
    const res = await callGetTrends({
      amm_account_id: AMM_ACCOUNT,
      time_range: '1M',
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it('evicts the oldest entry once the cache is full', async () => {
    await callGetTrends({ amm_account_id: AMM_ACCOUNT })
    for (let i = 0; i < MAX_CACHED_TRENDS; i += 1) {
      // eslint-disable-next-line no-await-in-loop -- requests must land in order
      await callGetTrends({ amm_account_id: fakeAddress(i) })
    }
    expect(axios.get).toHaveBeenCalledTimes(MAX_CACHED_TRENDS + 1)

    // the most recent entry is still cached, the first one was evicted
    await callGetTrends({ amm_account_id: fakeAddress(MAX_CACHED_TRENDS - 1) })
    expect(axios.get).toHaveBeenCalledTimes(MAX_CACHED_TRENDS + 1)
    await callGetTrends({ amm_account_id: AMM_ACCOUNT })
    expect(axios.get).toHaveBeenCalledTimes(MAX_CACHED_TRENDS + 2)
  })
})
