const axios = require('axios')
const log = require('../../lib/logger')({ name: 'amms' })
const rippled = require('../../lib/rippled')

const REFETCH_INTERVAL = 10 * 60 * 1000 // 10 minutes
const LOS_TOKEN_API_BATCH_SIZE = 100
const AMM_INFO_CONCURRENCY = 2 // Max concurrent amm_info RPC calls
const AMM_INFO_DELAY_MS = 200 // Delay between each amm_info RPC call per worker
const cachedAMMsList = { results: [], last_updated: null }
const cachedAggregatedStats = { data: null, last_updated: null }
const cachedHistoricalTrends = new Map() // key: `${amm_account_id}:${time_range}` -> { data, last_updated }

async function fetchAMMs() {
  const url = `${process.env.VITE_LOS_URL}/amms`
  log.info(`Fetching AMMs from: ${url}`)

  return axios
    .get(url, {
      params: {
        size: 1000,
        sort_field: 'tvl_usd',
        sort_order: 'desc',
      },
      timeout: 30000,
    })
    .then((resp) => {
      log.info(
        `Successfully fetched AMMs, status: ${resp.status}, count: ${resp.data?.results?.length || 0}`,
      )
      return resp.data
    })
    .catch((e) => {
      if (e.code === 'ECONNABORTED') {
        log.error(`Request timeout after 30 seconds for ${url}`)
      } else if (e.response) {
        log.error(`Failed to fetch AMMs from ${url}:`, {
          status: e.response.status,
          statusText: e.response.statusText,
          data: e.response.data,
        })
      } else if (e.request) {
        log.error(`No response received from ${url}:`, {
          message: e.message,
          code: e.code,
        })
      } else {
        log.error(`Error setting up request to ${url}:`, {
          message: e.message,
        })
      }
      return { results: [] }
    })
}

/**
 * Fetch token data (icon, asset_class, asset_subclass) from LOS /tokens/batch-get
 * for all unique non-XRP tokens across the AMM pools.
 * Returns a map of "CURRENCY.ISSUER" -> { icon, asset_class, asset_subclass }
 */
async function fetchTokenData(amms) {
  const tokenIds = new Set()
  amms.forEach((amm) => {
    if (amm.currency_1 && amm.issuer_1 && amm.currency_1 !== 'XRP') {
      tokenIds.add(`${amm.currency_1}.${amm.issuer_1}`)
    }
    if (amm.currency_2 && amm.issuer_2 && amm.currency_2 !== 'XRP') {
      tokenIds.add(`${amm.currency_2}.${amm.issuer_2}`)
    }
  })

  const uniqueTokenIds = Array.from(tokenIds)
  if (uniqueTokenIds.length === 0) return {}

  log.info(
    `Fetching token data for ${uniqueTokenIds.length} unique tokens from LOS`,
  )

  const tokenDataMap = {}
  const url = `${process.env.VITE_LOS_URL}/tokens/batch-get`

  // Batch in groups of LOS_TOKEN_API_BATCH_SIZE (DynamoDB BatchGetItem limit is 100)
  for (let i = 0; i < uniqueTokenIds.length; i += LOS_TOKEN_API_BATCH_SIZE) {
    const batch = uniqueTokenIds.slice(i, i + LOS_TOKEN_API_BATCH_SIZE)
    try {
      // eslint-disable-next-line no-await-in-loop
      const resp = await axios.post(
        url,
        { tokenIds: batch },
        { timeout: 30000 },
      )
      const tokens = resp.data?.tokens || []
      tokens.forEach((token) => {
        if (token.currency && token.issuer_account) {
          const key = `${token.currency}.${token.issuer_account}`
          tokenDataMap[key] = {
            icon: token.icon || undefined,
            asset_class: token.asset_class || undefined,
            asset_subclass: token.asset_subclass || undefined,
          }
        }
      })
    } catch (e) {
      log.error(`Failed to batch-get tokens from LOS: ${e.message}`)
    }
  }

  log.info(`Fetched token data for ${Object.keys(tokenDataMap).length} tokens`)
  return tokenDataMap
}

