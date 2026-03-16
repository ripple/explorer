const api = require('express').Router()
const getHealth = require('./health')
const getCurrentMetrics = require('./currentMetrics')
const {
  getTokensSearch,
  getAllTokens,
  batchGetTokens,
  getTokenById,
} = require('./tokens')
const {
  getVaults,
  getVaultsAggregateStats,
  getVaultAssetPrices,
} = require('./vaults')
const { getAMMs, getAggregatedStats, getHistoricalTrends } = require('./amms')

api.use('/healthz', (_req, res) => {
  res.status(200).send('success')
})
if (process.env.VITE_ENVIRONMENT !== 'custom') {
  // these require a single hardcoded rippled node to connect to
  api.use('/health', getHealth)
  api.use('/metrics', getCurrentMetrics)
  api.use('/tokens/search/:query', getTokensSearch)
  api.post('/tokens/batch-get', batchGetTokens)
  api.use('/tokens/:tokenId', getTokenById)
  api.use('/tokens', getAllTokens)
  api.get('/vaults/aggregate-statistics', getVaultsAggregateStats)
  api.get('/vaults/asset-prices', getVaultAssetPrices)
  api.get('/vaults', getVaults)
  // AMM endpoints
  api.use('/amms/aggregated', getAggregatedStats)
  api.use('/amms/historical-trends', getHistoricalTrends)
  api.use('/amms', getAMMs)
}

module.exports = api
