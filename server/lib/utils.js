const moment = require('moment');

const EPOCH_OFFSET = 946684800;
module.exports.EPOCH_OFFSET = EPOCH_OFFSET;
module.exports.XRP_BASE = 1000000;

const convertRippleDate = date =>
  moment
    .unix(date + EPOCH_OFFSET)
    .utc()
    .format();

module.exports.summarizeLedger = (ledger, txDetails = false) => {
  const summary = {
    ledger_index: Number(ledger.ledger_index),
    ledger_hash: ledger.ledger_hash,
    parent_hash: ledger.parent_hash,
    close_time: convertRippleDate(ledger.close_time),
    total_xrp: ledger.total_coins / 1000000,
    total_fees: 0,
  };

  ledger.transactions.forEach(tx => {
    summary.total_fees += Number(tx.Fee);
  });

  Object.assign(summary, { total_fees: summary.total_fees / 1000000 });
  return summary;
};

function CustomError(message, code) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.code = code;
}

require('util').inherits(CustomError, Error);

module.exports.Error = CustomError;
