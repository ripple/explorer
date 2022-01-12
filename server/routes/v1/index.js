const api = require('express').Router();
const getCors = require('./cors');
const getPayString = require('./payString');
const getTokenDiscovery = require('./tokenDiscovery');
const getValidators = require('./validators');
const getNodes = require('./nodes');
const getValidatorReport = require('./validatorReport');
const getHealth = require('./health');

api.use('/cors/:url', getCors);
api.use('/paystrings/:id', getPayString);
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

module.exports = api;
