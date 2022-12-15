const api = require('express').Router()
const getTokenDiscovery = require('./tokenDiscovery')
const getHealth = require('./health')
const getCurrentMetrics = require('./currentMetrics')

if (process.env.REACT_APP_ENVIRONMENT === 'mainnet') {
  api.use('/token/top', getTokenDiscovery)
}
api.use('/healthz', (_req, res) => {
  res.status(200).send('success')
})
if (process.env.REACT_APP_ENVIRONMENT !== 'custom') {
  // these require a single hardcoded rippled node to connect to
  api.use('/health', getHealth)
  api.use('/metrics', getCurrentMetrics)
}

module.exports = api
