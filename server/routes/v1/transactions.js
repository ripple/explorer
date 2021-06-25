const rippled = require('../../lib/rippled');
const utils = require('../../lib/utils');
const summarize = require('../../lib/txSummary');
const log = require('../../lib/logger')({ name: 'transactions' });

module.exports = (req, res) => {
  log.info(`get tx: ${req.params.id}`);
  rippled
    .getTransaction(req.params.id)
    .then(utils.formatTransaction)
    .then(data => ({
      summary: summarize(data, true).details,
      raw: data
    }))
    .then(data => res.send(data))
    .catch(error => {
      log.error(error.toString());
      res.status(error.code || 500).json({ message: error.message });
    });
};
