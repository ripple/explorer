const api = require('express').Router();
// const getAccountState = require('./accountState');
// const getAccountTransactions = require('./accountTransactions');
const ledger = require('./ledgers');
// const getTransaction = require('./transactions');
const getPayString = require('./payString');
const getQuorum = require('./quorum');
const nUNL = require('./nUNL');
const getTokenDiscovery = require('./tokenDiscovery');
const getToken = require('./token');
const getOffers = require('./offers');
const getValidators = require('./validators');
const getNodes = require('./nodes');
const getValidatorReport = require('./validatorReport');
const getHealth = require('./health');
const getCors = require('./cors');

// api.use('/account_state/:id', getAccountState);
// api.use('/account_transactions/:id/:currency?', getAccountTransactions);
api.use('/cors/:url/:method', getCors);
api.use('/ledgers/:id?', ledger);
// api.use('/transactions/:id', getTransaction);
api.use('/paystrings/:id', getPayString);
api.use('/nunl', nUNL);
api.use('/quorum', getQuorum);
if (process.env.REACT_APP_ENVIRONMENT === 'mainnet') {
  api.use('/token/top', getTokenDiscovery);
}
api.use(
  '/token/:currencyCode.:issuerAddress?/offers/:pairCurrencyCode.:pairIssuerAddress?',
  getOffers
);
api.use('/token/:currency.:accountId', getToken);
api.use('/healthz', (_req, res) => {
  res.status(200).send('success');
});
api.use('/validators', getValidators);
api.use('/validator_report/:id', getValidatorReport);
api.use('/nodes', getNodes);
api.use('/health', getHealth);

module.exports = api;