/**
 * Fetch trading fees for AMM pools via amm_info RPC, called concurrently
 * with controlled concurrency to avoid overwhelming the rippled node.
 * Returns a map of amm_account_id -> trading_fee (raw value, 0-1000)
 */
async function fetchTradingFees(amms) {
  log.info(`Fetching trading fees for ${amms.length} AMMs via amm_info RPC`)

  const tradingFeeMap = {}
  const queue = [...amms]
  let completed = 0

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Process AMMs with controlled concurrency and delays
  async function processNext() {
    while (queue.length > 0) {
      const amm = queue.shift()
      try {
        // eslint-disable-next-line no-await-in-loop
        const resp = await rippled.getAMMInfo(amm.amm_account_id)
        if (resp?.amm?.trading_fee !== undefined) {
          tradingFeeMap[amm.amm_account_id] = resp.amm.trading_fee
        }
      } catch (e) {
        // Silently skip — trading fee is non-critical
        log.warn(
          `Failed to fetch amm_info for ${amm.amm_account_id}: ${e.message}`,
        )
      }
      completed += 1
      if (completed % 100 === 0) {
        log.info(`Trading fee progress: ${completed}/${amms.length}`)
      }
      // eslint-disable-next-line no-await-in-loop
      await delay(AMM_INFO_DELAY_MS)
    }
  }

  // Launch AMM_INFO_CONCURRENCY workers
  const workers = []
  for (let i = 0; i < Math.min(AMM_INFO_CONCURRENCY, amms.length); i += 1) {
    workers.push(processNext())
  }
  await Promise.all(workers)

  log.info(
    `Fetched trading fees for ${Object.keys(tradingFeeMap).length}/${amms.length} AMMs`,
  )
  return tradingFeeMap
}

async function fetchAggregatedStats() {
  const url = `${process.env.VITE_LOS_URL}/amms/aggregated`
  log.info(`Fetching aggregated stats from: ${url}`)

  return axios
    .get(url, {
      timeout: 30000,
    })
    .then((resp) => {
      log.info(`Successfully fetched aggregated stats, status: ${resp.status}`)
      return resp.data
    })
    .catch((e) => {
      if (e.code === 'ECONNABORTED') {
        log.error(`Request timeout after 30 seconds for ${url}`)
      } else if (e.response) {
        log.error(`Failed to fetch aggregated stats from ${url}:`, {
          status: e.response.status,
          statusText: e.response.statusText,
          data: e.response.data,
        })
      } else if (e.request) {
        log.error(`No response received from ${url}:`, {
          message: e.message,
          code: e.code,
        })
      } else {
        log.error(`Error setting up request to ${url}:`, {
          message: e.message,
        })
      }
      return null
    })
}

function enrichAMMs(amms, tokenDataMap) {
  return amms.map((amm) => {
    const token1Key =
      amm.currency_1 && amm.issuer_1
        ? `${amm.currency_1}.${amm.issuer_1}`
        : null
    const token2Key =
      amm.currency_2 && amm.issuer_2
        ? `${amm.currency_2}.${amm.issuer_2}`
        : null
    const token1Data = token1Key ? tokenDataMap[token1Key] : undefined
    const token2Data = token2Key ? tokenDataMap[token2Key] : undefined

    return {
      ...amm,
      icon_1: token1Data?.icon,
      icon_2: token2Data?.icon,
      asset_class_1: token1Data?.asset_class || amm.asset_class_1,
      asset_class_2: token2Data?.asset_class || amm.asset_class_2,
      asset_subclass_1: token1Data?.asset_subclass,
      asset_subclass_2: token2Data?.asset_subclass,
    }
  })
}

