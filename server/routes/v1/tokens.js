const axios = require('axios')
const log = require('../../lib/logger')({ name: 'tokens search' })

const REFETCH_INTERVAL = 60 * 60 * 1000 // 1 hour
const cachedTokenSearchList = { tokens: [], last_updated: null }

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

async function fetchXRPLMetaTokens(offset) {
  log.info('caching tokens from XRPLMeta')
  return axios
    .get(
      `${process.env.XRPL_META_URL}/tokens?trust_level=1&trust_level=2&trust_level=3&sort_by=holders`,
      {
        params: {
          offset,
          limit: 1000,
        },
      },
    )
    .then((resp) => resp.data)
    .catch((e) => log.error(e))
}

async function cacheXRPLMetaTokens() {
  let offset = 0
  let tokenPage = []
  const allTokensFetched = []

  const XRPLMetaTokensData = await fetchXRPLMetaTokens(0)
  let { count } = XRPLMetaTokensData
  while (count > 0) {
    // eslint-disable-next-line no-await-in-loop
    tokenPage = await fetchXRPLMetaTokens(offset)
    log.info(`tokenPage length: ${tokenPage.tokens.length}`)
    log.info(`count: ${count}`)
    allTokensFetched.push(...tokenPage.tokens)
    offset += 1000
    count -= 1000
  }

  log.info(`Retrieved all tokens: ${allTokensFetched.length}`)
  const filterredTokens = allTokensFetched.filter(
    (result) =>
      result.metrics.trustlines > 50 &&
      result.metrics.holders > 50 &&
      result.metrics.marketcap > 0 &&
      result.metrics.volume_7d > 0,
  )
  cachedTokenSearchList.tokens = filterredTokens
  log.info(`cacheXRPLMetaTokens length: ${cachedTokenSearchList.tokens.length}`)
  cachedTokenSearchList.last_updated = Date.now()

  cachedTokenSearchList.tokens.map((token) => ({
    ...token,
    currency: parseCurrency(token.currency),
  }))
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
      token.meta?.token?.name?.toLowerCase().includes(sanitizedQuery) ||
      token.meta?.issuer?.name?.toLowerCase().includes(sanitizedQuery) ||
      token.issuer?.toLowerCase().includes(sanitizedQuery),
  )
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = async (req, res) => {
  try {
    log.info('getting tokens list from XRPLMeta')
    const { query } = req.params
    while (cachedTokenSearchList.tokens.length === 0) {
      // eslint-disable-next-line no-await-in-loop -- necessary here to wait for cache to be filled
      await sleep(1000)
    }
    const queriedTokens = await queryTokens(cachedTokenSearchList.tokens, query)
    return res.status(200).json({
      result: 'success',
      updated: cachedTokenSearchList.last_updated,
      tokens: queriedTokens,
    })
  } catch (error) {
    log.error(error)
    return res.status(error.code || 500).json({ message: error.message })
  }
}
