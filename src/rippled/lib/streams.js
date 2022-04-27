import { getServerInfo } from './rippled';
import { EPOCH_OFFSET } from './utils';
import logger from './logger';

const log = logger({ name: 'streams' });

const PURGE_INTERVAL = 10 * 1000;
const MAX_AGE = 120 * 1000;
const allLedgers = {};
const allValidators = {};

// add the ledger to the cache
const addLedger = data => {
  const { ledger_index: ledgerIndex } = data;
  if (!allLedgers[ledgerIndex]) {
    allLedgers[ledgerIndex] = {
      ledger_index: Number(ledgerIndex),
      seen: Date.now(),
    };
  }

  return allLedgers[ledgerIndex];
};

const fetchLoadFee = rippledUrl => {
  return getServerInfo(rippledUrl)
    .then(result => result.info)
    .then(info => {
      const ledgerFeeInfo = info.validated_ledger;
      const loadFee = ledgerFeeInfo.base_fee_xrp * (info.load_factor ?? 1);
      return { load_fee: Number(loadFee.toPrecision(4)).toString() };
    });
};

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

// convert to array and sort
const organizeChain = () =>
  Object.entries(allLedgers)
    .map(d => d[1])
    .sort((a, b) => a.ledger_index - b.ledger_index);

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

// update rolling metrics
const updateMetrics = baseFee => {
  const chain = organizeChain().slice(-100);

  let time = 0;
  let fees = 0;
  let timeCount = 0;
  let txCount = 0;
  let ledgerCount = 0;

  chain.forEach((d, i) => {
    const next = chain[i + 1];
    if (next && next.seen && d.seen) {
      time += next.seen - d.seen;
      timeCount += 1;
    }

    if (d.total_fees) {
      fees += d.total_fees;
      txCount += d.txn_count;
      ledgerCount += 1;
    }
  });

  return {
    base_fee: Number(baseFee.toPrecision(4)).toString(),
    txn_sec: time && txCount ? ((txCount / time) * 1000).toFixed(2) : undefined,
    txn_ledger: ledgerCount ? (txCount / ledgerCount).toFixed(2) : undefined,
    ledger_interval: timeCount ? (time / timeCount / 1000).toFixed(3) : undefined,
    avg_fee: txCount ? (fees / txCount).toPrecision(4) : undefined,
  };
};

// handle ledger messages
const handleLedger = data => {
  const ledger = addLedger(data);
  const { ledger_hash: ledgerHash, ledger_index: ledgerIndex, txn_count: txnCount } = data;

  log.info('new ledger', ledgerIndex);
  ledger.ledger_hash = ledgerHash;
  ledger.txn_count = txnCount;
  ledger.close_time = (data.ledger_time + EPOCH_OFFSET) * 1000;

  const metrics = updateMetrics(data.fee_base / 1000000);
  return {
    ledger,
    metrics,
  };
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

export { handleLedger, handleValidation, fetchLoadFee };
