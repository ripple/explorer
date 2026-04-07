const api = require('express').Router()
const getHealth = require('./health')
const getCurrentMetrics = require('./currentMetrics')
const { getTokensSearch, getAllTokens } = require('./tokens')
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
  api.use('/tokens', getAllTokens)
  api.get('/vaults/aggregate-statistics', getVaultsAggregateStats)
  api.get('/vaults/asset-prices', getVaultAssetPrices)
  api.get('/vaults', getVaults)
  api.get('/amms/aggregated', getAggregatedStats)
  api.get('/amms/historical-trends', getHistoricalTrends)
  api.get('/amms', getAMMs)
}

module.exports = api
