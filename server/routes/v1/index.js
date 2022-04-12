const api = require('express').Router();
const getTokenDiscovery = require('./tokenDiscovery');
const getValidators = require('./validators');
const getNodes = require('./nodes');
const getValidatorReport = require('./validatorReport');
const getHealth = require('./health');
const getCurrentMetrics = require('./currentMetrics');

if (process.env.REACT_APP_ENVIRONMENT === 'mainnet') {
  api.use('/token/top', getTokenDiscovery);
}
api.use('/healthz', (_req, res) => {
  res.status(200).send('success');
});
api.use('/validators', getValidators);
api.use('/validator_report/:id', getValidatorReport);
api.use('/nodes', getNodes);
api.use('/health', getHealth);
api.use('/metrics', getCurrentMetrics);

module.exports = api;
