const axios = require('axios')
const log = require('../../lib/logger')({ name: 'vaults' })

const PRICE_REFETCH_INTERVAL = 5 * 60 * 1000 // 5 minutes
const VAULTS_REFETCH_INTERVAL = 2 * 60 * 1000 // 2 minutes
const AGG_STATS_REFETCH_INTERVAL = 10 * 60 * 1000 // 10 minutes

const cachedPrices = { prices: {}, lastUpdated: null }
const cachedAggStats = { data: null, lastUpdated: null }
const cachedVaults = new Map() // key: query string, value: { data, lastUpdated }

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
          const losTokenUrl = `${process.env.VITE_LOS_URL}/tokens/${token.currency}.${token.issuer_account}`
          const tokenResp = await axios.get(losTokenUrl, { timeout: 10000 })
          const xrpPrice = Number(tokenResp.data?.price) || 0
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

async function fetchAggregateStats() {
  try {
    const url = `${process.env.VITE_LOS_URL}/vaults/aggregate-statistics`
    log.info(`Fetching vault aggregate stats from: ${url}`)
    const resp = await axios.get(url, { timeout: 30000 })
    cachedAggStats.data = resp.data
    cachedAggStats.lastUpdated = Date.now()
    log.info('Cached vault aggregate stats')
  } catch (e) {
    log.error(`Failed to fetch vault aggregate stats: ${e.message}`)
  }
}

async function fetchVaultsList() {
  try {
    // Fetch the default view (first page, sorted by TVL desc) to warm the cache
    const url = `${process.env.VITE_LOS_URL}/vaults?page=1&size=20&sort_by=assets_total&sort_order=desc`
    log.info(`Refreshing vaults list cache from: ${url}`)
    const resp = await axios.get(url, { timeout: 30000 })
    const cacheKey = 'page=1&size=20&sort_by=assets_total&sort_order=desc'
    cachedVaults.set(cacheKey, { data: resp.data, lastUpdated: Date.now() })
    log.info('Cached default vaults list')
  } catch (e) {
    log.error(`Failed to refresh vaults list cache: ${e.message}`)
  }
}

function startCaching() {
  if (process.env.VITE_ENVIRONMENT !== 'mainnet') {
    return
  }
  fetchAssetPrices()
  fetchAggregateStats()
  fetchVaultsList()
  setInterval(() => fetchAssetPrices(), PRICE_REFETCH_INTERVAL)
  setInterval(() => fetchAggregateStats(), AGG_STATS_REFETCH_INTERVAL)
  setInterval(() => fetchVaultsList(), VAULTS_REFETCH_INTERVAL)
}

startCaching()

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

    const cacheKey = params.toString()
    const cached = cachedVaults.get(cacheKey)
    if (cached && Date.now() - cached.lastUpdated < VAULTS_REFETCH_INTERVAL) {
      return res.status(200).json(cached.data)
    }

    const url = `${process.env.VITE_LOS_URL}/vaults?${cacheKey}`
    log.info(`Fetching vaults from: ${url}`)

    const resp = await axios.get(url, { timeout: 30000 })
    cachedVaults.set(cacheKey, { data: resp.data, lastUpdated: Date.now() })
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
    if (cachedAggStats.data) {
      return res.status(200).json(cachedAggStats.data)
    }

    // Cache not yet populated (e.g. first request before background fetch completes)
    const url = `${process.env.VITE_LOS_URL}/vaults/aggregate-statistics`
    log.info(`Fetching vault aggregate stats from: ${url}`)
    const resp = await axios.get(url, { timeout: 30000 })
    cachedAggStats.data = resp.data
    cachedAggStats.lastUpdated = Date.now()
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
