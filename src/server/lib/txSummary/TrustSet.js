const formatAmount = require('./formatAmount');

module.exports = tx => ({
  limit: formatAmount(tx.LimitAmount),
});
