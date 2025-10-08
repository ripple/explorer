const axios = require('axios')
const log = require('../../lib/logger')({ name: 'tokens search' })

const REFETCH_INTERVAL = 60 * 60 * 1000 // 1 hour
const cachedTokenList = { tokens: [], last_updated: null }

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

async function fetchXRPLMetaTokens() {
  log.info(`caching tokens from LOS`)
  return axios
    .get(`${process.env.VITE_LOS_URL}/trusted-tokens`)
    .then((resp) => resp.data)
    .catch((e) => {
      log.error(e)
      return { count: 0 }
    })
}

async function cacheXRPLMetaTokens() {
  const losTokens = await fetchXRPLMetaTokens()
  log.info(`Fetched ${losTokens.tokens.length} tokens from LOS...`)

  if (losTokens.tokens) {
    cachedTokenList.tokens = losTokens.tokens.sort(
      (a, b) => Number(b.holders ?? 0) - Number(a.holders ?? 0),
    )

    cachedTokenList.last_updated = Date.now()

    // nonstandard from XRPLMeta, check for hex codes in currencies and store parsed
    cachedTokenList.tokens.map((token) => ({
      ...token,
      parseCurrency: parseCurrency(token.currency),
    }))
  }
}

function startCaching() {
  if (process.env.VITE_ENVIRONMENT !== 'mainnet') {
    return
  }
  cacheXRPLMetaTokens()
  setInterval(() => cacheXRPLMetaTokens(), REFETCH_INTERVAL)
}

startCaching()

function queryTokens(tokenList, query) {
  const sanitizedQuery = query.toLowerCase()

  return tokenList.filter(
    (token) =>
      token.currency?.toLowerCase().includes(sanitizedQuery) ||
      token.parsedCurrency?.toLowerCase().includes(sanitizedQuery) ||
      token.name?.toLowerCase().includes(sanitizedQuery) ||
      token.issuer_name?.toLowerCase().includes(sanitizedQuery) ||
      token.issuer_account.toLowerCase().startsWith(sanitizedQuery),
  )
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

    const metrics = {
      count: cachedTokenList.tokens.length,
      market_cap: cachedTokenList.tokens
        .reduce((sum, token) => {
          const cap = Number(token.market_cap_usd) || 0
          return cap > 0 ? sum + cap : sum // TODO: Remove this condition once holders API fixed
        }, 0)
        .toFixed(6),
      volume_24h: cachedTokenList.tokens
        .reduce((sum, token) => sum + Number(token.daily_volume_usd || 0), 0)
        .toFixed(6),
      stablecoin: cachedTokenList.tokens
        .reduce((sum, token) => {
          const cap = Number(token.market_cap_usd) || 0
          return token.asset_subclass === 'stablecoin' && cap > 0
            ? sum + cap
            : sum
        }, 0)
        .toFixed(6),
    }

    log.info(cachedTokenList.tokens.length)

    return res.status(200).json({
      result: 'success',
      updated: cachedTokenList.last_updated,
      tokens: cachedTokenList.tokens,
      metrics,
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
