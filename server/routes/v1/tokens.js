const axios = require('axios')
const log = require('../../lib/logger')({ name: 'tokens search' })

const REFETCH_INTERVAL = 60 * 60 * 1000 // 1 hour
const cachedTokenSearchList = { tokens: [], last_updated: null }

async function fetchXRPLMetaTokens(offset) {
  log.info('caching tokens from XRPLMeta')
  return axios
    .get(`${process.env.XRPL_META_URL}/tokens`, {
      params: {
        trust_level: [1, 2, 3],
        sort_by: 'holders',
        limit: 1000,
        offset: 10000,
      },
    })
    .then((resp) => resp.data.tokens)
    .catch((e) => log.error(e))
}

async function cacheXRPLMetaTokens() {
  const offset = 10000
  let tokenPage = []
  // const allTokensFetched = []
  // do {
  //   tokenPage = await fetchXRPLMetaTokens(offset)
  //   await sleep(1000)
  //   log.info(`tokenPage length: ${tokenPage.length}`)
  //   log.info(`offset: ${offset}`)
  //   allTokensFetched.push(...tokenPage)
  //   offset += 1000
  // } while (tokenPage.length > 0)
  // log.info(`Retrieved all tokens: ${allTokensFetched.length}`)
  tokenPage = await fetchXRPLMetaTokens(offset)
  log.info(`tokenPage length: ${tokenPage.length}`)
  const filterredTokens = tokenPage.filter(
    (result) =>
      result.metrics.trustlines > 50 &&
      result.metrics.holders > 50 &&
      result.metrics.marketcap > 0 &&
      result.metrics.volume_7d > 0,
  )
  cachedTokenSearchList.tokens = filterredTokens
  log.info(`cacheXRPLMetaTokens length: ${cachedTokenSearchList.tokens.length}`)
  cachedTokenSearchList.last_updated = Date.now()
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
  return tokenList.filter(
    (token) =>
      token.currency?.includes(query) ||
      token.meta?.token?.name?.includes(query) ||
      token.meta?.issuer?.name?.includes(query) ||
      token.issuer?.includes(query),
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
