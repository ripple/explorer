const utils = require('./lib/utils');
const rippled = require('./lib/rippled');
const log = require('./lib/logger')({ name: 'ledgers' });

const getLedger = identifier => {
  const parameters = {};
  if (!isNaN(identifier)) {
    parameters.ledger_index = Number(identifier);
  } else if (['validated', 'closed', 'current'].includes(identifier)) {
    // TODO: (this is not reachable as id is validated prior to reaching here)
    parameters.ledger_index = identifier;
  } else if (!identifier) {
    parameters.ledger_index = 'validated';
  } else {
    parameters.ledger_hash = identifier.toUpperCase();
  }

  log.info(`get ledger: ${JSON.stringify(parameters)}`);

  return rippled
    .getLedger(parameters)
    .then(ledger => utils.summarizeLedger(ledger, true))
    .then(data => {
      return data;
    })
    .catch(error => {
      log.error(error.toString());
      return { message: error.message };
    });
};

export default getLedger;
