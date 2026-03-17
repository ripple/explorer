const axios = require('axios')
const log = require('../../lib/logger')({ name: 'vaults' })

const XRPLMETA_BASE = 'https://s1.xrplmeta.org'
const PRICE_REFETCH_INTERVAL = 5 * 60 * 1000 // 5 minutes
const cachedPrices = { prices: {}, lastUpdated: null }

async function fetchAssetPrices() {
  try {
    const losUrl = `${process.env.VITE_LOS_URL}/trusted-tokens`
    log.info(`Fetching trusted tokens for vault prices from: ${losUrl}`)
    const resp = await axios.get(losUrl, { timeout: 30000 })
    const tokens = resp.data?.tokens || []

    // Filter to RWA asset class (stablecoins used by vaults)
    const rwaTokens = tokens.filter((t) => t.asset_class === 'rwa')
    log.info(`Found ${rwaTokens.length} RWA tokens for vault price lookup`)

    const prices = {}

    await Promise.all(
      rwaTokens.map(async (token) => {
        try {
          const metaUrl = `${XRPLMETA_BASE}/token/${token.currency}:${token.issuer_account}`
          const metaResp = await axios.get(metaUrl, { timeout: 10000 })
          const xrpPrice = Number(metaResp.data?.metrics?.price) || 0
          if (xrpPrice > 0) {
            const key = `${token.currency}.${token.issuer_account}`
            prices[key] = xrpPrice
            log.info(
              `Price for ${token.name || token.currency}: ${xrpPrice} XRP`,
            )
          }
        } catch (e) {
          log.error(`Failed to fetch price for ${token.currency}: ${e.message}`)
        }
      }),
    )

    cachedPrices.prices = prices
    cachedPrices.lastUpdated = Date.now()
    log.info(`Cached prices for ${Object.keys(prices).length} vault assets`)
  } catch (e) {
    log.error(`Failed to fetch asset prices: ${e.message}`)
  }
}

function startPriceCaching() {
  if (process.env.VITE_ENVIRONMENT !== 'mainnet') {
    return
  }
  fetchAssetPrices()
  setInterval(() => fetchAssetPrices(), PRICE_REFETCH_INTERVAL)
}

startPriceCaching()

const getVaultAssetPrices = async (_req, res) => {
  try {
    return res.status(200).json({
      prices: cachedPrices.prices,
      lastUpdated: cachedPrices.lastUpdated,
    })
  } catch (error) {
    log.error('Failed to get vault asset prices:', error.message)
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message })
  }
}

const getVaults = async (req, res) => {
  try {
    const {
      page,
      size,
      sort_by: sortBy,
      sort_order: sortOrder,
      asset_type: assetType,
      name_like: nameLike,
    } = req.query

    const params = new URLSearchParams()
    if (page) params.set('page', page)
    if (size) params.set('size', size)
    if (sortBy) params.set('sort_by', sortBy)
    if (sortOrder) params.set('sort_order', sortOrder)
    if (assetType) params.set('asset_type', assetType)
    if (nameLike) params.set('name_like', nameLike)

    const url = `${process.env.VITE_LOS_URL}/vaults?${params.toString()}`
    log.info(`Fetching vaults from: ${url}`)

    const resp = await axios.get(url, { timeout: 30000 })
    log.info('[LOS] GET /vaults response:', JSON.stringify(resp.data, null, 2))
    return res.status(200).json(resp.data)
  } catch (error) {
    log.error('Failed to fetch vaults:', error.message)
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message })
  }
}

const getVaultsAggregateStats = async (_req, res) => {
  try {
    const url = `${process.env.VITE_LOS_URL}/vaults/aggregate-statistics`
    log.info(`Fetching vault aggregate stats from: ${url}`)

    const resp = await axios.get(url, { timeout: 30000 })
    log.info(
      '[LOS] GET /vaults/aggregate-statistics response:',
      JSON.stringify(resp.data, null, 2),
    )
    return res.status(200).json(resp.data)
  } catch (error) {
    log.error('Failed to fetch vault aggregate stats:', error.message)
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message })
  }
}

module.exports = {
  getVaults,
  getVaultsAggregateStats,
  getVaultAssetPrices,
}
