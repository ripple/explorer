const api = require('express').Router()
const getHealth = require('./health')
const getCurrentMetrics = require('./currentMetrics')
const getTokensSearch = require('./tokens')

api.use('/healthz', (_req, res) => {
  res.status(200).send('success')
})
if (process.env.VITE_ENVIRONMENT !== 'custom') {
  // these require a single hardcoded rippled node to connect to
  api.use('/health', getHealth)
  api.use('/metrics', getCurrentMetrics)
  api.use('/tokens/search/:query', getTokensSearch)
}

module.exports = api
