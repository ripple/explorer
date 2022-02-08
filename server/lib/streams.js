const WebSocket = require('ws');
const log = require('./logger')({ name: 'streams' });

const EPOCH_OFFSET = 946684800;
const XRP_BASE = 1000000;

const PURGE_INTERVAL = 10 * 1000;
const MAX_AGE = 120 * 1000;
const sockets = [];
const ledgers = {};
const reserve = {};

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
    };
  }

  return ledgers[ledgerIndex];
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

  let index = sockets.length;
  while (index) {
    index -= 1;
    if (sockets[index].readyState !== WebSocket.OPEN) {
      sockets[index].terminate();
      sockets.splice(index, 1);
    }
  }

  log.info('#sockets', sockets.length);
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

// fetch current reserve
module.exports.getReserve = () => ({ ...reserve });

// handle ledger messages
module.exports.handleLedger = data => {
  const ledger = addLedger(data);
  const { ledger_hash: ledgerHash, ledger_index: ledgerIndex, txn_count: txnCount } = data;

  log.info('new ledger', ledgerIndex);
  ledger.ledger_hash = ledgerHash;
  ledger.txn_count = txnCount;
  ledger.close_time = (data.ledger_time + EPOCH_OFFSET) * 1000;
  reserve.base = data.reserve_base / XRP_BASE;
  reserve.inc = data.reserve_inc / XRP_BASE;

  updateMetrics(data.fee_base / 1000000);
};

setInterval(purge, PURGE_INTERVAL);

// store new client
module.exports.addWs = ws => {
  sockets.push(ws);
};
