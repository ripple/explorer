const WebSocket = require('ws');
const rippled = require('./rippled');
const utils = require('./utils');
const log = require('./logger')({ name: 'streams' });

const PURGE_INTERVAL = 10 * 1000;
const MAX_AGE = 120 * 1000;
const sockets = [];
const ledgers = {};
const validators = {};
const reserve = {};

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

// fetch full ledger
const fetchLedger = (ledger, attempts = 0) => {
  return rippled
    .getLedger({ ledger_hash: ledger.ledger_hash })
    .then(utils.summarizeLedger)
    .then(summary => {
      Object.assign(ledger, summary);
      return summary;
    })
    .catch(error => {
      log.error(error.toString());
      if (error.code === 404 && attempts < 5) {
        log.info(`retry ledger ${ledger.ledger_index} (attempt:${attempts + 1})`);
        setTimeout(fetchLedger, 500, ledger, attempts + 1);
      }
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

// fetch current reserve
const getReserve = () => ({ ...reserve });

// handle ledger messages
const handleLedger = data => {
  const ledger = addLedger(data);
  const { ledger_hash: ledgerHash, ledger_index: ledgerIndex, txn_count: txnCount } = data;

  log.info('new ledger', ledgerIndex);
  ledger.ledger_hash = ledgerHash;
  ledger.txn_count = txnCount;
  ledger.close_time = (data.ledger_time + utils.EPOCH_OFFSET) * 1000;
  reserve.base = data.reserve_base / utils.XRP_BASE;
  reserve.inc = data.reserve_inc / utils.XRP_BASE;

  const metrics = updateMetrics(data.fee_base / 1000000);
  const ledgerSummary = fetchLedger(ledger);
  return {
    ledger,
    metrics,
    ledgerSummary,
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
      time: (data.signing_time + utils.EPOCH_OFFSET) * 1000,
    };
  }

  return undefined;
}

// handle load fee messages
const handleLoadFee = data => {
  const loadFee = (data.base_fee * data.load_factor) / data.load_factor_fee_reference / 1000000;
  return { load_fee: Number(loadFee.toPrecision(4)).toString() };
};

setInterval(purge, PURGE_INTERVAL);

// store new client
const addWs = ws => {
  sockets.push(ws);
};

export { getReserve, handleLedger, handleValidation, handleLoadFee, addWs };