async function cacheAMMs() {
  const losAMMs = await fetchAMMs()

  if (losAMMs.results && losAMMs.results.length > 0) {
    log.info(`Fetched ${losAMMs.results.length} AMMs from LOS...`)

    // Cache raw AMMs immediately so the page is usable right away
    cachedAMMsList.results = losAMMs.results
    cachedAMMsList.last_updated = Date.now()
    log.info(
      `Cached ${cachedAMMsList.results.length} AMMs (enriching with token data and trading fees in background)`,
    )

    // Fetch token data in the background — updates the cache when ready
    fetchTokenData(losAMMs.results)
      .then((tokenDataMap) => {
        cachedAMMsList.results = enrichAMMs(cachedAMMsList.results, tokenDataMap)
        log.info(
          `Updated cache with token data for ${Object.keys(tokenDataMap).length} tokens`,
        )
      })
      .catch((e) => {
        log.error(`Failed to fetch token data: ${e.message}`)
      })

    // Fetch trading fees in the background — updates the cache when ready
    fetchTradingFees(losAMMs.results)
      .then((tradingFeeMap) => {
        cachedAMMsList.results = cachedAMMsList.results.map((amm) => ({
          ...amm,
          trading_fee:
            tradingFeeMap[amm.amm_account_id] !== undefined
              ? tradingFeeMap[amm.amm_account_id]
              : amm.trading_fee,
        }))
        log.info(
          `Updated cache with trading fees for ${Object.keys(tradingFeeMap).length} AMMs`,
        )
      })
      .catch((e) => {
        log.error(`Failed to fetch trading fees: ${e.message}`)
      })
  } else if (cachedAMMsList.results.length > 0) {
    log.warn(
      `Failed to fetch AMMs from LOS, using stale cached data ` +
        `(${cachedAMMsList.results.length} AMMs from ` +
        `${new Date(cachedAMMsList.last_updated).toISOString()})`,
    )
  } else {
    log.error('Failed to fetch AMMs from LOS and no cached data available')
  }
}

async function cacheAggregatedStats() {
  const stats = await fetchAggregatedStats()

  if (stats) {
    log.info('Fetched aggregated stats from LOS...')
    cachedAggregatedStats.data = stats
    cachedAggregatedStats.last_updated = Date.now()
    log.info('Cached aggregated stats')
  } else if (cachedAggregatedStats.data) {
    log.warn(
      `Failed to fetch aggregated stats from LOS, using stale cached data ` +
        `(from ${new Date(cachedAggregatedStats.last_updated).toISOString()})`,
    )
  } else {
    log.error(
      'Failed to fetch aggregated stats from LOS and no cached data available',
    )
  }
}

function startCaching() {
  if (process.env.VITE_ENVIRONMENT !== 'mainnet') {
    return
  }
  cacheAMMs()
  cacheAggregatedStats()
  setInterval(() => cacheAMMs(), REFETCH_INTERVAL)
  setInterval(() => cacheAggregatedStats(), REFETCH_INTERVAL)
}

