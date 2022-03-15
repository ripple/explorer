import { summarizeLedger } from './lib/utils';
import { getLedger as getRippledLedger } from './lib/rippled';
import logger from './lib/logger';

const log = logger({ name: 'ledgers' });

const getLedger = (identifier, url) => {
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
  return getRippledLedger(url, parameters)
    .then(ledger => summarizeLedger(ledger, true))
    .then(data => {
      return data;
    })
    .catch(error => {
      log.error(error.toString());
      throw error;
    });
};

export default getLedger;
