const utils = require('../../lib/utils');
const rippled = require('../../lib/rippled');
const log = require('../../lib/logger')({ name: 'ledgers' });

module.exports = (req, res) => {
  const parameters = {};
  if (!isNaN(req.params.id)) {
    parameters.ledger_index = Number(req.params.id);
  } else if (['validated', 'closed', 'current'].includes(req.params.id)) {
    // TODO: (this is not reachable as id is validated prior to reaching here)
    parameters.ledger_index = req.params.id;
  } else if (!req.params.id) {
    parameters.ledger_index = 'validated';
  } else {
    parameters.ledger_hash = req.params.id.toUpperCase();
  }

  log.info(`get ledger: ${JSON.stringify(parameters)}`);

  rippled
    .getLedger(parameters)
    .then(ledger => utils.summarizeLedger(ledger, true))
    .then(data => res.send(data))
    .catch(error => {
      log.error(error.toString());
      res.status(error.code || 500).json({ message: error.message });
    });
};
