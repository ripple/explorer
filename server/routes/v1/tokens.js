const axios = require('axios')
const log = require('../../lib/logger')({ name: 'tokens search' })

const REFETCH_INTERVAL = 10 * 60 * 1000 // 10 minutes
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

// MPTs aren't tradeable on the DEX yet, so they have no price/market cap to
// rank on or filter by. Zero-holder issuances are mostly test/abandoned
// tokens, so only ones with at least one holder are made searchable.
const MPT_MIN_HOLDERS = 0

function mapMPT(mpt) {
  return {
    token_type: 'MPT',
    mpt_issuance_id: mpt.mpt_issuance_id,
    currency: mpt.mpt_issuance_id,
    issuer_account: mpt.issuer,
    issuer_name: mpt.meta?.token?.issuer_name ?? mpt.meta?.issuer?.name,
    issuer_domain: mpt.meta?.issuer?.domain,
    // `name` stays the short ticker for display (matches the IOU convention
    // of a short code shown next to the currency), but the fuller product
    // name (e.g. "Car Parts" for a token ticked "SCPO") is kept separately
    // so it's still searchable even though it's never the display name.
    name: mpt.meta?.token?.ticker ?? mpt.meta?.token?.name,
    full_name: mpt.meta?.token?.name,
    icon: mpt.meta?.token?.icon,
    holders: mpt.metrics?.holders,
  }
}

async function fetchMPTs() {
  const url = `https://${process.env.XRPL_META_URL}/v2/tokens/mpt?limit=1000`
  log.info(`Fetching MPTs from: ${url}`)

  return axios
    .get(url, { timeout: 30000 })
    .then((resp) => {
      const mpts = resp.data?.tokens || []
      log.info(`Successfully fetched MPTs, count: ${mpts.length}`)
      return mpts
        .filter((mpt) => (mpt.metrics?.holders ?? 0) > MPT_MIN_HOLDERS)
        .map(mapMPT)
    })
    .catch((e) => {
      log.error(`Failed to fetch MPTs from ${url}:`, { message: e.message })
      return []
    })
}

async function cacheTokens() {
  const [losTokens, mpts] = await Promise.all([fetchTokens(), fetchMPTs()])

  if (losTokens.tokens) {
    log.info(
      `Fetched ${losTokens.tokens.length} tokens from LOS, ${mpts.length} MPTs from XRPL Meta...`,
    )

    cachedTokenList.tokens = [...losTokens.tokens, ...mpts].sort(
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
      const fullNameMatch = token.full_name
        ?.toLowerCase()
        .includes(sanitizedQuery)
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
        fullNameMatch ||
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
    let timeoutLimit = 10
    while (cachedTokenList.tokens.length === 0 && timeoutLimit > 0) {
      // eslint-disable-next-line no-await-in-loop -- necessary here to wait for cache to be filled
      await sleep(1000)
      timeoutLimit -= 1
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
