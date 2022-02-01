import { getLedger, getServerInfo } from './rippled';
import { summarizeLedger, EPOCH_OFFSET } from './utils';
import logger from './logger';

const log = logger({ name: 'streams' });

const PURGE_INTERVAL = 10 * 1000;
const MAX_AGE = 120 * 1000;
const ledgers = {};
const validators = {};

// add the ledger to the cache
const addLedger = data => {
  const { ledger_index: ledgerIndex } = data;
  if (!ledgers[ledgerIndex]) {
    ledgers[ledgerIndex] = {
      ledger_index: Number(ledgerIndex),
      seen: Date.now(),
    };
  }

  return ledgers[ledgerIndex];
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// fetch full ledger
const fetchLedger = (ledger, rippledUrl, attempts = 0) => {
  return getLedger(rippledUrl, { ledger_hash: ledger.ledger_hash })
    .then(summarizeLedger)
    .then(summary => {
      Object.assign(ledger, summary);
      return summary;
    })
    .catch(error => {
      log.error(error.toString());
      if (error.code === 404 && attempts < 5) {
        log.info(`retry ledger ${ledger.ledger_index} (attempt:${attempts + 1})`);
        setTimeout(fetchLedger, 500, ledger, rippledUrl, attempts + 1);
      }
      throw error;
    });
};

const fetchLoadFee = () => {
  return getServerInfo()
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
  while (ledgers[prev]) {
    if (ledgers[prev].ledger_hash) {
      return true;
    }
    prev -= 1;
  }

  return false;
};

// convert to array and sort
const organizeChain = () =>
  Object.entries(ledgers)
    .map(d => d[1])
    .sort((a, b) => a.ledger_index - b.ledger_index);

// purge old data
const purge = () => {
  const now = Date.now();

  Object.keys(ledgers).forEach(key => {
    if (now - ledgers[key].seen > MAX_AGE) {
      delete ledgers[key];
    }
  });

  Object.keys(validators).forEach(key => {
    if (now - validators[key].last > MAX_AGE) {
      delete validators[key];
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

  if (!validators[pubkey]) {
    validators[pubkey] = { pubkey, ledger_index: 0 };
  }

  if (
    validators[pubkey].ledger_hash !== ledgerHash &&
    ledgerIndex > validators[pubkey].ledger_index
  ) {
    validators[pubkey].ledger_hash = ledgerHash;
    validators[pubkey].ledger_index = ledgerIndex;
    validators[pubkey].last = Date.now();

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

export { handleLedger, handleValidation, fetchLedger, fetchLoadFee };
