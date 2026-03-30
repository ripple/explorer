const axios = require('axios')
const log = require('../../lib/logger')({ name: 'amms' })

const REFETCH_INTERVAL = 10 * 60 * 1000 // 10 minutes
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

async function fetchAggregatedStats() {
  const url = `${process.env.VITE_LOS_URL}/amms/aggregated`
  log.info(`Fetching aggregated stats from: ${url}`)

  return axios
    .get(url, {
      timeout: 30000,
    })
    .then((resp) => {
      log.info(
        `Successfully fetched aggregated stats, status: ${resp.status}`,
      )
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

async function cacheAMMs() {
  const losAMMs = await fetchAMMs()

  if (losAMMs.results && losAMMs.results.length > 0) {
    log.info(`Fetched ${losAMMs.results.length} AMMs from LOS...`)
    cachedAMMsList.results = losAMMs.results
    cachedAMMsList.last_updated = Date.now()
    log.info(`Cached ${cachedAMMsList.results.length} AMMs`)
  } else if (cachedAMMsList.results.length > 0) {
    log.warn(
      `Failed to fetch AMMs from LOS, using stale cached data (${cachedAMMsList.results.length} AMMs from ${new Date(cachedAMMsList.last_updated).toISOString()})`,
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
      `Failed to fetch aggregated stats from LOS, using stale cached data (from ${new Date(cachedAggregatedStats.last_updated).toISOString()})`,
    )
  } else {
    log.error('Failed to fetch aggregated stats from LOS and no cached data available')
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
    const { size = 1000, sort_field = 'tvl_usd', sort_order = 'desc' } = req.query

    log.info(`Fetching AMMs from cache: size=${size}, sort_field=${sort_field}, sort_order=${sort_order}`)

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
  log.info(`Fetching historical trends from: ${url} (amm_account_id=${ammAccountId}, time_range=${timeRange})`)

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
        `Successfully fetched historical trends, status: ${resp.status}, data_points: ${resp.data?.total_data_points || 0}`,
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
    cachedHistoricalTrends.set(cacheKey, { data: trends, last_updated: Date.now() })
    log.info(`Cached historical trends for ${cacheKey}`)
  } else {
    const existing = cachedHistoricalTrends.get(cacheKey)
    if (existing) {
      log.warn(
        `Failed to fetch historical trends from LOS for ${cacheKey}, using stale cached data (from ${new Date(existing.last_updated).toISOString()})`,
      )
    } else {
      log.error(`Failed to fetch historical trends from LOS for ${cacheKey} and no cached data available`)
    }
  }
}

const getHistoricalTrends = async (req, res) => {
  try {
    const { amm_account_id = 'aggregated', time_range = '6M' } = req.query

    log.info(`Fetching historical trends from cache: amm_account_id=${amm_account_id}, time_range=${time_range}`)

    const cached = getCachedTrends(amm_account_id, time_range)

    // If cached and fresh (within REFETCH_INTERVAL), return it
    if (cached && (Date.now() - cached.last_updated) < REFETCH_INTERVAL) {
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

