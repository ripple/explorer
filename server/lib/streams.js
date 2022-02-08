const rippled = require('./rippled');
const utils = require('./utils');
const log = require('./logger')({ name: 'streams' });

const PURGE_INTERVAL = 10 * 1000;
const MAX_AGE = 120 * 1000;
const ledgers = {};

const currentMetric = {
  base_fee: undefined,
  txn_sec: undefined,
  txn_ledger: undefined,
  ledger_interval: undefined,
  avg_fee: undefined,
};

module.exports.getCurrentMetrics = () => currentMetric;

// add the ledger to the cache
const addLedger = data => {
  const { ledger_index: ledgerIndex } = data;
  if (!ledgers[ledgerIndex]) {
    ledgers[ledgerIndex] = {
      ledger_index: Number(ledgerIndex),
      seen: Date.now(),
      ledger_hash: data.ledger_hash,
      txn_count: Number(data.txn_count),
    };
  }

  return ledgers[ledgerIndex];
};

const getTotalFees = ledger => {
  let totalFees = 0;

  ledger.transactions.forEach(tx => {
    totalFees += Number(tx.Fee);
  });
  return totalFees / utils.XRP_BASE;
};

// fetch full ledger
const fetchLedger = (ledger, attempts = 0) => {
  rippled
    .getLedger({ ledger_hash: ledger.ledger_hash })
    .then(getTotalFees)
    .then(totalFees => {
      Object.assign(ledger, { total_fees: totalFees });
    })
    .catch(error => {
      log.error(error.toString());
      if (error.code === 404 && attempts < 5) {
        log.info(`retry ledger ${ledger.ledger_index} (attempt:${attempts + 1})`);
        setTimeout(fetchLedger, 500, ledger, attempts + 1);
      }
    });
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
      txCount += d.txn_count ?? 0;
      ledgerCount += 1;
    }
  });
  currentMetric.base_fee = Number(baseFee.toPrecision(4)).toString();
  currentMetric.txn_sec = time && txCount ? ((txCount / time) * 1000).toFixed(2) : undefined;
  currentMetric.txn_ledger = ledgerCount ? (txCount / ledgerCount).toFixed(2) : undefined;
  currentMetric.ledger_interval = timeCount ? (time / timeCount / 1000).toFixed(3) : undefined;
  currentMetric.avg_fee = txCount ? (fees / txCount).toPrecision(4) : undefined;
};

// handle ledger messages
module.exports.handleLedger = data => {
  const ledger = addLedger(data);

  log.info('new ledger', data.ledger_index);
  ledger.close_time = (data.ledger_time + utils.EPOCH_OFFSET) * 1000;

  updateMetrics(data.fee_base / utils.XRP_BASE);
  fetchLedger(ledger);
};

setInterval(purge, PURGE_INTERVAL);
