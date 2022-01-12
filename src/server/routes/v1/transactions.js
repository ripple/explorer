const rippled = require('../../lib/rippled');
const utils = require('../../lib/utils');
const summarize = require('../../lib/txSummary');
const log = require('../../lib/logger')({ name: 'transactions' });

const getTransaction = transactionId => {
  log.info(`get tx: ${transactionId}`);
  return rippled
    .getTransaction(transactionId)
    .then(response => {
      return utils.formatTransaction(response);
    })
    .then(data => ({
      summary: summarize(data, true).details,
      raw: data,
    }))
    .then(data => {
      return data;
    })
    .catch(error => {
      log.error(error.toString());
      return { message: error.message };
    });
};

export default getTransaction;