startCaching()

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function sortAMMs(amms, sortField, sortOrder) {
  const sorted = [...amms]

  sorted.sort((a, b) => {
    const aVal = Number(a[sortField]) || 0
    const bVal = Number(b[sortField]) || 0
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  return sorted
}

/**
 * GET /api/v1/amms
 * Fetch top AMMs with sorting (from cache)
 */
const getAMMs = async (req, res) => {
  try {
    const {
      size = 1000,
      sort_field = 'tvl_usd',
      sort_order = 'desc',
    } = req.query

    log.info(
      `Fetching AMMs from cache: size=${size}, sort_field=${sort_field}, sort_order=${sort_order}`,
    )

    // Wait for cache to be populated (with timeout)
    let timeoutLimit = 10
    while (cachedAMMsList.results.length === 0 && timeoutLimit > 0) {
      // eslint-disable-next-line no-await-in-loop -- necessary here to wait for cache to be filled
      await sleep(1000)
      timeoutLimit -= 1
    }

    // Sort and limit results
    let results = sortAMMs(cachedAMMsList.results, sort_field, sort_order)
    results = results.slice(0, Number(size))

    log.info(`Returning ${results.length} AMMs from cache`)

    return res.status(200).json({
      results,
      updated: cachedAMMsList.last_updated,
    })
  } catch (error) {
    log.error(error)
    return res.status(error.code || 500).json({ message: error.message })
  }
}

/**
 * GET /api/v1/amms/aggregated
 * Fetch aggregated AMM statistics
 * This fetches the special "aggregated" document from the amms index
 */
const getAggregatedStats = async (req, res) => {
  try {
    log.info('Fetching aggregated AMM stats from cache')

    // Wait for cache to be populated (with timeout)
    let timeoutLimit = 10
    while (!cachedAggregatedStats.data && timeoutLimit > 0) {
      // eslint-disable-next-line no-await-in-loop -- necessary here to wait for cache to be filled
      await sleep(1000)
      timeoutLimit -= 1
    }

    return res.status(200).json({
      ...cachedAggregatedStats.data,
      updated: cachedAggregatedStats.last_updated,
    })
  } catch (error) {
    log.error(error)
    return res.status(error.code || 500).json({ message: error.message })
  }
}

/**
 * GET /api/v1/amms/historical-trends
 * Fetch historical trends for AMM data
 */
async function fetchHistoricalTrends(ammAccountId, timeRange) {
  const url = `${process.env.VITE_LOS_URL}/amms/historical-trends`
  log.info(
    `Fetching historical trends from: ${url} (amm_account_id=${ammAccountId}, time_range=${timeRange})`,
  )

  return axios
    .get(url, {
      params: {
        amm_account_id: ammAccountId,
        time_range: timeRange,
      },
      timeout: 30000,
    })
    .then((resp) => {
      log.info(
        `Successfully fetched historical trends, ` +
          `status: ${resp.status}, ` +
          `data_points: ${resp.data?.total_data_points || 0}`,
      )
      return resp.data
    })
    .catch((e) => {
      if (e.code === 'ECONNABORTED') {
        log.error(`Request timeout after 30 seconds for ${url}`)
      } else if (e.response) {
        log.error(`Failed to fetch historical trends from ${url}:`, {
          status: e.response.status,
          statusText: e.response.statusText,
          data: e.response.data,
        })
      } else if (e.request) {
        log.error(`No response received from ${url}:`, {
          message: e.message,
          code: e.code,
        })
      } else {
        log.error(`Error setting up request to ${url}:`, {
          message: e.message,
        })
      }
      return null
    })
}

function getCachedTrends(ammAccountId, timeRange) {
  const cacheKey = `${ammAccountId}:${timeRange}`
  return cachedHistoricalTrends.get(cacheKey) || null
}

async function cacheTrends(ammAccountId, timeRange) {
  const cacheKey = `${ammAccountId}:${timeRange}`
  const trends = await fetchHistoricalTrends(ammAccountId, timeRange)

  if (trends) {
    log.info(`Fetched historical trends from LOS for ${cacheKey}...`)
    cachedHistoricalTrends.set(cacheKey, {
      data: trends,
      last_updated: Date.now(),
    })
    log.info(`Cached historical trends for ${cacheKey}`)
  } else {
    const existing = cachedHistoricalTrends.get(cacheKey)
    if (existing) {
      log.warn(
        `Failed to fetch historical trends from LOS for ${cacheKey}, ` +
          `using stale cached data ` +
          `(from ${new Date(existing.last_updated).toISOString()})`,
      )
    } else {
      log.error(
        `Failed to fetch historical trends from LOS for ${cacheKey} and no cached data available`,
      )
    }
  }
}

const getHistoricalTrends = async (req, res) => {
  try {
    const { amm_account_id = 'aggregated', time_range = '6M' } = req.query

    log.info(
      `Fetching historical trends from cache: amm_account_id=${amm_account_id}, time_range=${time_range}`,
    )

    const cached = getCachedTrends(amm_account_id, time_range)

    // If cached and fresh (within REFETCH_INTERVAL), return it
    if (cached && Date.now() - cached.last_updated < REFETCH_INTERVAL) {
      log.info('Returning historical trends from cache')
      return res.status(200).json({
        ...cached.data,
        updated: cached.last_updated,
      })
    }

    // Cache miss or stale — fetch fresh data
    await cacheTrends(amm_account_id, time_range)

    const updated = getCachedTrends(amm_account_id, time_range)

    return res.status(200).json({
      ...updated?.data,
      updated: updated?.last_updated,
    })
  } catch (error) {
    log.error(error)
    return res.status(error.code || 500).json({ message: error.message })
  }
}

module.exports = {
  getAMMs,
  getAggregatedStats,
  getHistoricalTrends,
}
