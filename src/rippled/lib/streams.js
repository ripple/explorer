import { EPOCH_OFFSET } from './utils';
import logger from './logger';

const log = logger({ name: 'streams' });

const PURGE_INTERVAL = 10 * 1000;
const MAX_AGE = 120 * 1000;
const allLedgers = {};
const allValidators = {};

// determine if the ledger index
// is on the validated ledger chain
const isValidatedChain = ledgerIndex => {
  let prev = ledgerIndex - 1;
  while (allLedgers[prev]) {
    if (allLedgers[prev].ledger_hash) {
      return true;
    }
    prev -= 1;
  }

  return false;
};

// purge old data
const purge = () => {
  const now = Date.now();

  Object.keys(allLedgers).forEach(key => {
    if (now - allLedgers[key].seen > MAX_AGE) {
      delete allLedgers[key];
    }
  });

  Object.keys(allValidators).forEach(key => {
    if (now - allValidators[key].last > MAX_AGE) {
      delete allValidators[key];
    }
  });
};

// handle validation messages
function handleValidation(data) {
  const { ledger_hash: ledgerHash, validation_public_key: pubkey } = data;
  const ledgerIndex = Number(data.ledger_index);

  if (!isValidatedChain(ledgerIndex)) {
    return undefined;
  }

  addLedger(data);

  if (!allValidators[pubkey]) {
    allValidators[pubkey] = { pubkey, ledger_index: 0 };
  }

  if (
    allValidators[pubkey].ledger_hash !== ledgerHash &&
    ledgerIndex > allValidators[pubkey].ledger_index
  ) {
    allValidators[pubkey].ledger_hash = ledgerHash;
    allValidators[pubkey].ledger_index = ledgerIndex;
    allValidators[pubkey].last = Date.now();

    return {
      ledger_index: Number(ledgerIndex),
      ledger_hash: ledgerHash,
      pubkey,
      partial: !data.full,
      time: (data.signing_time + EPOCH_OFFSET) * 1000,
    };
  }

  return undefined;
}

setInterval(purge, PURGE_INTERVAL);

// eslint-disable-next-line import/prefer-default-export
export { handleValidation };
