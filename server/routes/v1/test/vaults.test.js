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

const LOS_URL = 'https://los.test'
const MAX_CACHED_VAULT_QUERIES = 200

describe('getVaults', () => {
  let axios
  let getVaults

  beforeEach(() => {
    // Fresh module per test so the cache starts empty. Off mainnet, no background fetches run.
    jest.resetModules()
    process.env.VITE_ENVIRONMENT = 'testnet'
    process.env.VITE_LOS_URL = LOS_URL
    axios = require('axios')
    axios.get.mockResolvedValue({ data: { results: [], total: 0 } })
    ;({ getVaults } = require('../vaults'))
  })

  const callGetVaults = async (query) => {
    const res = mockResponse()
    await getVaults({ query }, res)
    return res
  }

  it('forwards a valid frontend query to LOS', async () => {
    const res = await callGetVaults({
      page: '2',
      size: '20',
      sort_by: 'utilization_ratio',
      sort_order: 'asc',
      asset_type: 'stablecoins',
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ results: [], total: 0 })
    expect(axios.get).toHaveBeenCalledWith(
      `${LOS_URL}/vaults?page=2&size=20&sort_by=utilization_ratio&sort_order=asc&asset_type=stablecoins`,
      { timeout: 30000 },
    )
  })

  it('accepts a request with no params', async () => {
    const res = await callGetVaults({})

    expect(res.status).toHaveBeenCalledWith(200)
    expect(axios.get).toHaveBeenCalledWith(`${LOS_URL}/vaults?`, {
      timeout: 30000,
    })
  })

  it('accepts name_like with punctuation and non-ASCII characters', async () => {
    const res = await callGetVaults({ name_like: "Bob's vault €" })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(axios.get).toHaveBeenCalledWith(
      `${LOS_URL}/vaults?name_like=Bob%27s+vault+%E2%82%AC`,
      { timeout: 30000 },
    )
  })

  it('accepts params at the edge of their bounds', async () => {
    const res = await callGetVaults({
      page: '1000',
      size: '100',
      name_like: 'x'.repeat(64),
    })

    expect(res.status).toHaveBeenCalledWith(200)
  })

  it.each([
    ['page is 0', { page: '0' }, 'page'],
    ['page is too large', { page: '1001' }, 'page'],
    ['page is not an integer', { page: '1.5' }, 'page'],
    ['page is repeated', { page: ['1', '2'] }, 'page'],
    ['size is 0', { size: '0' }, 'size'],
    ['size is too large', { size: '101' }, 'size'],
    ['size is not a number', { size: 'abc' }, 'size'],
    ['sort_by is unknown', { sort_by: 'name' }, 'sort_by'],
    ['sort_order is unknown', { sort_order: 'up' }, 'sort_order'],
    ['asset_type is unknown', { asset_type: 'mpt' }, 'asset_type'],
    ['name_like is too long', { name_like: 'x'.repeat(65) }, 'name_like'],
    ['name_like is repeated', { name_like: ['a', 'b'] }, 'name_like'],
  ])('returns 400 when %s', async (_label, query, param) => {
    const res = await callGetVaults(query)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: expect.stringContaining(param),
    })
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('serves a repeated query from the cache', async () => {
    await callGetVaults({ page: '1', size: '20' })
    const res = await callGetVaults({ page: '1', size: '20' })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it('evicts the oldest query once the cache is full', async () => {
    await callGetVaults({ name_like: 'first' })
    for (let i = 0; i < MAX_CACHED_VAULT_QUERIES; i += 1) {
      // eslint-disable-next-line no-await-in-loop -- requests must land in order
      await callGetVaults({ name_like: `query-${i}` })
    }
    expect(axios.get).toHaveBeenCalledTimes(MAX_CACHED_VAULT_QUERIES + 1)

    // the most recent query is still cached, the first one was evicted
    await callGetVaults({ name_like: `query-${MAX_CACHED_VAULT_QUERIES - 1}` })
    expect(axios.get).toHaveBeenCalledTimes(MAX_CACHED_VAULT_QUERIES + 1)
    await callGetVaults({ name_like: 'first' })
    expect(axios.get).toHaveBeenCalledTimes(MAX_CACHED_VAULT_QUERIES + 2)
  })
})
