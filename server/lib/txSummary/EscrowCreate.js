const formatAmount = require('./formatAmount');
const utils = require('../utils');

module.exports = tx => ({
  amount: formatAmount(tx.Amount),
  destination: tx.Destination !== tx.Account ? tx.Destination : undefined,
  condition: tx.Condition,
  cancelAfter: tx.CancelAfter ? utils.convertRippleDate(tx.CancelAfter) : undefined,
  finishAfter: tx.FinishAfter ? utils.convertRippleDate(tx.FinishAfter) : undefined
});
