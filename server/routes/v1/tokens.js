const axios = require('axios')
const log = require('../../lib/logger')({ name: 'tokens search' })

const REFETCH_INTERVAL = 60 * 60 * 1000 // 1 hour
const cachedTokenList = { tokens: [], last_updated: null, metrics: null }

const parseCurrency = (currency) => {
  const NON_STANDARD_CODE_LENGTH = 40
  const LP_TOKEN_IDENTIFIER = '03'

  const hexToString = (hex) => {
    let string = ''
    for (let i = 0; i < hex.length; i += 2) {
      const part = hex.substring(i, i + 2)
      const code = parseInt(part, 16)
      if (!isNaN(code) && code !== 0) {
        string += String.fromCharCode(code)
      }
    }
    return string
  }

  return currency.length === NON_STANDARD_CODE_LENGTH &&
    currency?.substring(0, 2) !== LP_TOKEN_IDENTIFIER
    ? hexToString(currency)
    : currency
}

const calculateMetrics = (tokens) => ({
  count: tokens.length,
  market_cap: tokens
    .reduce((sum, token) => {
      const cap = Number(token.market_cap_usd) || 0
      return cap > 0 ? sum + cap : sum
    }, 0)
    .toFixed(6),
  volume_24h: tokens
    .reduce((sum, token) => sum + Number(token.daily_volume_usd || 0), 0)
    .toFixed(6),
  stablecoin: tokens
    .reduce((sum, token) => {
      const cap = Number(token.market_cap_usd) || 0
      return token.asset_subclass === 'stablecoin' && cap > 0 ? sum + cap : sum
    }, 0)
    .toFixed(6),
})

async function fetchTokens() {
  const url = `${process.env.VITE_LOS_URL}/trusted-tokens`
  log.info(`Fetching tokens from: ${url}`)

  return axios
    .get(url, {
      timeout: 30000,
    })
    .then((resp) => {
      log.info(
        `Successfully fetched tokens, status: ${resp.status}, count: ${resp.data?.tokens?.length || 0}`,
      )
      return resp.data
    })
    .catch((e) => {
      if (e.code === 'ECONNABORTED') {
        log.error(`Request timeout after 30 seconds for ${url}`)
      } else if (e.response) {
        log.error(`Failed to fetch tokens from ${url}:`, {
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
      return { count: 0 }
    })
}

async function cacheTokens() {
  const losTokens = await fetchTokens()

  if (losTokens.tokens) {
    log.info(`Fetched ${losTokens.tokens.length} tokens from LOS...`)

    cachedTokenList.tokens = losTokens.tokens.sort(
      (a, b) => Number(b.holders ?? 0) - Number(a.holders ?? 0),
    )

    cachedTokenList.last_updated = Date.now()

    // nonstandard from XRPLMeta, check for hex codes in currencies and store parsed
    cachedTokenList.tokens = cachedTokenList.tokens.map((token) => ({
      ...token,
      parsedCurrency: parseCurrency(token.currency),
    }))

    // Calculate and cache metrics
    cachedTokenList.metrics = calculateMetrics(cachedTokenList.tokens)
    log.info(`Cached metrics for ${cachedTokenList.metrics.count} tokens`)
  } else {
    log.warn('Failed to fetch tokens from LOS, using stale cached data')
  }
}

function startCaching() {
  if (process.env.VITE_ENVIRONMENT !== 'mainnet') {
    return
  }
  cacheTokens()
  setInterval(() => cacheTokens(), REFETCH_INTERVAL)
}

startCaching()

function queryTokens(tokenList, query) {
  if (!tokenList || !Array.isArray(tokenList) || !query) {
    return []
  }

  const sanitizedQuery = query.toLowerCase().trim()
  if (!sanitizedQuery) {
    return []
  }

  return tokenList.filter((token) => {
    try {
      const currencyMatch = token.currency
        ?.toLowerCase()
        .includes(sanitizedQuery)
      const parsedCurrencyMatch = token.parsedCurrency
        ?.toLowerCase()
        .includes(sanitizedQuery)
      const nameMatch = token.name?.toLowerCase().includes(sanitizedQuery)
      const issuerNameMatch = token.issuer_name
        ?.toLowerCase()
        .includes(sanitizedQuery)
      const issuerAccountStartsMatch = token.issuer_account
        ?.toLowerCase()
        .startsWith(sanitizedQuery)

      return (
        currencyMatch ||
        parsedCurrencyMatch ||
        nameMatch ||
        issuerNameMatch ||
        issuerAccountStartsMatch
      )
    } catch (error) {
      log.error(`Error filtering token: ${error.message}`, { token })
      return false
    }
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getTokensSearch = async (req, res) => {
  try {
    log.info('getting tokens list for search')
    const { query } = req.params
    while (cachedTokenList.tokens.length === 0) {
      // eslint-disable-next-line no-await-in-loop -- necessary here to wait for cache to be filled
      await sleep(1000)
    }
    const queriedTokens = await queryTokens(cachedTokenList.tokens, query)
    return res.status(200).json({
      result: 'success',
      updated: cachedTokenList.last_updated,
      tokens: queriedTokens,
    })
  } catch (error) {
    log.error(error)
    return res.status(error.code || 500).json({ message: error.message })
  }
}

const getAllTokens = async (req, res) => {
  try {
    log.info('getting tokens list for search')
    while (cachedTokenList.tokens.length === 0) {
      // eslint-disable-next-line no-await-in-loop -- necessary here to wait for cache to be filled
      await sleep(1000)
    }

    log.info(cachedTokenList.tokens.length)

    return res.status(200).json({
      result: 'success',
      updated: cachedTokenList.last_updated,
      tokens: cachedTokenList.tokens,
      metrics: cachedTokenList.metrics,
    })
  } catch (error) {
    log.error(error)
    return res.status(error.code || 500).json({ message: error.message })
  }
}

module.exports = {
  getTokensSearch,
  getAllTokens,
}
